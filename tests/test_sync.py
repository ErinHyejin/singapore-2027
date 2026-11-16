import importlib.util
from pathlib import Path
import unittest

MODULE=Path(__file__).parents[1]/'scripts'/'sync_sheet.py'
spec=importlib.util.spec_from_file_location('sync_sheet',MODULE)
sync=importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)

class SnapshotTests(unittest.TestCase):
    def fixture(self):
        return ({'sheets':[{'properties':{'title':'일정표','sheetId':0},'merges':[{'startRowIndex':1,'endRowIndex':3,'startColumnIndex':1,'endColumnIndex':2}]}]},
                [['시간 (SGT)','2/22 (월)'],['17:00','17:00–18:30 클라우드 포레스트\n대안: 호텔 휴식'],['18:00'],['19:00']],
                [['대안 옵션'],['설명'],['날짜','기본','대안','조건','주의'],['2/22 오후','클라우드 포레스트','호텔 휴식','피곤할 때','23일 휴관']])
    def test_merge_becomes_one_event(self):
        data=sync.make_public_snapshot(*self.fixture(),generated_at='2026-11-16T00:00:00+08:00')
        self.assertEqual(len(data['days']),1)
        self.assertEqual(len(data['days'][0]['events']),1)
        self.assertEqual(data['days'][0]['events'][0]['end'],'19:00')
        self.assertEqual(data['days'][0]['date'],'2027-02-22')
        self.assertEqual(len(data['alternatives']),1)
    def test_no_pii_or_source_metadata(self):
        data=sync.make_public_snapshot(*self.fixture())
        self.assertNotIn('sheetId',str(data))
        self.assertNotIn('spreadsheetId',str(data))
    def test_personal_data_blocks_export(self):
        meta,grid,alts=self.fixture()
        grid[1][1]='문의 user@example.com'
        with self.assertRaises(ValueError):sync.make_public_snapshot(meta,grid,alts)
    def test_card_and_booking_data_blocks_export(self):
        for bad in ['예약번호 1234567890','결제 USD 12.34','카드번호 확인']:
            meta,grid,alts=self.fixture();grid[1][1]=bad
            with self.assertRaises(ValueError):sync.make_public_snapshot(meta,grid,alts)
    def test_export_rejects_missing_date_header(self):
        meta,_,alts=self.fixture()
        with self.assertRaises(ValueError):sync.make_public_snapshot(meta,[['목록','제목']],alts)
    def test_alternative_exchange_not_addition(self):
        data=sync.make_public_snapshot(*self.fixture())
        self.assertEqual(data['alternatives'][0]['replaces'],'클라우드 포레스트')
        self.assertEqual(data['alternatives'][0]['title'],'호텔 휴식')

    def test_cruise_notes_do_not_become_a_move(self):
        for text in ['디즈니 어드벤처 · 랑카위 기항\n하선·귀선 안내 확인',
                     '디즈니 어드벤처 · 해상일 동선 (가안)\n하선 짐 정리']:
            self.assertEqual(sync.classify(text),'cruise')
    def test_pat_does_not_become_an_assigned_clock_time(self):
        meta={'sheets':[{'properties':{'title':'일정표','sheetId':0}}]}
        grid=[['시간 (SGT)','2/18 (목)'],['14:00','예약 PAT 기준 승선 수속 · 마감 확인 필요']]
        event=sync.make_public_snapshot(meta,grid,[])['days'][0]['events'][0]
        self.assertEqual(event['time'],'배정 PAT 기준')
        self.assertEqual(event['title'],'승선 수속 · 마감 확인 필요')
    def test_langkawi_theme_and_all_day_cruise(self):
        meta={'sheets':[{'properties':{'title':'일정표','sheetId':0}}]}
        grid=[['시간 (SGT)','2/20 (토)'],['07:00','디즈니 어드벤처 · 랑카위 기항\n하선·귀선 확인']]
        day=sync.make_public_snapshot(meta,grid,[])['days'][0]
        self.assertIn('랑카위',day['title'])
        self.assertEqual(day['events'][0]['kind'],'cruise')
        self.assertEqual(day['events'][0]['time'],'하루 종일')

if __name__=='__main__':unittest.main()
