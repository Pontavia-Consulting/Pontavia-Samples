/* Fern & Field Garden Co. sample data. Fictional business, demo content only. */
window.FF = {
  plants: [
    { id: 'firebush', name: 'Firebush', latin: 'Hamelia patens', cats: ['natives', 'pollinator', 'shrubs'], price: 24, size: '3 gal', light: 'Full sun', water: 'Low', native: true, pollinator: true, stock: 18, height: '6–10 ft', bloom: 'Late spring to frost',
      blurb: 'The hummingbird magnet of Central Florida yards. Orange-red tubular flowers from May until the first cold snap, and it shrugs off August heat.',
      art: { type: 'spike', seed: 11, colors: { bloom: '#D9452B', bloom2: '#F07A3A' } } },
    { id: 'coontie', name: 'Coontie', latin: 'Zamia integrifolia', cats: ['natives', 'shrubs'], price: 29, size: '3 gal', light: 'Part shade', water: 'Low', native: true, pollinator: false, stock: 9, height: '2–3 ft', bloom: 'Cones in fall',
      blurb: 'A slow, tidy native cycad that handles deep shade and dry sand under oaks. The only host plant for the Atala butterfly. Toxic if eaten, so keep it away from curious pets.',
      art: { type: 'frond', seed: 4, leaf: 'deep' } },
    { id: 'beautyberry', name: 'American beautyberry', latin: 'Callicarpa americana', cats: ['natives', 'shrubs', 'pollinator'], price: 22, size: '3 gal', light: 'Part shade', water: 'Medium', native: true, pollinator: true, stock: 14, height: '4–6 ft', bloom: 'Berries Aug–Nov',
      blurb: 'Loose arching branches that load up with violet berry clusters in late summer. Mockingbirds and cardinals clean it out by winter.',
      art: { type: 'shrub', seed: 9, colors: { bloom: '#8E4F9E', bloom2: '#A866B8' } } },
    { id: 'muhly', name: 'Pink muhly grass', latin: 'Muhlenbergia capillaris', cats: ['natives', 'grasses'], price: 14, size: '1 gal', light: 'Full sun', water: 'Low', native: true, pollinator: false, stock: 40, height: '3 ft', bloom: 'Pink haze Oct–Nov',
      blurb: 'Fine green clumps most of the year, then a pink cloud every October. Plant it in groups of five or more where the evening sun can light it up.',
      art: { type: 'grass', seed: 21, leaf: 'olive', colors: { bloom: '#D98AB5' } } },
    { id: 'gaillardia', name: 'Blanket flower', latin: 'Gaillardia pulchella', cats: ['natives', 'pollinator'], price: 9, size: '1 gal', light: 'Full sun', water: 'Low', native: true, pollinator: true, stock: 52, height: '1–2 ft', bloom: 'Spring to fall',
      blurb: 'Red and yellow daisies that grow in straight sand. Nearly impossible to kill, and it reseeds itself into the bare spots.',
      art: { type: 'flower', seed: 5, colors: { bloom: '#C8382A', bloom2: '#E8B21C', eye: '#5A2A1A' } } },
    { id: 'coreopsis', name: 'Leavenworth\'s tickseed', latin: 'Coreopsis leavenworthii', cats: ['natives', 'pollinator'], price: 8, size: '1 gal', light: 'Full sun', water: 'Medium', native: true, pollinator: true, stock: 36, height: '2–3 ft', bloom: 'Spring and summer',
      blurb: 'Florida\'s state wildflower in its local form. Bright yellow blooms on airy stems, loved by small native bees.',
      art: { type: 'flower', seed: 2, colors: { bloom: '#F2B705', bloom2: '#E8A400' } } },
    { id: 'palmetto', name: 'Saw palmetto', latin: 'Serenoa repens', cats: ['natives', 'shrubs'], price: 39, size: '3 gal', light: 'Full sun', water: 'Low', native: true, pollinator: true, stock: 7, height: '4–6 ft', bloom: 'Spring',
      blurb: 'The backbone of old Florida scrub. Fan fronds, almost no care once rooted, and spring flowers the bees go wild for.',
      art: { type: 'frond', seed: 17, leaf: 'blue' } },
    { id: 'fakahatchee', name: 'Fakahatchee grass', latin: 'Tripsacum dactyloides', cats: ['natives', 'grasses'], price: 16, size: '3 gal', light: 'Full sun', water: 'Medium', native: true, pollinator: false, stock: 22, height: '4 ft', bloom: 'Summer',
      blurb: 'A big, soft fountain of a grass that fills a corner fast and hides an AC unit or a pool pump with style.',
      art: { type: 'grass', seed: 33, leaf: 'green' } },
    { id: 'firespike', name: 'Firespike', latin: 'Odontonema strictum', cats: ['pollinator', 'shrubs'], price: 18, size: '3 gal', light: 'Part shade', water: 'Medium', native: false, pollinator: true, stock: 15, height: '4–6 ft', bloom: 'Fall and winter',
      blurb: 'Glossy leaves and red flower spikes in fall, right when migrating hummingbirds pass through. One of the few bloomers that likes shade.',
      art: { type: 'spike', seed: 41, leaf: 'deep', colors: { bloom: '#C21F3A', bloom2: '#E0354F' } } },
    { id: 'porterweed', name: 'Blue porterweed', latin: 'Stachytarpheta jamaicensis', cats: ['natives', 'pollinator'], price: 10, size: '1 gal', light: 'Full sun', water: 'Low', native: true, pollinator: true, stock: 28, height: '2–3 ft', bloom: 'Most of the year',
      blurb: 'The low native porterweed, not the invasive tall one. Small blue flowers that open a few at a time all year, a butterfly favorite.',
      art: { type: 'spike', seed: 8, colors: { bloom: '#3E5FB8', bloom2: '#5B7BD1' } } },
    { id: 'liveoak', name: 'Southern live oak', latin: 'Quercus virginiana', cats: ['natives', 'trees'], price: 129, size: '15 gal', light: 'Full sun', water: 'Medium', native: true, pollinator: false, stock: 4, height: '40–60 ft', bloom: 'Acorns in fall',
      blurb: 'The tree Ocala is known for. Plant it 30 feet from the house and your grandkids will thank you for the shade.',
      art: { type: 'tree', seed: 3, pot: false, colors: { moss: '#A9B8A6' } } },
    { id: 'stopper', name: 'Simpson\'s stopper', latin: 'Myrcianthes fragrans', cats: ['natives', 'shrubs', 'pollinator'], price: 34, size: '3 gal', light: 'Full sun', water: 'Low', native: true, pollinator: true, stock: 11, height: '6–15 ft', bloom: 'Spring flowers, orange berries',
      blurb: 'A native hedge with peeling cinnamon bark, fragrant white flowers and orange berries. A good replacement for a ligustrum hedge.',
      art: { type: 'shrub', seed: 27, leaf: 'deep', colors: { bloom: '#F4F1E6', bloom2: '#E57A2E' } } },
    { id: 'aloe', name: 'Aloe vera', latin: 'Aloe barbadensis', cats: ['succulents'], price: 12, size: '6 in', light: 'Full sun', water: 'Low', native: false, pollinator: false, stock: 30, height: '1–2 ft', bloom: 'Winter spikes',
      blurb: 'Lives on a sunny porch for years with almost no water. Keep it out of our summer downpours in a pot that drains well.',
      art: { type: 'succulent', seed: 12, leaf: 'silver', potColor: '#C9A27A' } },
    { id: 'snake', name: 'Snake plant', latin: 'Dracaena trifasciata', cats: ['houseplants'], price: 28, size: '8 in', light: 'Shade', water: 'Low', native: false, pollinator: false, stock: 19, height: '2–3 ft', bloom: 'Rarely',
      blurb: 'The houseplant for people who forget about houseplants. Low light, water once a month, still looks sharp.',
      art: { type: 'broad', seed: 31, leaf: 'olive', potColor: '#2F4A3A', rimColor: '#24392C' } },
    { id: 'monstera', name: 'Monstera', latin: 'Monstera deliciosa', cats: ['houseplants'], price: 38, size: '10 in', light: 'Part shade', water: 'Medium', native: false, pollinator: false, stock: 8, height: '3–6 ft indoors', bloom: 'Rarely indoors',
      blurb: 'Big split leaves that make a room. Bright window, no direct afternoon sun, and a moss pole once it starts to climb.',
      art: { type: 'broad', seed: 15, leaf: 'deep', potColor: '#E8E1D3', rimColor: '#D8CFBC' } },
    { id: 'bird', name: 'White bird of paradise', latin: 'Strelitzia nicolai', cats: ['shrubs'], price: 45, size: '7 gal', light: 'Full sun', water: 'Medium', native: false, pollinator: false, stock: 6, height: '10–20 ft', bloom: 'Summer',
      blurb: 'Tropical paddle leaves for a pool deck or entry. Covers it with a sheet on the few nights we drop below freezing.',
      art: { type: 'broad', seed: 44, leaf: 'blue' } }
  ],

  categories: [
    { id: 'natives', name: 'Florida natives' },
    { id: 'pollinator', name: 'Pollinator plants' },
    { id: 'shrubs', name: 'Shrubs and hedges' },
    { id: 'grasses', name: 'Grasses' },
    { id: 'trees', name: 'Trees' },
    { id: 'succulents', name: 'Succulents' },
    { id: 'houseplants', name: 'Houseplants' }
  ],

  // What to plant each month in Ocala (USDA zone 9a)
  months: [
    { m: 'January', plant: 'coontie', note: 'Cool and dry. Plant shrubs and trees now so roots settle before spring.' },
    { m: 'February', plant: 'liveoak', note: 'Best tree-planting window of the year. Last frost is usually mid-February.' },
    { m: 'March', plant: 'coreopsis', note: 'Wildflowers go in now. Mulch before the dry season peaks in April.' },
    { m: 'April', plant: 'gaillardia', note: 'Our driest month. Pick drought-proof bloomers and water new plants twice a week.' },
    { m: 'May', plant: 'firebush', note: 'Heat lovers go in. Firebush and porterweed root fast in warm soil.' },
    { m: 'June', plant: 'porterweed', note: 'Rainy season starts. Free irrigation every afternoon, so plant away.' },
    { m: 'July', plant: 'fakahatchee', note: 'Plant early in the morning. Grasses fill in fast with summer rain.' },
    { m: 'August', plant: 'beautyberry', note: 'Berries are coloring up. A good month to plan a fall native bed.' },
    { m: 'September', plant: 'firespike', note: 'Plant for the hummingbird migration in October.' },
    { m: 'October', plant: 'muhly', note: 'Muhly turns pink. The best month to start almost anything.' },
    { m: 'November', plant: 'stopper', note: 'Cool nights, warm days. Ideal for hedges and screening.' },
    { m: 'December', plant: 'palmetto', note: 'Quiet month. Plant palms and cycads and check your irrigation timer.' }
  ],

  services: [
    { id: 'design', name: 'Landscape design consultation', price: 'From $150', time: '90 minutes on site',
      text: 'We walk your yard, test the soil, note sun and drainage, and leave you with a sketched plan and plant list. The fee is credited if we install it.' },
    { id: 'native', name: 'Native garden installation', price: 'From $1,800', time: '1–3 days',
      text: 'Beds cut, soil amended, plants placed by a designer, mulched and watered in. Built to live on rainfall after the first summer.' },
    { id: 'lawn', name: 'Lawn-to-garden conversion', price: 'From $2,400', time: '2–4 days',
      text: 'Swap thirsty St. Augustine for native groundcovers and beds. Most clients cut their irrigation bill by half.' },
    { id: 'color', name: 'Seasonal color planting', price: 'From $250', time: 'Half day',
      text: 'Fresh color in your containers and front beds four times a year, timed to what thrives each season.' },
    { id: 'irrigation', name: 'Irrigation check and repair', price: '$95 visit', time: '1 hour',
      text: 'We run every zone, fix broken heads, and set the timer to the current watering rules for Marion County.' },
    { id: 'care', name: 'Tree and shrub care', price: 'From $120', time: 'Varies',
      text: 'Pruning that follows the plant\'s shape, not a hedge-trimmer haircut. We also treat for scale and fungus.' }
  ],

  workshops: [
    { id: 'w1', date: '2026-11-07', time: '9:00 AM', title: 'Native plants for sandy soil', seats: 14, price: 15, length: '90 min',
      text: 'Which natives thrive in Marion County sand, how to prep a bed, and how to keep them alive the first summer.' },
    { id: 'w2', date: '2026-11-14', time: '10:00 AM', title: 'Build a hummingbird corner', seats: 6, price: 25, length: '2 hrs',
      text: 'Plant a container with firebush, firespike and porterweed. You take it home.' },
    { id: 'w3', date: '2026-11-21', time: '9:00 AM', title: 'Pruning without the hedge trimmer', seats: 10, price: 15, length: '90 min',
      text: 'Hands-on pruning of crape myrtles, viburnum and hollies, the right way.' },
    { id: 'w4', date: '2026-12-05', time: '10:00 AM', title: 'Holiday porch planters', seats: 3, price: 40, length: '2 hrs',
      text: 'Make a cool-season planter for your front steps. Pot, soil and plants included.' },
    { id: 'w5', date: '2026-12-12', time: '9:00 AM', title: 'Kids in the garden: seed bombs', seats: 18, price: 5, length: '1 hr',
      text: 'A messy, muddy hour for ages 5 to 12. Every kid takes home a wildflower seed bomb.' }
  ],

  team: [
    { name: 'Dana Whitfield', role: 'Owner and lead designer', bio: 'Grew up on a horse farm off Highway 326 and spent 12 years at a wholesale native nursery before opening Fern & Field.', fav: 'firebush' },
    { name: 'Marco Reyes', role: 'Installation crew lead', bio: 'Runs every install from first stake to last bag of mulch. Knows Marion County soil types by touch.', fav: 'palmetto' },
    { name: 'Priya Natarajan', role: 'Nursery manager', bio: 'Keeps 400 varieties alive through August. Ask her anything about houseplants or bugs.', fav: 'monstera' },
    { name: 'Hank Delaney', role: 'Irrigation tech', bio: 'Thirty years fixing sprinkler systems. Will tell you honestly when you don\'t need a new one.', fav: 'muhly' }
  ],

  projects: [
    { title: 'Front yard native makeover', area: 'SE Ocala', kind: 'Lawn conversion', plants: ['muhly', 'gaillardia', 'stopper'] },
    { title: 'Shady oak hammock bed', area: 'Silver Springs Shores', kind: 'Native install', plants: ['coontie', 'beautyberry', 'firespike'] },
    { title: 'Pool deck tropical screen', area: 'Golden Ocala', kind: 'Design and install', plants: ['bird', 'fakahatchee', 'aloe'] },
    { title: 'Pollinator meadow', area: 'Reddick horse farm', kind: 'Native install', plants: ['coreopsis', 'porterweed', 'gaillardia'] },
    { title: 'Courtyard container garden', area: 'Downtown Ocala', kind: 'Seasonal color', plants: ['snake', 'monstera', 'aloe'] },
    { title: 'Hummingbird border', area: 'Belleview', kind: 'Native install', plants: ['firebush', 'firespike', 'porterweed'] }
  ],

  posts: [
    { id: 'p1', title: 'Why your St. Augustine dies every April', date: 'Oct 14, 2026', mins: 4,
      text: 'April is the driest month in Marion County, and turf grass on deep sand needs more water than our watering rules allow. Here is what to plant instead, and how to transition one section at a time.' },
    { id: 'p2', title: 'Five natives that bloom through August heat', date: 'Sep 30, 2026', mins: 3,
      text: 'Firebush, porterweed, blanket flower, tickseed and beautyberry. Plant them once, water them the first summer, and they carry on through the worst of it.' },
    { id: 'p3', title: 'Frost nights: what to cover and what to leave', date: 'Sep 2, 2026', mins: 5,
      text: 'Ocala gets a handful of freezing nights most winters. Natives can take it. Tropicals cannot. A simple list, plus how to cover plants without cooking them the next morning.' }
  ],

  faqs: [
    ['Do you deliver?', 'Yes, anywhere in Marion County. Delivery is free on orders over $150 within 15 miles of the nursery.'],
    ['Will native plants really survive without watering?', 'After their first summer, most will. We water them in at planting and give you a simple schedule for the first 12 weeks.'],
    ['Do you guarantee your plants?', 'Every plant we install is guaranteed for one year. Plants bought at the nursery are guaranteed for 30 days.'],
    ['Can I bring a photo of my yard?', 'Please do. Photos of each side of the house, plus a rough idea of where the sun hits, make a quick visit much more useful.'],
    ['Do you work with HOAs?', 'All the time. We can draw your plan to match your HOA\'s approval form and plant list.'],
    ['When is the best time to plant in Ocala?', 'October through March for trees and shrubs. Most perennials can go in any time if you water them through the first few weeks.']
  ],

  reviews: [
    { name: 'Carol B.', place: 'Silver Springs Shores', text: 'They turned a dead lawn into a garden full of butterflies. Our water bill dropped by about $40 a month.' },
    { name: 'James T.', place: 'Belleview', text: 'Dana told us we didn\'t need half the plants another company quoted us. The yard looks better than their plan did.' },
    { name: 'Lena M.', place: 'Downtown Ocala', text: 'The nursery staff actually know what grows here. My monstera has three new leaves since I took their advice.' }
  ],

  hours: [
    // Sunday = 0
    null, [8, 17], [8, 17], [8, 17], [8, 17], [8, 18], [7, 16]
  ]
};
window.FF.byId = (id) => window.FF.plants.find((p) => p.id === id);
