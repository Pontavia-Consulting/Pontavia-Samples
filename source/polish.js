// Fern & Field polish layer: hero scene (procedural pines, palmettos, wiregrass), drifting pollen,
// parallax, header shrink, and scroll reveals. Pure progressive enhancement.
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function rng(seed) { let a = seed >>> 0; return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  // ---- hero scene ----
  function pine(r, x, base, h, col) {
    let s = `<path d="M${x} ${base} q ${(r() - .5) * 8} ${-h * .5} ${(r() - .5) * 6} ${-h}" stroke="${col}" stroke-width="${3 + r() * 2.5}" fill="none" stroke-linecap="round"/>`;
    const tufts = 3 + Math.floor(r() * 2);
    for (let t = 0; t < tufts; t++) {
      const cy = base - h * (0.62 + t * 0.13) - r() * 6, cx = x + (r() - .5) * 26, n = 15;
      for (let i = 0; i < n; i++) {
        const a = -Math.PI + (Math.PI * i) / (n - 1) + (r() - .5) * .18, len = 18 + r() * 16;
        s += `<path d="M${cx} ${cy} q ${Math.cos(a) * len * .6} ${Math.sin(a) * len * .5 - 4} ${Math.cos(a) * len} ${Math.sin(a) * len * .8 + 5}" stroke="${col}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
      }
    }
    return s;
  }
  function palm(r, x, base, size, col) {
    let s = '';
    const n = 13;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI * 0.95 + (Math.PI * 0.9 * i) / (n - 1) + (r() - .5) * .1, len = size * (0.7 + r() * 0.5);
      s += `<path d="M${x} ${base} q ${Math.cos(a) * len * .55} ${Math.sin(a) * len * .9} ${Math.cos(a) * len} ${Math.sin(a) * len * .6 + len * .25}" stroke="${col}" stroke-width="${2.2 + r() * 1.4}" fill="none" stroke-linecap="round"/>`;
    }
    return s;
  }
  function grass(r, x0, x1, base, col) {
    let s = '';
    for (let x = x0; x < x1; x += 7 + r() * 8) {
      const h = 22 + r() * 46, b = (r() - .5) * 26;
      s += `<path d="M${x} ${base} q ${b * .4} ${-h * .6} ${b} ${-h}" stroke="${col}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    }
    return s;
  }
  function buildScene() {
    const W = 1600, H = 260, r = rng(42);
    const layer = (inner, fill, op, cls) => `<svg class="${cls}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><g opacity="${op}">${inner}</g></svg>`;
    let far = `<path d="M0 ${H} V 150 C 200 120 360 150 560 132 S 980 120 1180 142 S 1500 126 ${W} 138 V ${H}Z" fill="#3A6E52"/>`;
    for (let i = 0; i < 9; i++) far += pine(r, 90 + i * 185 + r() * 60, 176, 70 + r() * 30, '#3A6E52');
    let mid = `<path d="M0 ${H} V 190 C 260 170 520 196 800 180 S 1330 170 ${W} 184 V ${H}Z" fill="#1A3A28"/>`;
    for (let i = 0; i < 6; i++) mid += pine(r, 130 + i * 270 + r() * 80, 214, 120 + r() * 50, '#1A3A28');
    mid += palm(r, 410, 222, 60, '#1A3A28') + palm(r, 1090, 224, 66, '#1A3A28');
    let near = `<path d="M0 ${H} V 228 C 300 214 600 236 900 222 S 1400 220 ${W} 230 V ${H}Z" fill="#0F2218"/>`;
    near += palm(r, 150, 246, 80, '#0F2218') + palm(r, 760, 250, 70, '#0F2218') + palm(r, 1380, 246, 86, '#0F2218') + grass(r, 0, W, 252, '#0F2218');
    return layer(far, '', .55, 'ly-far') + layer(mid, '', .92, 'ly-mid') + layer(near, '', 1, 'ly-near');
  }

  function initHero() {
    const hero = document.querySelector('.hero, .packet-hero');
    if (!hero) return;
    const scene = document.createElement('div');
    scene.className = 'hero-scene'; scene.innerHTML = buildScene();
    hero.insertBefore(scene, hero.firstChild);
    const canvas = document.createElement('canvas'); canvas.className = 'hero-pollen';
    hero.insertBefore(canvas, scene.nextSibling);
    const layers = scene.querySelectorAll('svg');
    let mx = 0, sy = 0;
    function place() { layers.forEach((l, i) => { const k = (i + 1) * 5; l.style.transform = `translate3d(${(-mx * k).toFixed(1)}px, ${(sy * (i + 1) * 0.06).toFixed(1)}px, 0)`; }); }
    if (!reduce) {
      hero.addEventListener('pointermove', (e) => {
        const b = hero.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
        mx = x - 0.5; hero.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); hero.style.setProperty('--my', (y * 100).toFixed(1) + '%'); place();
      }, { passive: true });
      window.addEventListener('scroll', () => { sy = Math.min(window.scrollY, 600); place(); }, { passive: true });
    }
    // pollen / fireflies
    const ctx = canvas.getContext('2d'); let W = 0, H = 0, motes = [], live = true, raf = 0;
    const R = rng(7);
    function size() { const b = hero.getBoundingClientRect(); const d = Math.min(window.devicePixelRatio || 1, 2); W = canvas.width = b.width * d; H = canvas.height = b.height * d; canvas.style.width = b.width + 'px'; canvas.style.height = b.height + 'px'; motes = Array.from({ length: 46 }, () => ({ x: R() * W, y: R() * H, r: (0.8 + R() * 2.2) * d, vy: -(0.08 + R() * 0.28) * d, vx: (R() - .5) * 0.18 * d, p: R() * 6.28, s: 0.4 + R() * 0.9 })); }
    function frame(t) {
      if (!live) return;
      ctx.clearRect(0, 0, W, H);
      for (const m of motes) {
        m.x += m.vx + Math.sin(t / 1800 + m.p) * 0.12; m.y += m.vy; if (m.y < -10) { m.y = H + 10; m.x = R() * W; }
        const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t / 700 * m.s + m.p));
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 5);
        g.addColorStop(0, `rgba(255,226,140,${a})`); g.addColorStop(1, 'rgba(255,226,140,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 5, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    size(); window.addEventListener('resize', size);
    if (!reduce && 'IntersectionObserver' in window) {
      new IntersectionObserver((e) => { live = e[0].isIntersecting; if (live) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); } }).observe(hero);
    }
    if (!reduce) raf = requestAnimationFrame(frame);
  }

  // ---- header shrink + reveals ----
  function initChrome() {
    const head = document.querySelector('.site-head');
    if (head) { const f = () => head.classList.toggle('scrolled', window.scrollY > 12); f(); window.addEventListener('scroll', f, { passive: true }); }
    if (reduce || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('pf');
    const sel = '.section-head, .plant-card, .card, .event, .reward-card, .zip-check, .hours-card, .map, .ba, .cta-band, .grid > *, .faq-item, details, .team-card, .pic, figure';
    const els = Array.from(document.querySelectorAll('main ' + sel)).filter((el) => !el.closest('.hero, .packet-hero'));
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('pf-show'); io.unobserve(x.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => { const i = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0; el.classList.add('pf-in'); el.style.setProperty('--d', (Math.min(i, 6) * .07).toFixed(2) + 's'); io.observe(el); });
  }
  document.addEventListener('DOMContentLoaded', () => { initHero(); initChrome(); });
})();
