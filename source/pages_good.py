"""GOOD package: 5 pages, contact form, basic SEO."""
from pages_common import *  # noqa
import pages_common as C

T = 'good'
NAV = [('index.html', 'Home'), ('services.html', 'Services'), ('about.html', 'About'), ('faq.html', 'FAQ'), ('contact.html', 'Contact')]
CTA = ('contact.html', 'Get a free quote')
FOOT = [('Visit', [('contact.html', 'Directions'), ('about.html', 'Our story'), ('faq.html', 'Questions')]),
        ('Services', [('services.html', 'Landscape design'), ('services.html', 'Native installs'), ('services.html', 'Irrigation repair')]),
        ('Hours', [('contact.html', 'Mon–Thu 8–5'), ('contact.html', 'Fri 8–6 · Sat 7–4'), ('contact.html', 'Closed Sunday')])]


def page(name, title, desc, body, ld=False):
    return (head(f'{title} | Fern & Field Garden Co., Ocala FL', desc, T, name, local_business_ld(T) if ld else '') +
            '<body>' + demo_bar(T) + header(T, NAV, name, CTA) + '<main>' + body + '</main>' + footer(T, FOOT) +
            tail(['art.js', 'core.js']))


def home():
    body = f'''
<section class="hero"><div class="wrap">
  <div>
    <h1>Plants that thrive in Ocala sand.</h1>
    <p class="lede">Fern &amp; Field is a native plant nursery and landscape design shop in southeast Ocala. We help you plant a yard that survives August without a sprinkler running every day.</p>
    <div class="btn-row"><a class="btn" href="contact.html">Get a free quote</a><a class="btn ghost" href="services.html">See our services</a></div>
  </div>
  <div class="hero-art"><div class="sun"></div>{plant_art('firebush')}</div>
</div></section>

<section class="section wash"><div class="wrap">
  <div class="section-head"><div><h2>What we do</h2><p>Design, planting and the small fixes that keep a yard healthy.</p></div><a class="btn ghost small" href="services.html">All services</a></div>
  {service_cards(['design', 'native', 'irrigation'])}
</div></section>

<section class="section"><div class="wrap">
  <h2>How a project works</h2>
  <ol class="steps" style="margin-top:32px">
    <li><h3>Walk the yard</h3><p class="muted">We visit, check sun, soil and drainage, and listen to what you want from the space.</p></li>
    <li><h3>Get a plan</h3><p class="muted">You get a simple drawing, a plant list and a flat price. No surprises later.</p></li>
    <li><h3>Plant it</h3><p class="muted">Our crew installs everything in one to three days and leaves you a watering schedule.</p></li>
  </ol>
</div></section>

<section class="section wash"><div class="wrap">
  <h2>What neighbors say</h2>
  <div style="margin-top:32px">{reviews_block()}</div>
</div></section>

<section class="section tight"><div class="wrap">
  {cta_band('Ready for a yard that takes care of itself?', 'Tell us a little about your space and we will reply within one business day.', 'contact.html', 'Get a free quote')}
</div></section>'''
    return page('index.html', 'Native Plants & Landscape Design', 'Native plant nursery and landscape design in Ocala, FL. Florida-friendly yards that survive the summer heat with less water.', body, ld=True)


def services():
    body = page_hero('Services', 'Flat starting prices for the work we do most. Every quote is in writing before we start.') + f'''
<section class="section"><div class="wrap">
  {service_cards()}
  <p class="muted small" style="margin-top:28px">Prices are starting points for a typical Ocala lot. We confirm your exact price after a site visit.</p>
</div></section>
<section class="section tight"><div class="wrap">
  {cta_band('Not sure which one you need?', 'Send a few photos of your yard and we will point you in the right direction.', 'contact.html', 'Ask us')}
</div></section>'''
    return page('services.html', 'Services & Prices', 'Landscape design, native garden installs, lawn conversions and irrigation repair in Ocala, FL, with posted starting prices.', body)


def about():
    body = page_hero('About Fern &amp; Field', 'A small nursery with a simple idea: plant what already wants to grow here.') + f'''
<section class="section"><div class="wrap">
  <div class="grid g2" style="align-items:center;gap:56px">
    <div>
      <h2>Started on a horse farm</h2>
      <p>Dana Whitfield grew up off Highway 326 watching her family fight the same losing battle every summer: thirsty grass, brown patches, and a water bill that kept climbing.</p>
      <p>After 12 years at a wholesale native nursery, she opened Fern &amp; Field in 2014 to help homeowners do it differently. Today our team of four designs, plants and cares for yards all over Marion County.</p>
      <p>We still grow most of our natives on site, and we will always tell you when the cheaper option is the right one.</p>
    </div>
    <div class="art-tile" style="padding:30px 60px 10px">{plant_art('liveoak', pot=False)}</div>
  </div>
</div></section>
<section class="section wash"><div class="wrap">
  <h2>What we believe</h2>
  <div class="grid g3" style="margin-top:28px">
    <div class="card"><h3>Right plant, right place</h3><p class="muted">A plant that suits your soil and sun needs less water, less spraying and less of your weekend.</p></div>
    <div class="card"><h3>Straight answers</h3><p class="muted">Written quotes, flat prices, and a one-year guarantee on every plant we install.</p></div>
    <div class="card"><h3>Good for wildlife</h3><p class="muted">Native plants feed the butterflies, bees and birds that make a yard feel alive.</p></div>
  </div>
</div></section>'''
    return page('about.html', 'About Us', 'Fern & Field Garden Co. is a family-run native plant nursery and landscape design team in Ocala, Florida.', body)


def faq():
    body = page_hero('Questions we hear a lot', 'If yours isn\'t here, call us or send a message. A real person answers.') + f'''
<section class="section"><div class="wrap" style="max-width:820px">{faq_list()}</div></section>'''
    return page('faq.html', 'Frequently Asked Questions', 'Answers about delivery, plant guarantees, HOAs and when to plant in Ocala, FL.', body)


def contact():
    body = page_hero('Get a free quote', 'Tell us about your yard. We reply within one business day.') + f'''
<section class="section"><div class="wrap">
  <div class="grid" style="grid-template-columns:1.4fr 1fr;gap:56px" id="contact-grid">
    <div>{contact_form()}</div>
    <aside class="info">
      <div class="card"><h3>Visit the nursery</h3><p>{ADDRESS}</p><p><a href="tel:+13525550142">{PHONE}</a><br><a href="mailto:{EMAIL}">{EMAIL}</a></p>
      <h3 style="margin-top:22px">Hours</h3>{hours_dl()}</div>
    </aside>
  </div>
</div></section>
<style>@media (max-width:860px){{#contact-grid{{grid-template-columns:1fr !important}}}}</style>'''
    return page('contact.html', 'Contact Us', 'Contact Fern & Field Garden Co. in Ocala, FL for a free landscape quote.', body)


def build():
    C.README[T] = readme(T, '$950',
        'A clean, fast, mobile-first brochure site: everything a local service business needs to look professional and get calls and quote requests.',
        ['index.html — home', 'services.html — services with starting prices', 'about.html — story and values', 'faq.html — common questions', 'contact.html — quote request form, hours, address'],
        ['5 pages, built for phones first', 'Quote request form with friendly validation', 'Basic SEO: page titles and descriptions, social share tags, LocalBusiness structured data, sitemap.xml and robots.txt',
         'Click-to-call phone number and mailto link', 'Accessible: keyboard navigation, visible focus, reduced-motion support'])
    return {'index.html': home(), 'services.html': services(), 'about.html': about(), 'faq.html': faq(), 'contact.html': contact()}
