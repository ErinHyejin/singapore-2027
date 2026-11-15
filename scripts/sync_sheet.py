#!/usr/bin/env python3
"""Export ONLY the timetable and alternatives into a public, credential-free snapshot.

Requires existing local gws authorization. Never run gws in the browser or on Pages.
ITINERARY_SHEET_ID is supplied locally, not stored in this public repository.
"""
import argparse
import datetime as dt
import json
import os
from pathlib import Path
import re
import subprocess
from urllib.parse import quote
from zoneinfo import ZoneInfo

ROOT=Path(__file__).resolve().parents[1]
PRIVATE=re.compile(r'[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|예약\s*번호|여권|카드\s*번호|결제|\b(?:USD|KRW|SGD)\s*[\d.,]+|\d{10,}',re.I)
PLACES=[('클라우드','Cloud Forest Singapore'),('내셔널 갤러리','National Gallery Singapore'),('덕투어','BIG BUS & DUCK Tourist Hub Singapore'),('DUCK','BIG BUS & DUCK Tourist Hub Singapore'),('주빌리','Jubilee Park Fort Canning Singapore'),('캄퐁글람','Kampong Glam Singapore'),('리틀인디아','Little India Singapore'),('마리나베이샌즈','Marina Bay Sands Singapore'),('스펙트라','Marina Bay Sands Event Plaza'),('파라독스','Paradox Singapore'),('홀리데이','Holiday Inn Express Singapore Clarke Quay'),('선텍','Suntec City Singapore'),('클락키','Clarke Quay Central Singapore'),('차이나타운','Chinatown Point Singapore'),('국립박물관','National Museum of Singapore'),('창이','Singapore Changi Airport'),('항구','Marina Bay Cruise Centre Singapore')]

def maps_for(text):
    # Prefer the first activity line rather than a second-line alternative/destination.
    first=text.split('\n')[0]
    for needle,place in PLACES:
        if needle.lower() in first.lower():
            return 'https://www.google.com/maps/search/?api=1&query='+quote(place)
    return ''

def classify(text):
    if any(x in text for x in ['확인 필요','시간 미정','시각 확인','귀국편']):return 'check'
    if any(x in text for x in ['하선','입국','짐 찾기 →','공항 도착']):return 'move'
    if '크루즈' in text or '선내' in text:return 'cruise'
    if any(x in text for x in ['휴식','낮잠','재우기','취침','호텔 체크인','파라독스 체크인']):
        # A tour followed by a rest alternative is still a tour.
        if not any(x in text.split('\n')[0] for x in ['클라우드','주빌리','갤러리','캄퐁']):return 'rest'
    if any(x in text.split('\n')[0] for x in ['아침','점심','저녁','조식']):return 'meal'
    if '체크아웃' in text or '→ 항구' in text:return 'move'
    return 'tour'

def assert_public(value):
    if PRIVATE.search(json.dumps(value,ensure_ascii=False)):
        raise ValueError('Potential private/payment/booking data detected; review source before publishing.')

def clock(label):
    if '새벽' in label:return '00:00'
    m=re.search(r'(\d{1,2}):(\d{2})',label)
    if not m:raise ValueError('Unknown timetable clock label')
    return f'{int(m[1]):02}:{m[2]}'

def make_public_snapshot(metadata,grid,alt_rows,generated_at=None,year=2027):
    if not grid or len(grid[0])<2:raise ValueError('Timetable missing date header')
    sheet=next((s for s in metadata.get('sheets',[]) if s['properties']['title']=='일정표'),None)
    if not sheet:raise ValueError('Main timetable tab not found')
    merges={(m.get('startRowIndex',0),m.get('startColumnIndex',0)):m for m in sheet.get('merges',[])}
    themes={17:('도착하는 저녁','클락키에서 가볍게 시작'),18:('바다로 떠나는 날','가까운 산책 후 승선 준비'),19:('바다 위의 하루','선내 일정은 자유롭게'),20:('바다 위의 하루','선내 일정은 자유롭게'),21:('바다 위의 하루','선내 일정은 자유롭게'),22:('정원에서 야경까지','하선 후 휴식, 그리고 마리나베이'),23:('예술과 도시 산책','갤러리 · 덕투어 · 충분한 휴식'),24:('집으로 돌아가는 새벽','정확한 항공 수속 시각 재확인')}
    days=[]
    for col,heading in enumerate(grid[0][1:],1):
        match=re.fullmatch(r'(\d{1,2})/(\d{1,2})\s*\(([월화수목금토일])\)',heading.strip())
        if not match:raise ValueError('Invalid date header; do not guess dates')
        date=dt.date(year,int(match[1]),int(match[2]))
        title,subtitle=themes.get(date.day,('싱가포르 여행','일정 확인'))
        day={'date':date.isoformat(),'label':heading,'title':title,'subtitle':subtitle,'events':[]}
        for r in range(1,len(grid)):
            cells=grid[r]
            if col>=len(cells) or not str(cells[col]).strip():continue
            text=str(cells[col]).strip()
            if not cells or not str(cells[0]).strip():continue
            start=clock(str(cells[0]));merge=merges.get((r,col))
            end_row=merge['endRowIndex'] if merge else r+1
            end=clock(str(grid[end_row][0])) if end_row<len(grid) and grid[end_row] else '24:00'
            lines=text.splitlines();first=lines[0]
            explicit=re.match(r'^(\d{1,2}:\d{2})(?:[–~—-](\d{1,2}:\d{2}))?\s*',first)
            time=explicit[0].strip() if explicit else start
            event_title=first[explicit.end():] if explicit else first
            kind=classify(text)
            if kind=='cruise':time='선내 일정' if date.day==18 else '하루 종일'
            if '오전 하선' in first:time='오전 · 미정'
            if start=='00:00':time='새벽 · 확인 필요'
            body=[];alt=[]
            for line in lines[1:]:
                if line.startswith('대안:'):alt.append(line.removeprefix('대안:').strip())
                elif line.strip():body.append(line.strip())
            day['events'].append({'id':f'{date.isoformat()}-{r}','time':time,'start':start,'end':end,'title':event_title,'details':body,'alternative':alt,'kind':kind,'map':maps_for(text)})
        days.append(day)
    alternatives=[]
    for r in alt_rows[3:]:
        if len(r)<3:continue
        padded=list(r)+['']*(8-len(r))
        alternatives.append({'when':padded[0],'replaces':padded[1],'title':padded[2],'condition':padded[3],'note':padded[4],'map':maps_for(padded[2]),'excluded':'동물원' in padded[2]})
    result={'schemaVersion':1,'title':'싱가포르 여행','timezone':'Asia/Singapore','updatedAt':generated_at or dt.datetime.now(ZoneInfo('Asia/Singapore')).isoformat(timespec='seconds'),'notice':'관광 일정은 제안이며 티켓은 미예약입니다. 승·하선 및 항공 수속 시간은 원본 예약서가 우선입니다.','days':days,'alternatives':alternatives}
    assert_public(result)
    return result

def gws(*args,params):
    p=subprocess.run(['gws',*args,'--params',json.dumps(params,ensure_ascii=False)],capture_output=True,text=True)
    if p.returncode:raise RuntimeError('gws read failed: '+p.stderr)
    return json.loads(p.stdout)

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--sheet-id',default=os.environ.get('ITINERARY_SHEET_ID'))
    parser.add_argument('--year',default=2027,type=int)
    args=parser.parse_args()
    if not args.sheet_id:parser.error('Set ITINERARY_SHEET_ID locally. Never commit credentials or private source snapshots.')
    metadata=gws('sheets','spreadsheets','get',params={'spreadsheetId':args.sheet_id,'fields':'sheets(properties(title,sheetId),merges)'})
    ranges=gws('sheets','spreadsheets','values','batchGet',params={'spreadsheetId':args.sheet_id,'ranges':['일정표!A1:Z150','대안 옵션!A1:H100'],'valueRenderOption':'FORMATTED_VALUE'})['valueRanges']
    snapshot=make_public_snapshot(metadata,ranges[0].get('values',[]),ranges[1].get('values',[]),year=args.year)
    output=ROOT/'docs'/'data.js';output.parent.mkdir(exist_ok=True)
    output.write_text('window.TRIP_DATA = '+json.dumps(snapshot,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
    print(json.dumps({'output':str(output),'days':len(snapshot['days']),'events':sum(len(d['events']) for d in snapshot['days']),'alternatives':len(snapshot['alternatives']),'privacy_check':'passed'},ensure_ascii=False))

if __name__=='__main__':main()
