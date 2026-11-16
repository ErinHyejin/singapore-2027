// Await this expression in an isolated browser Runtime.evaluate call.
(async () => {
  const results=[];
  const check=(name,ok)=>{results.push({name,ok});if(!ok)throw new Error(name);};
  const image=document.getElementById('day-photo');
  const hero=document.getElementById('cruise-photo');
  const loaded=img=>img.complete&&img.naturalWidth?Promise.resolve():new Promise((resolve,reject)=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',()=>reject(new Error('image failed: '+img.src)),{once:true});});
  await loaded(hero);
  check('real cruise hero loaded',hero.naturalWidth>=1000&&hero.alt.includes('디즈니 어드벤처'));
  for(const day of window.TRIP_DATA.days){
    document.getElementById('tab-'+day.date).click();
    await loaded(image);
    check(day.date+' image loaded',image.naturalWidth>0&&image.complete);
    check(day.date+' correct theme',image.getAttribute('src')===window.TRIP_PHOTOS.days[day.date].src);
    check(day.date+' alt text',image.alt.length>5);
  }
  check('eight distinct daily photos',new Set(Object.values(window.TRIP_PHOTOS.days).map(p=>p.src)).size===8);
  check('no visible source or usage notices',!/wikimedia|creative commons|CC BY|CC0|사진 출처|사용 조건/i.test(document.body.innerText));
  check('no legacy green palette',getComputedStyle(document.documentElement).getPropertyValue('--teal').trim()==='');
  document.getElementById('tab-2027-02-22').click();await loaded(image);
  return JSON.stringify({passed:results.length,viewport:innerWidth,results});
})();
