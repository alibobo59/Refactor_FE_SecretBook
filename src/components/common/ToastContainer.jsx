import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import Toast from './Toast';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            initial={{ 
              opacity: 0, 
              x: 300,
              scale: 0.8,
            }}
            animate={{ 
              opacity: 1, 
              x: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: index * 0.1, // Stagger animation
              }
            }}
            exit={{ 
              opacity: 0, 
              x: 300,
              scale: 0.8,
              transition: {
                duration: 0.2,
              }
            }}
            layout
            style={{
              zIndex: 1000 - index, // Ensure proper stacking order
            }}
            className="relative"
          >
            <Toast toast={toast} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;