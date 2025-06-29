import React, { useState } from 'react';
import { useBook } from '../../contexts/BookContext';
import { PageHeader, Table, Modal, FormField } from '../../components/admin';
import {
  Package,
  DollarSign,
  Tag,
  Upload,
  Download,
  CheckSquare,
  Square,
  AlertTriangle,
  FileText,
  Trash2,
  Edit,
} from 'lucide-react';
import { motion } from 'framer-motion';

const BulkOperations = () => {
  const { books, categories } = useBook();
  const [selectedBooks, setSelectedBooks] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [activeOperation, setActiveOperation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operationData, setOperationData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

  const operations = [
    {
      id: 'price-update',
      title: 'Bulk Price Update',
      description: 'Update prices for multiple books at once',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'stock-update',
      title: 'Bulk Stock Update',
      description: 'Update inventory levels for multiple books',
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'category-update',
      title: 'Bulk Category Update',
      description: 'Change categories for multiple books',
      icon: Tag,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'status-update',
      title: 'Bulk Status Update',
      description: 'Enable/disable multiple books',
      icon: CheckSquare,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      id: 'export',
      title: 'Export Books',
      description: 'Export selected books to CSV/Excel',
      icon: Download,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      id: 'import',
      title: 'Import Books',
      description: 'Import books from CSV/Excel file',
      icon: Upload,
      color: 'bg-teal-100 text-teal-600',
    },
  ];

  const handleSelectBook = (bookId) => {
    setSelectedBooks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBooks(new Set());
    } else {
      setSelectedBooks(new Set(books.map(book => book.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleOperation = (operation) => {
    if (operation.id === 'export') {
      handleExport();
      return;
    }
    
    if (operation.id === 'import') {
      setActiveOperation(operation);
      setOperationData({});
      setIsModalOpen(true);
      return;
    }

    if (selectedBooks.size === 0) {
      alert('Please select at least one book to perform this operation.');
      return;
    }

    setActiveOperation(operation);
    setOperationData({});
    setIsModalOpen(true);
  };

  const handleExport = () => {
    const selectedBooksData = books.filter(book => selectedBooks.has(book.id));
    const dataToExport = selectedBooksData.length > 0 ? selectedBooksData : books;
    
    const csvContent = [
      ['ID', 'Title', 'Author', 'Price', 'Stock', 'Category', 'ISBN', 'Published Date'].join(','),
      ...dataToExport.map(book => [
        book.id,
        `"${book.title}"`,
        `"${book.author}"`,
        book.price,
        book.stock,
        book.category_id,
        book.isbn,
        book.published_date,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `books-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedBooksArray = Array.from(selectedBooks);
      let successCount = 0;
      let errorCount = 0;
      
      // Mock operation results
      if (activeOperation.id === 'price-update') {
        successCount = selectedBooksArray.length;
        // In real implementation, update prices in database
      } else if (activeOperation.id === 'stock-update') {
        successCount = selectedBooksArray.length;
        // In real implementation, update stock in database
      } else if (activeOperation.id === 'category-update') {
        successCount = selectedBooksArray.length;
        // In real implementation, update categories in database
      } else if (activeOperation.id === 'status-update') {
        successCount = selectedBooksArray.length;
        // In real implementation, update status in database
      } else if (activeOperation.id === 'import') {
        // Mock import results
        successCount = Math.floor(Math.random() * 50) + 10;
        errorCount = Math.floor(Math.random() * 5);
      }
      
      setResults({
        success: successCount,
        errors: errorCount,
        total: successCount + errorCount,
      });
      
    } catch (error) {
      console.error('Operation failed:', error);
      setResults({
        success: 0,
        errors: selectedBooks.size,
        total: selectedBooks.size,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const columns = [
    { id: 'select', label: '', sortable: false, width: '50px' },
    { id: 'id', label: 'ID', sortable: true },
    { id: 'title', label: 'Title', sortable: true },
    { id: 'author', label: 'Author', sortable: true },
    { id: 'price', label: 'Price', sortable: true },
    { id: 'stock', label: 'Stock', sortable: true },
    { id: 'category', label: 'Category', sortable: false },
  ];

  const renderBookRow = (book) => (
    <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selectedBooks.has(book.id)}
          onChange={() => handleSelectBook(book.id)}
          className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        {book.id}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
        {book.title}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {book.author}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        ${book.price.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          book.stock > 10 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          book.stock > 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {book.stock}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {categories.find(c => c.id === book.category_id)?.name || 'Unknown'}
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Bulk Operations" hideAddButton />

      {/* Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {operations.map((operation) => {
          const Icon = operation.icon;
          return (
            <motion.div
              key={operation.id}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
              onClick={() => handleOperation(operation)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${operation.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {operation.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {operation.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selectedBooks.size > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            <span className="font-medium text-amber-800 dark:text-amber-200">
              {selectedBooks.size} book{selectedBooks.size !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedBooks(new Set())}
              className="ml-auto text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Books Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
            />
            <span className="font-medium text-gray-800 dark:text-white">
              Select All ({books.length} books)
            </span>
          </div>
        </div>
        
        <Table
          columns={columns}
          data={books}
          renderRow={renderBookRow}
        />
      </div>

      {/* Operation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setResults(null);
        }}
        title={activeOperation?.title || 'Bulk Operation'}
        footer={
          !results && (
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsModalOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isProcessing ? 'Processing...' : 'Execute Operation'}
              </button>
            </div>
          )
        }
      >
        {results ? (
          // Results Display
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Operation Completed
              </h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {results.success}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Successful
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {results.errors}
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Errors
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {results.total}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Total
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Operation Form
          <div className="space-y-4">
            {activeOperation?.id === 'price-update' && (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    This will update prices for {selectedBooks.size} selected book{selectedBooks.size !== 1 ? 's' : ''}.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Update Type
                  </label>
                  <select
                    value={operationData.updateType || 'percentage'}
                    onChange={(e) => setOperationData({ ...operationData, updateType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <option value="percentage">Percentage Change</option>
                    <option value="fixed">Fixed Amount Change</option>
                    <option value="set">Set Specific Price</option>
                  </select>
                </div>
                <FormField
                  label={
                    operationData.updateType === 'percentage' ? 'Percentage (%)' :
                    operationData.updateType === 'fixed' ? 'Amount ($)' :
                    'New Price ($)'
                  }
                  type="number"
                  value={operationData.value || ''}
                  onChange={(e) => setOperationData({ ...operationData, value: e.target.value })}
                  required
                />
              </>
            )}

            {activeOperation?.id === 'stock-update' && (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    This will update stock levels for {selectedBooks.size} selected book{selectedBooks.size !== 1 ? 's' : ''}.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Update Type
                  </label>
                  <select
                    value={operationData.updateType || 'add'}
                    onChange={(e) => setOperationData({ ...operationData, updateType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <option value="add">Add to Current Stock</option>
                    <option value="subtract">Subtract from Current Stock</option>
                    <option value="set">Set Specific Stock Level</option>
                  </select>
                </div>
                <FormField
                  label="Quantity"
                  type="number"
                  value={operationData.quantity || ''}
                  onChange={(e) => setOperationData({ ...operationData, quantity: e.target.value })}
                  required
                />
              </>
            )}

            {activeOperation?.id === 'category-update' && (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    This will change the category for {selectedBooks.size} selected book{selectedBooks.size !== 1 ? 's' : ''}.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Category
                  </label>
                  <select
                    value={operationData.categoryId || ''}
                    onChange={(e) => setOperationData({ ...operationData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {activeOperation?.id === 'status-update' && (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    This will change the status for {selectedBooks.size} selected book{selectedBooks.size !== 1 ? 's' : ''}.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Status
                  </label>
                  <select
                    value={operationData.status || 'active'}
                    onChange={(e) => setOperationData({ ...operationData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </>
            )}

            {activeOperation?.id === 'import' && (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Upload a CSV file with book data. The file should include columns: Title, Author, Price, Stock, Category, ISBN, Published Date.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CSV File
                  </label>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => setOperationData({ ...operationData, file: e.target.files[0] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="skipDuplicates"
                    checked={operationData.skipDuplicates || false}
                    onChange={(e) => setOperationData({ ...operationData, skipDuplicates: e.target.checked })}
                    className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="skipDuplicates" className="text-sm text-gray-700 dark:text-gray-300">
                    Skip duplicate entries (based on ISBN)
                  </label>
                </div>
              </>
            )}

            {isProcessing && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-amber-800 dark:text-amber-200">
                    Processing operation... This may take a few moments.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BulkOperations;