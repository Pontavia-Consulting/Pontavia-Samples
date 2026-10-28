/* Fern & Field: Best package store. Cart, checkout, account, quiz, search and chat all run in the browser only. */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const FF = window.FF, esc = window.ffEsc, toast = window.ffToast;
  const money = (n) => '$' + (Math.round(n * 100) / 100).toFixed(n % 1 ? 2 : 0);
  const FREE_AT = 150;

  // ---------- storage (falls back to memory if the browser blocks it) ----------
  const KEY = 'ff-best-demo';
  let mem = null;
  function load() {
    if (mem) return mem;
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
    mem = Object.assign({ cart: [], wish: ['coontie', 'bird'], orders: [], points: 340 }, s || {});
    return mem;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* memory only */ } }
  const state = load();

  // ---------- cart ----------
  const SIZE_UP = { '1 gal': '3 gal', '3 gal': '7 gal', '7 gal': '15 gal', '15 gal': '30 gal', '6 in': '10 in', '8 in': '12 in', '10 in': '14 in' };
  function sizesFor(p) { return [{ size: p.size, price: p.price }, { size: SIZE_UP[p.size] || 'Large', price: Math.round(p.price * 2.2) }]; }
  function count() { return state.cart.reduce((n, l) => n + l.qty, 0); }
  function subtotal() { return state.cart.reduce((n, l) => n + l.qty * l.price, 0); }

  function add(id, qty, size) {
    const p = FF.byId(id); if (!p) return;
    const opt = sizesFor(p).find((s) => s.size === size) || sizesFor(p)[0];
    const key = id + '|' + opt.size;
    const line = state.cart.find((l) => l.key === key);
    if (line) line.qty += qty || 1;
    else state.cart.push({ key, id, kind: 'plant', title: p.name, detail: opt.size, price: opt.price, qty: qty || 1 });
    save(); refresh(); openDrawer();
  }
  function addTicket(w, n) {
    const key = 'ticket|' + w.id;
    const line = state.cart.find((l) => l.key === key);
    if (line) line.qty += n; else state.cart.push({ key, id: w.id, kind: 'ticket', title: w.title, detail: 'Workshop ticket · ' + new Date(w.date + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), price: w.price, qty: n });
    save(); refresh(); openDrawer();
  }
  function setQty(key, q) {
    const l = state.cart.find((x) => x.key === key); if (!l) return;
    l.qty = Math.max(0, Math.min(20, q));
    if (!l.qty) state.cart = state.cart.filter((x) => x !== l);
    save(); refresh();
  }
  window.ffStore = { add, addTicket };

  function thumb(l) {
    if (l.kind === 'ticket') return '<div class="thumb" style="display:grid;place-items:center;height:64px;font-size:12px;font-weight:700;color:var(--oak);padding:0">TICKET</div>';
    const p = FF.byId(l.id);
    return '<div class="thumb">' + plantArt(Object.assign({ label: '' }, p.art)) + '</div>';
  }
  function lineHTML(l) {
    return `<div class="line-item">${thumb(l)}<div><b>${esc(l.title)}</b><small>${esc(l.detail)} · ${money(l.price)}</small>
      <div style="display:flex;gap:12px;align-items:center"><div class="qty"><button type="button" data-q="${l.key}" data-d="-1" aria-label="One fewer">−</button><input value="${l.qty}" aria-label="Quantity" data-qi="${l.key}" inputmode="numeric"><button type="button" data-q="${l.key}" data-d="1" aria-label="One more">+</button></div>
      <button class="link-btn" type="button" data-rm="${l.key}">Remove</button></div></div><b>${money(l.qty * l.price)}</b></div>`;
  }
  function freeBar() {
    const st = subtotal(), left = FREE_AT - st;
    const pct = Math.min(100, (st / FREE_AT) * 100);
    return `<div class="free-bar">${left > 0 ? `Add <b>${money(left)}</b> for free delivery` : '<b>You get free delivery</b> in Marion County'}<div class="track"><div class="fill" style="width:${pct}%"></div></div></div>`;
  }
  const EMPTY = '<div class="empty" style="margin-top:20px"><h3>Your cart is empty</h3><p class="muted" style="margin:0 auto 16px">Natives, houseplants and workshop tickets all land here.</p><a class="btn small" href="shop.html">Shop plants</a></div>';

  function refresh() {
    const n = count();
    $$('[data-cart-count]').forEach((b) => { b.textContent = n || ''; b.dataset.n = n; });
    const items = $('[data-drawer-items]'), foot = $('[data-drawer-foot]');
    if (items) {
      items.innerHTML = state.cart.length ? state.cart.map(lineHTML).join('') : EMPTY;
      foot.innerHTML = state.cart.length ? freeBar() + `<div class="totals"><span>Subtotal</span><b>${money(subtotal())}</b></div><a class="btn" style="width:100%" href="checkout.html">Check out</a><a class="btn ghost" style="width:100%;margin-top:8px" href="cart.html">View cart</a>` : '';
    }
    const page = $('[data-cart-page]');
    if (page) {
      page.innerHTML = state.cart.length ? '<h2 style="font-size:28px">' + n + ' item' + (n === 1 ? '' : 's') + '</h2>' + state.cart.map(lineHTML).join('') : EMPTY;
      $('[data-cart-summary]').innerHTML = state.cart.length ? '<h3 style="font-size:20px">Summary</h3>' + freeBar() + `<div class="totals"><span>Subtotal</span><b>${money(subtotal())}</b><span>Pickup</span><b>Free</b><span class="grand">Total</span><span class="grand">${money(subtotal())}</span></div><a class="btn" style="width:100%" href="checkout.html">Check out</a>` : '<p class="muted" style="margin:0">Nothing here yet.</p>';
    }
    if ($('[data-checkout-summary]')) checkoutSummary();
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-add]');
    if (a) { const qtyIn = $('[data-pqty]'); const size = $('input[name=size]:checked'); add(a.dataset.add, a.hasAttribute('data-use-qty') && qtyIn ? +qtyIn.value || 1 : 1, a.hasAttribute('data-use-qty') && size ? size.value : null); return; }
    const q = e.target.closest('[data-q]');
    if (q) { const l = state.cart.find((x) => x.key === q.dataset.q); if (l) setQty(l.key, l.qty + +q.dataset.d); return; }
    const rm = e.target.closest('[data-rm]');
    if (rm) { setQty(rm.dataset.rm, 0); return; }
    const h = e.target.closest('[data-wish]');
    if (h) { toggleWish(h.dataset.wish); return; }
  });
  document.addEventListener('change', (e) => { const i = e.target.closest('[data-qi]'); if (i) setQty(i.dataset.qi, parseInt(i.value, 10) || 0); });

  // drawer
  let drawerReturn = null;
  function openDrawer() {
    const d = $('[data-drawer]'); if (!d || $('[data-cart-page]') || $('[data-checkout]')) { if (d && ($('[data-cart-page]') || $('[data-checkout]'))) toast('Added to your cart'); return; }
    drawerReturn = document.activeElement;
    $('[data-drawer-shade]').hidden = false; d.classList.add('open'); d.setAttribute('aria-hidden', 'false');
    $('[data-cart-close]').focus();
  }
  function closeDrawer() {
    const d = $('[data-drawer]'); if (!d || !d.classList.contains('open')) return;
    $('[data-drawer-shade]').hidden = true; d.classList.remove('open'); d.setAttribute('aria-hidden', 'true');
    if (drawerReturn) drawerReturn.focus();
  }

  // wishlist
  function toggleWish(id) {
    const i = state.wish.indexOf(id);
    if (i >= 0) state.wish.splice(i, 1); else state.wish.push(id);
    save();
    $$(`[data-wish="${id}"]`).forEach((b) => b.setAttribute('aria-pressed', state.wish.includes(id)));
    toast(i >= 0 ? 'Removed from saved plants' : 'Saved to your account');
    if ($('[data-wish-grid]')) renderAccount();
  }
  const heartSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>';

  function shopCard(p, extra) {
    return `<article class="plant-card"><a class="pic" href="product.html?id=${p.id}" style="display:block">${plantArt(Object.assign({ label: 'Illustration of ' + p.name }, p.art))}<span class="tag">${money(p.price)}</span></a>
      <button class="heart" type="button" data-wish="${p.id}" aria-pressed="${state.wish.includes(p.id)}" aria-label="Save ${esc(p.name)}">${heartSvg}</button>
      <div class="body">${extra || ''}<h3><a href="product.html?id=${p.id}" style="text-decoration:none">${esc(p.name)}</a></h3><div class="latin">${esc(p.latin)}</div>
      <div class="facts">${p.native ? '<span class="fact native">Florida native</span>' : ''}<span class="fact">${p.light}</span><span class="fact">${p.water} water</span></div>
      <div class="add"><span class="stock${p.stock < 10 ? ' low' : ''}">${p.stock < 10 ? 'Only ' + p.stock + ' left' : p.stock + ' in stock'}</span><button class="btn small" type="button" data-add="${p.id}">Add to cart</button></div></div></article>`;
  }
  window.ffShopCard = shopCard;

  // ---------- shop ----------
  function shop() {
    const grid = $('[data-shop-grid]'); if (!grid) return;
    const f = $('[data-filters]'), q = $('[data-shop-q]'), sort = $('[data-sort]'), out = $('[data-shop-count]');
    const params = new URLSearchParams(location.search);
    if (params.get('cat')) $$(`input[name=cat][value="${params.get('cat')}"]`, f).forEach((c) => { c.checked = true; });
    if (params.get('q')) q.value = params.get('q');
    const vals = (n) => $$(`input[name=${n}]:checked`, f).map((c) => c.value);
    function render() {
      const cats = vals('cat'), lights = vals('light'), waters = vals('water');
      const max = +$('input[name=max]', f).value; $('[data-max-out]').textContent = money(max);
      const term = q.value.trim().toLowerCase();
      let list = FF.plants.filter((p) => (!cats.length || cats.some((c) => p.cats.includes(c))) && (!lights.length || lights.includes(p.light)) && (!waters.length || waters.includes(p.water)) &&
        (!$('input[name=native]', f).checked || p.native) && (!$('input[name=pollinator]', f).checked || p.pollinator) && (!$('input[name=instock]', f).checked || p.stock > 0) && p.price <= max &&
        (!term || (p.name + ' ' + p.latin + ' ' + p.cats.join(' ')).toLowerCase().includes(term)));
      const s = sort.value;
      if (s === 'low') list.sort((a, b) => a.price - b.price);
      if (s === 'high') list.sort((a, b) => b.price - a.price);
      if (s === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
      grid.innerHTML = list.length ? list.map((p) => shopCard(p)).join('') : '<div class="empty"><h3>No plants match those filters</h3><p class="muted" style="margin:0 auto 14px">Try removing a filter or raising the price limit.</p><button class="btn small" type="button" data-clear>Clear all filters</button></div>';
      out.textContent = list.length + (list.length === 1 ? ' plant' : ' plants');
    }
    f.addEventListener('input', render); q.addEventListener('input', render); sort.addEventListener('change', render);
    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-clear]')) return;
      $$('input[type=checkbox]', f).forEach((c) => { c.checked = false; }); $('input[name=max]', f).value = 130; q.value = ''; render();
    });
    const tg = $('[data-filters-toggle]');
    tg.addEventListener('click', () => { const o = f.classList.toggle('open'); tg.setAttribute('aria-expanded', o); });
    render();
  }

  // ---------- product ----------
  function nowOcala() {
    const p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(new Date());
    return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.find((x) => x.type === 'weekday').value), hour: +p.find((x) => x.type === 'hour').value % 24 };
  }
  function pickupText() {
    const n = nowOcala(), h = FF.hours[n.day];
    if (h && n.hour < Math.min(14, h[1] - 2)) return 'Order by 2 pm, ready for pickup <b>today</b>';
    return 'Ready for pickup the <b>next morning</b> we are open';
  }
  function product() {
    const box = $('[data-product]'); if (!box) return;
    const p = FF.byId(new URLSearchParams(location.search).get('id')) || FF.plants[0];
    document.title = p.name + ' | Fern & Field Garden Co., Ocala FL';
    $('[data-crumbs]').insertAdjacentHTML('beforeend', ' / ' + esc(p.name));
    const sizes = sizesFor(p);
    box.innerHTML = `<div class="big">${plantArt(Object.assign({ label: 'Illustration of ' + p.name }, p.art))}</div>
    <div>
      <div class="facts" style="margin:0 0 12px">${p.native ? '<span class="fact native">Florida native</span>' : ''}${p.pollinator ? '<span class="fact">Feeds pollinators</span>' : ''}</div>
      <h1 style="font-size:clamp(36px,4vw,52px)">${esc(p.name)}</h1><p class="latin">${esc(p.latin)}</p>
      <div class="price" data-pprice>${money(sizes[0].price)}</div>
      <p>${esc(p.blurb)}</p>
      <label style="display:block;margin-top:18px">Size</label>
      <div class="size-opts">${sizes.map((s, i) => `<label class="choice" style="padding:10px 14px"><input type="radio" name="size" value="${s.size}" data-price="${s.price}"${i ? '' : ' checked'}><span><b>${s.size}</b><span class="small muted">${money(s.price)}</span></span></label>`).join('')}</div>
      <div class="buy-row"><div class="qty"><button type="button" data-step="-1" aria-label="One fewer">−</button><input data-pqty value="1" aria-label="Quantity" inputmode="numeric"><button type="button" data-step="1" aria-label="One more">+</button></div>
      <button class="btn" type="button" data-add="${p.id}" data-use-qty>Add to cart</button>
      <button class="heart" type="button" data-wish="${p.id}" aria-pressed="${state.wish.includes(p.id)}" aria-label="Save ${esc(p.name)}" style="position:static">${heartSvg}</button></div>
      <p class="stock${p.stock < 10 ? ' low' : ''}">${p.stock < 10 ? 'Only ' + p.stock + ' left at the nursery' : p.stock + ' in stock at the nursery'}</p>
      <div class="pickup"><div>${pickupText()} at 2200 Fern Hollow Rd. Free delivery in Marion County on orders over $150.</div></div>
      <table class="care-table"><tbody>
        <tr><th>Light</th><td>${p.light}</td></tr><tr><th>Water once settled</th><td>${p.water}</td></tr><tr><th>Mature height</th><td>${p.height}</td></tr><tr><th>Blooms / interest</th><td>${p.bloom}</td></tr>
        <tr><th>Hardy in Ocala</th><td>${p.native || p.id === 'aloe' ? 'Yes, through our winters' : p.cats.includes('houseplants') ? 'Indoors, or a covered porch' : 'Cover on freezing nights'}</td></tr>
      </tbody></table>
    </div>`;
    $$('input[name=size]', box).forEach((r) => r.addEventListener('change', () => { $('[data-pprice]').textContent = money(+r.dataset.price); }));
    $$('[data-step]', box).forEach((b) => b.addEventListener('click', () => { const i = $('[data-pqty]'); i.value = Math.max(1, Math.min(20, (+i.value || 1) + +b.dataset.step)); }));
    const rel = FF.plants.filter((x) => x.id !== p.id && x.cats.some((c) => p.cats.includes(c))).slice(0, 4);
    $('[data-related]').innerHTML = rel.map((r) => shopCard(r)).join('');
  }

  // ---------- ZIP check ----------
  const NEAR = ['34470', '34471', '34472', '34473', '34474', '34475', '34476', '34477', '34478', '34479', '34480', '34481', '34482'];
  const MARION = ['34420', '34431', '34432', '34488', '34491', '32113', '32134', '32179', '32195', '32686', '34489'];
  function zipInfo(z) {
    if (!/^\d{5}$/.test(z)) return { ok: false, msg: 'Enter a 5-digit ZIP code.' };
    if (NEAR.includes(z)) return { ok: true, fee: 15, msg: `Yes. Delivery to ${z} is $15, free on orders over $150. Usually next day.` };
    if (MARION.includes(z)) return { ok: true, fee: 30, msg: `Yes. Delivery to ${z} is $30, free on orders over $150. Usually within 2 days.` };
    return { ok: false, msg: `Sorry, ${z} is outside our delivery area. Pickup at the nursery is always free.` };
  }
  function zips() {
    $$('[data-zip]').forEach((form) => form.addEventListener('submit', (e) => {
      e.preventDefault();
      const r = zipInfo($('input', form).value.trim()), out = form.parentElement.querySelector('[data-zip-out]');
      out.textContent = r.msg; out.className = 'zip-result ' + (r.ok ? 'ok' : 'no');
    }));
  }

  // ---------- checkout ----------
  let ship = 'pickup';
  function shipFee() {
    if (ship === 'pickup') return 0;
    const z = zipInfo(($('#c-zip') || {}).value || '');
    if (!z.ok) return null;
    return subtotal() >= FREE_AT ? 0 : z.fee;
  }
  function pointsCredit() { const u = $('[data-use-points]'); return u && u.checked ? Math.floor(state.points / 500) * 25 : 0; }
  function checkoutSummary() {
    const box = $('[data-checkout-summary]');
    if (!state.cart.length) { box.innerHTML = '<h3 style="font-size:20px">Order summary</h3><p class="muted">Your cart is empty.</p><a class="btn small" href="shop.html">Shop plants</a>'; return; }
    const fee = shipFee(), credit = Math.min(pointsCredit(), subtotal());
    const total = subtotal() + (fee || 0) - credit;
    box.innerHTML = '<h3 style="font-size:20px">Order summary</h3>' + state.cart.map((l) => `<div style="display:flex;justify-content:space-between;gap:12px;font-size:15px;padding:6px 0"><span>${l.qty} × ${esc(l.title)} <span class="muted small">(${esc(l.detail)})</span></span><b>${money(l.qty * l.price)}</b></div>`).join('') +
      `<div class="totals" style="margin-top:12px;border-top:1px solid var(--line);padding-top:12px"><span>Subtotal</span><b>${money(subtotal())}</b><span>${ship === 'pickup' ? 'Pickup' : 'Delivery'}</span><b>${fee === null ? 'Enter ZIP' : fee ? money(fee) : 'Free'}</b>${credit ? `<span>Rewards</span><b>−${money(credit)}</b>` : ''}<span class="grand">Total</span><span class="grand">${money(total)}</span></div>
      <p class="small muted" style="margin:0">You'll earn ${Math.floor(total)} reward points.</p>`;
  }
  function checkout() {
    const form = $('[data-checkout-form]'); if (!form) return;
    const slot = $('[data-pickup-slot]');
    const n = nowOcala(), opts = [];
    const days = ['Today', 'Tomorrow'];
    for (let d = 0; d < 3; d++) {
      const day = (n.day + d) % 7, h = FF.hours[day]; if (!h) continue;
      for (let t = h[0] + 1; t < h[1]; t += 2) { if (d === 0 && t <= n.hour + 2) continue; opts.push(`${d < 2 ? days[d] : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]}, ${t > 12 ? t - 12 + ' pm' : t === 12 ? '12 pm' : t + ' am'}`); }
    }
    slot.innerHTML = opts.slice(0, 8).map((o) => `<option>${o}</option>`).join('');
    $('[data-points-label]').textContent = state.points >= 500 ? `(${state.points} points = ${money(Math.floor(state.points / 500) * 25)} off)` : `(${state.points} points, 500 needed)`;
    if (state.points < 500) $('[data-use-points]').disabled = true;
    $$('input[name=ship]', form).forEach((r) => r.addEventListener('change', () => {
      ship = r.value;
      $('[data-pickup-fields]').hidden = ship !== 'pickup'; $('[data-delivery-fields]').hidden = ship !== 'delivery';
      $('#c-addr').required = $('#c-zip').required = ship === 'delivery';
      checkoutSummary();
    }));
    $('#c-zip').addEventListener('input', () => { const z = $('#c-zip').value; const r = z.length === 5 ? zipInfo(z) : null; $('[data-ship-note]').textContent = r ? r.msg : ''; $('[data-ship-note]').className = 'small ' + (r && !r.ok ? 'err' : 'muted'); checkoutSummary(); });
    $('[data-use-points]').addEventListener('change', checkoutSummary);
    const card = $('[data-card]'), exp = $('[data-exp]');
    card.addEventListener('input', () => { card.value = card.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '); });
    exp.addEventListener('input', () => { const v = exp.value.replace(/\D/g, '').slice(0, 4); exp.value = v.length > 2 ? v.slice(0, 2) + ' / ' + v.slice(2) : v; });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!state.cart.length) { toast('Your cart is empty'); return; }
      let bad = null;
      $$('[required]', form).forEach((f) => {
        let ok = f.value.trim() !== '';
        if (f.type === 'email') ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value);
        if (f === card) ok = f.value.replace(/\s/g, '').length >= 15;
        if (f === exp) ok = /^\d{2} \/ \d{2}$/.test(f.value);
        if (f.id === 'c-zip') ok = zipInfo(f.value).ok;
        f.setAttribute('aria-invalid', !ok); if (!ok && !bad) bad = f;
      });
      if (bad) { bad.focus(); toast('Check the highlighted field'); return; }
      const fee = shipFee() || 0, credit = Math.min(pointsCredit(), subtotal());
      const total = subtotal() + fee - credit;
      const num = 'FF-' + (10400 + Math.floor(Math.random() * 500));
      state.orders.unshift({ num, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), items: state.cart.map((l) => ({ id: l.id, kind: l.kind, title: l.title, qty: l.qty })), total, status: ship === 'pickup' ? 'Ready soon' : 'Out for delivery soon' });
      state.points = state.points - (credit ? Math.floor(state.points / 500) * 500 : 0) + Math.floor(total);
      state.cart = []; save(); refresh();
      const first = $('#c-name').value.split(' ')[0];
      form.closest('[data-checkout]').hidden = true;
      const done = $('[data-order-done]');
      done.innerHTML = `<h3>Thanks, ${esc(first)}. Order ${num} is in.</h3><p>${ship === 'pickup' ? 'We will text you when it is ready at the front counter (' + esc(slot.value) + ').' : 'We will text you the morning of delivery with a two-hour window.'} You earned ${Math.floor(total)} reward points.</p><p class="small muted">Demo checkout: no payment was taken and nothing was sent.</p><div class="btn-row" style="margin-top:12px"><a class="btn small" href="account.html">View your account</a><a class="btn ghost small" href="shop.html">Keep shopping</a></div>`;
      done.hidden = false; done.focus();
    });
    checkoutSummary();
  }

  // ---------- account ----------
  const SAMPLE_ORDERS = [{ num: 'FF-10288', date: 'Sep 19, 2026', items: [{ id: 'muhly', kind: 'plant', title: 'Pink muhly grass', qty: 5 }, { id: 'gaillardia', kind: 'plant', title: 'Blanket flower', qty: 3 }], total: 97, status: 'Picked up' },
    { num: 'FF-10114', date: 'Aug 2, 2026', items: [{ id: 'firebush', kind: 'plant', title: 'Firebush', qty: 2 }], total: 48, status: 'Delivered' }];
  function renderAccount() {
    const orders = state.orders.concat(SAMPLE_ORDERS);
    $('[data-points]').textContent = state.points;
    const toNext = 500 - (state.points % 500);
    $('[data-points-bar]').style.width = ((state.points % 500) / 5) + '%';
    $('[data-points-next]').textContent = state.points >= 500 ? `You have ${money(Math.floor(state.points / 500) * 25)} to spend. ${toNext} points to the next $25.` : `${toNext} points to your first $25 off.`;
    $('[data-orders]').innerHTML = orders.map((o) => `<div class="order-row"><div><b>${o.num}</b> <span class="muted small">· ${o.date}</span><div class="small muted">${o.items.map((i) => i.qty + ' × ' + esc(i.title)).join(', ')}</div></div><span class="status${/soon/.test(o.status) ? ' ready' : ''}">${o.status}</span><b>${money(o.total)}</b></div>`).join('');
    const w = $('[data-wish]');
    w.setAttribute('data-wish-grid', '');
    w.innerHTML = state.wish.length ? state.wish.map((id) => shopCard(FF.byId(id))).join('') : '<div class="empty"><h3>No saved plants yet</h3><p class="muted" style="margin:0 auto 14px">Tap the heart on any plant to keep it here.</p><a class="btn small" href="shop.html">Browse plants</a></div>';
    const bought = [...new Set(orders.flatMap((o) => o.items.filter((i) => i.kind === 'plant').map((i) => i.id)))];
    $('[data-care]').innerHTML = '<p class="muted">Simple reminders for the plants you bought, sent by text or email.</p>' + bought.map((id) => {
      const p = FF.byId(id);
      const tip = p.water === 'Low' ? 'Water twice a week for the first 8 weeks, then only in long dry spells.' : 'Water every other day for 2 weeks, then twice a week until summer rains start.';
      return `<div class="order-row"><div><b>${esc(p.name)}</b><div class="small muted">${tip}</div></div><label class="check"><input type="checkbox" checked> Remind me</label><span></span></div>`;
    }).join('');
  }
  function account() {
    if (!$('[data-orders]')) return;
    renderAccount();
    const tabs = $$('[role=tab]');
    function sel(t) {
      tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; document.getElementById(x.getAttribute('aria-controls')).hidden = !on; });
      t.focus();
    }
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => sel(t));
      t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') sel(tabs[(i + 1) % tabs.length]); if (e.key === 'ArrowLeft') sel(tabs[(i - 1 + tabs.length) % tabs.length]); });
    });
  }

  // ---------- plant finder ----------
  const QUIZ = [
    { q: 'How much sun does the spot get?', a: [['Full sun', 'Six hours or more', { light: 'Full sun' }], ['Part shade', 'Morning sun or dappled light', { light: 'Part shade' }], ['Shade', 'Under oaks, north side', { light: 'Shade' }], ['Indoors', 'A bright room', { indoor: true }]] },
    { q: 'How much watering will you do?', a: [['As little as possible', 'Rain should do the work', { water: 'Low' }], ['Some', 'A sprinkler zone or a hose now and then', { water: 'Medium' }]] },
    { q: 'What do you want most?', a: [['Butterflies and birds', 'Flowers and berries for wildlife', { pollinator: true }], ['Privacy', 'A hedge or a screen', { cat: 'shrubs' }], ['Color', 'Something blooming', { bloom: true }], ['Low upkeep', 'Plant it and forget it', { native: true }]] },
    { q: 'How big is the space?', a: [['A pot or small bed', 'Under 3 feet tall', { size: 'small' }], ['A bed along the house', 'Up to 6 feet', { size: 'mid' }], ['A big open area', 'Room for something large', { size: 'big' }]] },
  ];
  function finder() {
    const box = $('[data-quiz]'); if (!box) return;
    let step = 0; const picks = [];
    function show() {
      const s = QUIZ[step];
      box.innerHTML = `<div class="quiz-progress"><div style="width:${(step / QUIZ.length) * 100}%"></div></div><p class="muted small" style="margin-bottom:6px">Question ${step + 1} of ${QUIZ.length}</p><h2 tabindex="-1">${s.q}</h2>
        <div class="answers">${s.a.map((a, i) => `<button type="button" class="answer" data-a="${i}"><b>${a[0]}</b>${a[1]}</button>`).join('')}</div>
        ${step ? '<button class="link-btn" type="button" data-qback style="margin-top:20px">Back</button>' : ''}`;
      $('h2', box).focus();
    }
    function heightFt(p) { const m = p.height.match(/(\d+)/g); return m ? +m[m.length - 1] : 3; }
    function results() {
      const w = Object.assign({}, ...picks);
      const scored = FF.plants.map((p) => {
        let s = 0;
        const indoor = p.cats.includes('houseplants');
        if (w.indoor) s += indoor ? 4 : -3; else { if (indoor) s -= 3; if (p.light === w.light) s += 3; }
        if (w.water && p.water === w.water) s += 2; if (w.water === 'Low' && p.water === 'Medium') s -= 1;
        if (w.pollinator && p.pollinator) s += 2; if (w.cat && p.cats.includes(w.cat)) s += 2; if (w.bloom && /spring|summer|fall|year|winter/i.test(p.bloom) && !/rarely|cones|acorn/i.test(p.bloom)) s += 2; if (w.native && p.native) s += 2;
        const h = heightFt(p);
        if (w.size === 'small') s += h <= 3 ? 2 : h > 10 ? -2 : 0; if (w.size === 'mid') s += h > 3 && h <= 10 ? 2 : 0; if (w.size === 'big') s += h > 6 ? 2 : 0;
        return { p, s };
      }).sort((a, b) => b.s - a.s).slice(0, 3);
      const best = scored[0].s || 1;
      box.innerHTML = `<div class="quiz-progress"><div style="width:100%"></div></div><h2 tabindex="-1">Your shortlist</h2><p class="muted">Based on your answers, these three should do well. Add them to your cart, or ask Priya in the chat for more ideas.</p><button class="btn ghost small" type="button" data-qagain>Start over</button>`;
      $('[data-quiz-results]').innerHTML = '<div class="grid g3" style="margin-top:28px">' + scored.map((x) => shopCard(x.p, `<span class="match">${Math.max(70, Math.round((x.s / best) * 96))}% match</span>`)).join('') + '</div>';
      $('h2', box).focus();
    }
    box.addEventListener('click', (e) => {
      const a = e.target.closest('[data-a]');
      if (a) { picks[step] = QUIZ[step].a[+a.dataset.a][2]; step++; return step < QUIZ.length ? show() : results(); }
      if (e.target.closest('[data-qback]')) { step--; show(); }
      if (e.target.closest('[data-qagain]')) { step = 0; picks.length = 0; $('[data-quiz-results]').innerHTML = ''; show(); }
    });
    show();
  }

  // ---------- search ----------
  const PAGES = [['Book a design visit', 'design.html'], ['Workshops', 'workshops.html'], ['Services and prices', 'services.html'], ['Delivery and returns', 'faq.html'], ['Contact and hours', 'contact.html'], ['Plant finder quiz', 'finder.html'], ['Our work', 'gallery.html'], ['Garden journal', 'journal.html']];
  function search() {
    const ov = $('[data-search]'), q = $('[data-search-q]'), out = $('[data-search-results]');
    function render() {
      const t = q.value.trim().toLowerCase();
      const plants = FF.plants.filter((p) => !t || (p.name + ' ' + p.latin + ' ' + p.cats.join(' ')).toLowerCase().includes(t)).slice(0, 6);
      const pages = t ? PAGES.filter((p) => p[0].toLowerCase().includes(t)) : [];
      out.innerHTML = plants.map((p) => `<li><a href="product.html?id=${p.id}"><span class="thumb">${plantArt(Object.assign({ label: '' }, p.art))}</span><span><b>${esc(p.name)}</b><br><span class="small muted">${esc(p.latin)}</span></span><span class="small">${money(p.price)}</span></a></li>`).join('') +
        pages.map((p) => `<li><a href="${p[1]}"><span class="thumb" style="height:44px"></span><span><b>${p[0]}</b><br><span class="small muted">Page</span></span><span></span></a></li>`).join('') ||
        `<li class="muted" style="padding:14px">Nothing matches "${esc(q.value)}". Try a plant name like "palmetto".</li>`;
    }
    $$('[data-search-open]').forEach((b) => b.addEventListener('click', () => { ov.hidden = false; q.value = ''; render(); q.focus(); }));
    ov.addEventListener('click', (e) => { if (e.target === ov) ov.hidden = true; });
    q.addEventListener('input', render);
    q.addEventListener('keydown', (e) => { if (e.key === 'Enter') location.href = 'shop.html?q=' + encodeURIComponent(q.value); if (e.key === 'Escape') ov.hidden = true; });
  }

  // ---------- chat ----------
  const ANSWERS = [
    [/hour|open|close/i, () => 'We are open Monday to Thursday 8 to 5, Friday 8 to 6 and Saturday 7 to 4. Closed Sundays.'],
    [/deliver|ship|zip/i, () => 'We deliver anywhere in Marion County. It is free on orders over $150, otherwise $15 to $30 depending on ZIP. You can check yours on the home page.'],
    [/shade|oak/i, () => 'For shade under oaks, coontie and firespike are our go-tos. Beautyberry handles part shade too. Want me to send links?'],
    [/book|design|visit|consult/i, () => 'You can book a design visit online in about two minutes. The $150 fee comes off your install. <a href="design.html">Book a visit</a>'],
    [/return|guarantee|die|dead/i, () => 'Plants we install are guaranteed for a year. Plants bought here are guaranteed for 30 days. Just bring it back with your receipt.'],
    [/workshop|class/i, () => 'Our next workshop is "Native plants for sandy soil" on Saturday, November 7 at 9 am. <a href="workshops.html">See all workshops</a>'],
    [/deer/i, () => 'Deer leave most of our natives alone, but nothing is truly deer-proof. Saw palmetto and muhly grass hold up well.'],
  ];
  function chat() {
    const box = $('[data-chat]'), log = $('[data-chat-log]'), form = $('[data-chat-form]'), quick = $('[data-chat-quick]');
    const fab = $('[data-chat-open]');
    let started = false;
    function msg(html, who) { const d = document.createElement('div'); d.className = 'msg ' + who; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; }
    function reply(text) {
      const t = document.createElement('div'); t.className = 'typing'; t.textContent = 'Priya is typing…'; log.after(t);
      setTimeout(() => { t.remove(); const hit = ANSWERS.find(([r]) => r.test(text)); msg(hit ? hit[1]() : 'Good question. I will check with the team and get right back to you. You can also call us at (352) 555-0142.', 'bot'); }, 900);
    }
    function send(text) { if (!text.trim()) return; msg(esc(text), 'me'); quick.innerHTML = ''; reply(text); }
    fab.addEventListener('click', () => {
      box.hidden = !box.hidden;
      if (!box.hidden && !started) {
        started = true;
        msg('Hi! I\'m Priya at the nursery. Ask me anything about plants, delivery or booking. <span class="small muted">(Demo chat with canned answers.)</span>', 'bot');
        quick.innerHTML = ['What are your hours?', 'Do you deliver?', 'Plants for shade', 'Book a design visit'].map((q) => `<button type="button">${q}</button>`).join('');
      }
      if (!box.hidden) $('input', form).focus();
    });
    $('[data-chat-close]').addEventListener('click', () => { box.hidden = true; fab.focus(); });
    quick.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) send(b.textContent); });
    form.addEventListener('submit', (e) => { e.preventDefault(); const i = $('input', form); send(i.value); i.value = ''; });
  }

  document.addEventListener('DOMContentLoaded', () => {
    $$('[data-cart-open]').forEach((b) => b.addEventListener('click', openDrawer));
    const c = $('[data-cart-close]'); if (c) c.addEventListener('click', closeDrawer);
    const sh = $('[data-drawer-shade]'); if (sh) sh.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeDrawer(); const s = $('[data-search]'); if (s) s.hidden = true; } });
    $$('[data-month]').forEach((b) => b.addEventListener('click', () => {
      $$('[data-month]').forEach((x) => x.setAttribute('aria-pressed', x === b));
      window.ffSetMonth(+b.dataset.month, true);
    }));
    refresh(); shop(); product(); zips(); checkout(); account(); finder(); search(); chat();
  });
})();
