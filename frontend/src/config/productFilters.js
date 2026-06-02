export const categories = ['All', 'Food', 'Toys', 'Grooming', 'Health', 'Eco-Friendly', 'Accessories'];

import { getProductLabel } from './productTranslations';

export const categoryNames = Object.fromEntries(categories.map((category) => [category, getProductLabel(category)]));

export const filterConfig = {
  Food: [
    { key: 'type', label: 'Тип корму', options: ['Сухий', 'Вологий', 'Ласощі', 'Натуральний'] },
    { key: 'petType', label: 'Для кого', options: ['Коти', 'Собаки', 'Гризуни', 'Птахи'] },
    { key: 'ageGroup', label: 'Вік', options: ['Малюки', 'Дорослі', 'Літні'] },
    { key: 'flavor', label: 'Смак', options: ['Курка', 'Яловичина', 'Риба', 'Індичка'] },
  ],
  Toys: [
    { key: 'type', label: 'Тип іграшки', options: ["М'ячики", 'Канати', 'Інтерактивні', 'Жувальні', 'Лазерні'] },
    { key: 'petType', label: 'Для кого', options: ['Коти', 'Собаки', 'Птахи'] },
    { key: 'size', label: 'Розмір', options: ['Маленькі', 'Середні', 'Великі'] },
  ],
  Grooming: [
    { key: 'type', label: 'Тип догляду', options: ['Шампуні', 'Гребінці', 'Догляд за лапами', 'Гігієна', 'Засоби для шерсті'] },
    { key: 'petType', label: 'Для кого', options: ['Коти', 'Собаки'] },
  ],
  Health: [
    { key: 'type', label: 'Тип товару', options: ['Вітаміни', 'Добавки', 'Для зубів', 'Для суглобів', 'Проти бліх'] },
    { key: 'ageGroup', label: 'Вік', options: ['Малюки', 'Дорослі', 'Літні'] },
  ],
  'Eco-Friendly': [
    { key: 'type', label: 'Тип еко-товару', options: [{ value: 'Eco toys', label: 'Еко-іграшки' }, { value: 'Eco bowls', label: 'Еко-миски' }, { value: 'Eco bags', label: 'Еко-пакети' }, { value: 'Recycled products', label: 'Перероблені товари' }] },
    { key: 'material', label: 'Матеріал', options: [{ value: 'Bamboo', label: 'Бамбук' }, { value: 'Wood', label: 'Дерево' }, { value: 'Organic cotton', label: 'Органічна бавовна' }, { value: 'Recycled plastic', label: 'Перероблений пластик' }] },
  ],
};

export const emptyFilters = {
  subcategory: [],
  petType: [],
  ageGroup: [],
  flavor: [],
  size: [],
  material: [],
  type: [],
  minPrice: 0,
  maxPrice: 2500,
  rating: '',
  inStock: false,
  ecoFriendly: false,
};
