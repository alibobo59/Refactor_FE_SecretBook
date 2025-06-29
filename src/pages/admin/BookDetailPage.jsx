import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBook } from '../../contexts/BookContext';
import { useChangelog } from '../../contexts/ChangelogContext';
import { PageHeader, StatCard, Table } from '../../components/admin';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  DollarSign,
  Package,
  Star,
  Clock,
  Activity,
  FileText,
  Image,
} from 'lucide-react';
import { motion } from 'framer-motion';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, categories } = useBook();
  const { getChangelogForEntity } = useChangelog();
  const [book, setBook] = useState(null);
  const [changelog, setChangelog] = useState([]);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const foundBook = books.find(b => b.id === parseInt(id));
    if (foundBook) {
      setBook(foundBook);
      setChangelog(getChangelogForEntity('book', foundBook.id));
    }
  }, [id, books, getChangelogForEntity]);

  if (!book) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Book Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The book you're looking for doesn't exist.
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

  const category = categories.find(c => c.id === book.category_id);

  const tabs = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'changelog', label: 'Changelog', icon: Activity },
    { id: 'media', label: 'Media', icon: Image },
  ];

  const changelogColumns = [
    { id: 'timestamp', label: 'Date', sortable: true },
    { id: 'action', label: 'Action', sortable: true },
    { id: 'user', label: 'User', sortable: true },
    { id: 'changes', label: 'Changes', sortable: false },
  ];

  const getActionColor = (action) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'update':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'delete':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'publish':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600' };
    if (stock < 10) return { label: 'Low Stock', color: 'text-yellow-600' };
    return { label: 'In Stock', color: 'text-green-600' };
  };

  const stockStatus = getStockStatus(book.stock);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {book.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Book ID: {book.id}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/admin/books/${book.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit Book
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this book?')) {
                // Handle delete
                navigate('/admin');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<DollarSign className="h-6 w-6" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          title="Price"
          value={`$${book.price.toFixed(2)}`}
        />
        <StatCard
          icon={<Package className="h-6 w-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          title="Stock"
          value={book.stock}
        />
        <StatCard
          icon={<Star className="h-6 w-6" />}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          title="Rating"
          value={book.rating || 'N/A'}
        />
        <StatCard
          icon={<Eye className="h-6 w-6" />}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          title="Views"
          value={book.views || 0}
        />
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-600 dark:text-amber-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Book Cover */}
              <div className="lg:col-span-1">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>

              {/* Book Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                      Basic Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Title
                        </label>
                        <p className="text-gray-900 dark:text-white">{book.title}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Author
                        </label>
                        <p className="text-gray-900 dark:text-white">{book.author}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Category
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {category?.name || 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          ISBN
                        </label>
                        <p className="text-gray-900 dark:text-white">{book.isbn}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                      Pricing & Inventory
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Price
                        </label>
                        <p className="text-gray-900 dark:text-white font-semibold">
                          ${book.price.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Stock Quantity
                        </label>
                        <p className={`font-semibold ${stockStatus.color}`}>
                          {book.stock} ({stockStatus.label})
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Publication Date
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(book.published_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Description
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {book.description || 'No description available.'}
                    </p>
                  </div>
                </div>

                {/* Additional Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Additional Details
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Pages</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {book.pages || 'N/A'}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Language</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {book.language || 'English'}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Format</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {book.format || 'Paperback'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Changelog Tab */}
          {activeTab === 'changelog' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Change History
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track all changes made to this book over time.
                </p>
              </div>

              {changelog.length > 0 ? (
                <Table
                  columns={changelogColumns}
                  data={changelog}
                  renderRow={(entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div>
                          <div className="font-medium">
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActionColor(entry.action)}`}>
                          {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {entry.userName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <div className="max-w-md">
                          {entry.changes}
                          {entry.oldData && entry.newData && (
                            <details className="mt-2">
                              <summary className="cursor-pointer text-amber-600 hover:text-amber-700">
                                View Details
                              </summary>
                              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <strong>Before:</strong>
                                    <pre className="mt-1 whitespace-pre-wrap">
                                      {JSON.stringify(entry.oldData, null, 2)}
                                    </pre>
                                  </div>
                                  <div>
                                    <strong>After:</strong>
                                    <pre className="mt-1 whitespace-pre-wrap">
                                      {JSON.stringify(entry.newData, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            </details>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                />
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                    No Changes Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Changes to this book will appear here.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Book Media
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage images and other media files for this book.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Cover Image */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="aspect-w-3 aspect-h-4 mb-3">
                    <img
                      src={book.cover_image}
                      alt="Book Cover"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium text-gray-800 dark:text-white">Cover Image</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Primary cover</p>
                    <button className="mt-2 text-amber-600 hover:text-amber-700 text-sm">
                      Replace Image
                    </button>
                  </div>
                </div>

                {/* Add more media placeholder */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-center">
                      <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Add additional images
                      </p>
                      <button className="mt-2 text-amber-600 hover:text-amber-700 text-sm">
                        Upload Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;