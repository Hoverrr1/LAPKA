import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLeaf } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-extrabold mb-3">EcoPetShop</h3>
            <p className="text-gray-600 dark:text-gray-300">Преміальні екологічні товари для вашого улюбленця. Безпечні, стильні та добрі до планети.</p>
            <div className="mt-4 flex items-center gap-3">
              <FaLeaf className="text-accent text-2xl" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Наша місія — здорові улюбленці та чиста планета</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Швидкі посилання</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li><Link to="/">Головна</Link></li>
              <li><Link to="/catalog">Каталог</Link></li>
              <li><Link to="/about">Про нас</Link></li>
              <li><Link to="/cart">Кошик</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Категорії</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li><Link to="/catalog?category=Food">Корм</Link></li>
              <li><Link to="/catalog?category=Toys">Іграшки</Link></li>
              <li><Link to="/catalog?category=Eco-Friendly">Еко-товари</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Підписка</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Отримуйте знижки та новини про еко-продукти</p>
            <form className="flex gap-2">
              <input placeholder="Ваша пошта" className="input-field" />
              <button className="btn-primary">Підписатися</button>
            </form>

            <div className="mt-4 flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <a href="#"><FaFacebook className="text-xl" /></a>
              <a href="#"><FaTwitter className="text-xl" /></a>
              <a href="#"><FaInstagram className="text-xl" /></a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} EcoPetShop. Всі права захищені.</div>
      </div>
    </footer>
  );
};

export default Footer;
