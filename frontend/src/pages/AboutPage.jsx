import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBoxOpen,
  FaComments,
  FaHeart,
  FaLeaf,
  FaPaw,
  FaShieldAlt,
  FaTruck,
} from 'react-icons/fa';

const advantages = [
  {
    icon: FaLeaf,
    title: 'Еко-матеріали',
    text: 'Обираємо товари з натуральних, перероблених і безпечних матеріалів, які дбайливо ставляться до природи.',
  },
  {
    icon: FaShieldAlt,
    title: 'Безпечні товари',
    text: 'У каталозі - продумані рішення для щоденного догляду, комфорту та здоров’я ваших улюбленців.',
  },
  {
    icon: FaTruck,
    title: 'Швидка доставка',
    text: 'Дбайливо пакуємо замовлення та доставляємо їх по всій Україні без зайвого очікування.',
  },
  {
    icon: FaComments,
    title: 'Якісна підтримка',
    text: 'Допомагаємо обрати саме те, що підійде вашому улюбленцю та відповідатиме вашим цінностям.',
  },
];

const stats = [
  ['5000+', 'задоволених клієнтів'],
  ['1000+', 'еко-товарів'],
  ['98%', 'позитивних відгуків'],
  ['24/7', 'турбота по всій Україні'],
];

const values = [
  ['Любов до тварин', 'Рішення, що роблять щоденне життя улюбленців комфортнішим.', FaHeart],
  ['Повага до природи', 'Менше зайвого пластику та більше відповідального вибору.', FaLeaf],
  ['Чесна якість', 'Уважність до матеріалів, складу й деталей кожного товару.', FaShieldAlt],
  ['Сучасний сервіс', 'Зручний каталог, зрозумілі покупки та підтримка поруч.', FaBoxOpen],
];

const AboutPage = () => (
  <div className="overflow-hidden bg-stone-50 text-slate-900 dark:bg-gray-950 dark:text-white">
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 px-6 py-20 text-white md:py-28">
      <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-lime-300/20 blur-3xl" />
      <div className="absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-teal-200/20 blur-3xl" />
      <div className="container relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
            <FaPaw className="text-lime-200" />
            EcoPetShop / ЛАПКА
          </span>
          <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Турбота, яку відчувають лапками
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50 md:text-xl">
            Сучасні товари для щасливих улюбленців і відповідальних людей.
            Обираємо безпечні рішення, що дарують комфорт тваринам і залишають
            менше слідів у природі.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="container mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-center">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
            Наша місія
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Більше любові. Менше зайвого.
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-gray-300">
            ЛАПКА допомагає зробити щоденну турботу про домашніх улюбленців
            усвідомленою та зручною. Ми збираємо в одному місці якісні корми,
            іграшки, засоби догляду та еко-товари. Обираючи безпечні матеріали
            й практичні рішення, підтримуємо відповідальне споживання без
            компромісів для комфорту ваших друзів.
          </p>
        </div>
        <div className="rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-900/10 dark:border-emerald-900/50 dark:bg-gray-900">
          <FaPaw className="text-5xl text-emerald-600" />
          <p className="mt-6 text-2xl font-bold leading-9">
            Кожна покупка - маленький жест турботи про улюбленця та довкілля.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-emerald-50/80 px-6 py-20 dark:bg-emerald-950/25">
      <div className="container mx-auto max-w-6xl">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
          Чому обирають нас
        </p>
        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          Усе важливе - з турботою
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {advantages.map(({ icon: Icon, title, text }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -7 }}
              className="rounded-3xl border border-white/80 bg-white/85 p-6 shadow-sm backdrop-blur transition-shadow hover:shadow-xl dark:border-white/10 dark:bg-gray-900/80"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-xl text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200">
                <Icon />
              </span>
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600 dark:text-gray-300">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>

    <section className="container mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
        Наші цінності
      </p>
      <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
        Вибір, за який не соромно
      </h2>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-gray-300">
        Для нас любов до тварин починається з уважності до деталей: складу,
        матеріалів, зручності та сервісу. Поєднуємо екологічний підхід,
        сучасний дизайн і чесну якість.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {values.map(([title, text, Icon]) => (
          <div key={title} className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Icon className="mt-1 shrink-0 text-2xl text-emerald-600" />
            <div>
              <h3 className="font-bold">{title}</h3>
              <p className="mt-1 leading-6 text-slate-600 dark:text-gray-300">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="px-6 pb-20">
      <div className="container mx-auto grid max-w-6xl gap-4 rounded-[2rem] bg-emerald-950 p-7 text-white shadow-2xl shadow-emerald-950/20 md:grid-cols-4 md:p-10">
        {stats.map(([value, label]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-3xl font-black text-lime-200">{value}</p>
            <p className="mt-2 text-sm text-emerald-50">{label}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="px-6 pb-24">
      <div className="container mx-auto max-w-6xl rounded-[2rem] bg-gradient-to-r from-lime-200 to-emerald-200 p-8 text-emerald-950 md:p-14">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-800">
          Час потішити улюбленця
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
          Оберіть турботу, яка пасує саме вашим лапкам
        </h2>
        <p className="mt-5 max-w-2xl leading-7 text-emerald-950/75">
          Знайдіть товари для комфортного, здорового та екологічного життя
          вашого улюбленця.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/catalog" className="rounded-full bg-emerald-950 px-6 py-3 font-bold text-white transition hover:bg-emerald-800">
            Перейти в каталог
          </Link>
          <Link to="/catalog?category=Eco-Friendly" className="rounded-full border border-emerald-950/20 bg-white/70 px-6 py-3 font-bold transition hover:bg-white">
            Еко-товари
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
