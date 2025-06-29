import React, { createContext, useContext, useState, useEffect } from 'react';

const PromotionContext = createContext();

export const usePromotion = () => {
  return useContext(PromotionContext);
};

export const PromotionProvider = ({ children }) => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      // Simulate API call - in real app, this would fetch from backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPromotions = [
        {
          id: 1,
          title: 'Summer Reading Sale',
          description: 'Get 25% off on all fiction books',
          discountType: 'percentage',
          discountValue: 25,
          code: 'SUMMER25',
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          isActive: true,
          minOrderAmount: 30,
          maxDiscount: 50,
          applicableCategories: ['Fiction'],
          image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
        },
        {
          id: 2,
          title: 'New Customer Special',
          description: '15% off your first order',
          discountType: 'percentage',
          discountValue: 15,
          code: 'WELCOME15',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          isActive: true,
          minOrderAmount: 25,
          maxDiscount: 30,
          applicableCategories: [],
          image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        },
        {
          id: 3,
          title: 'Free Shipping Weekend',
          description: 'Free shipping on all orders over $35',
          discountType: 'free_shipping',
          discountValue: 0,
          code: 'FREESHIP',
          startDate: '2024-07-20',
          endDate: '2024-07-22',
          isActive: true,
          minOrderAmount: 35,
          maxDiscount: 15,
          applicableCategories: [],
          image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
        },
        {
          id: 4,
          title: 'Mystery Book Bundle',
          description: 'Buy 3 mystery books, get 1 free',
          discountType: 'buy_x_get_y',
          discountValue: 1,
          code: 'MYSTERY3FOR2',
          startDate: '2024-07-01',
          endDate: '2024-07-31',
          isActive: true,
          minOrderAmount: 0,
          maxDiscount: 20,
          applicableCategories: ['Mystery'],
          image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        },
      ];

      setPromotions(mockPromotions);
    } catch (error) {
      console.error('Failed to load promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivePromotions = () => {
    const now = new Date();
    return promotions.filter(promo => 
      promo.isActive && 
      new Date(promo.startDate) <= now && 
      new Date(promo.endDate) >= now
    );
  };

  const validatePromoCode = (code, cartTotal, cartItems) => {
    const promotion = promotions.find(p => 
      p.code.toLowerCase() === code.toLowerCase() && 
      p.isActive &&
      new Date() >= new Date(p.startDate) &&
      new Date() <= new Date(p.endDate)
    );

    if (!promotion) {
      return { valid: false, error: 'Invalid or expired promo code' };
    }

    if (cartTotal < promotion.minOrderAmount) {
      return { 
        valid: false, 
        error: `Minimum order amount of $${promotion.minOrderAmount} required` 
      };
    }

    // Check if applicable categories match
    if (promotion.applicableCategories.length > 0) {
      const hasApplicableItems = cartItems.some(item => 
        promotion.applicableCategories.includes(item.category)
      );
      
      if (!hasApplicableItems) {
        return { 
          valid: false, 
          error: `This code only applies to ${promotion.applicableCategories.join(', ')} books` 
        };
      }
    }

    return { valid: true, promotion };
  };

  const calculateDiscount = (promotion, cartTotal, cartItems) => {
    let discount = 0;

    switch (promotion.discountType) {
      case 'percentage':
        discount = (cartTotal * promotion.discountValue) / 100;
        break;
      case 'fixed':
        discount = promotion.discountValue;
        break;
      case 'free_shipping':
        discount = 0; // Handled separately in shipping calculation
        break;
      case 'buy_x_get_y':
        // Simplified implementation - would need more complex logic in real app
        const applicableItems = promotion.applicableCategories.length > 0
          ? cartItems.filter(item => promotion.applicableCategories.includes(item.category))
          : cartItems;
        
        const totalQuantity = applicableItems.reduce((sum, item) => sum + item.quantity, 0);
        const freeItems = Math.floor(totalQuantity / 3) * promotion.discountValue;
        const cheapestPrice = Math.min(...applicableItems.map(item => item.price));
        discount = freeItems * cheapestPrice;
        break;
    }

    // Apply maximum discount limit
    if (promotion.maxDiscount && discount > promotion.maxDiscount) {
      discount = promotion.maxDiscount;
    }

    return discount;
  };

  const value = {
    promotions,
    loading,
    getActivePromotions,
    validatePromoCode,
    calculateDiscount,
    refreshPromotions: loadPromotions,
  };

  return (
    <PromotionContext.Provider value={value}>
      {children}
    </PromotionContext.Provider>
  );
};