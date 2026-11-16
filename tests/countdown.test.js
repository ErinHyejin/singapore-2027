// Calendar boundaries are Singapore dates, not the viewer's local timezone.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('docs/app.js','utf8');
const fn=source.match(/  function updateCountdown[\s\S]*?\n  }\n/)[0];
const cases=[
 ['2026-11-16T03:00:00Z',93,'여행까지 D-93'],
 ['2027-02-16T15:59:59Z',1,'여행까지 D-1'],
 ['2027-02-16T16:00:00Z',0,'지금은 우리의 여행 중'],
 ['2027-02-24T15:59:59Z',-7,'지금은 우리의 여행 중'],
 ['2027-02-24T16:00:00Z',-8,'다시 꺼내 보는 우리의 모험']
];
for(const [now,days,text]of cases){
 const node={textContent:'',dataset:{}};
 vm.runInNewContext(fn+';updateCountdown(new Date(now));',{
  data:{days:[{date:'2027-02-17'},{date:'2027-02-24'}]},$:(id)=>{assert.equal(id,'trip-countdown');return node;},now
 });
 assert.equal(node.dataset.days,String(days));assert.equal(node.textContent,text);
}
console.log(JSON.stringify({passed:cases.length,timezone:'Asia/Singapore'}));
