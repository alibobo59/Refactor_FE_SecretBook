import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const NotificationBell = ({ className = "" }) => {
  const { unreadCount, toggleNotificationPanel } = useNotification();

  return (
    <button
      onClick={toggleNotificationPanel}
      className={`relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 ${className}`}
      aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
    >
      <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      
      {unreadCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </motion.span>
      )}
      
      {unreadCount > 0 && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-1 -right-1 bg-red-500 rounded-full w-[18px] h-[18px] opacity-75"
        />
      )}
    </button>
  );
};

export default NotificationBell;