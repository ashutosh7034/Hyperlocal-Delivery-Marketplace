const PRODUCT_TAG_MAP = {
  'fresh milk 1l': 'milk,bottle,dairy',
  'brown bread': 'brownbread,bread,loaf',
  'banana bunch': 'banana,fruit,bunch',
  'tomatoes': 'tomato,vegetable,red',
  'onions': 'onion,vegetable',
  'vitamin c 500mg': 'vitamin,tablet,medicine',
  'pain relief gel': 'gel,medicine,tube',
  'cough syrup': 'syrup,medicine,bottle',
  'first aid kit': 'firstaid,bandage,medicine',
  'plain dosa': 'dosa,southindian,food',
  'samosa pack': 'samosa,snack,indian',
  'masala chai': 'chai,tea,indian',
  'idli pack': 'idli,southindian,food',
  'garlic chutney': 'chutney,sauce,green',
  'croissant': 'croissant,pastry,bakery',
  'chocolate cake': 'chocolatecake,cake,dessert',
  'multigrain bread': 'multigrain,bread,loaf',
  'cookies pack': 'cookies,biscuit,snack',
  'doughnut': 'doughnut,donut,pastry',
  'organic rice 1kg': 'rice,grain,basmati',
  'organic dal': 'dal,lentil,indian',
  'honey raw': 'honey,jar,golden',
  'almonds': 'almonds,nuts,dryfruit',
  'coconut oil': 'coconutoil,oil,bottle',
  'margherita pizza': 'margherita,pizza,cheese',
  'pepperoni pizza': 'pepperoni,pizza',
  'garlic bread': 'garlicbread,bread,baked',
  'coke': 'cocacola,cola,drink',
  'chocolate brownie': 'brownie,chocolate,dessert',
  'biryani': 'biryani,rice,indian',
  'butter chicken': 'butterchicken,curry,indian',
  'naan bread': 'naan,bread,indian',
  'raita': 'raita,yogurt,indian',
  'gulab jamun': 'gulabjamun,sweet,indian',
  'laddu box': 'laddu,sweet,indian',
  'barfi': 'barfi,sweet,indian',
  'birthday cake': 'birthdaycake,cake,celebration',
  'jalebi': 'jalebi,sweet,indian',
  'kheer pack': 'kheer,sweet,pudding',
  'protein powder': 'protein,powder,fitness',
  'bcaas': 'supplement,fitness,powder',
  'green tea': 'greentea,tea',
  'multivitamin': 'multivitamin,vitamin,tablet',
  'yoga mat': 'yogamat,yoga,fitness',
  'instant noodles': 'noodles,instant,asian',
  'biscuits pack': 'biscuit,cookie,snack',
  'chips': 'chips,potato,snack',
  'chocolate bar': 'chocolatebar,chocolate,sweet',
  'ice cream': 'icecream,dessert,cone',
};

const VENDOR_TAG_MAP = {
  'demo fresh mart': 'grocery,supermarket,store',
  'fresh daily mart': 'grocery,vegetable,market',
  'supreme pharmacy': 'pharmacy,drugstore,medicine',
  'chai & samosa corner': 'tea,chai,indianfood',
  'happy bakery': 'bakery,bread,pastry',
  'green valley organic': 'organic,vegetable,farm',
  'quick pizza palace': 'pizza,restaurant,italian',
  'spice kitchen restaurant': 'indianfood,restaurant,curry',
  'sweet tooth confectionery': 'sweets,desserts,bakery',
  'fitness & wellness hub': 'fitness,gym,wellness',
  'metro convenience store': 'store,convenience,shop',
};

const CATEGORY_TAG_FALLBACK = {
  dairy: 'dairy,milk',
  bakery: 'bakery,bread',
  fruits: 'fruit,fresh',
  vegetables: 'vegetable,fresh',
  supplements: 'supplement,fitness',
  'pain relief': 'medicine,pharmacy',
  'cough syrup': 'medicine,syrup',
  'first aid': 'firstaid,medicine',
  'south indian': 'southindian,food',
  snacks: 'snack,food',
  beverages: 'drink,beverage',
  condiments: 'sauce,condiment',
  pastry: 'pastry,bakery',
  cake: 'cake,dessert',
  bread: 'bread,bakery',
  cookies: 'cookies,snack',
  grains: 'grain,rice',
  pulses: 'lentil,dal',
  honey: 'honey,jar',
  'dry fruits': 'dryfruits,nuts',
  oils: 'oil,bottle',
  pizza: 'pizza,italian',
  sides: 'side,food',
  dessert: 'dessert,sweet',
  'main course': 'curry,indianfood',
  'side dish': 'side,food',
  sweets: 'sweet,indian',
  vitamins: 'vitamin,tablet',
  tea: 'tea,leaf',
  'fitness gear': 'fitness,gear',
  noodles: 'noodles,asian',
  confectionery: 'chocolate,sweet',
  frozen: 'icecream,frozen',
};

const slugify = (text) =>
  (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const hashSeed = (text) => {
  let hash = 0;
  const str = text || 'fallback';
  for (let i = 0; i < str.length; i += 1) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 1;
};

const buildLoremflickrUrl = (tags, seedKey, width = 800, height = 600) => {
  const safeTags = tags && tags.trim() ? tags.trim() : 'food';
  const lock = hashSeed(seedKey || safeTags);
  return `https://loremflickr.com/${width}/${height}/${encodeURIComponent(safeTags)}?lock=${lock}`;
};

const resolveTags = (name, category, exactMap) => {
  const slugName = slugify(name);
  if (slugName && exactMap[slugName]) return exactMap[slugName];

  const slugCategory = slugify(category);
  if (slugCategory && CATEGORY_TAG_FALLBACK[slugCategory]) return CATEGORY_TAG_FALLBACK[slugCategory];

  const tokens = `${slugName} ${slugCategory}`.split(/\s+/).filter(Boolean).slice(0, 3);
  return tokens.length ? tokens.join(',') : 'food';
};

export const getProductImage = (name, category) => {
  const tags = resolveTags(name, category, PRODUCT_TAG_MAP);
  return buildLoremflickrUrl(tags, `product:${name || ''}:${category || ''}`);
};

export const getVendorImage = (name, category) => {
  const tags = resolveTags(name, category, VENDOR_TAG_MAP);
  return buildLoremflickrUrl(tags, `vendor:${name || ''}:${category || ''}`, 1600, 900);
};
