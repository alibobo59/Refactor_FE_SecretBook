import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  CheckSquare,
  Square,
  ShoppingBag,
  Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const {
    cartItems,
    selectedItems,
    removeFromCart,
    updateQuantity,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    getSelectedTotal,
    getSelectedItems,
    getSelectedItemsCount,
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      deselectAllItems();
    } else {
      selectAllItems();
    }
  };

  const handleProceedToCheckout = () => {
    if (selectedItems.size === 0) {
      toast?.showError('No items selected', 'Please select at least one item to proceed');
      return;
    }

    if (!user) {
      toast?.showError('Please login', 'You need to be logged in to checkout');
      navigate('/login');
      return;
    }

    navigate('/checkout');
  };

  const selectedTotal = getSelectedTotal();
  const selectedCount = getSelectedItemsCount();
  const tax = selectedTotal * 0.08; // 8% tax
  const shipping = selectedTotal > 50 ? 0 : 5.99;
  const finalTotal = selectedTotal + tax + shipping;

  if (!user) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Please Login
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be logged in to view your cart
          </p>
          <Link
            to="/login"
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Looks like you haven't added any books to your cart yet
            </p>
            <Link
              to="/books"
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors inline-flex items-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              {/* Select All Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
                  >
                    {selectedItems.size === cartItems.length ? (
                      <CheckSquare className="h-5 w-5 text-amber-600" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                    <span className="font-medium">
                      Select All ({cartItems.length} items)
                    </span>
                  </button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedItems.size} of {cartItems.length} selected
                  </span>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Selection Checkbox */}
                        <button
                          onClick={() => toggleItemSelection(item.id)}
                          className="text-gray-400 hover:text-amber-600 transition-colors"
                        >
                          {selectedItems.has(item.id) ? (
                            <CheckSquare className="h-5 w-5 text-amber-600" />
                          ) : (
                            <Square className="h-5 w-5" />
                          )}
                        </button>

                        {/* Book Image */}
                        <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Book Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            by {item.author}
                          </p>
                          <p className="text-lg font-bold text-amber-600 mt-1">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 font-medium text-gray-800 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Remove from cart"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="mt-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <button className="text-gray-400 hover:text-red-500 transition-colors">
                            <Heart className="h-4 w-4" />
                          </button>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Save for later
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Subtotal: ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Selected Items ({selectedCount})</span>
                  <span>${selectedTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {selectedTotal < 50 && selectedTotal > 0 && (
                  <div className="text-sm text-amber-600 dark:text-amber-500">
                    Add ${(50 - selectedTotal).toFixed(2)} more for free shipping!
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-white">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                disabled={selectedItems.size === 0 || isProcessing}
                className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {selectedItems.size === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                  Select items to proceed
                </p>
              )}

              <div className="mt-4 text-center">
                <Link
                  to="/books"
                  className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 text-sm font-medium"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;