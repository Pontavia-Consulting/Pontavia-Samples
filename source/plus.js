/* Fern & Field: Better and Best interactions. Front-end only; nothing is sent to a server. */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const FF = window.FF;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  window.ffEsc = esc;

  // ---------- helpers ----------
  window.ffToast = function (msg) {
    const t = document.createElement('div');
    t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  };
  let lastFocus = null;
  window.ffOpen = function (el) {
    lastFocus = document.activeElement;
    el.hidden = false;
    const f = el.querySelector('input, select, button:not([data-close]), [tabindex]');
    (f || el.querySelector('[data-close]')).focus();
  };
  window.ffClose = function (el) {
    el.hidden = true;
    if (lastFocus) lastFocus.focus();
  };
  document.addEventListener('click', (e) => {
    const c = e.target.closest('[data-close]');
    if (c) { ffClose(c.closest('.modal, .lightbox')); return; }
    if (e.target.classList && (e.target.classList.contains('modal') || e.target.classList.contains('lightbox'))) ffClose(e.target);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = $$('.modal:not([hidden]), .lightbox:not([hidden])').pop();
    if (open) ffClose(open);
  });

  // Time in Ocala, wherever the visitor is
  function ocalaNow() {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false, month: 'numeric' }).formatToParts(new Date());
    const get = (t) => (parts.find((p) => p.type === t) || {}).value;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return { day: days.indexOf(get('weekday')), hour: (+get('hour') % 24) + (+get('minute')) / 60, month: +get('month') - 1 };
  }
  const fmtH = (h) => (h === 12 ? '12 pm' : h > 12 ? (h - 12) + ' pm' : h + ' am');

  // ---------- plant-of-the-month packet ----------
  window.ffSetMonth = function (i, animate) {
    const pk = $('[data-packet]');
    if (!pk) return;
    const m = FF.months[i], p = FF.byId(m.plant);
    const set = (sel, v) => { const n = $(sel, pk); if (n) n.textContent = v; };
    set('[data-pk-month]', 'Plant in ' + m.m);
    set('[data-pk-name]', p.name); set('[data-pk-latin]', p.latin);
    set('[data-pk-light]', p.light); set('[data-pk-water]', p.water); set('[data-pk-height]', p.height);
    set('[data-pk-note]', m.note); set('[data-pk-price]', '$' + p.price);
    const art = $('[data-pk-art]', pk); if (art) art.innerHTML = plantArt(Object.assign({ label: 'Illustration of ' + p.name }, p.art));
    const link = $('[data-pk-link]', pk); if (link) link.href = 'product.html?id=' + p.id;
    const add = $('[data-pk-add]', pk); if (add) add.dataset.add = p.id;
    if (animate) { pk.classList.remove('swap'); void pk.offsetWidth; pk.classList.add('swap'); }
  };

  // ---------- open now / hours ----------
  function hoursStatus() {
    const now = ocalaNow();
    const today = FF.hours[now.day];
    const open = today && now.hour >= today[0] && now.hour < today[1];
    let text;
    if (open) text = 'Open until ' + fmtH(today[1]) + ' today · 2200 Fern Hollow Rd';
    else {
      let d = now.day, n = 0;
      if (today && now.hour < today[0]) text = 'Opens at ' + fmtH(today[0]) + ' today';
      else {
        do { d = (d + 1) % 7; n++; } while (!FF.hours[d] && n < 7);
        const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        text = 'Opens ' + (n === 1 ? 'tomorrow' : names[d]) + ' at ' + fmtH(FF.hours[d][0]);
      }
    }
    $$('[data-open-pill]').forEach((p) => { p.textContent = open ? 'Open now' : 'Closed now'; p.classList.toggle('closed', !open); });
    $$('[data-open-text]').forEach((p) => { p.textContent = text; });
    $$('.hours-list li').forEach((li) => li.classList.toggle('today', +li.dataset.day === now.day));
    return now;
  }

  // ---------- before / after ----------
  function beforeAfter() {
    $$('[data-ba]').forEach((ba) => {
      const r = $('input', ba), after = $('.after', ba), h = $('.handle', ba);
      const upd = () => { after.style.clipPath = `inset(0 0 0 ${r.value}%)`; h.style.left = r.value + '%'; };
      r.addEventListener('input', upd); upd();
    });
  }

  // ---------- plant library ----------
  function plantCard(p) {
    return `<button type="button" class="plant-card" data-open-plant="${p.id}" style="text-align:left;font:inherit;cursor:pointer;padding:0">
      <div class="pic">${plantArt(Object.assign({ label: 'Illustration of ' + p.name }, p.art))}</div>
      <div class="body"><h3>${esc(p.name)}</h3><div class="latin">${esc(p.latin)}</div>
      <div class="facts">${p.native ? '<span class="fact native">Florida native</span>' : ''}<span class="fact">${p.light}</span><span class="fact">${p.water} water</span></div></div></button>`;
  }
  function library() {
    const grid = $('[data-lib-grid]');
    if (!grid) return;
    let cat = 'all';
    const q = $('[data-lib-q]'), light = $('[data-lib-light]'), nat = $('[data-lib-native]'), count = $('[data-lib-count]');
    function render() {
      const term = q.value.trim().toLowerCase();
      const list = FF.plants.filter((p) => (cat === 'all' || p.cats.includes(cat)) && (!light.value || p.light === light.value) && (!nat.checked || p.native) &&
        (!term || (p.name + ' ' + p.latin).toLowerCase().includes(term)));
      grid.innerHTML = list.length ? list.map(plantCard).join('') :
        '<div class="empty"><h3>No plants match those filters</h3><p class="muted" style="margin:0 auto 14px">Try a different light level or clear the search.</p><button class="btn small" type="button" data-lib-reset>Show all plants</button></div>';
      count.textContent = list.length + (list.length === 1 ? ' plant' : ' plants');
    }
    $$('.chip[data-cat]').forEach((c) => c.addEventListener('click', () => {
      cat = c.dataset.cat;
      $$('.chip[data-cat]').forEach((x) => x.setAttribute('aria-pressed', x === c));
      render();
    }));
    [q, light, nat].forEach((el) => el.addEventListener('input', render));
    grid.addEventListener('click', (e) => {
      if (e.target.closest('[data-lib-reset]')) { q.value = ''; light.value = ''; nat.checked = false; cat = 'all'; $$('.chip[data-cat]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.cat === 'all')); render(); return; }
      const b = e.target.closest('[data-open-plant]');
      if (b) openPlant(b.dataset.openPlant);
    });
    render();
    const h = location.hash.slice(1);
    if (h && FF.byId(h)) openPlant(h);
  }
  function openPlant(id) {
    const p = FF.byId(id), m = $('[data-plant-modal]');
    if (!p || !m) return;
    $('[data-pm-name]', m).textContent = p.name;
    $('[data-pm-latin]', m).textContent = p.latin;
    $('[data-pm-blurb]', m).textContent = p.blurb;
    $('[data-pm-art]', m).innerHTML = plantArt(Object.assign({ label: 'Illustration of ' + p.name }, p.art));
    $('[data-pm-facts]', m).innerHTML = [['Light', p.light], ['Water', p.water], ['Mature height', p.height], ['Blooms', p.bloom], ['Native', p.native ? 'Yes' : 'No'], ['In stock', p.stock + ' at the nursery']]
      .map(([k, v]) => `<dt class="muted small">${k}</dt><dd class="small" style="margin:0;font-weight:600">${esc(v)}</dd>`).join('');
    ffOpen(m);
  }

  // ---------- gallery lightbox ----------
  function gallery() {
    const lb = $('[data-lightbox]');
    if (!lb) return;
    const shots = $$('[data-shot]');
    let i = 0;
    function show(n) {
      i = (n + shots.length) % shots.length;
      const s = shots[i];
      $('[data-lb-scene]', lb).innerHTML = $('.scene', s).outerHTML;
      $('[data-lb-title]', lb).textContent = $('.cap b', s).textContent;
      $('[data-lb-meta]', lb).textContent = $('.cap span', s).textContent;
    }
    shots.forEach((s, n) => s.addEventListener('click', () => { show(n); ffOpen(lb); }));
    $('[data-lb-prev]', lb).addEventListener('click', () => show(i - 1));
    $('[data-lb-next]', lb).addEventListener('click', () => show(i + 1));
    lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
  }

  // ---------- workshop seats ----------
  function workshops() {
    const m = $('[data-rsvp-modal]');
    if (!m) return;
    let cur = null;
    const form = $('[data-rsvp-form]', m), seatsSel = $('[name=seats]', m), total = $('[data-rsvp-total]', m);
    const updTotal = () => { if (cur) total.textContent = 'Total: $' + (cur.price * +seatsSel.value) + (window.ffStore ? ', paid now.' : ', paid at the door.'); };
    seatsSel.addEventListener('change', updTotal);
    $$('[data-rsvp]').forEach((b) => b.addEventListener('click', () => {
      cur = FF.workshops.find((w) => w.id === b.dataset.rsvp);
      $('[data-rsvp-title]', m).textContent = cur.title;
      const d = new Date(cur.date + 'T12:00:00');
      $('[data-rsvp-when]', m).textContent = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + ' · ' + cur.time;
      $('[data-rsvp-submit]', m).textContent = b.textContent;
      $$('option', seatsSel).forEach((o) => { o.disabled = +o.value > cur.seats; });
      seatsSel.value = '1'; updTotal();
      ffOpen(m);
    }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('[name=name]', form), email = $('[name=email]', form);
      let bad = null;
      [name, email].forEach((f) => { const ok = f.value.trim() && (f.type !== 'email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value)); f.setAttribute('aria-invalid', !ok); if (!ok && !bad) bad = f; });
      if (bad) { bad.focus(); return; }
      const n = +seatsSel.value;
      if (window.ffStore) { window.ffStore.addTicket(cur, n); ffClose(m); form.reset(); return; }
      cur.seats -= n;
      $$(`[data-event="${cur.id}"] [data-seats]`).forEach((s) => { s.textContent = cur.seats + ' seats left'; s.classList.toggle('low', cur.seats <= 6); });
      ffClose(m); form.reset();
      ffToast(`Seat${n > 1 ? 's' : ''} saved for ${cur.title}. See you there!`);
    });
  }

  // ---------- journal ----------
  function journal() {
    $$('[data-more]').forEach((b) => b.addEventListener('click', () => {
      const post = b.closest('.post');
      const open = post.classList.toggle('open');
      b.setAttribute('aria-expanded', open);
      b.textContent = open ? 'Show less' : 'Read the full post';
    }));
  }

  // ---------- booking ----------
  function booking() {
    const form = $('[data-booking]');
    if (!form) return;
    const steps = $$('.bk-step', form), marks = $$('[data-stepper] li');
    const back = $('[data-back]'), next = $('[data-next]');
    let at = 0, day = null, time = null;

    // Next 12 open days (closed Sundays)
    const daysBox = $('[data-days]'), timesBox = $('[data-times]');
    const d0 = new Date(); d0.setHours(12, 0, 0, 0);
    const days = [];
    for (let i = 1; days.length < 12 && i < 30; i++) {
      const d = new Date(d0); d.setDate(d0.getDate() + i);
      if (d.getDay() !== 0) days.push(d);
    }
    daysBox.innerHTML = days.map((d, i) => `<button type="button" class="slot" data-day="${i}" aria-pressed="false">${d.toLocaleDateString('en-US', { weekday: 'short' })}<small>${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</small></button>`).join('');
    daysBox.addEventListener('click', (e) => {
      const b = e.target.closest('[data-day]'); if (!b) return;
      day = days[+b.dataset.day]; time = null;
      $$('[data-day]', daysBox).forEach((x) => x.setAttribute('aria-pressed', x === b));
      const sat = day.getDay() === 6;
      const slots = sat ? ['7:30 am', '9:00 am', '10:30 am', '12:00 pm'] : ['8:00 am', '9:30 am', '11:00 am', '1:00 pm', '2:30 pm', '4:00 pm'];
      const seed = day.getDate();
      timesBox.innerHTML = slots.map((t, i) => `<button type="button" class="slot" data-time="${t}" aria-pressed="false" ${(seed + i) % 4 === 0 ? 'disabled aria-label="' + t + ', booked"' : ''}>${t}</button>`).join('');
    });
    timesBox.addEventListener('click', (e) => {
      const b = e.target.closest('[data-time]'); if (!b || b.disabled) return;
      time = b.dataset.time;
      $$('[data-time]', timesBox).forEach((x) => x.setAttribute('aria-pressed', x === b));
      $('[data-slot-err]').hidden = true;
    });
    const photo = $('#b-photo');
    photo.addEventListener('change', () => { $('[data-upload-text]').textContent = photo.files.length ? photo.files.length + ' photo' + (photo.files.length > 1 ? 's' : '') + ' ready to send' : 'Drop photos here or tap to choose. Up to 6.'; });

    function visit() { const r = $('input[name=visit]:checked', form); return r ? r.dataset.label : ''; }
    function whenText() { return day ? day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + ' at ' + time : ''; }
    function go(n) {
      at = n;
      steps.forEach((s, i) => { s.hidden = i !== at; });
      marks.forEach((m, i) => { m.className = i < at ? 'done' : i === at ? 'on' : ''; });
      back.hidden = at === 0;
      next.textContent = at === steps.length - 1 ? 'Confirm booking' : 'Continue';
      if (at === 3) {
        const goals = $$('input[name=goals]:checked', form).map((g) => g.value).join(', ') || 'Not specified';
        $('[data-summary]').innerHTML = [['Visit', visit()], ['When', whenText()], ['Where', $('#b-addr').value], ['Yard', $('#b-size').value + ', ' + $('#b-sun').value.toLowerCase()], ['Goals', goals]]
          .map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('');
      }
      const h = steps[at].querySelector('h2'); if (h) { h.tabIndex = -1; h.focus(); }
    }
    function valid() {
      if (at === 1 && !(day && time)) { $('[data-slot-err]').hidden = false; return false; }
      const req = $$('[required]', steps[at]);
      let bad = null;
      req.forEach((f) => { const ok = f.value.trim() && (f.type !== 'email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value)); f.setAttribute('aria-invalid', !ok); if (!ok && !bad) bad = f; });
      if (bad) { bad.focus(); return false; }
      return true;
    }
    back.addEventListener('click', () => go(at - 1));
    next.addEventListener('click', () => {
      if (!valid()) return;
      if (at < steps.length - 1) return go(at + 1);
      form.hidden = true; $('[data-stepper]').hidden = true;
      const done = $('[data-booked]');
      $('[data-booked-text]').textContent = `${visit()} on ${whenText()}. We sent the details to ${$('#b-email').value} and will text a reminder the day before.`;
      done.hidden = false; done.focus();
    });
    $('[data-ics]').addEventListener('click', () => {
      const [hm, ap] = time.split(' '); let [h, m] = hm.split(':').map(Number);
      if (ap === 'pm' && h !== 12) h += 12;
      const s = new Date(day); s.setHours(h, m, 0, 0);
      const e = new Date(s.getTime() + 90 * 60000);
      const f = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
      const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Fern and Field (demo)//EN', 'BEGIN:VEVENT', 'UID:' + Date.now() + '@fernandfield.example', 'DTSTAMP:' + f(new Date()),
        'DTSTART:' + f(s), 'DTEND:' + f(e), 'SUMMARY:Fern & Field: ' + visit(), 'LOCATION:' + $('#b-addr').value.replace(/,/g, '\\,'), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
      a.download = 'fern-and-field-visit.ics'; a.click();
    });
    go(0);
  }

  // ---------- content editor demo ----------
  function editor() {
    const fab = $('[data-edit-toggle]');
    if (!fab) return;
    const bar = document.createElement('div');
    bar.className = 'edit-bar'; bar.hidden = true;
    bar.innerHTML = '<div class="wrap"><span><b>Editing this page.</b> Click any outlined text to change it, the way the owner would.</span><span style="display:flex;gap:8px"><button class="btn small" type="button" data-edit-save>Publish changes</button><button class="btn small ghost" type="button" data-edit-exit>Exit</button></span></div>';
    document.body.prepend(bar);
    const fields = $$('[data-edit]');
    let snapshot = [];
    function set(on) {
      document.body.classList.toggle('editing', on);
      bar.hidden = !on; fab.hidden = on;
      fields.forEach((f) => { f.contentEditable = on; if (on) f.setAttribute('spellcheck', 'true'); });
      if (on) { snapshot = fields.map((f) => f.innerHTML); window.scrollTo({ top: 0 }); if (fields[0]) fields[0].focus(); }
    }
    fab.addEventListener('click', () => set(true));
    $('[data-edit-exit]', bar).addEventListener('click', () => { fields.forEach((f, i) => { f.innerHTML = snapshot[i]; }); set(false); ffToast('Changes discarded'); });
    $('[data-edit-save]', bar).addEventListener('click', () => { set(false); ffToast('Published. (Demo: changes last until you reload.)'); });
    fields.forEach((f) => f.addEventListener('click', (e) => { if (document.body.classList.contains('editing') && f.tagName === 'A') e.preventDefault(); }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const now = hoursStatus();
    setInterval(hoursStatus, 60000);
    if ($('[data-packet]')) ffSetMonth(now.month);
    beforeAfter(); library(); gallery(); workshops(); journal(); booking(); editor();
  });
})();
