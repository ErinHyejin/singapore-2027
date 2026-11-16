// Await in the isolated browser. All event imagery is existing sourced artwork.
(async()=>{
 const results=[],$=id=>document.getElementById(id);
 const check=(name,ok)=>{results.push({name,ok});if(!ok)throw new Error(name);};
 const loaded=img=>img.complete&&img.naturalWidth?Promise.resolve():new Promise((res,rej)=>{img.addEventListener('load',res,{once:true});img.addEventListener('error',()=>rej(new Error(img.src)),{once:true});});
 const actions=window.TRIP_ACTIONS;check('scene data loaded',!!actions?.events&&!!actions?.assets);
 const seen=new Set(),used=new Set(),characters=new Set();
 for(const day of window.TRIP_DATA.days){
  $('tab-'+day.date).click();
  const cards=[...document.querySelectorAll('.event')];check(day.date+' card count unchanged',cards.length===day.events.length);
  for(const event of day.events){
   const card=cards.find(c=>c.dataset.eventId===event.id);check(event.id+' correct title',card?.querySelector('h3').textContent===event.title);
   const scene=card.querySelector('.event-scene'),binding=actions.events[event.id],asset=actions.assets[binding?.asset];
   check(event.id+' activity scene assigned',!!scene&&scene.dataset.asset===binding.asset&&scene.dataset.activity===binding.activity);
   const img=scene.querySelector('img');img.loading='eager';await loaded(img);
   check(event.id+' image decoded',img.naturalWidth>0&&!scene.hidden);
   check(event.id+' exact local asset',img.getAttribute('src')===asset.src);
   check(event.id+' honest character caption',scene.querySelector('figcaption').textContent===asset.caption);
   check(event.id+' activity relationship',asset.activityTags.includes(binding.activity));
   check(event.id+' decorative accessibility',scene.getAttribute('aria-hidden')==='true'&&img.alt===''&&getComputedStyle(scene).pointerEvents==='none');
   const r=scene.getBoundingClientRect(),p=card.querySelector('.event-card').getBoundingClientRect(),copy=card.querySelector('.event-copy').getBoundingClientRect();
   check(event.id+' image contained and not covering text',r.left>=p.left-1&&r.right<=p.right+1&&(r.left>=copy.right-1||r.top>=copy.bottom-1));
   check(event.id+' no character crop',getComputedStyle(img).objectFit==='contain');
   seen.add(event.id);used.add(binding.asset);asset.characters.forEach(c=>characters.add(c));
  }
 }
 check('all 30 schedule events covered',seen.size===30);
 check('at least 18 distinct activity scenes',used.size>=18);
 check('at least 16 distinct characters',characters.size>=16);
 check('no document-level overflow',document.documentElement.scrollWidth<=innerWidth);
 $('tab-2027-02-22').click();const first=document.querySelector('.event'),image=first.querySelector('.event-scene img'),title=first.querySelector('h3').textContent;
 image.dispatchEvent(new Event('error'));
 check('image error leaves itinerary readable',first.querySelector('.event-scene').hidden&&!first.querySelector('.event-card').classList.contains('has-scene')&&first.querySelector('h3').textContent===title);
 $('tab-2027-02-22').click();
 return JSON.stringify({passed:results.length,viewport:innerWidth,eventCoverage:seen.size,distinctScenes:used.size,distinctCharacters:characters.size,results});
})();
