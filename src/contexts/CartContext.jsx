import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const storedCart = localStorage.getItem(`cart_${user.id}`);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
        // Select all items by default
        setSelectedItems(new Set(parsedCart.map(item => item.id)));
      }
    } else {
      setCartItems([]);
      setSelectedItems(new Set());
    }
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user && cartItems.length >= 0) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = (book, quantity = 1, variationId = null) => {
    if (!user) {
      toast?.showError('Please login', 'You need to be logged in to add items to cart');
      return;
    }

    setLoading(true);
    try {
      const itemId = `${book.id}_${variationId || 'default'}`;
      const existingItemIndex = cartItems.findIndex(item => item.id === itemId);

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += quantity;
        setCartItems(updatedItems);
        
        // Add to selected items
        setSelectedItems(prev => new Set([...prev, itemId]));
        
        toast?.showSuccess('Updated cart', `Updated quantity for "${book.title}"`);
      } else {
        // Add new item
        const newItem = {
          id: itemId,
          bookId: book.id,
          variationId,
          title: book.title,
          author: book.author,
          price: book.price,
          coverImage: book.cover_image,
          quantity,
          addedAt: new Date().toISOString(),
        };
        
        const updatedItems = [...cartItems, newItem];
        setCartItems(updatedItems);
        
        // Add to selected items
        setSelectedItems(prev => new Set([...prev, itemId]));
        
        toast?.showSuccess('Added to cart', `"${book.title}" has been added to your cart`);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast?.showError('Error', 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
    
    if (item) {
      toast?.showSuccess('Removed from cart', `"${item.title}" has been removed from your cart`);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const selectAllItems = () => {
    setSelectedItems(new Set(cartItems.map(item => item.id)));
  };

  const deselectAllItems = () => {
    setSelectedItems(new Set());
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedItems(new Set());
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getSelectedTotal = () => {
    return cartItems
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getSelectedItems = () => {
    return cartItems.filter(item => selectedItems.has(item.id));
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getSelectedItemsCount = () => {
    return cartItems
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    selectedItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    clearCart,
    getCartTotal,
    getSelectedTotal,
    getSelectedItems,
    getCartItemsCount,
    getSelectedItemsCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};