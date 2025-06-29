import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const VariationContext = createContext();

export const useVariation = () => {
  return useContext(VariationContext);
};

export const VariationProvider = ({ children }) => {
  const { user } = useAuth();
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVariations();
  }, []);

  const loadVariations = () => {
    const storedVariations = localStorage.getItem('bookVariations');
    if (storedVariations) {
      setVariations(JSON.parse(storedVariations));
    }
  };

  const createVariation = async (variationData) => {
    setLoading(true);
    try {
      const newVariation = {
        id: Date.now(),
        ...variationData,
        sku: variationData.sku || generateSKU(variationData),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedVariations = [...variations, newVariation];
      setVariations(updatedVariations);
      localStorage.setItem('bookVariations', JSON.stringify(updatedVariations));
      
      return newVariation;
    } catch (error) {
      console.error('Failed to create variation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateVariation = async (id, updates) => {
    setLoading(true);
    try {
      const updatedVariations = variations.map(variation =>
        variation.id === id ? { ...variation, ...updates, updatedAt: new Date().toISOString() } : variation
      );
      
      setVariations(updatedVariations);
      localStorage.setItem('bookVariations', JSON.stringify(updatedVariations));
      
      return updatedVariations.find(variation => variation.id === id);
    } catch (error) {
      console.error('Failed to update variation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteVariation = async (id) => {
    setLoading(true);
    try {
      const updatedVariations = variations.filter(variation => variation.id !== id);
      setVariations(updatedVariations);
      localStorage.setItem('bookVariations', JSON.stringify(updatedVariations));
    } catch (error) {
      console.error('Failed to delete variation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getVariationsByBookId = (bookId) => {
    return variations.filter(variation => variation.bookId === bookId);
  };

  const getVariationById = (id) => {
    return variations.find(variation => variation.id === id);
  };

  const generateSKU = (variationData) => {
    const timestamp = Date.now().toString().slice(-6);
    const bookPrefix = variationData.bookId ? `B${variationData.bookId}` : 'BK';
    return `${bookPrefix}-${timestamp}`;
  };

  const bulkCreateVariations = async (bookId, variationsData) => {
    setLoading(true);
    try {
      const newVariations = variationsData.map((variationData, index) => ({
        id: Date.now() + index,
        bookId,
        ...variationData,
        sku: variationData.sku || generateSKU({ ...variationData, bookId }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      
      const updatedVariations = [...variations, ...newVariations];
      setVariations(updatedVariations);
      localStorage.setItem('bookVariations', JSON.stringify(updatedVariations));
      
      return newVariations;
    } catch (error) {
      console.error('Failed to create variations:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    variations,
    loading,
    createVariation,
    updateVariation,
    deleteVariation,
    getVariationsByBookId,
    getVariationById,
    bulkCreateVariations,
    refreshVariations: loadVariations,
  };

  return (
    <VariationContext.Provider value={value}>
      {children}
    </VariationContext.Provider>
  );
};