const UNSPLASH_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb';

const UNSPLASH_IMAGES = {
  Food: [
    'photo-1589924691995-400dc9ecc119',
    'photo-1601758174114-e711c0cbaa69',
    'photo-1601758063890-1167f394febb',
    'photo-1601758125946-6ec2ef64daf8',
    'photo-1525253013412-55c1a69a5738',
    'photo-1568572933382-74d440642117',
    'photo-1560743641-3914f2c45636',
    'photo-1596854407944-bf87f6fdd49e',
    'photo-1534361960057-19889db9621e',
    'photo-1583337130417-3346a1be7dee',
  ],
  Toys: [
    'photo-1517849845537-4d257902454a',
    'photo-1517423440428-a5a00ad493e8',
    'photo-1548199973-03cce0bbc87b',
    'photo-1558788353-f76d92427f16',
    'photo-1561037404-61cd46aa615b',
    'photo-1537151625747-768eb6cf92b2',
    'photo-1530281700549-e82e7bf110d6',
    'photo-1592194996308-7b43878e84a6',
    'photo-1574158622682-e40e69881006',
    'photo-1561948955-570b270e7c36',
  ],
  Grooming: [
    'photo-1543466835-00a7907e9de1',
    'photo-1552053831-71594a27632d',
    'photo-1560807707-8cc77767d783',
    'photo-1583511655826-05700d52f4d9',
    'photo-1518717758536-85ae29035b6d',
    'photo-1450778869180-41d0601e046e',
    'photo-1514888286974-6c03e2ca1dba',
    'photo-1518791841217-8f162f1e1131',
    'photo-1478098711619-5ab0b478d6e6',
    'photo-1494256997604-768d1f608cac',
  ],
  Health: [
    'photo-1601758228041-f3b2795255f1',
    'photo-1601758123927-19647fbc2b71',
    'photo-1601758003122-53c40e686a19',
    'photo-1601758125946-6ec2ef64daf8',
    'photo-1601758175576-648226072e90',
    'photo-1601758064224-c3c9ec9107f4',
    'photo-1601758227846-7d6dd697b04b',
    'photo-1601758177266-bc599de87707',
    'photo-1601758173924-7f7d2c6f1c32',
    'photo-1601758176175-45914394491c',
  ],
  'Eco-Friendly': [
    'photo-1500530855697-b586d89ba3ee',
    'photo-1441974231531-c6227db76b6e',
    'photo-1472214103451-9374bd1c798e',
    'photo-1501004318641-b39e6451bec6',
    'photo-1464822759023-fed622ff2c3b',
    'photo-1473773508845-188df298d2d1',
    'photo-1518837695005-2083093ee35b',
    'photo-1470252649378-9c29740c9fa8',
    'photo-1506744038136-46273834b3fb',
    'photo-1518495973542-4542c06a5843',
  ],
};

const hashText = (value = '') =>
  String(value).split('').reduce((hash, char) => hash + char.charCodeAt(0), 0);

const isUnsplashPhotoUrl = (src = '') =>
  /^https:\/\/images\.unsplash\.com\/photo-/.test(String(src).trim());

const getUnsplashBase = (src) => {
  const value = String(src || '').trim();
  return isUnsplashPhotoUrl(value) ? value.split('?')[0] : UNSPLASH_FALLBACK_IMAGE;
};

const buildUnsplashUrl = (src, width = 1200, quality = 80) =>
  `${getUnsplashBase(src)}?w=${width}&auto=format&fit=crop&q=${quality}`;

const getCategoryUnsplashBase = (category = 'Food', seed = '') => {
  const list = UNSPLASH_IMAGES[category] || UNSPLASH_IMAGES.Food;
  const index = Math.abs(hashText(seed || category)) % list.length;
  return `https://images.unsplash.com/${list[index]}`;
};

const getProductImageUrl = (product = {}) => {
  if (isUnsplashPhotoUrl(product.image)) return buildUnsplashUrl(product.image);
  return buildUnsplashUrl(getCategoryUnsplashBase(product.category, product._id || product.name || product.category));
};

const normalizeProductImage = (product = {}) => ({
  ...product,
  image: getProductImageUrl(product),
});

module.exports = {
  UNSPLASH_FALLBACK_IMAGE,
  UNSPLASH_IMAGES,
  buildUnsplashUrl,
  getCategoryUnsplashBase,
  getProductImageUrl,
  isUnsplashPhotoUrl,
  normalizeProductImage,
};
