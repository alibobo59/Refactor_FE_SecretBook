import React from 'react';
import { useCart } from '../contexts/CartContext';

const CheckoutPage = () => {
  const { cartItems, getCartTotal } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      {/* Add checkout form here */}
    </div>
  );
}

export default CheckoutPage;