import React, { useState, useEffect } from 'react';
import { useVariation } from '../../contexts/VariationContext';
import { useAttribute } from '../../contexts/AttributeContext';
import { Modal, FormField } from '../admin';
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Package,
  DollarSign,
  Hash,
  Image,
  AlertCircle,
  Save,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VariationManager = ({ bookId, bookTitle, mainBookImage, onVariationsChange }) => {
  const {
    variations,
    loading,
    createVariation,
    updateVariation,
    deleteVariation,
    getVariationsByBookId,
    bulkCreateVariations,
  } = useVariation();

  const { attributes } = useAttribute();

  const [bookVariations, setBookVariations] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkCreateModalOpen, setIsBulkCreateModalOpen] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    sku: '',
    image: '',
    attributes: {},
  });
  const [bulkFormData, setBulkFormData] = useState({
    selectedAttributes: [],
    basePrice: '',
    baseStock: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bookId) {
      const bookVars = getVariationsByBookId(bookId);
      setBookVariations(bookVars);
      if (onVariationsChange) {
        onVariationsChange(bookVars);
      }
    }
  }, [bookId, variations, getVariationsByBookId, onVariationsChange]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Variation name is required';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateVariationName = (attributes) => {
    const attrValues = Object.values(attributes).filter(val => val);
    return attrValues.length > 0 ? attrValues.join(' - ') : 'Default Variation';
  };

  const generateSKU = (bookId, attributes) => {
    const timestamp = Date.now().toString().slice(-4);
    const attrCode = Object.values(attributes).map(val => val.substring(0, 2).toUpperCase()).join('');
    return `B${bookId}-${attrCode}-${timestamp}`;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    
    try {
      const variationData = {
        bookId,
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sku: formData.sku,
        image: formData.image || mainBookImage,
        attributes: formData.attributes,
      };
      
      await createVariation(variationData);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create variation:', error);
    }
  };

  const handleEdit = async () => {
    if (!validateForm()) return;
    
    try {
      const variationData = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sku: formData.sku,
        image: formData.image || mainBookImage,
        attributes: formData.attributes,
      };
      
      await updateVariation(selectedVariation.id, variationData);
      setIsEditModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to update variation:', error);
    }
  };

  const handleDelete = async (variation) => {
    if (window.confirm(`Are you sure you want to delete the variation "${variation.name}"?`)) {
      try {
        await deleteVariation(variation.id);
      } catch (error) {
        console.error('Failed to delete variation:', error);
      }
    }
  };

  const handleBulkCreate = async () => {
    if (!bulkFormData.selectedAttributes.length || !bulkFormData.basePrice || !bulkFormData.baseStock) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Generate all possible combinations
      const combinations = generateCombinations(bulkFormData.selectedAttributes);
      
      const variationsData = combinations.map((combination, index) => {
        const attributes = {};
        combination.forEach((value, attrIndex) => {
          const attr = bulkFormData.selectedAttributes[attrIndex];
          attributes[attr.name] = value;
        });
        
        const name = generateVariationName(attributes);
        const sku = generateSKU(bookId, attributes);
        
        return {
          name,
          price: parseFloat(bulkFormData.basePrice),
          stock: parseInt(bulkFormData.baseStock),
          sku,
          image: mainBookImage,
          attributes,
        };
      });
      
      await bulkCreateVariations(bookId, variationsData);
      setIsBulkCreateModalOpen(false);
      resetBulkForm();
    } catch (error) {
      console.error('Failed to create bulk variations:', error);
    }
  };

  const generateCombinations = (selectedAttributes) => {
    if (selectedAttributes.length === 0) return [];
    
    const combinations = [];
    const generate = (current, depth) => {
      if (depth === selectedAttributes.length) {
        combinations.push([...current]);
        return;
      }
      
      const attr = selectedAttributes[depth];
      for (const option of attr.options) {
        current[depth] = option;
        generate(current, depth + 1);
      }
    };
    
    generate(new Array(selectedAttributes.length), 0);
    return combinations;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      stock: '',
      sku: '',
      image: '',
      attributes: {},
    });
    setErrors({});
    setSelectedVariation(null);
  };

  const resetBulkForm = () => {
    setBulkFormData({
      selectedAttributes: [],
      basePrice: '',
      baseStock: '',
    });
  };

  const openCreateModal = () => {
    resetForm();
    setFormData(prev => ({
      ...prev,
      sku: generateSKU(bookId, {}),
    }));
    setIsCreateModalOpen(true);
  };

  const openEditModal = (variation) => {
    setSelectedVariation(variation);
    setFormData({
      name: variation.name,
      price: variation.price.toString(),
      stock: variation.stock.toString(),
      sku: variation.sku,
      image: variation.image || '',
      attributes: variation.attributes || {},
    });
    setErrors({});
    setIsEditModalOpen(true);
  };

  const duplicateVariation = async (variation) => {
    try {
      const duplicatedData = {
        ...variation,
        name: `${variation.name} (Copy)`,
        sku: generateSKU(bookId, variation.attributes),
      };
      delete duplicatedData.id;
      delete duplicatedData.createdAt;
      delete duplicatedData.updatedAt;
      
      await createVariation(duplicatedData);
    } catch (error) {
      console.error('Failed to duplicate variation:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Book Variations
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage different versions of "{bookTitle}"
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsBulkCreateModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            <Package className="h-4 w-4" />
            Bulk Create
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-3 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            Add Variation
          </button>
        </div>
      </div>

      {/* Variations List */}
      <div className="space-y-4">
        <AnimatePresence>
          {bookVariations.map((variation) => (
            <motion.div
              key={variation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center gap-4">
                {/* Image */}
                <div className="w-16 h-20 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={variation.image || mainBookImage}
                    alt={variation.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = mainBookImage;
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">
                        {variation.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        SKU: {variation.sku}
                      </p>
                      
                      {/* Attributes */}
                      {Object.keys(variation.attributes || {}).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(variation.attributes).map(([key, value]) => (
                            <span
                              key={key}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                            >
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price and Stock */}
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-green-600 font-semibold">
                        <DollarSign className="h-4 w-4" />
                        ${variation.price.toFixed(2)}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
                        <Package className="h-3 w-3" />
                        {variation.stock} in stock
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => duplicateVariation(variation)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                    title="Duplicate"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(variation)}
                    className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(variation)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {bookVariations.length === 0 && (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              No variations yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create variations to offer different formats, editions, or versions of this book.
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create First Variation
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Variation Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
          resetForm();
        }}
        title={`${isCreateModalOpen ? 'Create' : 'Edit'} Variation`}
        footer={
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 flex items-center gap-2"
              onClick={isCreateModalOpen ? handleCreate : handleEdit}
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {loading ? 'Saving...' : (isCreateModalOpen ? 'Create' : 'Update')}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField
            label="Variation Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
            placeholder="e.g., Paperback, Hardcover, Special Edition"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Price ($)"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              error={errors.price}
              required
            />
            <FormField
              label="Stock Quantity"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              error={errors.stock}
              required
            />
          </div>

          <FormField
            label="SKU"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            error={errors.sku}
            required
            placeholder="Unique product identifier"
          />

          <FormField
            label="Image URL (Optional)"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="Leave empty to use main book image"
          />

          {/* Attributes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attributes
            </label>
            <div className="space-y-3">
              {attributes.map((attribute) => (
                <div key={attribute.id}>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {attribute.name}
                    {attribute.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {attribute.type === 'select' ? (
                    <select
                      value={formData.attributes[attribute.name] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        attributes: {
                          ...formData.attributes,
                          [attribute.name]: e.target.value,
                        },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      required={attribute.required}
                    >
                      <option value="">Select {attribute.name}</option>
                      {attribute.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : attribute.type === 'boolean' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.attributes[attribute.name] === 'true'}
                        onChange={(e) => setFormData({
                          ...formData,
                          attributes: {
                            ...formData.attributes,
                            [attribute.name]: e.target.checked ? 'true' : 'false',
                          },
                        })}
                        className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {attribute.name}
                      </span>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={formData.attributes[attribute.name] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        attributes: {
                          ...formData.attributes,
                          [attribute.name]: e.target.value,
                        },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      required={attribute.required}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Bulk Create Modal */}
      <Modal
        isOpen={isBulkCreateModalOpen}
        onClose={() => {
          setIsBulkCreateModalOpen(false);
          resetBulkForm();
        }}
        title="Bulk Create Variations"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                setIsBulkCreateModalOpen(false);
                resetBulkForm();
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              onClick={handleBulkCreate}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Variations'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Select attributes to generate all possible combinations automatically. 
              For example, selecting "Format" and "Language" will create variations for each format-language combination.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Attributes
            </label>
            <div className="space-y-2">
              {attributes.filter(attr => attr.type === 'select').map((attribute) => (
                <div key={attribute.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`bulk-attr-${attribute.id}`}
                    checked={bulkFormData.selectedAttributes.some(attr => attr.id === attribute.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setBulkFormData(prev => ({
                          ...prev,
                          selectedAttributes: [...prev.selectedAttributes, attribute],
                        }));
                      } else {
                        setBulkFormData(prev => ({
                          ...prev,
                          selectedAttributes: prev.selectedAttributes.filter(attr => attr.id !== attribute.id),
                        }));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`bulk-attr-${attribute.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                    {attribute.name} ({attribute.options.length} options)
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Base Price ($)"
              type="number"
              step="0.01"
              min="0"
              value={bulkFormData.basePrice}
              onChange={(e) => setBulkFormData({ ...bulkFormData, basePrice: e.target.value })}
              required
            />
            <FormField
              label="Base Stock"
              type="number"
              min="0"
              value={bulkFormData.baseStock}
              onChange={(e) => setBulkFormData({ ...bulkFormData, baseStock: e.target.value })}
              required
            />
          </div>

          {bulkFormData.selectedAttributes.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                Preview: {generateCombinations(bulkFormData.selectedAttributes).length} variations will be created
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {bulkFormData.selectedAttributes.map(attr => attr.name).join(' × ')}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default VariationManager;