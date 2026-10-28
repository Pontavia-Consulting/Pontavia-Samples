#!/usr/bin/env python3
"""Screenshot pages. Usage: shot.py OUTDIR site/page.html[@mobile][#full] ...
Serves /home/claude/samples over http on port 8765."""
import sys, os, subprocess, time, socket
from playwright.sync_api import sync_playwright

ROOT = '/home/claude/samples'
PORT = 8765

def up():
    s = socket.socket()
    try:
        s.connect(('127.0.0.1', PORT)); return True
    except OSError:
        return False
    finally:
        s.close()

if not up():
    subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT), '-d', ROOT], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(30):
        if up(): break
        time.sleep(.2)

out = sys.argv[1]
os.makedirs(out, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch()
    for spec in sys.argv[2:]:
        full = spec.endswith('#full'); spec = spec.replace('#full', '')
        mobile = '@mobile' in spec; spec = spec.replace('@mobile', '')
        actions = None
        if '!' in spec:
            spec, actions = spec.split('!', 1)
        vp = {'width': 390, 'height': 844} if mobile else {'width': 1366, 'height': 860}
        pg = b.new_page(viewport=vp, device_scale_factor=1); pg.set_default_timeout(5000)
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        pg.goto(f'http://127.0.0.1:{PORT}/{spec}', wait_until='networkidle')
        if actions:
            for a in actions.split('!'):
                if a.startswith('click='): pg.click(a[6:])
                elif a.startswith('fill='):
                    sel, val = a[5:].split('=', 1); pg.fill(sel, val)
                elif a.startswith('wait='): pg.wait_for_timeout(int(a[5:]))
                elif a.startswith('eval='): pg.evaluate(a[5:])
        pg.wait_for_timeout(350)
        name = spec.replace('/', '_').replace('?', '_').replace('=', '-') + ('_m' if mobile else '') + ('_full' if full else '') + ('_act' if actions else '') + '.png'
        pg.screenshot(path=os.path.join(out, name), full_page=full)
        print(name, 'ERRORS:' if errs else '', '; '.join(errs)[:400])
        pg.close()
    b.close()
