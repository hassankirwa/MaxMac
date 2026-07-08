export interface PackageItem {
  slug: string;
  /** Real WP Travel Engine trip post ID — only present when sourced live from WP, not static fallback data. */
  wpId?: number;
  name: string;
  region: string;
  dest: string;
  tag: string;
  days: number;
  priceN: number;
  /** ISO 4217 code. Optional — static fallback data has no live WP currency setting; defaults to USD wherever displayed. */
  currency?: string;
  rating: number;
  gradient: [string, string];
  /** WordPress featured image (large size, for the trip hero). Empty/absent → gradient fallback. */
  image?: string;
  /** WordPress featured image (card size, for grids). Falls back to `image`, then gradient. */
  imageCard?: string;
  imageAlt?: string;
  blurb: string;
  exps: string[];
  /** WTE trip_types term names (only present on live WP data). Used by the /packages?trip_type= filter. */
  tripTypes?: string[];
  chips: string[];
  highlights: string[];
  itinerary: { title: string; desc: string }[];
  includes: string[];
  excludes: string[];
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const raw: Omit<PackageItem, 'slug'>[] = [
  {
    name: 'Great Migration Explorer',
    region: 'Serengeti, Tanzania',
    dest: 'Tanzania',
    tag: 'Best seller',
    days: 7,
    priceN: 3450,
    rating: 4.9,
    gradient: ['#c98a3c', '#7a4a1e'],
    blurb: 'Follow the herds with expert trackers and luxury tented camps.',
    exps: ['Wildlife safari'],
    chips: ['Big Five', 'Luxury'],
    highlights: [
      'Track the Great Migration with a private spotter vehicle',
      'Three nights in a luxury tented camp on the migration route',
      'Sundowner game drive over the Serengeti plains',
      'Optional hot-air balloon safari at dawn',
    ],
    itinerary: [
      { title: 'Arrive Arusha, transfer to Serengeti', desc: 'Fly into Arusha and connect via light aircraft to your camp in the central Serengeti. Afternoon orientation game drive.' },
      { title: 'Full-day migration tracking', desc: 'Follow the herds with your guide across the plains, with a bush picnic lunch en route.' },
      { title: 'Northern Serengeti river crossings', desc: 'Head north toward the Mara River for a chance to witness a dramatic river crossing.' },
      { title: 'Balloon safari & bush breakfast', desc: 'Optional sunrise balloon flight over the plains, followed by a champagne bush breakfast.' },
      { title: 'Ndutu plains wildlife drive', desc: 'Explore the short-grass plains, rich with resident predators year-round.' },
      { title: 'Leisure day & cultural visit', desc: 'Relax at camp or visit a nearby Maasai community, plus an evening bush dinner.' },
      { title: 'Departure', desc: 'Final morning game drive before your flight back to Arusha for onward travel.' },
    ],
    includes: ['All park fees and conservation levies', 'Private 4x4 safari vehicle with guide', 'Luxury tented camp accommodation', 'All meals and selected drinks', 'Internal flights within Tanzania'],
    excludes: ['International flights', 'Visa fees', 'Travel insurance', 'Hot-air balloon safari (optional add-on)', 'Gratuities'],
  },
  {
    name: 'Kilimanjaro Machame Trek',
    region: 'Kilimanjaro, Tanzania',
    dest: 'Tanzania',
    tag: 'Adventure',
    days: 8,
    priceN: 2690,
    rating: 4.8,
    gradient: ['#5b7fa6', '#2c4a63'],
    blurb: 'Summit the roof of Africa on the scenic Machame route with seasoned mountain crews.',
    exps: ['Trekking'],
    chips: ['Summit', 'Guided'],
    highlights: [
      'Seven-day Machame "Whiskey" route for optimal acclimatization',
      'Experienced summit-certified mountain guides and porters',
      'All camping equipment and mess-tent dining provided',
      'Summit certificate on successful ascent',
    ],
    itinerary: [
      { title: 'Machame Gate to Machame Camp', desc: 'Begin trekking through lush rainforest to your first camp at 3,000m.' },
      { title: 'Machame Camp to Shira Camp', desc: 'Climb above the forest line onto the moorland zone.' },
      { title: 'Shira Camp to Barranco Camp', desc: 'Trek via the Lava Tower for acclimatization before descending to camp.' },
      { title: 'Barranco Wall to Karanga Camp', desc: 'Scale the Barranco Wall and cross the Karanga Valley.' },
      { title: 'Karanga Camp to Barafu Camp', desc: 'Short trekking day to base camp, resting ahead of the summit push.' },
      { title: 'Summit day: Barafu to Uhuru Peak', desc: 'Midnight ascent to the summit, then descend to Mweka Camp.' },
      { title: 'Mweka Camp to Mweka Gate', desc: 'Final descent through the rainforest and transfer to your hotel.' },
      { title: 'Departure', desc: 'Rest and recover before your onward flight.' },
    ],
    includes: ['Park fees and rescue fees', 'Certified mountain guides and porters', 'All camping equipment', 'Full board meals on the mountain', 'Pre- and post-trek hotel night'],
    excludes: ['International flights', 'Visa fees', 'Trekking gear rental', 'Tips for guides and porters', 'Travel insurance'],
  },
  {
    name: 'Diani & South Coast Escape',
    region: 'Diani, Kenya',
    dest: 'Kenyan Coast',
    tag: 'Beach',
    days: 5,
    priceN: 1890,
    rating: 4.9,
    gradient: ['#3fa9c9', '#1c6f86'],
    blurb: 'White sand, dhow sunsets and the reef — pure coastal unwind.',
    exps: ['Beach & coast', 'Honeymoon'],
    chips: ['Beach', 'Reef'],
    highlights: [
      'Beachfront suite steps from the powder-white sand',
      'Sunset dhow cruise with fresh seafood dinner',
      'Guided snorkelling trip on the Diani reef',
      'Spa treatment included at your resort',
    ],
    itinerary: [
      { title: 'Arrive Diani', desc: 'Transfer from Mombasa airport to your beachfront resort, evening at leisure.' },
      { title: 'Reef snorkelling excursion', desc: 'Morning boat trip out to the coral reef with a marine guide.' },
      { title: 'Sunset dhow cruise', desc: 'Sail the coastline at golden hour with a fresh seafood dinner on board.' },
      { title: 'Leisure day & spa', desc: 'Free day to relax by the pool or beach, with an included spa treatment.' },
      { title: 'Departure', desc: 'Morning at leisure before your transfer back to the airport.' },
    ],
    includes: ['Beachfront accommodation', 'Daily breakfast and two dinners', 'Reef snorkelling excursion', 'Sunset dhow cruise', 'Airport transfers'],
    excludes: ['International flights', 'Visa fees', 'Lunches (except where noted)', 'Travel insurance', 'Gratuities'],
  },
  {
    name: 'Masai Mara Big Cat Safari',
    region: 'Masai Mara, Kenya',
    dest: 'Kenya',
    tag: 'Popular',
    days: 6,
    priceN: 2980,
    rating: 4.9,
    gradient: ['#c98a3c', '#6e4a22'],
    blurb: 'The Mara at its wildest — lions, cheetahs and endless plains.',
    exps: ['Wildlife safari'],
    chips: ['Big Cats', 'Great Migration'],
    highlights: [
      'Twice-daily game drives with a big-cat specialist guide',
      'Stay inside the Mara reserve for prime early-morning access',
      'Visit to a local Maasai village',
      'Optional hot-air balloon safari',
    ],
    itinerary: [
      { title: 'Arrive Masai Mara', desc: 'Fly or drive in and settle into camp, afternoon game drive.' },
      { title: 'Full-day Mara game drives', desc: 'Explore the reserve\'s prime big-cat territory with a specialist guide.' },
      { title: 'Mara River crossing points', desc: 'Visit the famous crossing points, migration-dependent.' },
      { title: 'Maasai village visit', desc: 'Morning cultural visit followed by an afternoon game drive.' },
      { title: 'Leisure & optional balloon safari', desc: 'Relax at camp or take an optional sunrise balloon flight.' },
      { title: 'Departure', desc: 'Final game drive before transfer back to Nairobi.' },
    ],
    includes: ['All park fees', 'Private 4x4 with guide', 'Full-board camp accommodation', 'Maasai village visit', 'Airstrip transfers'],
    excludes: ['International flights', 'Visa fees', 'Hot-air balloon safari (optional add-on)', 'Travel insurance', 'Gratuities'],
  },
  {
    name: 'Zanzibar Spice & Sea',
    region: 'Zanzibar, Tanzania',
    dest: 'Zanzibar',
    tag: 'Beach',
    days: 6,
    priceN: 2240,
    rating: 4.8,
    gradient: ['#3fa9c9', '#1c6f86'],
    blurb: 'Stone Town history, spice farms and turquoise Indian Ocean.',
    exps: ['Beach & coast', 'Cultural'],
    chips: ['Island', 'Culture'],
    highlights: [
      'Guided walking tour of historic Stone Town',
      'Spice farm tour with tasting',
      'Beachfront stay on the north coast',
      'Sunset sailing on a traditional dhow',
    ],
    itinerary: [
      { title: 'Arrive Stone Town', desc: 'Settle into your riad-style hotel, evening walking tour of the old town.' },
      { title: 'Spice farm tour', desc: 'Visit a working spice farm and learn the island\'s trading history.' },
      { title: 'Transfer to the north coast', desc: 'Relocate to a beachfront resort for the remainder of your stay.' },
      { title: 'Sunset dhow sail', desc: 'Traditional sailing boat trip along the coastline at golden hour.' },
      { title: 'Beach day at leisure', desc: 'Free day to enjoy the resort, snorkelling, or watersports.' },
      { title: 'Departure', desc: 'Transfer to the airport for your onward flight.' },
    ],
    includes: ['Stone Town & beach accommodation', 'Daily breakfast', 'Spice farm tour', 'Sunset dhow sail', 'All transfers'],
    excludes: ['International flights', 'Visa fees', 'Lunches and most dinners', 'Travel insurance', 'Gratuities'],
  },
  {
    name: 'Lamu Old Town & Dhows',
    region: 'Lamu, Kenya',
    dest: 'Kenyan Coast',
    tag: 'Cultural',
    days: 4,
    priceN: 1720,
    rating: 4.7,
    gradient: ['#4a9d7a', '#256149'],
    blurb: 'A living Swahili town of coral-stone lanes and sailing dhows.',
    exps: ['Cultural', 'Beach & coast'],
    chips: ['Heritage', 'Slow travel'],
    highlights: [
      'Stay in a restored Swahili coral-stone guesthouse',
      'Guided heritage walk through Lamu Old Town, a UNESCO site',
      'Full-day dhow sailing trip with a beach picnic',
      'Donkey sanctuary and local market visit',
    ],
    itinerary: [
      { title: 'Arrive Lamu', desc: 'Transfer by boat from the airstrip to your guesthouse in the old town.' },
      { title: 'Old Town heritage walk', desc: 'Guided tour through the coral-stone lanes and Swahili architecture.' },
      { title: 'Full-day dhow trip', desc: 'Sail to a nearby beach for swimming, snorkelling and a fresh seafood picnic.' },
      { title: 'Departure', desc: 'Free morning at leisure before your boat transfer to the airstrip.' },
    ],
    includes: ['Guesthouse accommodation', 'Daily breakfast', 'Heritage walking tour', 'Full-day dhow excursion', 'Boat transfers'],
    excludes: ['International & domestic flights', 'Visa fees', 'Most lunches and dinners', 'Travel insurance', 'Gratuities'],
  },
  {
    name: 'Amboseli & Kilimanjaro Views',
    region: 'Amboseli, Kenya',
    dest: 'Kenya',
    tag: 'Family',
    days: 5,
    priceN: 2380,
    rating: 4.8,
    gradient: ['#c98a3c', '#7a4a1e'],
    blurb: "Elephant herds beneath Africa's highest peak — family favourite.",
    exps: ['Wildlife safari', 'Family'],
    chips: ['Elephants', 'Family'],
    highlights: [
      'Family-friendly lodge with a pool and kids\' program',
      'Game drives focused on Amboseli\'s famed elephant herds',
      'Uninterrupted views of Kilimanjaro on clear mornings',
      'Maasai cultural visit suitable for all ages',
    ],
    itinerary: [
      { title: 'Arrive Amboseli', desc: 'Transfer from Nairobi, afternoon game drive with elephant sightings likely.' },
      { title: 'Full-day game drives', desc: 'Explore the park\'s swamps and plains beneath Kilimanjaro.' },
      { title: 'Maasai village & leisure', desc: 'Morning cultural visit, afternoon at the lodge pool.' },
      { title: 'Sunrise game drive', desc: 'Early start for the best light and wildlife activity, plus a relaxed afternoon.' },
      { title: 'Departure', desc: 'Final photo stop for Kilimanjaro views before transfer back to Nairobi.' },
    ],
    includes: ['Park fees', 'Private 4x4 with guide', 'Family-friendly lodge accommodation', 'Full board meals', 'Road transfers from Nairobi'],
    excludes: ['International flights', 'Visa fees', 'Travel insurance', 'Optional activities', 'Gratuities'],
  },
  {
    name: 'Malindi & Watamu Reef',
    region: 'Malindi, Kenya',
    dest: 'Kenyan Coast',
    tag: 'Beach',
    days: 5,
    priceN: 1980,
    rating: 4.7,
    gradient: ['#3fa9c9', '#1c6f86'],
    blurb: 'Marine park snorkelling and laid-back Italian-Swahili coast.',
    exps: ['Beach & coast', 'Family'],
    chips: ['Snorkel', 'Marine park'],
    highlights: [
      'Guided snorkelling in Watamu Marine National Park',
      'Beachfront family-friendly resort stay',
      'Mida Creek mangrove boat safari',
      'Free day to explore Malindi\'s old town',
    ],
    itinerary: [
      { title: 'Arrive Malindi', desc: 'Transfer to your beachfront resort, evening at leisure.' },
      { title: 'Watamu Marine Park snorkelling', desc: 'Boat trip out to the marine park with a snorkelling guide.' },
      { title: 'Mida Creek mangrove safari', desc: 'Gentle boat trip through the mangroves, good for birdwatching.' },
      { title: 'Beach day at leisure', desc: 'Free day to enjoy the resort and coastline.' },
      { title: 'Departure', desc: 'Transfer to the airport for your onward flight.' },
    ],
    includes: ['Beachfront accommodation', 'Daily breakfast', 'Marine park snorkelling trip', 'Mangrove boat safari', 'Airport transfers'],
    excludes: ['International flights', 'Visa fees', 'Lunches and most dinners', 'Travel insurance', 'Gratuities'],
  },
  {
    name: 'Serengeti Honeymoon Retreat',
    region: 'Serengeti, Tanzania',
    dest: 'Tanzania',
    tag: 'Honeymoon',
    days: 7,
    priceN: 4650,
    rating: 5.0,
    gradient: ['#b98a52', '#5e3d1c'],
    blurb: 'Private plunge pools, candlelit dinners and dawn game drives.',
    exps: ['Honeymoon', 'Wildlife safari'],
    chips: ['Private', 'Ultra-luxury'],
    highlights: [
      'Private-pool suite in an ultra-luxury tented camp',
      'Candlelit bush dinner under the stars',
      'Private game drives with your own guide and vehicle',
      'Couples spa treatment included',
    ],
    itinerary: [
      { title: 'Arrive Serengeti', desc: 'Private light-aircraft transfer to your camp, afternoon orientation drive.' },
      { title: 'Private game drives', desc: 'Full day exploring the plains with your dedicated guide and vehicle.' },
      { title: 'Candlelit bush dinner', desc: 'A private dining setup under the stars, arranged by your camp.' },
      { title: 'Couples spa & leisure', desc: 'Relax at camp with an included couples spa treatment.' },
      { title: 'Sunrise game drive', desc: 'Early start for golden-hour photography and wildlife activity.' },
      { title: 'Leisure day at camp', desc: 'Free day to enjoy your private plunge pool and camp facilities.' },
      { title: 'Departure', desc: 'Final morning drive before your flight back to Arusha.' },
    ],
    includes: ['Private-pool suite accommodation', 'All meals and premium drinks', 'Private 4x4 with dedicated guide', 'Couples spa treatment', 'Internal flights'],
    excludes: ['International flights', 'Visa fees', 'Travel insurance', 'Premium wine selections', 'Gratuities'],
  },
];

export const packages: PackageItem[] = raw.map((p) => ({ ...p, slug: slugify(p.name) }));

export const destOptions = ['Tanzania', 'Kenya', 'Zanzibar', 'Kenyan Coast'];
export const expOptions = ['Wildlife safari', 'Beach & coast', 'Trekking', 'Cultural', 'Honeymoon', 'Family'];
export const durOptions = ['Any', '1-4 days', '5-6 days', '7+ days'];
export const sortOptions = ['Recommended', 'Price', 'Rating', 'Duration'];
