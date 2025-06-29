import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastQueue, setToastQueue] = useState([]);

  // Load notifications from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const storedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (storedNotifications) {
        const parsed = JSON.parse(storedNotifications);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.read).length);
      } else {
        // Add some demo notifications for new users
        const demoNotifications = getDemoNotifications(user);
        setNotifications(demoNotifications);
        setUnreadCount(demoNotifications.filter(n => !n.read).length);
      }
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (user && notifications.length > 0) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  // Demo notifications for new users
  const getDemoNotifications = (user) => {
    const baseNotifications = [
      {
        id: Date.now() + 1,
        userId: user.id,
        title: 'Welcome to Secret Bookstore!',
        message: 'Thank you for joining our community of book lovers. Explore our vast collection and find your next great read.',
        type: 'success',
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: '/books',
        actionText: 'Browse Books',
        metadata: {},
      },
      {
        id: Date.now() + 2,
        userId: user.id,
        title: 'New Books Added',
        message: 'We\'ve added 15 new books to our collection this week. Check out the latest arrivals!',
        type: 'info',
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        actionUrl: '/books?filter=new',
        actionText: 'View New Books',
        metadata: {},
      },
    ];

    // Add admin-specific notifications
    if (user.isAdmin) {
      baseNotifications.push(
        {
          id: Date.now() + 3,
          userId: user.id,
          title: 'Low Stock Alert',
          message: 'The Great Gatsby is running low on stock (3 remaining). Consider restocking soon.',
          type: 'warning',
          read: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          actionUrl: '/admin/books',
          actionText: 'Manage Inventory',
          metadata: { bookId: 1, stock: 3 },
        },
        {
          id: Date.now() + 4,
          userId: user.id,
          title: 'New Order Received',
          message: 'Order #ORD-12345 from John Doe requires your attention.',
          type: 'order',
          read: true,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          actionUrl: '/admin/orders',
          actionText: 'View Order',
          metadata: { orderId: 'ORD-12345' },
        }
      );
    }

    return baseNotifications;
  };

  // Create a new notification
  const addNotification = (notification) => {
    if (!user) return;

    const newNotification = {
      id: Date.now() + Math.random(),
      userId: user.id,
      title: notification.title,
      message: notification.message,
      type: notification.type || 'info', // info, success, warning, error, order, system
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: notification.actionUrl || null,
      actionText: notification.actionText || null,
      metadata: notification.metadata || {},
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    showToast(newNotification);

    return newNotification;
  };

  // Show toast notification with improved stacking
  const showToast = (notification) => {
    const toastId = `toast-${Date.now()}-${Math.random()}`;
    
    // Add to toast queue
    setToastQueue(prev => {
      const newQueue = [{ ...notification, toastId }, ...prev];
      // Limit to maximum 5 toasts
      return newQueue.slice(0, 5);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(toastId);
    }, 5000);
  };

  const removeToast = (toastId) => {
    setToastQueue(prev => prev.filter(toast => toast.toastId !== toastId));
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // Delete notification
  const deleteNotification = (notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      const newNotifications = prev.filter(n => n.id !== notificationId);
      
      if (notification && !notification.read) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
      
      return newNotifications;
    });
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Get notifications by type
  const getNotificationsByType = (type) => {
    return notifications.filter(notification => notification.type === type);
  };

  // Get unread notifications
  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.read);
  };

  // Predefined notification templates
  const notificationTemplates = {
    orderPlaced: (orderId) => ({
      title: 'Order Placed Successfully',
      message: `Your order #${orderId} has been placed and is being processed.`,
      type: 'order',
      actionUrl: `/order-confirmation/${orderId}`,
      actionText: 'View Order',
    }),
    orderConfirmed: (orderId) => ({
      title: 'Order Confirmed',
      message: `Your order #${orderId} has been confirmed and will be processed soon.`,
      type: 'success',
      actionUrl: `/order-confirmation/${orderId}`,
      actionText: 'Track Order',
    }),
    orderShipped: (orderId) => ({
      title: 'Order Shipped',
      message: `Your order #${orderId} has been shipped and is on its way to you.`,
      type: 'info',
      actionUrl: `/order-confirmation/${orderId}`,
      actionText: 'Track Shipment',
    }),
    orderDelivered: (orderId) => ({
      title: 'Order Delivered',
      message: `Your order #${orderId} has been delivered successfully.`,
      type: 'success',
      actionUrl: `/order-confirmation/${orderId}`,
      actionText: 'Rate Products',
    }),
    newOrder: (orderId, customerName) => ({
      title: 'New Order Received',
      message: `New order #${orderId} from ${customerName} requires your attention.`,
      type: 'order',
      actionUrl: `/admin/orders`,
      actionText: 'View Order',
    }),
    lowStock: (bookTitle, stock) => ({
      title: 'Low Stock Alert',
      message: `"${bookTitle}" is running low on stock (${stock} remaining).`,
      type: 'warning',
      actionUrl: `/admin/books`,
      actionText: 'Manage Inventory',
    }),
    systemMaintenance: () => ({
      title: 'System Maintenance',
      message: 'The system will undergo maintenance tonight from 2:00 AM to 4:00 AM.',
      type: 'system',
    }),
    newBookAdded: (bookTitle) => ({
      title: 'New Book Added',
      message: `"${bookTitle}" has been added to our collection.`,
      type: 'info',
      actionUrl: '/books',
      actionText: 'Browse Books',
    }),
    promotionalOffer: (discount) => ({
      title: 'Special Offer!',
      message: `Get ${discount}% off on all books this weekend. Limited time offer!`,
      type: 'success',
      actionUrl: '/books',
      actionText: 'Shop Now',
    }),
  };

  // Quick notification methods
  const notifyOrderPlaced = (orderId) => addNotification(notificationTemplates.orderPlaced(orderId));
  const notifyOrderConfirmed = (orderId) => addNotification(notificationTemplates.orderConfirmed(orderId));
  const notifyOrderShipped = (orderId) => addNotification(notificationTemplates.orderShipped(orderId));
  const notifyOrderDelivered = (orderId) => addNotification(notificationTemplates.orderDelivered(orderId));
  const notifyNewOrder = (orderId, customerName) => addNotification(notificationTemplates.newOrder(orderId, customerName));
  const notifyLowStock = (bookTitle, stock) => addNotification(notificationTemplates.lowStock(bookTitle, stock));
  const notifySystemMaintenance = () => addNotification(notificationTemplates.systemMaintenance());
  const notifyNewBookAdded = (bookTitle) => addNotification(notificationTemplates.newBookAdded(bookTitle));
  const notifyPromotionalOffer = (discount) => addNotification(notificationTemplates.promotionalOffer(discount));

  const value = {
    notifications,
    unreadCount,
    toastQueue,
    removeToast,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByType,
    getUnreadNotifications,
    // Quick notification methods
    notifyOrderPlaced,
    notifyOrderConfirmed,
    notifyOrderShipped,
    notifyOrderDelivered,
    notifyNewOrder,
    notifyLowStock,
    notifySystemMaintenance,
    notifyNewBookAdded,
    notifyPromotionalOffer,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};