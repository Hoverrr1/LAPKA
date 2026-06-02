const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const Product = require('./models/Product');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI);

const petNames = {
  Коти: 'котів',
  Собаки: 'собак',
  Гризуни: 'гризунів',
  Птахи: 'птахів',
};

const makeProduct = (name, description, price, category, index, extra = {}) => ({
  name,
  description,
  price,
  category,
  image: '',
  stock: index % 9 === 0 ? 0 : 12 + (index * 7) % 73,
  rating: Number((4.1 + (index % 9) / 10).toFixed(1)),
  reviews: 18 + (index * 13) % 130,
  ecoFriendly: extra.ecoFriendly ?? index % 3 === 0,
  subcategory: extra.subcategory || extra.type,
  petType: extra.petType || 'Універсальний',
  ageGroup: extra.ageGroup || 'Для будь-якого віку',
  ...extra,
});

const foodTypes = ['Сухий', 'Вологий', 'Ласощі', 'Натуральний'];
const foodPets = ['Коти', 'Собаки', 'Гризуни', 'Птахи'];
const ages = ['Малюки', 'Дорослі', 'Літні'];
const flavors = ['Курка', 'Яловичина', 'Риба', 'Індичка'];

const foodProducts = Array.from({ length: 20 }, (_, index) => {
  const type = foodTypes[index % foodTypes.length];
  const petType = foodPets[index % foodPets.length];
  const ageGroup = ages[index % ages.length];
  const flavor = flavors[(index * 3) % flavors.length];
  return makeProduct(
    `${type} корм ${flavor.toLowerCase()} для ${petNames[petType]} ${index + 1}`,
    `Збалансований ${type.toLowerCase()} корм для ${petNames[petType]} з добірними інгредієнтами.`,
    89 + index * 27,
    'Food',
    index,
    { type, petType, ageGroup, flavor }
  );
});

const toyTypes = ["М'ячики", 'Канати', 'Інтерактивні', 'Жувальні', 'Лазерні'];
const toyPets = ['Коти', 'Собаки', 'Птахи'];
const sizes = ['Маленькі', 'Середні', 'Великі'];

const toyProducts = Array.from({ length: 20 }, (_, index) => {
  const type = toyTypes[index % toyTypes.length];
  const petType = toyPets[index % toyPets.length];
  const size = sizes[index % sizes.length];
  return makeProduct(
    `${type}: іграшка для ${petNames[petType]} ${index + 1}`,
    `Безпечна іграшка для активних занять і гарного настрою вашого улюбленця.`,
    119 + index * 19,
    'Toys',
    index + 20,
    { type, petType, size }
  );
});

const groomingTypes = ['Шампуні', 'Гребінці', 'Догляд за лапами', 'Гігієна', 'Засоби для шерсті'];
const groomingPets = ['Коти', 'Собаки'];

const groomingProducts = Array.from({ length: 20 }, (_, index) => {
  const type = groomingTypes[index % groomingTypes.length];
  const petType = groomingPets[index % groomingPets.length];
  return makeProduct(
    `${type} для ${petNames[petType]} ${index + 1}`,
    `Зручний засіб категорії «${type}» для регулярного домашнього догляду.`,
    129 + index * 22,
    'Grooming',
    index + 40,
    { type, petType }
  );
});

const healthTypes = ['Вітаміни', 'Добавки', 'Для зубів', 'Для суглобів', 'Проти бліх'];
const healthPets = ['Коти', 'Собаки'];

const healthProducts = Array.from({ length: 20 }, (_, index) => {
  const type = healthTypes[index % healthTypes.length];
  const petType = healthPets[index % healthPets.length];
  const ageGroup = ages[index % ages.length];
  return makeProduct(
    `${type} для ${petNames[petType]} ${index + 1}`,
    `Продуманий товар категорії «${type}» для щоденної турботи про здоров’я улюбленця.`,
    149 + index * 31,
    'Health',
    index + 60,
    { type, petType, ageGroup }
  );
});

const ecoTypes = [
  { value: 'Eco toys', label: 'Еко-іграшки' },
  { value: 'Eco bowls', label: 'Еко-миски' },
  { value: 'Eco bags', label: 'Еко-пакети' },
  { value: 'Recycled products', label: 'Перероблені товари' },
];
const materials = [
  { value: 'Bamboo', label: 'бамбука' },
  { value: 'Wood', label: 'дерева' },
  { value: 'Organic cotton', label: 'органічної бавовни' },
  { value: 'Recycled plastic', label: 'переробленого пластику' },
];

const ecoProducts = Array.from({ length: 20 }, (_, index) => {
  const type = ecoTypes[index % ecoTypes.length];
  const material = materials[(index * 3) % materials.length];
  return makeProduct(
    `${type.label}: еко-товар ${index + 1}`,
    `Практичний еко-товар із ${material.label} для відповідального догляду за улюбленцем.`,
    139 + index * 29,
    'Eco-Friendly',
    index + 80,
    { type: type.value, material: material.value, ecoFriendly: true, legacyName: `${type.value}: еко-товар ${index + 1}` }
  );
});

const products = [
  ...foodProducts,
  ...toyProducts,
  ...groomingProducts,
  ...healthProducts,
  ...ecoProducts,
];

const users = [
  { name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { name: 'John Doe', email: 'user@example.com', password: 'password123', role: 'user' },
];

const importData = async () => {
  try {
    await Promise.all(
      products.map((product) => {
        const { legacyName, ...productData } = product;
        return Product.findOneAndUpdate({ name: { $in: [product.name, legacyName].filter(Boolean) } }, productData, {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        });
      })
    );

    for (const user of users) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) await User.create(user);
    }

    console.log(`${products.length} products imported without deleting existing data.`.green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('Products destroyed!'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') destroyData();
else importData();
