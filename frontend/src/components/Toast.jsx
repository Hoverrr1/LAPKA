import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useCallback, useState } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  return { toasts, showToast, removeToast };
};

const ToastItem = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FaCheckCircle className="text-xl text-green-500" />;
      case 'error':
        return <FaExclamationCircle className="text-xl text-red-500" />;
      case 'warning':
        return <FaExclamationCircle className="text-xl text-yellow-500" />;
      default:
        return <FaInfoCircle className="text-xl text-blue-500" />;
    }
  };

  const getBackgroundClass = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50';
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/50 dark:border-red-700/50';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200/50 dark:border-yellow-700/50';
      default:
        return 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200/50 dark:border-blue-700/50';
    }
  };

  const getTextClass = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      default:
        return 'text-blue-800 dark:text-blue-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 50, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-lg shadow-lg ${getBackgroundClass()} ${getTextClass()}`}
    >
      {getIcon()}
      <span className="font-medium flex-1">{toast.message}</span>
      <motion.button
        whileHover={{ scale: 1.2, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onRemove(toast.id)}
        className="p-1 hover:bg-white/30 rounded-full transition-colors"
      >
        <FaTimes className="text-sm" />
      </motion.button>
    </motion.div>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={onRemove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export { ToastContainer };
