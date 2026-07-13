// Local seed content — the prototype's Danish copy, reused verbatim
// (design/Kislings App.dc.html). Screens render from this today; the next pass
// swaps these for live PocketBase reads. Field names mirror the backend schema.

export type Coffee = {
  id: string;
  name: string;
  origin: string;
  notes: string;
  grinder: boolean;
  story: string;
};

export type NewsItem = {
  id: string;
  title: string;
  date: string;
  body: string;
};

export type GuideStep = { n: string; text: string; time: string };

export type Guide = {
  id: string;
  name: string;
  meta: string;
  ratio: string;
  dose: string;
  water: string;
  temp: string;
  steps: GuideStep[];
};

export const customer = {
  name: 'Mette',
  id: 'kis_mette_8Xz2Q',
  coffeeStamps: 6,
  beanStamps: 2,
};

export const coffees: Coffee[] = [
  {
    id: 'esperanza',
    name: 'La Esperanza',
    origin: 'Colombia · vasket',
    notes: 'rød frugt, karamel, ren eftersmag',
    grinder: true,
    story:
      'Fra familien Trujillos farm i Huila, 1.750 meter over havet. Plukket i hånden, vasket og tørret langsomt. Vi rister den lyst, så frugten får plads. Kontra brænder bønnerne — du drikker resultatet.',
  },
  {
    id: 'duromina',
    name: 'Duromina',
    origin: 'Etiopien · vasket',
    notes: 'bergamot, abrikos, te-agtig',
    grinder: false,
    story:
      'Et kooperativ i Agaro i det vestlige Etiopien. Klassisk vasket profil — floral og let som te. Bedst som V60, uden mælk.',
  },
  {
    id: 'silvestre',
    name: 'São Silvestre',
    origin: 'Brasilien · natural',
    notes: 'nødder, mørk chokolade, blød',
    grinder: false,
    story:
      'Cerrado Mineiro, Brasilien. Natural-tørret på terrasser i solen. Blød og rund — vores go-to til espresso og god med mælk.',
  },
];

export const news: NewsItem[] = [
  {
    id: 'koncert',
    title: 'Gårdhavekoncert på fredag',
    date: '12. juli 2026',
    body: 'Fredag åbner vi gårdhaven for en stille aften med trioen fra Alsion. Musik fra 17.30, fredagsmenuen serveres samtidig. Der er plads til omkring 40 — kom i god tid, eller reservér et bord hvis I er fire eller flere.',
  },
  {
    id: 'colombia',
    title: 'Ny kaffe fra Colombia',
    date: '4. juli 2026',
    body: 'La Esperanza fra Huila er landet og ligger på kværnen nu. Rød frugt, karamel og en ren eftersmag. Vi rister selv profilerne. Kontra brænder bønnerne. Du drikker resultatet.',
  },
];

export const guides: Guide[] = [
  {
    id: 'v60',
    name: 'V60',
    meta: '1:16 · ca. 2.45 min',
    ratio: '1:16',
    dose: '15 g',
    water: '240 ml',
    temp: '94°',
    steps: [
      { n: '1', text: 'Skyl filteret med varmt vand og hæld det ud.', time: '' },
      { n: '2', text: 'Tilsæt 15 g mellemfin kaffe. Nulstil vægten.', time: '' },
      { n: '3', text: 'Hæld 45 ml vand og lad kaffen blomstre.', time: '0.00' },
      { n: '4', text: 'Hæld roligt op til 150 ml i cirkler.', time: '0.45' },
      { n: '5', text: 'Fyld op til 240 ml. Lad det løbe igennem.', time: '1.30' },
      { n: '6', text: 'Færdig når lejet er fladt.', time: '2.45' },
    ],
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    meta: '1:15 · ca. 1.30 min',
    ratio: '1:15',
    dose: '14 g',
    water: '210 ml',
    temp: '92°',
    steps: [
      { n: '1', text: 'Saml AeroPressen omvendt. Skyl filteret.', time: '' },
      { n: '2', text: 'Tilsæt 14 g fintmalet kaffe og 210 ml vand.', time: '0.00' },
      { n: '3', text: 'Rør tre gange. Sæt låget på.', time: '0.15' },
      { n: '4', text: 'Vent. Vend den over koppen.', time: '1.00' },
      { n: '5', text: 'Pres langsomt — cirka 20 sekunder.', time: '1.10' },
    ],
  },
  {
    id: 'stempel',
    name: 'Stempelkande',
    meta: '1:15 · 4 min',
    ratio: '1:15',
    dose: '30 g',
    water: '450 ml',
    temp: '95°',
    steps: [
      { n: '1', text: 'Tilsæt 30 g groftmalet kaffe.', time: '' },
      { n: '2', text: 'Hæld 450 ml vand over. Rør forsigtigt.', time: '0.00' },
      { n: '3', text: 'Læg låget løst på. Vent.', time: '0.30' },
      { n: '4', text: 'Skum toppen af med en ske.', time: '4.00' },
      { n: '5', text: 'Pres stemplet halvt ned og skænk.', time: '4.30' },
    ],
  },
  {
    id: 'moka',
    name: 'Moka',
    meta: 'fyld kurven · medium varme',
    ratio: '—',
    dose: 'fuld kurv',
    water: 'til ventilen',
    temp: 'medium',
    steps: [
      { n: '1', text: 'Fyld underdelen med varmt vand til ventilen.', time: '' },
      { n: '2', text: 'Fyld kurven med fintmalet kaffe. Pres ikke.', time: '' },
      { n: '3', text: 'Skru sammen og sæt på medium varme.', time: '' },
      { n: '4', text: 'Tag den af, når det begynder at gurgle.', time: '' },
    ],
  },
];

export const menus = [
  { lang: 'Dansk', sub: 'menukort · pdf' },
  { lang: 'English', sub: 'menu · pdf' },
  { lang: 'Deutsch', sub: 'speisekarte · pdf' },
];

export const hours = [
  { day: 'mandag–torsdag', time: '08–18', note: '' },
  { day: 'fredag', time: '08–21', note: 'køkkenet lukker 16 · fredagsmenu fra 17.30' },
  { day: 'lørdag', time: '08–18', note: '' },
  { day: 'søndag', time: 'lukket', note: 'åbent 9–17 i december' },
];

export const contacts = [
  { label: 'mail', value: 'info@kislings.dk', href: 'mailto:info@kislings.dk' },
  { label: 'instagram', value: '@kislings', href: 'https://instagram.com/kislings' },
  { label: 'facebook', value: '/kislings', href: 'https://facebook.com/kislings' },
];

export const wifi = { ssid: 'Kislings Gæst', password: 'kaffetid' };

export const nextEvent = 'Gårdhavekoncert · fredag kl. 17.30';
