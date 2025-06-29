import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { X, CheckCircle, AlertTriangle, Info, XCircle, Package, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContainer = () => {
  const { toastQueue, removeToast } = useNotification();

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'order':
        return <Package className="h-5 w-5 text-purple-500" />;
      case 'system':
        return <Settings className="h-5 w-5 text-gray-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getToastColors = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'error':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'order':
        return 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'system':
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
      case 'info':
      default:
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {toastQueue.map((toast, index) => (
          <motion.div
            key={toast.toastId}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              scale: 1,
              y: 0
            }}
            exit={{ 
              opacity: 0, 
              x: 300, 
              scale: 0.8,
              transition: { duration: 0.2 }
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              delay: index * 0.1
            }}
            layout
            className={`
              relative p-4 rounded-lg shadow-lg border-l-4 backdrop-blur-sm
              ${getToastColors(toast.type)}
              border border-gray-200 dark:border-gray-700
            `}
            style={{
              marginBottom: index < toastQueue.length - 1 ? '8px' : '0'
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getToastIcon(toast.type)}
              </div>
              
              <div className="flex-grow min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-tight">
                  {toast.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 leading-relaxed">
                  {toast.message}
                </p>
                
                {toast.actionUrl && toast.actionText && (
                  <div className="mt-2">
                    <a
                      href={toast.actionUrl}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                    >
                      {toast.actionText}
                    </a>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => removeToast(toast.toastId)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Progress bar for auto-dismiss */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-bl-lg"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;