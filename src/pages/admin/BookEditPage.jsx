import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBook } from '../../contexts/BookContext';
import { useChangelog } from '../../contexts/ChangelogContext';
import { PageHeader, FormField } from '../../components/admin';
import {
  ArrowLeft,
  Save,
  Image,
  AlertCircle,
  Trash2,
} from 'lucide-react';

const BookEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, categories, updateBook, deleteBook } = useBook();
  const { addChangelogEntry } = useChangelog();
  
  const [originalBook, setOriginalBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    isbn: '',
    published_date: '',
    cover_image: '',
    pages: '',
    language: 'English',
    format: 'Paperback',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const book = books.find(b => b.id === parseInt(id));
    if (book) {
      setOriginalBook(book);
      setFormData({
        title: book.title || '',
        author: book.author || '',
        description: book.description || '',
        price: book.price?.toString() || '',
        stock: book.stock?.toString() || '',
        category_id: book.category_id?.toString() || '',
        isbn: book.isbn || '',
        published_date: book.published_date || '',
        cover_image: book.cover_image || '',
        pages: book.pages?.toString() || '',
        language: book.language || 'English',
        format: book.format || 'Paperback',
      });
    }
  }, [id, books]);

  useEffect(() => {
    if (originalBook) {
      const hasChanged = Object.keys(formData).some(key => {
        const originalValue = originalBook[key]?.toString() || '';
        const currentValue = formData[key] || '';
        return originalValue !== currentValue;
      });
      setHasChanges(hasChanged);
    }
  }, [formData, originalBook]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (!formData.published_date) newErrors.published_date = 'Publication date is required';
    if (!formData.cover_image.trim()) newErrors.cover_image = 'Cover image URL is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category_id: parseInt(formData.category_id),
        pages: formData.pages ? parseInt(formData.pages) : null,
      };
      
      const updatedBook = await updateBook(parseInt(id), bookData);
      
      // Generate change description
      const changes = [];
      Object.keys(formData).forEach(key => {
        const oldValue = originalBook[key];
        const newValue = bookData[key];
        if (oldValue !== newValue) {
          changes.push(`${key}: "${oldValue}" → "${newValue}"`);
        }
      });
      
      // Add changelog entry
      addChangelogEntry(
        'book',
        parseInt(id),
        'update',
        `Updated book: ${changes.join(', ')}`,
        originalBook,
        updatedBook
      );
      
      navigate(`/admin/books/${id}`);
    } catch (error) {
      console.error('Failed to update book:', error);
      setErrors({ submit: 'Failed to update book. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${originalBook?.title}"? This action cannot be undone.`)) {
      try {
        await deleteBook(parseInt(id));
        
        // Add changelog entry
        addChangelogEntry(
          'book',
          parseInt(id),
          'delete',
          `Deleted book: ${originalBook.title}`,
          originalBook,
          null
        );
        
        navigate('/admin');
      } catch (error) {
        console.error('Failed to delete book:', error);
        setErrors({ submit: 'Failed to delete book. Please try again.' });
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!originalBook) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Book Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The book you're trying to edit doesn't exist.
          </p>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/admin/books/${id}`)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Edit Book
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {originalBook.title}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Delete Book
        </button>
      </div>

      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">You have unsaved changes</span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Alert */}
          {errors.submit && (
            <div className="flex items-center p-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800">
              <AlertCircle className="w-5 h-5 mr-2" />
              {errors.submit}
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={errors.title}
                required
              />
              <FormField
                label="Author"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                error={errors.author}
                required
              />
              <div className="md:col-span-2">
                <FormField
                  label="Description"
                  type="textarea"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  error={errors.description}
                  required
                  inputProps={{ rows: 4 }}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Pricing & Inventory
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                label="Price ($)"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                error={errors.price}
                required
              />
              <FormField
                label="Stock Quantity"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                error={errors.stock}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white ${
                    errors.category_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.category_id}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Publication Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Publication Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="ISBN"
                value={formData.isbn}
                onChange={(e) => handleInputChange('isbn', e.target.value)}
                error={errors.isbn}
                required
              />
              <FormField
                label="Publication Date"
                type="date"
                value={formData.published_date}
                onChange={(e) => handleInputChange('published_date', e.target.value)}
                error={errors.published_date}
                required
              />
              <FormField
                label="Pages"
                type="number"
                min="1"
                value={formData.pages}
                onChange={(e) => handleInputChange('pages', e.target.value)}
                error={errors.pages}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Italian">Italian</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Format
                </label>
                <select
                  value={formData.format}
                  onChange={(e) => handleInputChange('format', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Paperback">Paperback</option>
                  <option value="Hardcover">Hardcover</option>
                  <option value="eBook">eBook</option>
                  <option value="Audiobook">Audiobook</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Cover Image
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  label="Cover Image URL"
                  value={formData.cover_image}
                  onChange={(e) => handleInputChange('cover_image', e.target.value)}
                  error={errors.cover_image}
                  placeholder="https://example.com/book-cover.jpg"
                  required
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter a direct URL to the book cover image
                </p>
              </div>
              <div>
                {formData.cover_image && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Preview
                    </label>
                    <div className="w-32 h-40 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      <img
                        src={formData.cover_image}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center" style={{ display: 'none' }}>
                        <Image className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate(`/admin/books/${id}`)}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !hasChanges}
              className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookEditPage;