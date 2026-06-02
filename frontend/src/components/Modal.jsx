import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

const Modal = ({
  isOpen,
  title,
  message,
  type = 'info', // 'success', 'error', 'warning', 'info'
  buttons = [],
  onClose,
  showCloseButton = true,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-4xl text-green-500" />;
      case 'error':
        return <FaExclamationCircle className="text-4xl text-red-500" />;
      case 'warning':
        return <FaExclamationCircle className="text-4xl text-yellow-500" />;
      default:
        return null;
    }
  };

  const getBackgroundClass = () => {
    switch (type) {
      case 'success':
        return 'border-green-200/30 dark:border-green-800/30';
      case 'error':
        return 'border-red-200/30 dark:border-red-800/30';
      case 'warning':
        return 'border-yellow-200/30 dark:border-yellow-800/30';
      default:
        return 'border-gray-200/30 dark:border-gray-700/30';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl backdrop-blur-lg border ${getBackgroundClass()} max-w-md w-full p-8 relative`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              {showCloseButton && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </motion.button>
              )}

              {/* Content */}
              <div className="text-center space-y-4">
                {/* Icon */}
                {getIcon() && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="flex justify-center"
                  >
                    {getIcon()}
                  </motion.div>
                )}

                {/* Title */}
                {title && (
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h2>
                )}

                {/* Message */}
                {message && (
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                    {message}
                  </p>
                )}

                {/* Buttons */}
                {buttons && buttons.length > 0 && (
                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200/30 dark:border-gray-700/30">
                    {buttons.map((button, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          button.onClick?.();
                          if (button.closeOnClick !== false) onClose();
                        }}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
                          button.variant === 'danger'
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : button.variant === 'secondary'
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                            : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg'
                        }`}
                      >
                        {button.label}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
