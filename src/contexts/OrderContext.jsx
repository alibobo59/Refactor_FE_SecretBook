import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useNotification } from './NotificationContext';
import { useToast } from './ToastContext';

const OrderContext = createContext();

export const useOrder = () => {
  return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const { notifyOrderPlaced, notifyOrderConfirmed, notifyOrderShipped, notifyOrderDelivered, notifyNewOrder } = useNotification();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load orders from localStorage when component mounts
  useEffect(() => {
    const loadOrders = () => {
      try {
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        } else {
          // Initialize with dummy orders for testing
          const dummyOrders = generateDummyOrders();
          setOrders(dummyOrders);
          localStorage.setItem('orders', JSON.stringify(dummyOrders));
        }
      } catch (error) {
        console.error('Failed to load orders from localStorage:', error);
      }
    };

    loadOrders();
  }, []);

  // Generate dummy orders for testing
  const generateDummyOrders = () => {
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    const customers = [
      { name: 'John Doe', email: 'john.doe@email.com', phone: '+1 (555) 123-4567' },
      { name: 'Jane Smith', email: 'jane.smith@email.com', phone: '+1 (555) 987-6543' },
      { name: 'Michael Johnson', email: 'michael.j@email.com', phone: '+1 (555) 456-7890' },
      { name: 'Emily Davis', email: 'emily.davis@email.com', phone: '+1 (555) 321-0987' },
      { name: 'David Wilson', email: 'david.wilson@email.com', phone: '+1 (555) 654-3210' },
      { name: 'Sarah Brown', email: 'sarah.brown@email.com', phone: '+1 (555) 789-0123' },
      { name: 'Robert Taylor', email: 'robert.taylor@email.com', phone: '+1 (555) 234-5678' },
      { name: 'Lisa Anderson', email: 'lisa.anderson@email.com', phone: '+1 (555) 876-5432' },
      { name: 'James Martinez', email: 'james.martinez@email.com', phone: '+1 (555) 345-6789' },
      { name: 'Jennifer Garcia', email: 'jennifer.garcia@email.com', phone: '+1 (555) 567-8901' },
    ];

    const books = [
      { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 12.99, coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg' },
      { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 14.99, coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg' },
      { id: 3, title: '1984', author: 'George Orwell', price: 13.99, coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg' },
      { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', price: 11.99, coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg' },
      { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 16.99, coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg' },
      { id: 6, title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', price: 15.99, coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg' },
      { id: 7, title: 'The Catcher in the Rye', author: 'J.D. Salinger', price: 13.50, coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg' },
      { id: 8, title: 'Lord of the Flies', author: 'William Golding', price: 12.50, coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg' },
    ];

    const addresses = [
      { firstName: 'John', lastName: 'Doe', address: '123 Main St', city: 'New York', state: 'NY', postalCode: '10001', country: 'USA' },
      { firstName: 'Jane', lastName: 'Smith', address: '456 Oak Ave', city: 'Los Angeles', state: 'CA', postalCode: '90210', country: 'USA' },
      { firstName: 'Michael', lastName: 'Johnson', address: '789 Pine Rd', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'USA' },
      { firstName: 'Emily', lastName: 'Davis', address: '321 Elm St', city: 'Houston', state: 'TX', postalCode: '77001', country: 'USA' },
      { firstName: 'David', lastName: 'Wilson', address: '654 Maple Dr', city: 'Phoenix', state: 'AZ', postalCode: '85001', country: 'USA' },
      { firstName: 'Sarah', lastName: 'Brown', address: '987 Cedar Ln', city: 'Philadelphia', state: 'PA', postalCode: '19101', country: 'USA' },
      { firstName: 'Robert', lastName: 'Taylor', address: '147 Birch Way', city: 'San Antonio', state: 'TX', postalCode: '78201', country: 'USA' },
      { firstName: 'Lisa', lastName: 'Anderson', address: '258 Spruce St', city: 'San Diego', state: 'CA', postalCode: '92101', country: 'USA' },
      { firstName: 'James', lastName: 'Martinez', address: '369 Willow Ave', city: 'Dallas', state: 'TX', postalCode: '75201', country: 'USA' },
      { firstName: 'Jennifer', lastName: 'Garcia', address: '741 Poplar Rd', city: 'San Jose', state: 'CA', postalCode: '95101', country: 'USA' },
    ];

    const dummyOrders = [];
    const now = new Date();

    for (let i = 0; i < 50; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const address = addresses[Math.floor(Math.random() * addresses.length)];
      
      // Generate random date within last 3 months
      const randomDate = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000);
      
      // Generate 1-4 random items per order
      const itemCount = Math.floor(Math.random() * 4) + 1;
      const orderItems = [];
      let orderTotal = 0;
      
      for (let j = 0; j < itemCount; j++) {
        const book = books[Math.floor(Math.random() * books.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const itemTotal = book.price * quantity;
        
        orderItems.push({
          bookId: book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          quantity: quantity,
          coverImage: book.coverImage,
        });
        
        orderTotal += itemTotal;
      }

      // Add shipping cost
      const shippingCost = orderTotal > 50 ? 0 : 5.99;
      orderTotal += shippingCost;

      // Add tax (8.5%)
      const tax = orderTotal * 0.085;
      orderTotal += tax;

      const order = {
        id: `ORD-${String(i + 1).padStart(4, '0')}`,
        userId: Math.floor(Math.random() * 100) + 1,
        customerName: customer.name,
        customerEmail: customer.email,
        contactInfo: {
          phone: customer.phone,
          email: customer.email,
        },
        shippingAddress: address,
        billingAddress: address,
        items: orderItems,
        subtotal: orderTotal - shippingCost - tax,
        shipping: shippingCost,
        tax: tax,
        total: orderTotal,
        status: status,
        paymentMethod: 'cod',
        paymentStatus: status === 'cancelled' ? 'failed' : 
                      status === 'delivered' ? 'completed' : 
                      status === 'confirmed' || status === 'processing' || status === 'shipped' ? 'pending' : 'pending',
        createdAt: randomDate.toISOString(),
        updatedAt: randomDate.toISOString(),
        estimatedDelivery: new Date(randomDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: generateOrderNotes(status),
        trackingNumber: status === 'shipped' || status === 'delivered' ? `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}` : null,
      };

      dummyOrders.push(order);
    }

    // Sort by creation date (newest first)
    return dummyOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const generateOrderNotes = (status) => {
    const notes = {
      pending: 'Order received and awaiting confirmation.',
      confirmed: 'Order confirmed and being prepared for shipment.',
      processing: 'Order is being processed in our warehouse.',
      shipped: 'Order has been shipped and is on its way to the customer.',
      delivered: 'Order has been successfully delivered to the customer.',
      cancelled: 'Order was cancelled at customer request.',
    };
    return notes[status] || 'No additional notes.';
  };

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [orders]);

  const createOrder = async (orderData) => {
    if (!user) {
      throw new Error('User must be logged in to create an order');
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newOrder = {
        id: `ORD-${Date.now()}`,
        userId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        ...orderData,
        status: 'pending',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      };

      setOrders(prevOrders => [newOrder, ...prevOrders]);
      
      // Clear the cart after successful order creation
      clearCart();
      
      // Send notifications
      notifyOrderPlaced(newOrder.id);
      
      // Show success toast
      if (toast) {
        toast.showOrderCreated(newOrder.id);
      }
      
      // Notify admin about new order (simulate admin notification)
      if (user.isAdmin !== true && toast) {
        toast.showAdminNewOrder(newOrder.id, newOrder.customerName, newOrder.total);
      }
      
      return newOrder;
    } catch (error) {
      setError('Failed to create order');
      
      // Show error toast
      if (toast) {
        toast.showError(
          'Order Failed',
          'Unable to place your order. Please try again.'
        );
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.id === orderId) {
            const updatedOrder = { 
              ...order, 
              status: newStatus, 
              updatedAt: new Date().toISOString(),
              // Update payment status if order is confirmed
              paymentStatus: newStatus === 'confirmed' ? 'pending' : order.paymentStatus,
              // Add tracking number if shipped
              trackingNumber: newStatus === 'shipped' && !order.trackingNumber ? 
                `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}` : order.trackingNumber
            };

            // Send status update notifications to customer
            switch (newStatus) {
              case 'confirmed':
                notifyOrderConfirmed(orderId);
                if (toast) {
                  toast.showSuccess(
                    'Order Confirmed',
                    `Order ${orderId} has been confirmed and is being processed.`
                  );
                }
                break;
              case 'shipped':
                notifyOrderShipped(orderId);
                if (toast) {
                  toast.showInfo(
                    'Order Shipped',
                    `Order ${orderId} has been shipped and is on its way.`
                  );
                }
                break;
              case 'delivered':
                notifyOrderDelivered(orderId);
                if (toast) {
                  toast.showSuccess(
                    'Order Delivered',
                    `Order ${orderId} has been delivered successfully.`
                  );
                }
                break;
              case 'cancelled':
                if (toast) {
                  toast.showOrderCancelled(orderId);
                }
                break;
            }

            return updatedOrder;
          }
          return order;
        })
      );

      return true;
    } catch (error) {
      setError('Failed to update order status');
      
      // Show error toast
      if (toast) {
        toast.showError(
          'Update Failed',
          'Unable to update order status. Please try again.'
        );
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                paymentStatus, 
                updatedAt: new Date().toISOString()
              }
            : order
        )
      );

      return true;
    } catch (error) {
      setError('Failed to update payment status');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const getUserOrders = (userId) => {
    return orders.filter(order => order.userId === userId);
  };

  const getAllOrders = () => {
    return orders;
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const cancelOrder = async (orderId) => {
    const order = getOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === 'delivered' || order.status === 'cancelled') {
      throw new Error('Cannot cancel this order');
    }

    return updateOrderStatus(orderId, 'cancelled');
  };

  const value = {
    orders,
    loading,
    error,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    getOrderById,
    getUserOrders,
    getAllOrders,
    getOrdersByStatus,
    cancelOrder,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};