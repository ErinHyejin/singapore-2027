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
  let gridVisible = false;
  let buttons = [];

  function mapLink(url) {
    if (!url || !url.startsWith('https://www.google.com/maps/')) return null;
    const a = el('a', 'map-link', '지도에서 보기 ↗');
    a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    return a;
  }
  function renderCard(event) {
    const kind = safeKind(event.kind);
    const article = el('article', 'event'); article.dataset.kind = kind;
    article.append(el('span', 'event-time', event.time));
    const card = el('div', 'event-card');
    const top = el('div', 'card-top');
    top.append(el('h3', '', event.title), el('span', `badge ${kind}`, labels[kind]));
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
    const [year, month, date] = day.date.split('-').map(Number);
    const when = `${month}/${date}`;
    const options = data.alternatives.filter(a => a.when.startsWith(when) && !a.excluded);
    const container = $('alternatives-list'); container.replaceChildren();
    if (!options.length) {
      container.append(el('p', 'no-alts', day.events.some(e => e.kind === 'cruise') ? '선내 프로그램은 별도로 정해요. 쉬고 싶은 만큼 여유롭게 보내세요.' : '이날은 이동과 휴식을 우선해요. 별도 관광을 더하지 않아도 괜찮아요.'));
      return;
    }
    options.forEach(a => {
      const details = el('details', 'alternative-card');
      details.append(el('summary', '', `${a.replaces} 대신 ${a.title}`));
      const body = el('div', 'alt-body');
      const condition = el('p'); condition.append(el('strong', '', '이럴 때  '), document.createTextNode(a.condition));
      body.append(condition, el('p', '', a.note));
      const link = mapLink(a.map); if (link) body.append(link);
      details.append(body); container.append(details);
    });
  }
  function renderDay() {
    const index = data.days.findIndex(d => d.date === selected);
    const day = data.days[index];
    buttons.forEach((b, i) => { const active = i === index; b.setAttribute('aria-selected', String(active)); b.tabIndex = active ? 0 : -1; });
    $('daily-panel').setAttribute('aria-labelledby', `tab-${day.date}`);
    $('day-label').textContent = `${day.date.replaceAll('-', '. ')} · ${day.label.match(/\((.)\)/)?.[1] || ''}요일`;
    $('day-title').textContent = day.title;
    $('day-subtitle').textContent = day.subtitle;
    $('day-index').textContent = `0${index + 1}`.slice(-2);
    $('timeline').replaceChildren(...day.events.map(renderCard));
    const summary = $('day-summary'); summary.replaceChildren();
    summary.append(el('span', 'summary-chip', `${day.events.length}개의 일정 블록`));
    if (day.events.some(e => e.kind === 'rest')) summary.append(el('span', 'summary-chip rest', '호텔에서 쉬는 시간 확보'));
    if (day.events.some(e => e.kind === 'check')) summary.append(el('span', 'summary-chip', '수속 시간 재확인'));
    $('previous-day').disabled = index === 0;
    $('next-day').disabled = index === data.days.length - 1;
    renderAlternatives(day);
  }
  function toggleView(grid) {
    gridVisible = grid;
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
    const button = buttons[data.days.findIndex(d => d.date === date)];
    if (userInitiated) {
      button.scrollIntoView({block:'nearest', inline:'center'});
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
  $('daily-view').addEventListener('click', () => toggleView(false));
  $('grid-view').addEventListener('click', () => toggleView(true));
  $('refresh-button').addEventListener('click', () => location.reload());
  $('previous-day').addEventListener('click', () => { const index = data.days.findIndex(d => d.date === selected); if(index>0) selectDay(data.days[index-1].date, true); });
  $('next-day').addEventListener('click', () => { const index = data.days.findIndex(d => d.date === selected); if(index<data.days.length-1) selectDay(data.days[index+1].date, true); });
  window.addEventListener('hashchange', () => { if(available(hashDate())) { selected=hashDate(); renderDay(); toggleView(false); } });
  const updated = new Intl.DateTimeFormat('ko-KR', {timeZone:'Asia/Singapore', month:'numeric', day:'numeric', hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(data.updatedAt));
  $('updated').textContent = `${updated} SGT 반영`;
})();
