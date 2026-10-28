"""BEST package: everything in Better plus an online store, plant finder, rewards account, live chat and integrations."""
from pages_common import *  # noqa
import pages_common as C
import pages_better as B
from datetime import date

T = 'best'

TOOLS = f'''<div class="head-tools">
<button class="tool-btn" type="button" data-search-open aria-label="Search plants">{ICONS["search"]}</button>
<a class="tool-btn hide-sm" href="account.html" aria-label="Your account and rewards">{ICONS["user"]}</a>
<button class="tool-btn" type="button" data-cart-open aria-label="Open cart">{ICONS["bag"]}<span class="badge" data-cart-count data-n="0"></span></button>
</div>'''

PROMO = '<div class="promo">Free delivery in Marion County on orders over $150. <a href="design.html">Or book a design visit</a></div>'

DRAWER = f'''<div class="drawer-shade" data-drawer-shade hidden></div>
<aside class="drawer" data-drawer aria-label="Cart" aria-hidden="true">
  <div class="drawer-head"><h2>Your cart</h2><button class="icon-btn" type="button" data-cart-close aria-label="Close cart">×</button></div>
  <div class="drawer-body" data-drawer-items></div>
  <div class="drawer-foot" data-drawer-foot></div>
</aside>
<div class="search-overlay" data-search hidden role="dialog" aria-modal="true" aria-label="Search">
  <div class="search-box"><label class="sr" for="s-q">Search plants and pages</label><input id="s-q" type="search" placeholder="Search plants, workshops, services…" autocomplete="off" data-search-q>
  <ul class="search-results" data-search-results></ul></div>
</div>
<button class="chat-fab" type="button" data-chat-open aria-label="Chat with the nursery">{ICONS["chat"]}</button>
<section class="chat" data-chat hidden aria-label="Chat">
  <div class="chat-head"><div><b>Ask the nursery</b><small>Priya usually replies in a few minutes</small></div><button type="button" data-chat-close aria-label="Close chat">×</button></div>
  <div class="chat-log" data-chat-log aria-live="polite"></div>
  <div class="quick" data-chat-quick></div>
  <form data-chat-form><label class="sr" for="chat-in">Message</label><input id="chat-in" placeholder="Type a question" autocomplete="off"><button class="btn small" type="submit">Send</button></form>
</section>'''

BEST = B.Ctx(
    T,
    [('shop.html', 'Shop plants'), ('services.html', 'Services'), ('gallery.html', 'Our work'), ('workshops.html', 'Workshops'), ('team.html', 'About us')],
    None,
    [('Shop', [('shop.html', 'All plants'), ('shop.html?cat=natives', 'Florida natives'), ('shop.html?cat=houseplants', 'Houseplants'), ('finder.html', 'Plant finder quiz')]),
     ('Services', [('design.html', 'Book a design visit'), ('services.html', 'All services'), ('workshops.html', 'Workshops'), ('journal.html', 'Garden journal')]),
     ('Help', [('account.html', 'Your account'), ('faq.html', 'Delivery and returns'), ('contact.html', 'Contact and hours'), ('team.html', 'About us')])],
    ['art.js', 'data.js', 'core.js', 'site.js', 'store.js'],
    tools=TOOLS, extra_body=B.EDIT_FAB + DRAWER, promo=PROMO,
)


def zip_box(title='Do we deliver to you?'):
    return f'''<div class="zip-check"><h3 style="font-size:20px;margin-bottom:10px">{title}</h3>
<form data-zip novalidate><label class="sr" for="zip-{title[:3]}">ZIP code</label><input id="zip-{title[:3]}" inputmode="numeric" maxlength="5" placeholder="ZIP code" autocomplete="postal-code"><button class="btn small" type="submit">Check</button></form>
<p class="zip-result" data-zip-out aria-live="polite">Same-day pickup is always free at the nursery.</p></div>'''


def shop_cards_static(ids):
    out = ''
    for pid in ids:
        p = PLANTS[pid]
        out += f'''<article class="plant-card"><a class="pic" href="product.html?id={pid}" style="display:block">{plant_art(pid)}<span class="tag">${p["price"]}</span></a>
<div class="body"><h3><a href="product.html?id={pid}" style="text-decoration:none">{esc(p["name"])}</a></h3><div class="latin">{esc(p["latin"])}</div>
<div class="facts">{'<span class="fact native">Florida native</span>' if p["native"] else ''}<span class="fact">{p["light"]}</span></div>
<div class="add"><span class="stock{' low' if p['stock'] < 10 else ''}">{p["stock"]} in stock</span><button class="btn small" type="button" data-add="{pid}">Add to cart</button></div></div></article>'''
    return f'<div class="grid g4">{out}</div>'


def months_row():
    now = date.today().month - 1
    return '<p class="months-label">See what to plant in another month</p><div class="months" role="group" aria-label="Choose a month">' + ''.join(
        f'<button type="button" data-month="{i}" aria-pressed="{"true" if i == now else "false"}" aria-label="{m["m"]}">{m["m"][:3]}</button>' for i, m in enumerate(FF['months'])) + '</div>'


def home(ctx):
    cats = [('natives', 'Florida natives', 'firebush'), ('pollinator', 'Pollinator plants', 'coreopsis'), ('shrubs', 'Shrubs and hedges', 'stopper'), ('houseplants', 'Houseplants', 'monstera')]
    cat_tiles = ''.join(f'<a class="plant-card" href="shop.html?cat={c}"><div class="pic">{plant_art(pid)}</div><div class="body"><h3>{n}</h3><span class="muted small">Shop {n.lower()}</span></div></a>' for c, n, pid in cats)
    body = f'''
<section class="packet-hero"><div class="wrap">
  <div>
    <h1 data-edit>Plant what already wants to grow here.</h1>
    <p class="lede" data-edit>Order natives online for pickup today or delivery anywhere in Marion County, or have a designer plan the whole yard.</p>
    <div class="btn-row"><a class="btn" href="shop.html">Shop plants</a><a class="btn ghost" href="finder.html">Take the plant finder quiz</a></div>
    {B.open_line()}
    {months_row()}
  </div>
  {B.packet(store=True)}
</div></section>

<section class="section wash"><div class="wrap">
  <div class="section-head"><div><h2>Shop by what you need</h2><p>About 400 varieties at the nursery. These are the ones people ask for most.</p></div><a class="btn ghost small" href="shop.html">Shop all plants</a></div>
  <div class="grid g4">{cat_tiles}</div>
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head"><div><h2>Selling fast this week</h2><p>Stock counts update from the register every few minutes.</p></div><a class="btn ghost small" href="shop.html">See everything</a></div>
  {shop_cards_static(['firebush', 'muhly', 'beautyberry', 'monstera'])}
</div></section>

<section class="section tight"><div class="wrap">
  <div class="grid g2" style="gap:28px;align-items:stretch" id="home-duo">
    <div class="reward-card"><h3>Not sure what to plant?</h3><p style="color:var(--on-oak-muted)">Answer four quick questions about your yard and get a shortlist that will actually grow there.</p><a class="btn gold" href="finder.html">Start the plant finder</a></div>
    {zip_box()}
  </div>
</div></section>

<section class="section wash"><div class="wrap">
  <div class="section-head"><div><h2>Or let us plant it for you</h2><p>A Silver Springs Shores front lawn, converted in four days. Drag to compare.</p></div><a class="btn ghost small" href="design.html">Book a design visit</a></div>
  {B.before_after()}
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head"><div><h2>Workshops</h2><p>Buy tickets online. Small groups, hands in the dirt.</p></div><a class="btn ghost small" href="workshops.html">Full calendar</a></div>
  {B.workshop_rows(3, buy=True)}
</div></section>

<section class="section wash"><div class="wrap">
  <h2>Find us, or see what neighbors say</h2>
  <div style="margin:32px 0 44px">{B.gbp_block(ctx.tier)}</div>
  {reviews_block(stars=True)}
</div></section>

<section class="section tight"><div class="wrap">
  <div class="cta-band"><div><h2>The planting calendar, in your inbox</h2><p>One short email a month: what to plant, what to prune, and member-only sale days.</p></div>
  <form class="demo-form signup" novalidate data-success="You're on the list, {{name}}. Look for the first email on the 1st."><input type="hidden" name="name" value="friend"><label class="sr" for="nl">Email</label><input id="nl" name="email" type="email" required placeholder="you@example.com"><button class="btn gold" type="submit">Sign up</button></form></div>
</div></section>
{B.RSVP_MODAL}
<style>@media (max-width:860px){{#home-duo{{grid-template-columns:1fr !important}}}}</style>'''
    return ctx.page('index.html', 'Native Plant Nursery & Online Plant Shop', 'Shop native and Florida-friendly plants online from Fern & Field in Ocala, FL. Same-day pickup, Marion County delivery, and landscape design.', body, ld=True)


def shop(ctx):
    cats = ''.join(f'<label class="check"><input type="checkbox" name="cat" value="{c["id"]}"> {esc(c["name"])}</label>' for c in FF['categories'])
    body = page_hero('Shop plants', 'Grown or hand-picked for Central Florida. Order by 2 pm for same-day pickup.', [('index.html', 'Home'), ('shop.html', 'Shop')]) + f'''
<section class="section" style="padding-top:44px"><div class="wrap">
  <div class="shop">
    <aside class="filters" id="filters" aria-label="Filters" data-filters>
      <h3>Type</h3>{cats}
      <h3>Light</h3>
      <label class="check"><input type="checkbox" name="light" value="Full sun"> Full sun</label>
      <label class="check"><input type="checkbox" name="light" value="Part shade"> Part shade</label>
      <label class="check"><input type="checkbox" name="light" value="Shade"> Shade</label>
      <h3>Water needs</h3>
      <label class="check"><input type="checkbox" name="water" value="Low"> Low</label>
      <label class="check"><input type="checkbox" name="water" value="Medium"> Medium</label>
      <h3>Good to know</h3>
      <label class="check"><input type="checkbox" name="native"> Florida natives only</label>
      <label class="check"><input type="checkbox" name="pollinator"> Feeds pollinators</label>
      <label class="check"><input type="checkbox" name="instock"> In stock now</label>
      <h3><label for="maxp">Price up to</label></h3>
      <input id="maxp" type="range" name="max" min="10" max="130" step="5" value="130"><div class="range-out" data-max-out>$130</div>
      <button class="link-btn" type="button" data-clear style="margin-top:14px">Clear all filters</button>
    </aside>
    <div>
      <div class="toolbar">
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
          <button class="btn ghost small filters-toggle" type="button" data-filters-toggle aria-controls="filters" aria-expanded="false">Filters</button>
          <label class="sr" for="shop-q">Search</label><input id="shop-q" type="search" class="search" placeholder="Search plants" data-shop-q>
        </div>
        <div style="display:flex;gap:12px;align-items:center"><span class="count" data-shop-count aria-live="polite"></span>
        <label class="sr" for="sort">Sort</label><select id="sort" data-sort style="width:auto"><option value="pop">Most popular</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="az">Name A–Z</option></select></div>
      </div>
      <div class="grid g3" data-shop-grid></div>
    </div>
  </div>
</div></section>'''
    return ctx.page('shop.html', 'Shop Native Plants Online', 'Buy native and Florida-friendly plants online in Ocala, FL. Filter by sun, water and type. Pickup or Marion County delivery.', body)


def product(ctx):
    body = f'''<section class="section" style="padding-top:40px"><div class="wrap">
  <div class="crumbs" data-crumbs><a href="index.html">Home</a> / <a href="shop.html">Shop</a></div>
  <div class="product" data-product><p class="muted">Loading plant…</p></div>
</div></section>
<section class="section wash"><div class="wrap"><h2 style="margin-bottom:28px">Pairs well with</h2><div class="grid g4" data-related></div></div></section>'''
    return ctx.page('product.html', 'Plant Details', 'Plant details, care notes and stock at Fern & Field Garden Co. in Ocala, FL.', body)


def cart(ctx):
    body = page_hero('Your cart', 'Pickup is free and usually ready within two hours.', [('index.html', 'Home'), ('shop.html', 'Shop'), ('cart.html', 'Cart')]) + f'''
<section class="section"><div class="wrap"><div class="checkout"><div data-cart-page></div><div class="order-box"><div class="summary-box" data-cart-summary></div><div style="margin-top:20px">{zip_box('Check delivery')}</div></div></div></div></section>'''
    return ctx.page('cart.html', 'Cart', 'Your cart at Fern & Field Garden Co.', body)


def checkout(ctx):
    body = page_hero('Checkout', 'Secure checkout. Your order goes straight to the nursery team.', [('index.html', 'Home'), ('cart.html', 'Cart'), ('checkout.html', 'Checkout')]) + f'''
<section class="section"><div class="wrap">
  <div class="checkout" data-checkout>
    <form data-checkout-form novalidate>
      <fieldset><legend>How do you want it?</legend>
        <div class="choice-grid" style="margin-bottom:16px">
          <label class="choice"><input type="radio" name="ship" value="pickup" checked><span><b>Pickup at the nursery</b><span class="small muted">Free · ready in about 2 hours</span></span></label>
          <label class="choice"><input type="radio" name="ship" value="delivery"><span><b>Local delivery</b><span class="small muted">Marion County · free over $150</span></span></label>
        </div>
        <div data-pickup-fields><div class="field"><label for="c-slot">Pickup time</label><select id="c-slot" data-pickup-slot></select></div></div>
        <div data-delivery-fields hidden>
          <div class="field"><label for="c-addr">Street address</label><input id="c-addr" name="addr" autocomplete="street-address"></div>
          <div class="row2"><div class="field"><label for="c-city">City</label><input id="c-city" name="city" value="Ocala" autocomplete="address-level2"></div><div class="field"><label for="c-zip">ZIP</label><input id="c-zip" name="zip" inputmode="numeric" maxlength="5" autocomplete="postal-code"></div></div>
          <p class="small" data-ship-note></p>
        </div>
      </fieldset>
      <fieldset><legend>Your details</legend>
        <div class="row2"><div class="field"><label for="c-name">Full name</label><input id="c-name" name="name" required autocomplete="name"></div><div class="field"><label for="c-phone">Mobile</label><input id="c-phone" name="phone" type="tel" required autocomplete="tel"></div></div>
        <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" required autocomplete="email"></div>
        <label class="check" style="margin-bottom:14px"><input type="checkbox" checked> Text me when my order is ready</label>
      </fieldset>
      <fieldset><legend>Payment</legend>
        <p class="secure">{ICONS["lock"]} Demo checkout. Don't enter a real card. On a live site, payment runs through Square and the order appears on the nursery's register.</p>
        <div class="pay-mock"><div class="field"><label for="c-card">Card number</label><input id="c-card" inputmode="numeric" placeholder="4242 4242 4242 4242" data-card required autocomplete="off"></div>
        <div class="field"><label for="c-exp">Expiry</label><input id="c-exp" placeholder="MM / YY" data-exp required autocomplete="off"></div>
        <div class="field"><label for="c-cvc">CVC</label><input id="c-cvc" inputmode="numeric" maxlength="4" placeholder="123" required autocomplete="off"></div></div>
        <label class="check" style="margin-bottom:12px"><input type="checkbox" data-use-points> Use my rewards balance <span class="muted small" data-points-label></span></label>
      </fieldset>
      <button class="btn" type="submit" style="width:100%;padding:16px" data-place>Place order</button>
    </form>
    <aside class="order-box"><div class="summary-box" data-checkout-summary></div></aside>
  </div>
  <div data-order-done hidden class="success" tabindex="-1" style="max-width:720px"></div>
</div></section>'''
    return ctx.page('checkout.html', 'Checkout', 'Checkout at Fern & Field Garden Co.', body)


def account(ctx):
    body = page_hero('Hi, Sam', 'Your orders, saved plants and rewards in one place. (Demo account.)', [('index.html', 'Home'), ('account.html', 'Account')]) + f'''
<section class="section"><div class="wrap">
  <div class="grid" style="grid-template-columns:340px 1fr;gap:40px;align-items:start" id="acct">
    <div class="reward-card"><h3>Fern &amp; Field Rewards</h3><div class="points" data-points>0</div><div style="color:var(--on-oak-muted)">points</div>
      <div class="progress"><div data-points-bar style="width:0"></div></div><p class="small" style="color:var(--on-oak-muted)" data-points-next></p>
      <p class="small" style="color:var(--on-oak-muted);margin:0">1 point per dollar. 500 points = $25 off.</p></div>
    <div>
      <div class="tabs" role="tablist">
        <button role="tab" aria-selected="true" aria-controls="t-orders" id="tb-orders">Orders</button>
        <button role="tab" aria-selected="false" aria-controls="t-wish" id="tb-wish" tabindex="-1">Saved plants</button>
        <button role="tab" aria-selected="false" aria-controls="t-care" id="tb-care" tabindex="-1">Care reminders</button>
      </div>
      <div role="tabpanel" id="t-orders" aria-labelledby="tb-orders" data-orders></div>
      <div role="tabpanel" id="t-wish" aria-labelledby="tb-wish" hidden><div class="grid g3" data-wish></div></div>
      <div role="tabpanel" id="t-care" aria-labelledby="tb-care" hidden data-care></div>
    </div>
  </div>
</div></section>
<style>@media (max-width:860px){{#acct{{grid-template-columns:1fr !important}}}}</style>'''
    return ctx.page('account.html', 'Your Account', 'Your Fern & Field orders, saved plants and rewards.', body)


def finder(ctx):
    body = page_hero('Plant finder', 'Four questions about your yard. You get a shortlist of plants that will grow there.', [('index.html', 'Home'), ('shop.html', 'Shop'), ('finder.html', 'Plant finder')]) + '''
<section class="section"><div class="wrap"><div class="quiz" data-quiz></div><div data-quiz-results></div></div></section>'''
    return ctx.page('finder.html', 'Plant Finder Quiz', 'Find plants that will thrive in your Ocala yard: answer four questions about sun, water and goals.', body)


def build():
    c = BEST
    C.README[T] = readme(T, 'from $3,100',
        'A full online store and customer experience on top of everything in Better: shoppers can find, filter, buy and pick up plants, buy workshop tickets, earn rewards and get answers from a chat widget, with integrations to the point of sale.',
        ['index.html — home with interactive planting calendar', 'shop.html — store with filters, search and sort', 'product.html — product details (?id=)', 'cart.html — cart', 'checkout.html — pickup or delivery checkout',
         'account.html — orders, saved plants, rewards, care reminders', 'finder.html — plant finder quiz', 'services.html, design.html, gallery.html, workshops.html, team.html, journal.html, faq.html, contact.html — as in Better'],
        ['Everything in Better', 'Online store: 16 products, filters, search, sort, stock counts, wishlist', 'Cart drawer with free-delivery progress bar, and a full checkout with pickup times or delivery',
         'Delivery ZIP checker for Marion County', 'Workshop tickets go into the same cart', 'Customer account with rewards points, order history, saved plants and care reminders',
         'Plant finder quiz with scored recommendations', 'Site-wide instant search', 'Chat widget with quick answers', 'Integration touchpoints: payments (Square), live stock from the register, text-when-ready notifications',
         'Interactive month-by-month planting calendar on the home page'])
    pages = {'index.html': home(c), 'shop.html': shop(c), 'product.html': product(c), 'cart.html': cart(c), 'checkout.html': checkout(c), 'account.html': account(c), 'finder.html': finder(c),
             'services.html': B.services(c), 'design.html': B.design(c), 'gallery.html': B.gallery(c), 'workshops.html': B.workshops(c, buy=True), 'team.html': B.team(c),
             'journal.html': B.journal(c), 'faq.html': B.faq(c), 'contact.html': B.contact(c)}
    return pages
