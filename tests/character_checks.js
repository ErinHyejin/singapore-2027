// Run in the isolated browser on the local or deployed site.
(async()=>{
  const results=[],$=id=>document.getElementById(id);
  const check=(name,ok)=>{results.push({name,ok});if(!ok)throw new Error(name);};
  const load=src=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error('Character asset failed: '+src));i.src=src;});
  const expected=['mickey','donald','minnie','stitch','goofy','olaf','minnie','stitch'];
  const extensions={mickey:'svg',minnie:'svg',stitch:'webp',donald:'webp',goofy:'webp',olaf:'webp'};
  for(const [name,ext]of Object.entries(extensions)){
    const img=await load('./assets/characters/'+name+'.'+ext);
    check(name+' asset decodes',img.naturalWidth>0&&img.naturalHeight>0);
  }
  check('countdown populated',/^여행까지 D-\d+$|여행 중|우리의 모험/.test($('trip-countdown').textContent));
  const found=new Set();
  for(const [n,day]of window.TRIP_DATA.days.entries()){
    $('tab-'+day.date).click();const friend=$('day-companion');
    check(day.date+' companion',friend.dataset.character===expected[n]);found.add(friend.dataset.character);
    check(day.date+' photo preserved',$('day-photo').getAttribute('src')===window.TRIP_PHOTOS.days[day.date].src);
    check(day.date+' timetable preserved',document.querySelectorAll('.event').length===day.events.length);
  }
  check('six distinct daily companions',found.size===6);
  const sprites=[...document.querySelectorAll('img[src*="/characters/"]')];
  check('decorations hidden from assistive tech',sprites.every(i=>i.alt===''&&i.getAttribute('aria-hidden')==='true'));
  check('decorations never intercept taps',sprites.every(i=>getComputedStyle(i).pointerEvents==='none'));
  const intersects=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
  check('hero characters do not cover heading, date or route',sprites.filter(i=>i.classList.contains('hero-character')).every(i=>!['h1','.trip-meta','.voyage-route','.trip-caption'].some(s=>intersects(i.getBoundingClientRect(),document.querySelector(s).getBoundingClientRect()))));
  for(const b of document.querySelectorAll('[data-voyage-date]')){
    b.click();check('route jumps '+b.dataset.voyageDate,document.querySelector('[role=tab][aria-selected=true]').id==='tab-'+b.dataset.voyageDate);
    check('route current step '+b.dataset.voyageDate,b.getAttribute('aria-current')==='step');
    const r=b.getBoundingClientRect();check('route touch target '+b.dataset.voyageDate,r.width>=44&&r.height>=44);
  }
  $('tab-2027-02-19').click();$('tab-2027-02-20').click();
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const animations=$('day-companion').getAnimations();
  check('motion preference respected',reduced?animations.length===0:animations.length===1&&animations[0].effect.getTiming().duration===360);
  check('no looping hero motion',[...document.querySelectorAll('.hero-character')].every(i=>getComputedStyle(i).animationIterationCount==='1'));
  check('hero reduced-motion path',!reduced||[...document.querySelectorAll('.hero-character')].every(i=>getComputedStyle(i).animationName==='none'));
  check('no document overflow',document.documentElement.scrollWidth<=innerWidth);
  check('no character booking claims',!/미키.*만남.*확정|스티치.*만남.*확정/.test(document.body.innerText));
  $('tab-2027-02-22').click();
  return JSON.stringify({passed:results.length,viewport:innerWidth,reducedMotion:reduced,countdown:$('trip-countdown').textContent,results});
})();
