#!/usr/bin/env python3
"""Builds the three Fern & Field sample sites (good, better, best) as plain static HTML.
Run: python3 build.py  ->  writes ../good, ../better, ../best"""
import json, os, shutil, html
from pages_common import *  # noqa
import sys, importlib

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(ROOT)

def write_site(tier, pages, css_parts, js_parts):
    d = os.path.join(OUT, tier)
    if os.path.isdir(d):
        for name in os.listdir(d):
            if name in ('.git',):
                continue
            p = os.path.join(d, name)
            shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
    os.makedirs(os.path.join(d, 'assets'), exist_ok=True)
    for fname, content in pages.items():
        with open(os.path.join(d, fname), 'w') as f:
            f.write(content)
    css = '\n'.join(open(os.path.join(ROOT, c)).read() for c in css_parts)
    open(os.path.join(d, 'assets', 'style.css'), 'w').write(css)
    shutil.copytree(os.path.join(ROOT, 'fonts'), os.path.join(d, 'assets', 'fonts'))
    for src, dst in js_parts:
        shutil.copy(os.path.join(ROOT, src), os.path.join(d, 'assets', dst))
    open(os.path.join(d, 'assets', 'favicon.svg'), 'w').write(LOGO_SVG.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '))
    base = SITE_URLS[tier]
    urls = ''.join(f'  <url><loc>{base}{"" if p == "index.html" else p}</loc></url>\n' for p in pages if p.endswith('.html') and p not in ('cart.html', 'checkout.html', 'account.html', '404.html'))
    open(os.path.join(d, 'sitemap.xml'), 'w').write(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n')
    open(os.path.join(d, 'robots.txt'), 'w').write(f'User-agent: *\nAllow: /\nSitemap: {base}sitemap.xml\n')
    open(os.path.join(d, 'README.md'), 'w').write(README[tier])
    open(os.path.join(d, '.nojekyll'), 'w').write('')
    print(tier, len(pages), 'pages')

if len(sys.argv) < 2 or 'good' in sys.argv: write_site('good', importlib.import_module('pages_good').build(), ['base.css'], [('art.js', 'art.js'), ('core.js', 'core.js')])
if len(sys.argv) < 2 or 'better' in sys.argv: write_site('better', importlib.import_module('pages_better').build(), ['base.css', 'plus.css'], [('art.js', 'art.js'), ('core.js', 'core.js'), ('data.js', 'data.js'), ('plus.js', 'site.js')])
if len(sys.argv) < 2 or 'best' in sys.argv: write_site('best', importlib.import_module('pages_best').build(), ['base.css', 'plus.css', 'store.css'], [('art.js', 'art.js'), ('core.js', 'core.js'), ('data.js', 'data.js'), ('plus.js', 'site.js'), ('store.js', 'store.js')])
