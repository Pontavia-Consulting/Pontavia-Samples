/* Fern & Field: illustrated plant portraits drawn as SVG.
   plantArt({type, leaf, bloom, seed, pot}) returns an SVG string.
   Every product and section image on the site comes from this file, so no photos are needed. */
(function () {
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const leafPath = (len, w) => `M0 0 Q ${w} ${-len * 0.45} 0 ${-len} Q ${-w} ${-len * 0.45} 0 0Z`;
  const deg = (r) => (r * 180) / Math.PI;

  function frond(r, c) {
    let s = '';
    const n = 7 + Math.floor(r() * 3);
    for (let i = 0; i < n; i++) {
      const ang = -75 + (150 / (n - 1)) * i + (r() * 8 - 4);
      const len = 70 + r() * 35;
      s += `<g transform="rotate(${ang})"><path d="M0 0 Q 6 ${-len / 2} 0 ${-len}" stroke="${c.dark}" stroke-width="2" fill="none"/>`;
      const k = 9;
      for (let j = 2; j < k; j++) {
        const y = (-len * j) / k, l = 30 * (1 - j / (k + 3));
        s += `<path d="${leafPath(l, 5.5)}" fill="${j % 2 ? c.leaf : c.mid}" transform="translate(1 ${y}) rotate(58)" />`;
        s += `<path d="${leafPath(l, 5.5)}" fill="${j % 2 ? c.mid : c.leaf}" transform="translate(1 ${y}) rotate(-58)"/>`;
      }
      s += '</g>';
    }
    return s;
  }
  function broad(r, c) {
    let s = '';
    const n = 5 + Math.floor(r() * 3);
    for (let i = 0; i < n; i++) {
      const ang = -52 + (104 / (n - 1)) * i + (r() * 10 - 5);
      const len = 80 + r() * 34, w = 24 + r() * 10;
      const col = i % 2 ? c.leaf : c.mid;
      s += `<g transform="rotate(${ang})"><path d="M0 0 L0 ${-len * 0.35}" stroke="${c.dark}" stroke-width="3"/>` +
        `<path d="${leafPath(len * 0.7, w)}" fill="${col}" transform="translate(0 ${-len * 0.3})"/>` +
        `<path d="M0 ${-len * 0.3} L0 ${-len}" stroke="${c.dark}" stroke-width="1.5" opacity=".55"/></g>`;
    }
    return s;
  }
  function flower(r, c) {
    let s = '';
    for (let i = 0; i < 6; i++) {
      const ang = -70 + i * 28;
      s += `<path d="${leafPath(38 + r() * 14, 9)}" fill="${i % 2 ? c.leaf : c.mid}" transform="rotate(${ang})"/>`;
    }
    const stems = 3 + Math.floor(r() * 2);
    for (let i = 0; i < stems; i++) {
      const x = -40 + (80 / (stems - 1)) * i + (r() * 10 - 5), h = 95 + r() * 45;
      s += `<path d="M0 0 Q ${x * 0.4} ${-h / 2} ${x} ${-h}" stroke="${c.dark}" stroke-width="2.5" fill="none"/>`;
      s += `<path d="${leafPath(18, 5)}" fill="${c.mid}" transform="translate(${x * 0.3} ${-h * 0.45}) rotate(${x > 0 ? 50 : -50})"/>`;
      const p = 8 + Math.floor(r() * 4), rad = 11 + r() * 5;
      s += `<g transform="translate(${x} ${-h})">`;
      for (let j = 0; j < p; j++) s += `<ellipse cx="0" cy="${-rad}" rx="${rad * 0.42}" ry="${rad * 0.8}" fill="${j % 2 ? c.bloom : c.bloom2}" transform="rotate(${(360 / p) * j})"/>`;
      s += `<circle r="${rad * 0.42}" fill="${c.eye}"/></g>`;
    }
    return s;
  }
  function spike(r, c) {
    let s = '';
    for (let i = 0; i < 7; i++) s += `<path d="${leafPath(42 + r() * 12, 11)}" fill="${i % 2 ? c.leaf : c.mid}" transform="rotate(${-72 + i * 24})"/>`;
    for (let i = 0; i < 3; i++) {
      const x = -30 + i * 30, h = 110 + r() * 30;
      s += `<path d="M0 0 Q ${x * 0.3} ${-h / 2} ${x} ${-h}" stroke="${c.dark}" stroke-width="2.5" fill="none"/>`;
      for (let j = 0; j < 9; j++) {
        const t = 0.55 + j * 0.05, y = -h * t, xx = x * t;
        s += `<ellipse cx="${xx + (j % 2 ? 4 : -4)}" cy="${y}" rx="4" ry="8" fill="${j % 2 ? c.bloom : c.bloom2}" transform="rotate(${j % 2 ? 25 : -25} ${xx} ${y})"/>`;
      }
    }
    return s;
  }
  function shrub(r, c) {
    let s = `<path d="M0 0 L-10 -40 M0 0 L12 -46 M0 0 L0 -55" stroke="${c.dark}" stroke-width="4" fill="none"/>`;
    const blobs = [[-38, -70, 34], [36, -74, 36], [0, -104, 40], [-20, -128, 28], [26, -124, 30], [0, -60, 30]];
    blobs.forEach(([x, y, rad], i) => {
      s += `<circle cx="${x}" cy="${y}" r="${rad}" fill="${i % 2 ? c.leaf : c.mid}"/>`;
    });
    for (let i = 0; i < 26; i++) {
      const a = r() * Math.PI * 2, d = r() * 52, x = Math.cos(a) * d, y = -95 + Math.sin(a) * d * 0.8;
      s += `<path d="${leafPath(12, 4)}" fill="${c.dark}" opacity=".35" transform="translate(${x} ${y}) rotate(${deg(a)})"/>`;
    }
    if (c.bloom) for (let i = 0; i < 22; i++) {
      const a = r() * Math.PI * 2, d = 18 + r() * 40, x = Math.cos(a) * d, y = -95 + Math.sin(a) * d * 0.85;
      s += `<circle cx="${x}" cy="${y}" r="${3 + r() * 3}" fill="${i % 3 ? c.bloom : c.bloom2}"/>`;
    }
    return s;
  }
  function grass(r, c) {
    let s = '';
    for (let i = 0; i < 34; i++) {
      const x = (r() - 0.5) * 110, h = 80 + r() * 55, bend = (r() - 0.5) * 50;
      s += `<path d="M${(r() - 0.5) * 16} 0 Q ${x * 0.4} ${-h * 0.6} ${x + bend} ${-h}" stroke="${i % 3 ? c.leaf : c.mid}" stroke-width="${2 + r() * 2.5}" fill="none" stroke-linecap="round"/>`;
    }
    if (c.bloom) for (let i = 0; i < 40; i++) {
      const x = (r() - 0.5) * 130, y = -95 - r() * 45;
      s += `<circle cx="${x}" cy="${y}" r="${4 + r() * 7}" fill="${c.bloom}" opacity="${0.25 + r() * 0.35}"/>`;
    }
    return s;
  }
  function succulent(r, c) {
    let s = '';
    [[11, 84, 22, c.mid], [9, 64, 19, c.leaf], [7, 42, 14, c.bloom || c.mid]].forEach(([n, len, w, col], k) => {
      for (let i = 0; i < n; i++) {
        const ang = -90 + (180 / (n - 1)) * i + k * 7;
        s += `<path d="${leafPath(len, w)}" fill="${col}" stroke="${c.dark}" stroke-width=".8" stroke-opacity=".4" transform="translate(0 -14) rotate(${ang})"/>`;
      }
    });
    return s;
  }
  function tree(r, c) {
    let s = `<path d="M-9 0 C -6 -40 -12 -70 -4 -96 L 6 -96 C 12 -70 8 -40 11 0Z" fill="${c.bark}"/>` +
      `<path d="M0 -80 C -20 -95 -40 -100 -62 -112 M2 -88 C 22 -102 44 -104 64 -118" stroke="${c.bark}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    [[-62, -132, 34], [60, -138, 36], [0, -150, 46], [-30, -168, 32], [32, -172, 30]].forEach(([x, y, rad], i) => {
      s += `<circle cx="${x}" cy="${y}" r="${rad}" fill="${i % 2 ? c.leaf : c.mid}"/>`;
    });
    if (c.moss) for (let i = 0; i < 9; i++) {
      const x = -80 + i * 19 + r() * 6, y = -118 + r() * 14, h = 26 + r() * 22;
      s += `<path d="M${x} ${y} q 3 ${h / 3} -2 ${h / 1.6} q 3 ${h / 4} 0 ${h / 2.6}" stroke="${c.moss}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    }
    return s;
  }
  function scaled(fn, k) { return (r, c) => `<g transform="scale(${k})">${fn(r, c)}</g>`; }
  const kinds = { frond, broad, flower, spike, shrub, grass, succulent, tree: scaled(tree, 0.88) };

  const palettes = {
    green:  { leaf: '#4E7A4A', mid: '#6E9A5E', dark: '#24412C' },
    blue:   { leaf: '#4C7768', mid: '#7FA592', dark: '#24412C' },
    olive:  { leaf: '#6B7F3A', mid: '#8FA05A', dark: '#36451F' },
    deep:   { leaf: '#2F5B3E', mid: '#467654', dark: '#18301F' },
    silver: { leaf: '#8BA597', mid: '#A9BFB2', dark: '#4C6658' },
  };

  // Lighting helpers: gives every plant depth (soft shadow, light from upper left, glossy pot).
  const shade = (hex, k) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return hex;
    const n = parseInt(m[1], 16), f = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
    return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, '0')).join('');
  };
  let uid = 0;

  window.plantArt = function (o) {
    const id = 'pa' + (++uid);
    const r = rng(o.seed || 7);
    const c = Object.assign({ bark: '#6B4F3A', eye: '#5A3A1A' }, palettes[o.leaf || 'green'], o.colors || {});
    const noPot = o.pot === false;
    const base = noPot ? 204 : 164;
    const plant = `<g transform="translate(100 ${base})">${kinds[o.type || 'broad'](r, c)}</g>`;
    const pc = o.potColor || '#B98C5E', rc = o.rimColor || '#A3784E';
    const pot = noPot ? '' :
      `<path d="M58 170 L142 170 L132 214 Q100 219 68 214Z" fill="url(#${id}p)"/>` +
      `<path d="M62 182 H138 M65 194 H135 M67 205 H133" stroke="${shade(pc, 0.78)}" stroke-width=".9" opacity=".35"/>` +
      `<rect x="51" y="159" width="98" height="16" rx="4" fill="url(#${id}r)"/>` +
      `<rect x="54" y="161" width="92" height="3" rx="1.5" fill="#fff" opacity=".28"/>` +
      `<ellipse cx="100" cy="160" rx="44" ry="5.5" fill="#3A2A1B"/>`;
    const ground = noPot ? `<ellipse cx="100" cy="208" rx="82" ry="9" fill="url(#${id}g)"/>` :
      `<ellipse cx="100" cy="216" rx="64" ry="7" fill="url(#${id}g)"/>`;
    const defs = `<defs>` +
      `<linearGradient id="${id}p" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${shade(pc, 1.12)}"/><stop offset=".5" stop-color="${pc}"/><stop offset="1" stop-color="${shade(pc, 0.7)}"/></linearGradient>` +
      `<linearGradient id="${id}r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${shade(rc, 1.15)}"/><stop offset="1" stop-color="${shade(rc, 0.75)}"/></linearGradient>` +
      `<linearGradient id="${id}l" x1="0.05" y1="0" x2="0.95" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#06140b" stop-opacity=".7"/></linearGradient>` +
      `<radialGradient id="${id}g"><stop offset="0" stop-color="#14261a" stop-opacity=".38"/><stop offset="1" stop-color="#14261a" stop-opacity="0"/></radialGradient>` +
      `<filter id="${id}s" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="b"/><feOffset in="b" dx="1.5" dy="3" result="o"/><feComponentTransfer in="o" result="sh"><feFuncA type="linear" slope=".3"/></feComponentTransfer><feMerge><feMergeNode in="sh"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
      `<filter id="${id}w" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/></filter>` +
      `<mask id="${id}m" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="220"><g filter="url(#${id}w)">${plant}</g></mask></defs>`;
    return `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${o.label || 'Plant illustration'}">` +
      defs + ground + `<g ${o.type === 'grass' ? '' : `filter="url(#${id}s)"`}>${plant}${pot}</g>` +
      `<rect width="200" height="220" fill="url(#${id}l)" mask="url(#${id}m)" style="mix-blend-mode:soft-light"/></svg>`;
  };

  // Fill every <div data-plant='{"type":...}'> on the page.
  window.drawPlants = function (root) {
    (root || document).querySelectorAll('[data-plant]').forEach((el) => {
      if (el.dataset.drawn) return;
      try { el.innerHTML = window.plantArt(JSON.parse(el.dataset.plant)); el.dataset.drawn = '1'; } catch (e) { /* skip bad config */ }
    });
  };
  document.addEventListener('DOMContentLoaded', () => window.drawPlants());
})();
