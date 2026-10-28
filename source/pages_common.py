"""Shared layout pieces for the Fern & Field sample sites."""
import json, os, subprocess, html as _h

ROOT = os.path.dirname(os.path.abspath(__file__))
ORG = 'pontavia-consulting'
SAMPLES_URL = f'https://{ORG}.github.io/Pontavia-Samples/'
SITE_URLS = {t: f'https://{ORG}.github.io/Pontavia-Sample-{t.capitalize()}/' for t in ('good', 'better', 'best')}
TIER_LABEL = {'good': 'Good', 'better': 'Better', 'best': 'Best'}

# Load the shared data file once so static HTML and the browser use the same content.
_js = "global.window={};require(process.argv[1]);const F=window.FF;delete F.byId;console.log(JSON.stringify(F))"
FF = json.loads(subprocess.check_output(['node', '-e', _js, os.path.join(ROOT, 'data.js')]))
PLANTS = {p['id']: p for p in FF['plants']}

def esc(s):
    return _h.escape(str(s), quote=True)

def art(cfg, cls='art', label=None):
    c = dict(cfg)
    if label:
        c['label'] = label
    return f"<div class=\"{cls}\" data-plant='{esc(json.dumps(c))}'></div>"

def plant_art(pid, cls='art', **over):
    p = PLANTS[pid]
    c = dict(p['art']); c.update(over)
    return art(c, cls, f"Illustration of {p['name']}")

LOGO_SVG = ('<svg viewBox="0 0 48 48" aria-hidden="true">'
            '<circle cx="24" cy="24" r="23" fill="#1F3D2C"/>'
            '<circle cx="31" cy="15" r="6" fill="#E8B21C"/>'
            '<path d="M24 40 C24 30 22 22 15 15" stroke="#EEF3E8" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
            '<path d="M16 16 Q 10 22 15 28 Q 21 23 16 16Z" fill="#8DB57E"/>'
            '<path d="M21 23 Q 13 26 16 34 Q 24 30 21 23Z" fill="#B9D3AA"/>'
            '<path d="M24 31 Q 31 26 34 31 Q 29 37 24 31Z" fill="#8DB57E"/></svg>')

ICONS = {
    'search': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    'user': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    'bag': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    'heart': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>',
    'chat': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4V5Z"/></svg>',
    'lock': '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
}

ADDRESS = '2200 Fern Hollow Rd, Ocala, FL 34471'
PHONE = '(352) 555-0142'
EMAIL = 'hello@fernandfield.example'
HOURS_TXT = [('Mon–Thu', '8 am – 5 pm'), ('Friday', '8 am – 6 pm'), ('Saturday', '7 am – 4 pm'), ('Sunday', 'Closed')]

def demo_bar(tier):
    return (f'<div class="demo-bar"><div class="wrap"><span>Sample <b>{TIER_LABEL[tier]}</b> website by Pontavia Consulting. '
            'Fern &amp; Field is a made-up business, so nothing you enter is sent anywhere.</span>'
            f'<a href="{SAMPLES_URL}">Compare all three packages</a></div></div>')

def head(title, desc, tier, page, extra=''):
    url = SITE_URLS[tier] + ('' if page == 'index.html' else page)
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{url}">
<meta name="theme-color" content="#1F3D2C">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/lora.woff" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="assets/style.css">
{extra}</head>
'''

def local_business_ld(tier):
    d = {
        "@context": "https://schema.org", "@type": "GardenStore", "name": "Fern & Field Garden Co.",
        "url": SITE_URLS[tier], "telephone": PHONE,
        "address": {"@type": "PostalAddress", "streetAddress": "2200 Fern Hollow Rd", "addressLocality": "Ocala", "addressRegion": "FL", "postalCode": "34471", "addressCountry": "US"},
        "openingHours": ["Mo-Th 08:00-17:00", "Fr 08:00-18:00", "Sa 07:00-16:00"],
        "areaServed": "Marion County, FL", "description": "Native plant nursery and landscape design in Ocala, Florida. (Sample site, fictional business.)"
    }
    return f'<script type="application/ld+json">{json.dumps(d)}</script>\n'

def logo(sub='Native plants · Ocala, FL'):
    return f'<a class="logo" href="index.html">{LOGO_SVG}<span><b>Fern &amp; Field</b><small>Garden Co. — Ocala, Florida</small></span></a>'

def nav(items, page, cta=None):
    links = ''.join(f'<a href="{h}"{" aria-current=\"page\"" if h == page else ""}>{esc(t)}</a>' for h, t in items)
    if cta:
        links += f'<a class="btn small" href="{cta[0]}">{esc(cta[1])}</a>'
    return links

def header(tier, items, page, cta=None, tools=''):
    return f'''<header class="site-head"><div class="wrap">
{logo()}
<nav class="nav" id="nav" aria-label="Main">{nav(items, page, cta)}</nav>
{tools}
<button class="menu-btn" aria-expanded="false" aria-controls="nav" aria-label="Menu"><span></span><span></span><span></span></button>
</div></header>'''

def footer(tier, cols):
    colhtml = ''.join(f'<div><h4>{esc(h)}</h4>{"".join(f"<a href=\"{u}\">{esc(t)}</a>" for u, t in links)}</div>' for h, links in cols)
    return f'''<footer class="site-foot"><div class="wrap">
<div class="cols">
<div>{logo()}<p>Native plants, landscape design and honest advice for Marion County yards since 2014.</p>
<p>{ADDRESS}<br><a href="tel:+13525550142" style="display:inline">{PHONE}</a></p></div>
{colhtml}
</div>
<div class="base"><span>© 2026 Fern &amp; Field Garden Co. A fictional business.</span><span>Sample site built by <a href="{SAMPLES_URL}" style="display:inline">Pontavia Consulting</a></span></div>
</div></footer>'''

def page_hero(title, lede, crumbs=None):
    c = ''
    if crumbs:
        c = '<div class="crumbs">' + ' / '.join(f'<a href="{u}">{esc(t)}</a>' for u, t in crumbs) + '</div>'
    return f'<section class="page-hero"><div class="wrap">{c}<h1>{title}</h1><p class="lede">{lede}</p></div></section>'

def hours_dl():
    return '<dl>' + ''.join(f'<dt>{d}</dt><dd>{h}</dd>' for d, h in HOURS_TXT) + '</dl>'

def service_cards(ids=None, cols='g3', edit=False):
    out = []
    for s in FF['services']:
        if ids and s['id'] not in ids:
            continue
        e = ' data-edit' if edit else ''
        out.append(f'<article class="card svc"><h3{e}>{esc(s["name"])}</h3><p class="muted"{e}>{esc(s["text"])}</p>'
                   f'<div class="meta"><span class="price"{e}>{esc(s["price"])}</span><span>{esc(s["time"])}</span></div></article>')
    return f'<div class="grid {cols}">' + ''.join(out) + '</div>'

def faq_list():
    return ''.join(f'<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q, a in FF['faqs'])

def reviews_block(stars=False):
    out = []
    for r in FF['reviews']:
        s = '<div class="stars" aria-label="5 out of 5 stars">★★★★★</div>' if stars else ''
        out.append(f'<figure class="card" style="margin:0">{s}<blockquote class="quote">“{esc(r["text"])}”</blockquote><figcaption class="who">{esc(r["name"])}, {esc(r["place"])}</figcaption></figure>')
    return '<div class="grid g3">' + ''.join(out) + '</div><p class="sample-note">Sample reviews written for this demo site.</p>'

def cta_band(title, text, href, label):
    return f'''<div class="cta-band"><div><h2>{title}</h2><p>{text}</p></div><a class="btn gold" href="{href}">{esc(label)}</a></div>'''

def contact_form(services=True, extra=''):
    opts = ''.join(f'<option>{esc(s["name"])}</option>' for s in FF['services'])
    svc = f'<div class="field"><label for="f-svc">What can we help with?</label><select id="f-svc" name="service"><option value="">Choose one</option>{opts}<option>Something else</option></select></div>' if services else ''
    return f'''<form class="demo-form" novalidate data-success="Thanks, {{name}}. We got your message and will reply within one business day.">
<div class="row2"><div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" autocomplete="name" required></div>
<div class="field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div></div>
<div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
{svc}{extra}
<div class="field"><label for="f-msg">Tell us about your yard</label><textarea id="f-msg" name="message" required placeholder="Sun or shade, rough size, what you'd like to change"></textarea></div>
<button class="btn" type="submit">Send message</button>
</form>'''

MAP_SVG = '''<svg viewBox="0 0 400 250" role="img" aria-label="Map showing Fern &amp; Field on Fern Hollow Road, southeast Ocala">
<rect width="400" height="250" fill="#DDE6D5"/>
<path d="M0 70 C 120 60 200 90 400 80" stroke="#fff" stroke-width="14" fill="none"/>
<path d="M150 0 C 160 90 140 160 170 250" stroke="#fff" stroke-width="10" fill="none"/>
<path d="M0 190 C 140 175 260 200 400 170" stroke="#fff" stroke-width="8" fill="none"/>
<path d="M260 0 L 300 250" stroke="#F3E7C4" stroke-width="12"/>
<circle cx="70" cy="140" r="30" fill="#C6D6BC"/><circle cx="345" cy="215" r="24" fill="#C6D6BC"/>
<text x="12" y="62" font-size="11" fill="#4D5E52" font-family="sans-serif">SE 17th St</text>
<text x="306" y="40" font-size="11" fill="#4D5E52" font-family="sans-serif">US-441</text>
<text x="180" y="236" font-size="11" fill="#4D5E52" font-family="sans-serif">Fern Hollow Rd</text>
<g transform="translate(220 138)"><path d="M0 0 C -14 -16 -14 -34 0 -34 C 14 -34 14 -16 0 0Z" fill="#7A3F8A"/><circle cy="-23" r="5" fill="#fff"/></g>
<rect x="232" y="104" width="112" height="26" rx="5" fill="#fff"/><text x="241" y="121" font-size="12" font-weight="700" fill="#1F3D2C" font-family="sans-serif">Fern &amp; Field</text>
</svg>'''

def scene(pids, dusk=False):
    inner = ''.join(plant_art(p, 'art', pot=False) for p in pids)
    return f'<div class="scene{" dusk" if dusk else ""}">{inner}</div>'

def tail(scripts):
    return ''.join(f'<script src="assets/{s}" defer></script>\n' for s in scripts) + '</body>\n</html>\n'

def readme(tier, price, summary, pages, features):
    p = '\n'.join(f'- `{x}`' for x in pages)
    f = '\n'.join(f'- {x}' for x in features)
    return f'''# Fern & Field Garden Co. — {TIER_LABEL[tier]} package sample

A sample website built by **Pontavia Consulting** to show what the **{TIER_LABEL[tier]} ({price})** website package includes.
Fern & Field Garden Co. is a made-up business in Ocala, Florida.

Live demo: {SITE_URLS[tier]}
Compare all three packages: {SAMPLES_URL}

{summary}

## What's included

{f}

## Pages

{p}

## Notes

- Plain HTML, CSS and JavaScript. No build step, no framework, nothing to install.
- All plant pictures are SVG illustrations drawn by `assets/art.js`, so there are no stock photos to license.
- This is a front-end demo only: forms, bookings{", the cart and checkout" if tier == "best" else ""} work in the browser but don't send or store anything on a server.
- To preview locally, open `index.html` in a browser, or run `python3 -m http.server` in this folder.
'''

README = {}
