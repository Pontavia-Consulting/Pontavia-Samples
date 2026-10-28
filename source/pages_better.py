"""BETTER package: 10 pages, content editor, booking and custom forms, Google Business Profile."""
from pages_common import *  # noqa
import pages_common as C
from datetime import date

T = 'better'


class Ctx:
    def __init__(self, tier, nav, cta, foot, scripts, tools='', extra_body='', promo=''):
        self.tier, self.nav, self.cta, self.foot, self.scripts = tier, nav, cta, foot, scripts
        self.tools, self.extra_body, self.promo = tools, extra_body, promo

    def page(self, name, title, desc, body, ld=False):
        return (head(f'{title} | Fern & Field Garden Co., Ocala FL', desc, self.tier, name, local_business_ld(self.tier) if ld else '') +
                '<body>' + demo_bar(self.tier) + self.promo + header(self.tier, self.nav, name, self.cta, self.tools) +
                '<main id="main">' + body + '</main>' + footer(self.tier, self.foot) + self.extra_body + tail(self.scripts))


EDIT_FAB = '<button class="edit-fab" type="button" data-edit-toggle>Try the owner\'s editor</button>'

BETTER = Ctx(
    T,
    [('services.html', 'Services'), ('plants.html', 'Plant library'), ('gallery.html', 'Our work'), ('workshops.html', 'Workshops'),
     ('journal.html', 'Journal'), ('team.html', 'About us'), ('contact.html', 'Contact')],
    ('design.html', 'Book a design visit'),
    [('Explore', [('plants.html', 'Plant library'), ('gallery.html', 'Our work'), ('workshops.html', 'Workshops'), ('journal.html', 'Garden journal')]),
     ('Services', [('design.html', 'Book a design visit'), ('services.html', 'All services'), ('faq.html', 'Questions')]),
     ('Company', [('team.html', 'Meet the team'), ('contact.html', 'Contact and hours')])],
    ['art.js', 'data.js', 'core.js', 'site.js'],
    extra_body=EDIT_FAB,
)


def packet(month_idx=None, store=False):
    """Seed-packet card. JS refreshes it to the visitor's current month."""
    m = FF['months'][month_idx if month_idx is not None else date.today().month - 1]
    p = PLANTS[m['plant']]
    actions = ''
    if store:
        actions = (f'<div class="packet-actions"><span class="packet-price" data-pk-price>${p["price"]}</span>'
                   f'<span style="display:flex;gap:8px"><a class="btn ghost small" data-pk-link href="product.html?id={p["id"]}">Details</a>'
                   f'<button class="btn small" type="button" data-pk-add data-add="{p["id"]}">Add to cart</button></span></div>')
    return f'''<div class="packet" data-packet>
  <div class="packet-inner">
    <div class="packet-top"><b>Fern &amp; Field</b><span data-pk-month>Plant in {m["m"]}</span></div>
    <div class="packet-art" data-pk-art>{plant_art(p["id"])}</div>
    <h2 data-pk-name>{esc(p["name"])}</h2>
    <p class="latin" data-pk-latin>{esc(p["latin"])}</p>
    <div class="packet-facts">
      <div><span>Light</span><strong data-pk-light>{p["light"]}</strong></div>
      <div><span>Water</span><strong data-pk-water>{p["water"]}</strong></div>
      <div><span>Height</span><strong data-pk-height>{p["height"]}</strong></div>
    </div>
    <p class="packet-note" data-pk-note>{esc(m["note"])}</p>
    {actions}
  </div>
</div>'''


def open_line():
    return '<p class="hero-open" style="margin-top:28px;display:flex;gap:14px;align-items:center;flex-wrap:wrap"><span class="open-pill" data-open-pill>Open now</span><span class="muted small" data-open-text>Today 8 am – 5 pm · 2200 Fern Hollow Rd</span></p>'


HOUSE = ('<svg class="house" viewBox="0 0 400 170" aria-hidden="true"><path d="M20 80 L200 10 L380 80Z" fill="#7F8F84"/><rect x="45" y="78" width="310" height="92" fill="#F1EEE6"/>'
         '<rect x="175" y="105" width="48" height="65" fill="#557A50"/><rect x="75" y="100" width="62" height="42" fill="#B9CBD6"/><rect x="262" y="100" width="62" height="42" fill="#B9CBD6"/>'
         '<path d="M106 100v42M75 121h62M293 100v42M262 121h62" stroke="#F1EEE6" stroke-width="4"/><rect x="290" y="28" width="22" height="40" fill="#7F8F84"/></svg>')


def before_after():
    return f'''<div class="ba" data-ba>
  <div class="layer before">{HOUSE}<div class="turf"></div><div class="patch" style="left:12%"></div><div class="patch" style="left:58%;width:24%"></div></div>
  <div class="layer after">{HOUSE}{scene(['muhly', 'gaillardia', 'stopper', 'coreopsis', 'muhly'])}</div>
  <div class="handle"></div>
  <span class="label" style="left:14px">Before: thirsty St. Augustine</span><span class="label" style="right:14px">After: native beds</span>
  <input type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after">
</div>'''


def gbp_block(ctx_tier):
    """Google Business Profile style block: rating, live hours, map."""
    hours = ''.join(f'<li data-day="{i}"><span>{d}</span><span>{h}</span></li>' for i, (d, h) in enumerate(
        [('Sunday', 'Closed'), ('Monday', '8 am – 5 pm'), ('Tuesday', '8 am – 5 pm'), ('Wednesday', '8 am – 5 pm'), ('Thursday', '8 am – 5 pm'), ('Friday', '8 am – 6 pm'), ('Saturday', '7 am – 4 pm')]))
    return f'''<div class="grid" style="grid-template-columns:1.2fr 1fr;gap:28px" id="gbp">
  <div class="map">{MAP_SVG}</div>
  <div class="hours-card">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
      <span class="open-pill" data-open-pill>Open now</span>
      <span class="small"><span class="stars">★★★★★</span> <b>4.9</b> <span class="muted">· 128 Google reviews (sample)</span></span>
    </div>
    <ul class="hours-list">{hours}</ul>
    <div class="btn-row" style="margin-top:18px"><a class="btn small" href="https://www.google.com/maps/search/?api=1&query=Ocala+FL" rel="noopener">Get directions</a><a class="btn ghost small" href="tel:+13525550142">Call {PHONE}</a></div>
  </div>
</div>
<style>@media (max-width:860px){{#gbp{{grid-template-columns:1fr !important}}}}</style>'''


def workshop_rows(limit=None, buy=False):
    out = []
    for w in FF['workshops'][:limit]:
        d = date.fromisoformat(w['date'])
        low = ' low' if w['seats'] <= 6 else ''
        btn = 'Buy tickets' if buy else 'Save my seat'
        out.append(f'''<article class="event" data-event="{w["id"]}">
  <div class="cal" aria-hidden="true"><span>{d.strftime("%b")}</span><b>{d.day}</b></div>
  <div><h3>{esc(w["title"])}</h3><div class="when">{d.strftime("%A, %B ")}{d.day} · {w["time"]} · {w["length"]} · ${w["price"]} per person</div><p class="muted small" style="margin:6px 0 0">{esc(w["text"])}</p></div>
  <div class="event-side"><span class="seats{low}" data-seats>{w["seats"]} seats left</span><button class="btn small" type="button" data-rsvp="{w["id"]}">{btn}</button></div>
</article>''')
    return ''.join(out)


RSVP_MODAL = '''<div class="modal" data-rsvp-modal hidden role="dialog" aria-modal="true" aria-labelledby="rsvp-title">
  <div class="modal-box">
    <div class="modal-head"><div><h2 id="rsvp-title" style="font-size:28px;margin:0" data-rsvp-title>Save your seat</h2><p class="muted small" data-rsvp-when style="margin:4px 0 0"></p></div><button class="icon-btn" type="button" data-close aria-label="Close">×</button></div>
    <form data-rsvp-form novalidate>
      <div class="field"><label for="r-name">Name</label><input id="r-name" name="name" required autocomplete="name"></div>
      <div class="field"><label for="r-email">Email</label><input id="r-email" name="email" type="email" required autocomplete="email"></div>
      <div class="field"><label for="r-seats">How many seats?</label><select id="r-seats" name="seats"><option>1</option><option>2</option><option>3</option><option>4</option></select></div>
      <p class="small muted" data-rsvp-total></p>
      <button class="btn" type="submit" data-rsvp-submit>Save my seat</button>
    </form>
  </div>
</div>'''


def team_grid():
    out = ''
    for t in FF['team']:
        out += f'''<article class="person"><div class="portrait">{plant_art(t["fav"])}</div><h3 data-edit>{esc(t["name"])}</h3><div class="role">{esc(t["role"])}</div><p class="muted" data-edit>{esc(t["bio"])}</p><p class="small muted">Favorite plant: {esc(PLANTS[t["fav"]]["name"])}</p></article>'''
    return f'<div class="grid g4">{out}</div>'


def gallery_grid():
    out = ''
    for i, pr in enumerate(FF['projects']):
        out += f'''<button class="shot" type="button" data-shot="{i}"><span class="sr">Open larger view of </span>{scene(pr["plants"], dusk=i % 3 == 1)}<span class="cap"><b>{esc(pr["title"])}</b><span>{esc(pr["kind"])} · {esc(pr["area"])}</span></span></button>'''
    return f'<div class="gallery">{out}</div>'


LIGHTBOX = '''<div class="lightbox" data-lightbox hidden role="dialog" aria-modal="true" aria-label="Project photo">
  <div class="lightbox-inner"><div data-lb-scene></div>
  <div class="lightbox-bar"><div><b data-lb-title style="font-family:var(--display);font-size:21px;color:var(--oak)"></b><div class="muted small" data-lb-meta></div></div>
  <div style="display:flex;gap:8px"><button class="icon-btn" type="button" data-lb-prev aria-label="Previous project">‹</button><button class="icon-btn" type="button" data-lb-next aria-label="Next project">›</button><button class="icon-btn" type="button" data-close aria-label="Close">×</button></div></div></div>
</div>'''


def posts():
    out = ''
    for i, p in enumerate(FF['posts']):
        pid = FF['posts'][i]['id']
        art_id = ['muhly', 'firebush', 'bird'][i]
        out += f'''<article class="post" id="{pid}"><div class="art-tile">{plant_art(art_id)}</div><div>
<div class="when">{p["date"]} · {p["mins"]} min read</div><h3><a href="#{pid}" data-edit>{esc(p["title"])}</a></h3><p class="muted" data-edit>{esc(p["text"])}</p>
<div class="more"><p>Start small. Pick the sunniest, hardest-to-water corner of the yard, strip the turf, and plant a group of three to five of the same plant. Water every other day for two weeks, then twice a week until the rainy season starts.</p><p>Once that patch looks good, do the next one. Most of our clients convert a front yard over two or three seasons without ever living in a construction zone.</p></div>
<button class="link-btn" type="button" data-more aria-expanded="false" style="font-size:15px;color:var(--oak);font-weight:600">Read the full post</button></div></article>'''
    return out


def plant_cards_static(ids, link):
    out = ''
    for pid in ids:
        p = PLANTS[pid]
        nat = '<span class="fact native">Florida native</span>' if p['native'] else ''
        out += f'''<a class="plant-card" href="{link(pid)}"><div class="pic">{plant_art(pid)}</div><div class="body"><h3>{esc(p["name"])}</h3><div class="latin">{esc(p["latin"])}</div><div class="facts">{nat}<span class="fact">{p["light"]}</span><span class="fact">{p["water"]} water</span></div></div></a>'''
    return f'<div class="grid g4">{out}</div>'


# ---------- pages ----------

def home(ctx):
    body = f'''
<section class="packet-hero"><div class="wrap">
  <div>
    <h1 data-edit>Plant what already wants to grow here.</h1>
    <p class="lede" data-edit>Native plants, landscape design and honest advice for Marion County yards. Come see what's in season, or book a designer to walk your yard.</p>
    <div class="btn-row"><a class="btn" href="design.html">Book a design visit</a><a class="btn ghost" href="plants.html">Browse the plant library</a></div>
    {open_line()}
  </div>
  {packet()}
</div></section>

<section class="section wash"><div class="wrap">
  <div class="section-head"><div><h2>What we do</h2><p>Flat starting prices, written quotes, one-year plant guarantee.</p></div><a class="btn ghost small" href="services.html">All services</a></div>
  {service_cards(['design', 'native', 'lawn'], edit=True)}
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head"><div><h2>Natives that earn their spot</h2><p>Picked for sand, heat and the odd January freeze.</p></div><a class="btn ghost small" href="plants.html">See all 16 plants</a></div>
  {plant_cards_static(['firebush', 'muhly', 'beautyberry', 'coontie'], lambda pid: 'plants.html#' + pid)}
</div></section>

<section class="section wash"><div class="wrap">
  <div class="section-head"><div><h2>Lawn to garden in four days</h2><p>A Silver Springs Shores front yard. Drag the handle to compare.</p></div><a class="btn ghost small" href="gallery.html">More of our work</a></div>
  {before_after()}
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head"><div><h2>Upcoming workshops</h2><p>Saturday mornings at the nursery. Small groups, hands in the dirt.</p></div><a class="btn ghost small" href="workshops.html">Full calendar</a></div>
  {workshop_rows(3)}
</div></section>

<section class="section wash"><div class="wrap">
  <h2>Find us, or see what neighbors say</h2>
  <div style="margin:32px 0 44px">{gbp_block(ctx.tier)}</div>
  {reviews_block(stars=True)}
</div></section>

<section class="section tight"><div class="wrap">
  {cta_band('Let a designer walk your yard', '90 minutes on site, a sketched plan and plant list. The $150 fee comes off your install.', 'design.html', 'Book a design visit')}
</div></section>
{RSVP_MODAL}'''
    return ctx.page('index.html', 'Native Plants & Landscape Design', 'Native plant nursery and landscape design in Ocala, FL. Book a design visit, browse the plant library, or join a Saturday workshop.', body, ld=True)


def services(ctx):
    body = page_hero('Services', 'Flat starting prices for the work we do most. Every quote is in writing before we start.', [('index.html', 'Home'), ('services.html', 'Services')]) + f'''
<section class="section"><div class="wrap">{service_cards(edit=True)}</div></section>
<section class="section wash"><div class="wrap">
  <h2>How a project works</h2>
  <ol class="steps" style="margin-top:32px">
    <li><h3>Walk the yard</h3><p class="muted">Book a design visit online. We check sun, soil and drainage, and listen to what you want.</p></li>
    <li><h3>Approve the plan</h3><p class="muted">You get a drawing, a plant list and a flat price within a week. Change anything you like.</p></li>
    <li><h3>We plant it</h3><p class="muted">Our crew installs in one to three days and leaves a 12-week watering schedule.</p></li>
  </ol>
</div></section>
<section class="section tight"><div class="wrap">{cta_band('Start with a design visit', 'Pick a time that works for you. It takes about two minutes.', 'design.html', 'Book a design visit')}</div></section>'''
    return ctx.page('services.html', 'Services & Prices', 'Landscape design, native garden installs, lawn conversions, seasonal color and irrigation repair in Ocala, FL.', body)


def design(ctx):
    visit_types = [('consult', 'Design consultation', '90 minutes · $150, credited toward your install'),
                   ('lawn', 'Lawn conversion assessment', '60 minutes · $95, credited toward your install'),
                   ('check', 'Quick yard check', '30 minutes · free within 10 miles'),
                   ('hoa', 'HOA plan drawing', 'Remote · $120 · we draw to your HOA form')]
    vt = ''.join(f'<label class="choice"><input type="radio" name="visit" value="{v}" data-label="{esc(n)}"{" checked" if i == 0 else ""}><span><b>{esc(n)}</b><span class="small muted">{esc(d)}</span></span></label>' for i, (v, n, d) in enumerate(visit_types))
    goals = ['Use less water', 'Attract butterflies and birds', 'More privacy', 'Less mowing', 'Curb appeal for a sale', 'Shade']
    gl = ''.join(f'<label class="choice"><input type="checkbox" name="goals" value="{esc(g)}"><span>{esc(g)}</span></label>' for g in goals)
    body = page_hero('Book a design visit', 'Four short steps. You will get a confirmation email and a reminder the day before.', [('index.html', 'Home'), ('services.html', 'Services'), ('design.html', 'Book a visit')]) + f'''
<section class="section"><div class="wrap" style="max-width:860px">
  <ol class="stepper" data-stepper><li class="on">Visit type</li><li>Date and time</li><li>Your yard</li><li>Confirm</li></ol>
  <form data-booking novalidate>
    <fieldset class="bk-step" data-step="0" style="border:0;padding:0;margin:0"><legend class="sr">Visit type</legend>
      <h2 style="font-size:30px">What kind of visit?</h2><div class="choice-grid">{vt}</div></fieldset>

    <fieldset class="bk-step" data-step="1" hidden style="border:0;padding:0;margin:0"><legend class="sr">Date and time</legend>
      <h2 style="font-size:30px">Pick a day</h2><div class="slot-grid" data-days></div>
      <h3 style="margin-top:28px">Available times</h3><div class="slot-grid" data-times><p class="muted">Choose a day first.</p></div>
      <p class="err" data-slot-err hidden>Pick a day and a time to continue.</p></fieldset>

    <fieldset class="bk-step" data-step="2" hidden style="border:0;padding:0;margin:0"><legend class="sr">Your yard</legend>
      <h2 style="font-size:30px">Tell us about your yard</h2>
      <div class="field"><label for="b-addr">Street address</label><input id="b-addr" name="address" required autocomplete="street-address" placeholder="Where should we meet you?"></div>
      <div class="row2"><div class="field"><label for="b-size">Yard size</label><select id="b-size" name="size"><option>Under ¼ acre</option><option>¼ to ½ acre</option><option>½ to 1 acre</option><option>Over 1 acre</option></select></div>
      <div class="field"><label for="b-sun">Mostly</label><select id="b-sun" name="sun"><option>Full sun</option><option>Part shade</option><option>Shade under oaks</option><option>Not sure</option></select></div></div>
      <label style="display:block;margin:6px 0 10px">What matters most? <span class="muted small">(pick any)</span></label><div class="choice-grid">{gl}</div>
      <div class="field" style="margin-top:18px"><label for="b-photo">Photos of the yard <span class="muted small">(optional)</span></label><label class="upload" for="b-photo" style="font-weight:400;cursor:pointer"><span data-upload-text>Drop photos here or tap to choose. Up to 6.</span></label><input id="b-photo" type="file" accept="image/*" multiple class="sr"></div></fieldset>

    <fieldset class="bk-step" data-step="3" hidden style="border:0;padding:0;margin:0"><legend class="sr">Confirm</legend>
      <h2 style="font-size:30px">Almost done</h2>
      <div class="grid g2" style="gap:28px;align-items:start" id="bk-confirm">
        <div><div class="field"><label for="b-name">Your name</label><input id="b-name" name="name" required autocomplete="name"></div>
        <div class="field"><label for="b-email">Email</label><input id="b-email" name="email" type="email" required autocomplete="email"></div>
        <div class="field"><label for="b-phone">Mobile for a text reminder</label><input id="b-phone" name="phone" type="tel" autocomplete="tel"></div></div>
        <div class="summary-box"><h3 style="font-size:20px">Your visit</h3><dl data-summary></dl></div>
      </div></fieldset>

    <div class="btn-row" style="justify-content:space-between;margin-top:32px"><button class="btn ghost" type="button" data-back hidden>Back</button><span></span><button class="btn" type="button" data-next>Continue</button></div>
  </form>
  <div data-booked hidden class="success" tabindex="-1"><h3>You're booked</h3><p data-booked-text></p><p class="small muted">This is a demo site, so no booking was made and no email was sent.</p><button class="btn small" type="button" data-ics>Add to my calendar</button></div>
</div></section>
<style>@media (max-width:620px){{#bk-confirm{{grid-template-columns:1fr !important}}}}</style>'''
    return ctx.page('design.html', 'Book a Design Visit', 'Book a landscape design consultation in Ocala, FL online. Pick a time, tell us about your yard, and get a plan.', body)


LIB_MODAL = '''<div class="modal" data-plant-modal hidden role="dialog" aria-modal="true" aria-labelledby="pm-title">
  <div class="modal-box" style="width:min(100%,680px)">
    <div class="modal-head"><h2 id="pm-title" style="font-size:30px;margin:0" data-pm-name></h2><button class="icon-btn" type="button" data-close aria-label="Close">×</button></div>
    <div class="grid g2" style="gap:24px" id="pm-grid"><div class="art-tile" data-pm-art></div><div><p class="latin" data-pm-latin style="font-style:italic;color:var(--muted)"></p><p data-pm-blurb></p><dl class="summary-box" data-pm-facts style="display:grid;grid-template-columns:auto 1fr;gap:6px 14px"></dl></div></div>
    <form class="demo-form" novalidate style="margin-top:22px" data-success="Thanks, {name}. We set one aside at the front counter for 3 days.">
      <h3 style="font-size:20px">Hold one at the nursery</h3>
      <div class="row2"><div class="field"><label for="h-name">Name</label><input id="h-name" name="name" required></div><div class="field"><label for="h-phone">Phone</label><input id="h-phone" name="phone" type="tel" required></div></div>
      <button class="btn small" type="submit">Hold it for me</button>
    </form>
  </div>
</div>
<style>@media (max-width:620px){#pm-grid{grid-template-columns:1fr !important}}</style>'''


def plants(ctx):
    chips = '<button class="chip" type="button" data-cat="all" aria-pressed="true">All plants</button>' + ''.join(
        f'<button class="chip" type="button" data-cat="{c["id"]}" aria-pressed="false">{esc(c["name"])}</button>' for c in FF['categories'])
    body = page_hero('Plant library', 'Everything we grow, with honest notes on where it does well. Ask at the counter and we will walk you to it.', [('index.html', 'Home'), ('plants.html', 'Plant library')]) + f'''
<section class="section"><div class="wrap">
  <div class="toolbar"><div class="chips" role="group" aria-label="Filter by type">{chips}</div></div>
  <div class="toolbar">
    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
      <label class="sr" for="lib-q">Search plants</label><input id="lib-q" class="search" type="search" placeholder="Search by name" data-lib-q>
      <label class="sr" for="lib-light">Light</label><select id="lib-light" data-lib-light style="width:auto"><option value="">Any light</option><option>Full sun</option><option>Part shade</option><option>Shade</option></select>
      <label class="check" style="font-weight:500"><input type="checkbox" data-lib-native style="width:18px;height:18px;accent-color:var(--oak)"> Florida natives only</label>
    </div>
    <span class="count" data-lib-count aria-live="polite"></span>
  </div>
  <div class="grid g4" data-lib-grid></div>
</div></section>
{LIB_MODAL}'''
    return ctx.page('plants.html', 'Plant Library', 'Browse native and Florida-friendly plants grown at Fern & Field in Ocala, with light, water and size notes.', body)


def gallery(ctx):
    body = page_hero('Our work', 'A few recent yards around Marion County. Tap any project for a closer look.', [('index.html', 'Home'), ('gallery.html', 'Our work')]) + f'''
<section class="section"><div class="wrap">
  <h2>Before and after</h2><p class="muted" style="margin-bottom:24px">A Silver Springs Shores front lawn, converted in four days.</p>
  {before_after()}
</div></section>
<section class="section wash"><div class="wrap"><h2 style="margin-bottom:28px">Recent projects</h2>{gallery_grid()}</div></section>
{LIGHTBOX}'''
    return ctx.page('gallery.html', 'Our Work', 'Recent native garden installs, lawn conversions and design projects in Ocala and Marion County, FL.', body)


def workshops(ctx, buy=False):
    body = page_hero('Workshops', 'Saturday mornings at the nursery. Small groups, real plants, and you go home with something growing.', [('index.html', 'Home'), ('workshops.html', 'Workshops')]) + f'''
<section class="section"><div class="wrap" style="max-width:960px">{workshop_rows(None, buy)}
<p class="muted small" style="margin-top:22px">Coffee and pastries from the shop next door are on us. Workshops run rain or shine under the shade house.</p></div></section>
{RSVP_MODAL}'''
    return ctx.page('workshops.html', 'Garden Workshops', 'Hands-on gardening workshops in Ocala, FL: native plants, pruning, planters and kids classes.', body)


def team(ctx):
    body = page_hero('About us', 'Four people who would rather be outside. We have been planting Marion County yards since 2014.', [('index.html', 'Home'), ('team.html', 'About us')]) + f'''
<section class="section"><div class="wrap">{team_grid()}</div></section>
<section class="section wash"><div class="wrap">
  <div class="grid g2" style="gap:56px;align-items:center">
    <div><h2 data-edit>Started on a horse farm</h2><p data-edit>Dana grew up off Highway 326 watching her family fight the same losing battle every summer: thirsty grass, brown patches, and a water bill that kept climbing.</p><p data-edit>After 12 years at a wholesale native nursery she opened Fern &amp; Field to help homeowners do it differently. We still grow most of our natives on site, and we will always tell you when the cheaper option is the right one.</p></div>
    <div class="art-tile" style="padding:30px 60px 10px">{plant_art('liveoak', pot=False)}</div>
  </div>
</div></section>'''
    return ctx.page('team.html', 'About Us & Our Team', 'Meet the Fern & Field team: designers, installers and nursery staff in Ocala, FL.', body)


def journal(ctx):
    body = page_hero('Garden journal', 'Short, practical posts about gardening in Central Florida. New posts every other week.', [('index.html', 'Home'), ('journal.html', 'Journal')]) + f'''
<section class="section"><div class="wrap" style="max-width:980px">{posts()}</div></section>'''
    return ctx.page('journal.html', 'Garden Journal', 'Practical gardening advice for Ocala and Central Florida: natives, watering, frost and lawn conversion.', body)


def faq(ctx):
    body = page_hero('Questions we hear a lot', 'If yours isn\'t here, call us or send a message. A real person answers.', [('index.html', 'Home'), ('faq.html', 'FAQ')]) + f'''
<section class="section"><div class="wrap" style="max-width:820px">{faq_list()}</div></section>'''
    return ctx.page('faq.html', 'Frequently Asked Questions', 'Answers about delivery, plant guarantees, HOAs and when to plant in Ocala, FL.', body)


def contact(ctx):
    body = page_hero('Contact and hours', 'Call, stop by, or send a message. We reply within one business day.', [('index.html', 'Home'), ('contact.html', 'Contact')]) + f'''
<section class="section"><div class="wrap">
  <div class="grid" style="grid-template-columns:1.3fr 1fr;gap:56px" id="contact-grid">
    <div><h2 style="font-size:32px">Send a message</h2>{contact_form()}</div>
    <aside class="info"><div class="card"><h3>Visit the nursery</h3><p>{ADDRESS}</p><p><a href="tel:+13525550142">{PHONE}</a><br><a href="mailto:{EMAIL}">{EMAIL}</a></p>
    <p class="small muted">Plenty of parking. Wagons and a shaded seating area for kids and grandparents.</p></div></aside>
  </div>
</div></section>
<section class="section wash"><div class="wrap">{gbp_block(ctx.tier)}</div></section>
<style>@media (max-width:860px){{#contact-grid{{grid-template-columns:1fr !important}}}}</style>'''
    return ctx.page('contact.html', 'Contact & Hours', 'Contact Fern & Field Garden Co. in Ocala, FL. Hours, directions and a message form.', body)


def build():
    c = BETTER
    C.README[T] = readme(T, '$1,875',
        'A 10-page site for a business that takes bookings and wants to keep its own content fresh. It adds online booking, a filterable plant library, a project gallery, a workshop calendar and Google Business Profile features on top of everything in Good.',
        ['index.html — home with "plant this month" card and live open/closed status', 'services.html — services and process', 'design.html — 4-step booking flow', 'plants.html — filterable plant library',
         'gallery.html — before/after slider and project lightbox', 'workshops.html — event calendar with seat reservations', 'team.html — team and story', 'journal.html — blog', 'faq.html — questions', 'contact.html — form, map, live hours'],
        ['Everything in Good', 'Up to 10 pages', 'Content editor demo: the "Try the owner\'s editor" button shows how the owner edits text in place',
         'Online booking: 4-step visit booking with live time slots, photo upload, summary and add-to-calendar file',
         'Custom forms: workshop seat reservations, "hold this plant" requests', 'Google Business Profile features: live open/closed status, hours, map, review rating',
         'Filterable plant library with search and detail pop-ups', 'Project gallery with before/after slider and lightbox', 'Plant-of-the-month card that changes with the calendar'])
    return {'index.html': home(c), 'services.html': services(c), 'design.html': design(c), 'plants.html': plants(c), 'gallery.html': gallery(c),
            'workshops.html': workshops(c), 'team.html': team(c), 'journal.html': journal(c), 'faq.html': faq(c), 'contact.html': contact(c)}
