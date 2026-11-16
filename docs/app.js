(() => {
  'use strict';
  const data = window.TRIP_DATA;
  const $ = id => document.getElementById(id);
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  if (!data || !Array.isArray(data.days) || !data.days.length) {
    $('timeline').append(el('p', 'no-alts', '일정 정보를 불러오지 못했어요. 잠시 후 새로고침해 주세요.'));
    return;
  }
  const labels = {tour:'관광 제안', rest:'쉬는 시간', meal:'식사', move:'이동', check:'확인 필요', cruise:'크루즈'};
  const allowedKinds = new Set(Object.keys(labels));
  const safeKind = value => allowedKinds.has(value) ? value : 'tour';
  const getSaved = () => { try { return localStorage.getItem('singapore-day'); } catch { return null; } };
  const saveDay = value => { try { localStorage.setItem('singapore-day', value); } catch { /* Optional convenience only. */ } };
  const available = id => data.days.some(d => d.date === id);
  const hashDate = () => location.hash.slice(1);
  let selected = available(hashDate()) ? hashDate() : (available(getSaved()) ? getSaved() : data.days[0].date);
  let buttons = [];
  const companions = {
    mickey:'./assets/characters/mickey.svg', minnie:'./assets/characters/minnie.svg',
    stitch:'./assets/characters/stitch.webp', donald:'./assets/characters/donald.webp',
    goofy:'./assets/characters/goofy.webp', olaf:'./assets/characters/olaf.webp'
  };
  const companionByDay = ['mickey','donald','minnie','stitch','goofy','olaf','minnie','stitch'];

  function updateCountdown(now = new Date()) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone:'Asia/Singapore',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).map(p => [p.type,p.value]));
    const today = Date.UTC(Number(parts.year),Number(parts.month)-1,Number(parts.day));
    const first = Date.parse(data.days[0].date+'T00:00:00Z');
    const last = Date.parse(data.days[data.days.length-1].date+'T00:00:00Z');
    const days = Math.round((first-today)/86400000);
    $('trip-countdown').textContent = days>0 ? `여행까지 D-${days}` : today<=last ? '지금은 우리의 여행 중' : '다시 꺼내 보는 우리의 모험';
    $('trip-countdown').dataset.days = String(days);
  }

  function animateDayChange() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const friend = $('day-companion');
    friend.getAnimations().forEach(a => a.cancel());
    friend.animate([
      {opacity:.6,transform:'translateY(0) rotate(-4deg) scale(.96)'},
      {opacity:1,transform:'translateY(0) rotate(0) scale(1)'}
    ], {duration:360,easing:'cubic-bezier(.22,1,.36,1)'});
    $('day-photo').getAnimations().forEach(a => a.cancel());
    $('day-photo').animate([{opacity:.7},{opacity:1}],{duration:220,easing:'ease-out'});
  }

  function icon(path, className = '') {
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    node.setAttribute('viewBox', '0 0 24 24');
    node.setAttribute('aria-hidden', 'true');
    if (className) node.setAttribute('class', className);
    const stroke = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    stroke.setAttribute('d', path); node.append(stroke); return node;
  }

  function mapLink(url) {
    if (!url || !url.startsWith('https://www.google.com/maps/')) return null;
    const a = el('a', 'map-link', '지도');
    a.append(icon('M14 4h6v6M20 4 10 14M20 14v6H4V4h6'));
    a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    return a;
  }
  function renderCard(event) {
    const kind = safeKind(event.kind);
    const article = el('article', 'event'); article.dataset.kind = kind;
    const time = el('span', 'event-time');
    const range = event.time.match(/^(\d{1,2}:\d{2})[–~](\d{1,2}:\d{2})$/);
    if (range) time.append(el('span', 'time-start', range[1]), el('span', 'time-end', `~${range[2]}`));
    else time.textContent = event.time;
    article.append(time);
    const card = el('div', 'event-card');
    const top = el('div', 'card-top');
    top.append(el('h3', '', event.title));
    if (['check', 'rest', 'cruise'].includes(kind)) top.append(el('span', `badge ${kind}`, labels[kind]));
    card.append(top);
    if (event.details.length) {
      const detail = el('div', 'event-details');
      event.details.forEach(text => detail.append(el('p', '', text)));
      card.append(detail);
    }
    const link = mapLink(event.map); if (link) card.append(link);
    if (event.alternative.length) {
      const alt = el('div', 'inline-alt');
      alt.append(el('strong', '', '대안'), document.createTextNode(event.alternative.join(' · ')));
      card.append(alt);
    }
    article.append(card); return article;
  }
  function renderAlternatives(day) {
    const [, month, date] = day.date.split('-').map(Number);
    const when = `${month}/${date}`;
    const options = data.alternatives.filter(a => a.when.startsWith(when) && !a.excluded);
    const container = $('alternatives-list'); container.replaceChildren();
    if (!options.length) {
      container.append(el('p', 'no-alts', day.events.some(e => e.kind === 'cruise') ? '선내 프로그램은 별도 일정으로 확인하세요' : '등록한 대안이 없습니다'));
      return;
    }
    options.forEach(a => {
      const details = el('details', 'alternative-card');
      const heading = el('summary', '', `${a.replaces} 대신 ${a.title}`);
      heading.append(icon('m6 9 6 6 6-6', 'disclosure-icon'));
      details.append(heading);
      const body = el('div', 'alt-body');
      const condition = el('p'); condition.append(el('strong', '', '이럴 때  '), document.createTextNode(a.condition));
      body.append(condition, el('p', '', a.note));
      const link = mapLink(a.map); if (link) body.append(link);
      details.append(body); container.append(details);
    });
  }
  function revealSelectedTab() {
    const tabs = $('date-tabs');
    const button = buttons[data.days.findIndex(d => d.date === selected)];
    const delta = button.getBoundingClientRect().left - tabs.getBoundingClientRect().left;
    tabs.scrollLeft += delta - (tabs.clientWidth - button.offsetWidth) / 2;
  }
  function renderDay() {
    const index = data.days.findIndex(d => d.date === selected);
    const day = data.days[index];
    buttons.forEach((b, i) => { const active = i === index; b.setAttribute('aria-selected', String(active)); b.tabIndex = active ? 0 : -1; });
    revealSelectedTab();
    $('daily-panel').setAttribute('aria-labelledby', `tab-${day.date}`);
    $('day-label').textContent = `2월 ${Number(day.date.slice(-2))}일 ${day.label.match(/\((.)\)/)?.[1] || ''}요일`;
    $('day-title').textContent = day.title;
    $('day-subtitle').textContent = day.subtitle;
    $('day-index').textContent = String(Number(day.date.slice(-2)));
    const photo = window.TRIP_PHOTOS?.days?.[day.date];
    const image = $('day-photo');
    if (photo) { image.src = photo.src; image.alt = photo.alt; }
    const companion = companionByDay[index % companionByDay.length];
    $('day-companion').src = companions[companion];
    $('day-companion').dataset.character = companion;
    const routes = [...document.querySelectorAll('[data-voyage-date]')];
    const leg = routes.filter(b => b.dataset.voyageDate<=day.date).at(-1);
    routes.forEach(b => { if(b===leg)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current'); });
    $('timeline').replaceChildren(...day.events.map(renderCard));
    const summary = $('day-summary'); summary.replaceChildren();
    summary.append(el('span', 'summary-chip', `일정 ${day.events.length}개`));
    if (day.events.some(e => e.kind === 'rest')) summary.append(el('span', 'summary-chip rest', '호텔 휴식 포함'));
    if (day.events.some(e => e.kind === 'check')) summary.append(el('span', 'summary-chip', '수속 시간 확인 필요'));
    $('previous-day').disabled = index === 0;
    $('next-day').disabled = index === data.days.length - 1;
    renderAlternatives(day);
  }
  function toggleView(grid) {
    $('daily-panel').hidden = grid;
    $('grid-panel').hidden = !grid;
    $('daily-view').setAttribute('aria-pressed', String(!grid));
    $('grid-view').setAttribute('aria-pressed', String(grid));
  }
  function selectDay(date, userInitiated = false) {
    if (!available(date)) return;
    selected = date; saveDay(date);
    history.replaceState(null, '', `#${date}`);
    renderDay(); toggleView(false);
    if (userInitiated) {
      animateDayChange();
      const top = $('main').getBoundingClientRect().top + window.scrollY - document.querySelector('.date-dock').offsetHeight - 8;
      window.scrollTo({top:Math.max(0,top), behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    }
  }
  function createTabs() {
    const tabs = $('date-tabs');
    buttons = data.days.map((day, index) => {
      const b = el('button', 'date-tab'); b.type = 'button'; b.id = `tab-${day.date}`;
      b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'daily-panel');
      b.setAttribute('aria-label', `${day.label} 일정`);
      b.append(el('span', 'weekday', `${day.label.match(/\((.)\)/)?.[1] || ''}요일`), el('span', 'date-number', String(Number(day.date.slice(-2)))), el('span', 'date-mark', index===0?'도착':index===data.days.length-1?'귀국':day.events.some(e=>e.kind==='cruise')?'크루즈':'도시 여행'));
      b.addEventListener('click', () => selectDay(day.date, true));
      b.addEventListener('keydown', e => {
        let target = index;
        if (e.key === 'ArrowRight') target = (index + 1) % data.days.length;
        else if (e.key === 'ArrowLeft') target = (index + data.days.length - 1) % data.days.length;
        else if (e.key === 'Home') target = 0;
        else if (e.key === 'End') target = data.days.length - 1;
        else return;
        e.preventDefault(); selectDay(data.days[target].date); buttons[target].focus();
      });
      tabs.append(b); return b;
    });
  }
  function renderGrid() {
    const table = $('schedule-table');
    const caption = el('caption', '', '2027년 2월 싱가포르 전체 일정 · 현지 시간');
    const head = el('thead'); const hr = el('tr'); hr.append(el('th', '', '시간'));
    data.days.forEach(day => { const th = el('th', '', day.label); th.scope = 'col'; hr.append(th); }); head.append(hr);
    const body = el('tbody');
    const starts = [...new Set(data.days.flatMap(day => day.events.map(e => e.start)))].sort();
    starts.forEach(time => {
      const tr = el('tr'); const th = el('th', '', time === '00:00' ? '새벽' : time); th.scope = 'row'; tr.append(th);
      data.days.forEach(day => {
        const cell = el('td'); const events = day.events.filter(e => e.start === time);
        if (events.length) {
          cell.dataset.kind = safeKind(events[0].kind);
          events.forEach((event, i) => { if (i) cell.append(el('hr')); cell.append(el('strong', '', event.title), el('div', '', event.time)); if(event.alternative.length) cell.append(el('small', '', `대안: ${event.alternative.join(' · ')}`)); });
        }
        tr.append(cell);
      }); body.append(tr);
    });
    table.replaceChildren(caption, head, body);
  }
  createTabs(); renderDay(); renderGrid();
  updateCountdown();
  document.querySelectorAll('[data-voyage-date]').forEach(b => b.addEventListener('click', () => selectDay(b.dataset.voyageDate, true)));
  $('daily-view').addEventListener('click', () => toggleView(false));
  $('grid-view').addEventListener('click', () => toggleView(true));
  $('refresh-button').addEventListener('click', () => location.reload());
  $('previous-day').addEventListener('click', () => { const index = data.days.findIndex(d => d.date === selected); if(index>0) selectDay(data.days[index-1].date, true); });
  $('next-day').addEventListener('click', () => { const index = data.days.findIndex(d => d.date === selected); if(index<data.days.length-1) selectDay(data.days[index+1].date, true); });
  window.addEventListener('resize', revealSelectedTab);
  window.addEventListener('hashchange', () => { if(available(hashDate())) { selected=hashDate(); renderDay(); toggleView(false); } });
  const updated = new Intl.DateTimeFormat('ko-KR', {timeZone:'Asia/Singapore', month:'numeric', day:'numeric', hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(data.updatedAt));
  $('updated').textContent = `${updated} SGT 반영`;
})();
