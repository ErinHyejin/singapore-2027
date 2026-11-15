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

if __name__=='__main__':unittest.main()
