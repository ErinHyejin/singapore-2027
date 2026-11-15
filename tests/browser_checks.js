// Run this expression in the isolated browser after loading the site.
// No browser automation dependency is required by the published app.
(() => {
  const results=[];
  const check=(name,ok,detail='')=>{results.push({name,ok,detail});if(!ok)throw new Error(name+': '+detail);};
  const $=id=>document.getElementById(id);
  const data=window.TRIP_DATA;
  check('eight dates',data.days.length===8);
  check('no document-level horizontal overflow',document.documentElement.scrollWidth<=innerWidth);
  for(const day of data.days){
    $('tab-'+day.date).click();
    const active=document.querySelector('[role=tab][aria-selected=true]');
    check(day.date+' selected',active.id==='tab-'+day.date);
    check(day.date+' card count',document.querySelectorAll('.event').length===day.events.length);
    const bounds=active.getBoundingClientRect(),strip=$('date-tabs').getBoundingClientRect();
    check(day.date+' selected tab in view',bounds.left>=strip.left-1&&bounds.right<=strip.right+1);
  }
  $('tab-2027-02-22').click();
  const alternative=document.querySelector('.alternative-card');
  const before=alternative.open;alternative.querySelector('summary').click();
  check('alternative disclosure toggles',alternative.open!==before);
  $('grid-view').click();
  check('grid view opens',!$('grid-panel').hidden&&$('daily-panel').hidden);
  check('first column is time',document.querySelector('#schedule-table thead th').textContent==='시간');
  check('all eight dates are columns',document.querySelectorAll('#schedule-table thead th').length===9);
  $('daily-view').click();check('daily view opens',!$('daily-panel').hidden&&$('grid-panel').hidden);
  $('next-day').click();check('next day',document.querySelector('[aria-selected=true]').id==='tab-2027-02-23');
  $('previous-day').click();check('previous day',document.querySelector('[aria-selected=true]').id==='tab-2027-02-22');
  $('tab-2027-02-17').click();
  $('tab-2027-02-17').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
  check('arrow-key navigation',document.querySelector('[aria-selected=true]').id==='tab-2027-02-18');
  check('safe map links',[...document.querySelectorAll('.map-link')].every(a=>a.href.startsWith('https://www.google.com/maps/')));
  $('tab-2027-02-22').click();
  return JSON.stringify({passed:results.length,viewport:innerWidth,results});
})();
