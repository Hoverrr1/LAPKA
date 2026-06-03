import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import OptimizedImage from './OptimizedImage';
import { UNSPLASH_IMAGES } from '../utils/unsplashImages';

const testimonials = [
  {
    name: 'Марія Петренко',
    review: 'Відличний сервіс! Мій кіт абсолютно закоханий у іграшки. Дуже задоволена якістю!',
    rating: 5,
    avatar: `https://images.unsplash.com/${UNSPLASH_IMAGES.Testimonials[0]}`
  },
  {
    name: 'Сергій Коваленко',
    review: 'Товари екологічні, безпечні для мого собаки. Доставка була швидкою. Рекомендую!',
    rating: 5,
    avatar: `https://images.unsplash.com/${UNSPLASH_IMAGES.Testimonials[1]}`
  },
  {
    name: 'Олена Іванова',
    review: 'Ціни справедливі, якість на висоті. Буду замовляти ще. Спасибі EcoPetShop!',
    rating: 5,
    avatar: `https://images.unsplash.com/${UNSPLASH_IMAGES.Testimonials[2]}`
  },
  {
    name: 'Артем Сидоренко',
    review: 'Мій кіт дуже активний з вашими іграшками. Батьки вдячні за чистоту та безпеку!',
    rating: 5,
    avatar: `https://images.unsplash.com/${UNSPLASH_IMAGES.Testimonials[3]}`
  },
];

const TestimonialsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Відгуки клієнтів
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Тисячі щасливих улюбленців та їхніх власників
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic text-sm leading-relaxed">
                "{testimonial.review}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <OptimizedImage
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  variant="preview"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Перевірений покупець
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
