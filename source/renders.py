#!/usr/bin/env python3
"""Capture renderings of the three sample sites for the samples page (WebP, 2x)."""
import os, io, subprocess, sys, time, socket
from playwright.sync_api import sync_playwright
from PIL import Image

OUT = '/home/claude/samples/samples-page/renders'
os.makedirs(OUT, exist_ok=True)
BASE = 'http://127.0.0.1:8765/'
HIDE = "document.querySelectorAll('.edit-fab').forEach(e=>e.style.display='none')"
CART = """localStorage.setItem('ff-best-demo', JSON.stringify({cart:[{key:'firebush|3 gal',id:'firebush',kind:'plant',title:'Firebush',detail:'3 gal',price:24,qty:2},{key:'muhly|1 gal',id:'muhly',kind:'plant',title:'Pink muhly grass',detail:'1 gal',price:14,qty:5},{key:'ticket|w2',id:'w2',kind:'ticket',title:'Build a hummingbird corner',detail:'Workshop ticket · Nov 14',price:25,qty:2}],wish:['coontie','bird','monstera'],orders:[],points:620}))"""

SHOTS = [
    # name, url, mobile, steps
    ('good-home', 'good/index.html', False, [HIDE]),
    ('good-home-m', 'good/index.html', True, []),
    ('good-services', 'good/services.html', False, ['scroll:300']),
    ('good-contact', 'good/contact.html', False, ['eval:document.querySelector("#f-name").value="Maria Lopez";document.querySelector("#f-email").value="maria@example.com";document.querySelector("#f-phone").value="(352) 555-0199";document.querySelector("#f-svc").selectedIndex=6;document.querySelector("#f-msg").value="Half-acre lot in SE Ocala, full sun in front. The lawn dies every spring and we would like a low-water native garden instead."', 'scroll:250']),
    ('better-home', 'better/index.html', False, [HIDE]),
    ('better-home-m', 'better/index.html', True, [HIDE]),
    ('better-booking', 'better/design.html', False, [HIDE, 'click:input[value=lawn]', 'click:[data-next]', 'click:[data-day="3"]', 'click:[data-times] .slot:not([disabled])', 'scroll:330']),
    ('better-library', 'better/plants.html', False, [HIDE, 'click:[data-cat=natives]', 'scroll:330']),
    ('better-editor', 'better/index.html', False, ['click:[data-edit-toggle]', 'type:h1[data-edit]|Your headline, edited in place.']),
    ('better-gallery', 'better/gallery.html', False, [HIDE, 'scroll:300']),
    ('best-home', 'best/index.html', False, [HIDE]),
    ('best-home-m', 'best/index.html', True, [HIDE]),
    ('best-shop', 'best/shop.html', False, [HIDE, 'scroll:330']),
    ('best-cart', 'best/product.html?id=firebush', False, [CART, 'reload', HIDE, 'click:[data-cart-open]']),
    ('best-checkout', 'best/checkout.html', False, [CART, 'reload', HIDE, 'scroll:330']),
    ('best-finder', 'best/finder.html', False, [HIDE, 'click:[data-a="0"]', 'click:[data-a="0"]', 'click:[data-a="0"]', 'click:[data-a="1"]', 'scroll:300']),
    ('best-chat', 'best/index.html', False, [HIDE, 'click:[data-chat-open]', 'click:[data-chat-quick] button', 'wait:1300']),
]

with sync_playwright() as p:
    b = p.chromium.launch()
    only = sys.argv[1:]
    for name, url, mobile, steps in SHOTS:
        if only and name not in only: continue
        vp = {'width': 390, 'height': 844} if mobile else {'width': 1366, 'height': 860}
        ctx = b.new_context(viewport=vp, device_scale_factor=2, is_mobile=mobile, has_touch=mobile)
        pg = ctx.new_page(); pg.set_default_timeout(6000)
        pg.goto(BASE + url, wait_until='networkidle')
        for s in steps:
            if s == 'reload': pg.reload(wait_until='networkidle')
            elif s.startswith('click:'): pg.click(s[6:]); pg.wait_for_timeout(150)
            elif s.startswith('scroll:'): pg.evaluate(f'window.scrollTo(0,{s[7:]})')
            elif s.startswith('wait:'): pg.wait_for_timeout(int(s[5:]))
            elif s.startswith('type:'):
                sel, txt = s[5:].split('|', 1)
                pg.evaluate("([s,t])=>{const e=document.querySelector(s); e.textContent=t; e.focus();}", [sel, txt])
            elif s.startswith('eval:'): pg.evaluate(s[5:])
            else: pg.evaluate(s)
        pg.wait_for_timeout(500)
        png = pg.screenshot()
        img = Image.open(io.BytesIO(png)).convert('RGB')
        img.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=82, method=6)
        print(name, img.size, os.path.getsize(os.path.join(OUT, name + '.webp')) // 1024, 'KB')
        ctx.close()
    b.close()
