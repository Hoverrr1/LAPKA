export const productValueLabels = {
  All: 'Усі товари',
  Food: 'Корм',
  Toys: 'Іграшки',
  Accessories: 'Аксесуари',
  Grooming: 'Догляд',
  Health: "Здоров'я",
  'Eco-Friendly': 'Еко-товари',
  'Eco toys': 'Еко-іграшки',
  'Eco bowls': 'Еко-миски',
  'Eco bags': 'Еко-пакети',
  'Recycled products': 'Перероблені товари',
  Bamboo: 'Бамбук',
  Wood: 'Дерево',
  'Organic cotton': 'Органічна бавовна',
  'Recycled plastic': 'Перероблений пластик',
};

const textTranslations = [
  ['Recycled products', 'Перероблені товари'],
  ['Organic cotton', 'органічної бавовни'],
  ['Recycled plastic', 'переробленого пластику'],
  ['Eco toys', 'Еко-іграшки'],
  ['Eco bowls', 'Еко-миски'],
  ['Eco bags', 'Еко-пакети'],
  ['Bamboo', 'бамбука'],
  ['Wood', 'дерева'],
];

export const getProductLabel = (value) => productValueLabels[value] || value || '';

export const translateProductText = (text = '') =>
  textTranslations.reduce((result, [source, translation]) => result.replaceAll(source, translation), text);

export const getProductName = (product) => translateProductText(product?.name || '');
export const getProductDescription = (product) => translateProductText(product?.description || '');
