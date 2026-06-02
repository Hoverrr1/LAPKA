import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaSignInAlt, FaCrown, FaLeaf } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import { BsSun, BsMoon } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemCount = getCartItemCount();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setOpen(false);
  };

  const navLinks = [
    { label: 'Головна', href: '/' },
    { label: 'Каталог', href: '/catalog' },
    { label: 'Про нас', href: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      {/* Premium Navbar */}
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-lg border-b border-gray-200/30 dark:border-gray-700/30'
            : 'bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm border-b border-gray-200/20 dark:border-gray-700/20'
        }`}
      >
        <div className="container mx-auto px-6 md:px-10 py-4 md:py-5">
          <div className="flex items-center justify-between">
            {/* Logo - Левая сторона */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-lg">
                  <FaLeaf />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
                    <span className="text-primary">Eco</span>Pet<span className="text-accent">Shop</span>
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Преміальні еко-товари</p>
                </div>
              </Link>
            </motion.div>

            {/* Center Nav Links - Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  variants={itemVariants}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link
                    to={link.href}
                    className="relative px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 transition-colors group"
                  >
                    {link.label}
                    
                    {/* Animated underline */}
                    <motion.span
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent"
                      initial={{ width: '0%' }}
                      whileHover={{ width: '100%' }}
                      animate={isActive(link.href) ? { width: '100%' } : { width: '0%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Side - Icons & User */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Theme Toggle */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.1, rotate: 20 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleTheme()}
                className="p-2 md:p-2.5 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <BsSun className="text-xl md:text-2xl text-yellow-500" />
                ) : (
                  <BsMoon className="text-xl md:text-2xl text-gray-700" />
                )}
              </motion.button>

              {/* Cart Icon */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/cart"
                  className="relative p-2 md:p-2.5 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors group"
                >
                  <FaShoppingCart className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors" />
                  
                  {/* Cart Badge - Pulse Animation */}
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-br from-accent to-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {cartItemCount}
                      </motion.div>
                    </motion.span>
                  )}
                </Link>
              </motion.div>

              {/* User Section - Desktop */}
              {user ? (
                <motion.div
                  variants={itemVariants}
                  className="hidden md:flex items-center space-x-2"
                >
                  {/* Admin Button */}
                  {user.role === 'admin' && (
                    <motion.div
                      whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(45, 125, 91, 0.3)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/admin"
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary via-accent to-primary text-white text-sm font-bold shadow-md hover:shadow-lg transition-all relative overflow-hidden group"
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <FaCrown />
                        </motion.div>
                        <span>Admin</span>
                      </Link>
                    </motion.div>
                  )}

                  {/* User Greeting */}
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <FaUser className="text-primary text-lg" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Привіт!</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{user.name}</p>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="p-2 md:p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                    title="Вийти"
                  >
                    <FaSignOutAlt className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 group-hover:text-red-500 transition-colors" />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:block"
                >
                  <Link
                    to="/login"
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-md"
                  >
                    <FaSignInAlt />
                    <span>Вхід</span>
                  </Link>
                </motion.div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                variants={itemVariants}
                whileTap={{ scale: 0.95 }}
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setOpen(!open)}
                aria-label="Menu"
              >
                <motion.div
                  animate={{ rotate: open ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {open ? (
                    <FiX className="text-2xl text-gray-900 dark:text-white" />
                  ) : (
                    <FiMenu className="text-2xl text-gray-900 dark:text-white" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Premium Drawer */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: open ? 1 : 0,
          height: open ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-20 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/30 dark:border-gray-700/30 overflow-hidden"
      >
        <div className="container mx-auto px-6 py-6 space-y-4">
          {/* Mobile Nav Links */}
          {navLinks.map((link) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -20 }}
              animate={open ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={link.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-bold'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}

          {/* Mobile User Section */}
          {user ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={open ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.15 }}
              className="pt-4 border-t border-gray-200/30 dark:border-gray-700/30 space-y-3"
            >
              <div className="flex items-center space-x-3 px-4 py-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <FaUser className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Привіт!</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{user.name}</p>
                </div>
              </div>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-bold hover:shadow-lg transition-shadow"
                >
                  <FaCrown className="inline mr-2" /> Адмін-панель
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <FaSignOutAlt className="inline mr-2" /> Вийти
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={open ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.15 }}
              className="pt-4 border-t border-gray-200/30 dark:border-gray-700/30"
            >
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-lg border-2 border-primary text-primary font-bold text-center hover:bg-primary hover:text-white transition-all"
              >
                <FaSignInAlt className="inline mr-2" /> Вхід
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Spacer for sticky navbar */}
      <div className="h-20 md:h-24" />
    </>
  );
};

export default Navbar;