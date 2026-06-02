import { Link } from 'react-router-dom';
import { FaPaw, FaBone, FaLeaf, FaTshirt, FaMedkit, FaBath } from 'react-icons/fa';
import { motion } from 'framer-motion';

const categoryIcons = {
  Food: FaBone,
  Toys: FaPaw,
  'Eco-Friendly': FaLeaf,
  Accessories: FaTshirt,
  Health: FaMedkit,
  Grooming: FaBath,
};

const categoryNames = {
  Food: 'Корм',
  Toys: 'Іграшки',
  'Eco-Friendly': 'Еко-товари',
  Accessories: 'Аксесуари',
  Health: 'Здоров\'я',
  Grooming: 'Догляд',
};

const CategoryCard = ({ category }) => {
  const Icon = categoryIcons[category] || FaPaw;
  const displayName = categoryNames[category] || category;

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={`/catalog?category=${category}`}
        className="block bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-soft hover:shadow-2xl transition-all duration-300 h-full"
      >
        <motion.div 
          className="flex flex-col items-center gap-4"
          whileHover={{ scale: 1.05 }}
        >
          {/* Icon Background */}
          <motion.div 
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center"
            whileHover={{ 
              background: 'linear-gradient(135deg, rgba(45, 125, 91, 0.2) 0%, rgba(74, 157, 126, 0.2) 100%)',
              boxShadow: '0 0 20px rgba(45, 125, 91, 0.2)'
            }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="text-3xl text-primary" />
          </motion.div>

          {/* Category Name */}
          <h3 className="font-bold text-lg text-center text-gray-900 dark:text-white">
            {displayName}
          </h3>

          {/* Arrow Indicator */}
          <motion.div 
            className="text-primary text-xl"
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;