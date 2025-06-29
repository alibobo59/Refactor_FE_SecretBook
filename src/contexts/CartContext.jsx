import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const toast = useToast();

  // Load cart from localStorage when component mounts or user changes
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  const addToCart = (book, quantity = 1) => {
    setCartItems(prevItems => {
      // Check if the item is already in the cart
      const existingItemIndex = prevItems.findIndex(item => item.id === book.id);

      if (existingItemIndex >= 0) {
        // Update quantity if the item is already in the cart
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        
        // Show toast for quantity update
        if (toast) {
          toast.showInfo(
            'Cart updated',
            `"${book.title}" quantity updated in your cart.`,
            {
              action: {
                label: 'View Cart',
                onClick: () => window.location.href = '/checkout',
              },
            }
          );
        }
        
        return updatedItems;
      } else {
        // Add new item to cart
        const newItems = [...prevItems, { ...book, quantity }];
        
        // Show toast for new item
        if (toast) {
          toast.showItemAddedToCart(book.title);
        }
        
        return newItems;
      }
    });
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (bookId) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === bookId);
      const newItems = prevItems.filter(item => item.id !== bookId);
      
      // Show toast for item removal
      if (toast && itemToRemove) {
        toast.showItemRemovedFromCart(itemToRemove.title);
      }
      
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    
    // Show toast for cart clear
    if (toast) {
      toast.showInfo(
        'Cart cleared',
        'All items have been removed from your cart.'
      );
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (parseFloat(item.price) || 0) * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};