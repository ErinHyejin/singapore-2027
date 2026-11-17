// Cruise plans are proposals; ship offerings are not a dated personal Navigator.
(()=>{
 const results=[],$=id=>document.getElementById(id);
 const check=(name,ok)=>{results.push({name,ok});if(!ok)throw new Error(name);};
 for(const date of ['2027-02-19','2027-02-20','2027-02-21']){
  $('tab-'+date).click();const day=window.TRIP_DATA.days.find(d=>d.date===date),text=$('timeline').innerText;
  check(date+' all-day cruise',day.events.length===1&&day.events[0].kind==='cruise'&&day.events[0].time==='하루 종일');
  check(date+' dayparts filled',['오전','오후','저녁'].every(s=>text.includes(s)));
  check(date+' actual app confirmation',text.includes('앱'));
  check(date+' no old blank plan',!/선내 일정은 별도|선내 일정 별도/.test(text));
  check(date+' scene retained',!!document.querySelector('.event-scene img'));
  check(date+' no horizontal overflow',document.documentElement.scrollWidth<=innerWidth);
 }
 $('tab-2027-02-20').click();
 check('Langkawi title',$('day-title').textContent.includes('랑카위'));
 check('Langkawi booking confirmation',$('day-subtitle').textContent.includes('예약 확인서'));
 check('confirmed dinner with variability',['17:45','15분 변동 가능'].every(s=>portTextFor('2027-02-20').includes(s)));
 function portTextFor(date){$('tab-'+date).click();return $('timeline').innerText;}
 check('Langkawi tab is a port day',$('tab-2027-02-20').querySelector('.date-mark').textContent==='기항일');
 const port=$('timeline').innerText;
 check('Ashore and Aboard distinguished',port.includes('하선 가능 11:00')&&port.includes('귀선 마감 21:00')&&port.includes('출항시각이 아니'));
 check('shore or onboard remains a choice',port.includes('자유하선 또는 선내 잔류 중 선택'));
 $('tab-2027-02-18').click();
 const boarding=document.querySelector('[data-event-id="2027-02-18-9"]');
 check('family PAT is not invented',boarding.querySelector('.event-time').textContent==='배정 PAT 기준');
 check('onboard first-day plan filled',$('timeline').innerText.includes('안전 안내·Navigator 확인'));
 $('tab-2027-02-20').click();
 return JSON.stringify({passed:results.length,viewport:innerWidth,results});
})();
