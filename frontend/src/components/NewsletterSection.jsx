import { motion } from 'framer-motion';
import { FaEnvelope, FaArrowRight } from 'react-icons/fa';
import { useState } from 'react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 2000);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Decorative blobs */}
        <motion.div
          animate={{ float: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ float: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-4xl p-12 shadow-2xl border border-white/20 dark:border-gray-700/20">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                whileHover={{ rotate: 20 }}
                className="text-3xl text-primary"
              >
                <FaEnvelope />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                Отримуйте новинки
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              Підпишіться на нашу розсилку і отримуйте експклюзивні пропозиції та знижки на еко-товари
            </p>

            {/* Form */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="text-5xl mb-3">✓</div>
                <p className="text-lg font-semibold text-primary">Дякуємо за підписку!</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">На вашу пошту буде надіслано підтвердження</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  placeholder="Введіть вашу пошту..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all whitespace-nowrap"
                >
                  Підписатися
                  <FaArrowRight className="text-lg" />
                </motion.button>
              </form>
            )}

            {/* Privacy note */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center">
              Ми поважаємо вашу приватність. Розсилка тільки про еко-товари та спеціальні пропозиції.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
