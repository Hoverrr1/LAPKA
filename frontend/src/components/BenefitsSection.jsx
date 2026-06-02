import { motion } from 'framer-motion';
import { FaTruck, FaLeaf, FaLock, FaPaw } from 'react-icons/fa';

const benefits = [
  {
    icon: FaTruck,
    title: 'Швидка доставка',
    description: 'Доставляємо у найкоротший час'
  },
  {
    icon: FaLeaf,
    title: 'Еко-продукти',
    description: 'Біорозкладні та безпечні матеріали'
  },
  {
    icon: FaLock,
    title: 'Безпечна оплата',
    description: 'Захищені транзакції 100%'
  },
  {
    icon: FaPaw,
    title: 'Щасливі улюбленці',
    description: 'Схвалено ветеринарами'
  },
];

const BenefitsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Чому обирають нас
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Найкращі умови для вас та вашого улюбленця
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(45, 125, 91, 0.15)' }}
                className="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-soft transition-all duration-300"
              >
                {/* Icon */}
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="text-3xl text-white" />
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {benefit.description}
                </p>

                {/* Bottom accent */}
                <motion.div
                  className="h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-4 w-0"
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
