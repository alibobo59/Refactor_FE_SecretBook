import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/admin';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Clock,
  Package,
  FileText,
  BarChart3,
} from 'lucide-react';
import { motion } from 'framer-motion';

const BulkOperationReport = () => {
  const { operationId } = useParams();
  const navigate = useNavigate();
  
  // Mock operation data - in real app, this would come from context or API
  const [operationData] = useState({
    id: operationId,
    type: 'price-update',
    name: 'Bulk Price Update',
    startTime: '2024-01-21T10:30:00Z',
    endTime: '2024-01-21T10:32:15Z',
    status: 'completed',
    totalItems: 150,
    successCount: 142,
    errorCount: 8,
    warningCount: 3,
    parameters: {
      updateType: 'percentage',
      value: 10,
      selectedCategories: ['Fiction', 'Mystery'],
    },
    results: [
      {
        id: 1,
        itemId: 'book-001',
        itemName: 'The Great Gatsby',
        status: 'success',
        oldValue: '$12.99',
        newValue: '$14.29',
        message: 'Price updated successfully',
      },
      {
        id: 2,
        itemId: 'book-002',
        itemName: 'To Kill a Mockingbird',
        status: 'success',
        oldValue: '$15.99',
        newValue: '$17.59',
        message: 'Price updated successfully',
      },
      {
        id: 3,
        itemId: 'book-003',
        itemName: '1984',
        status: 'error',
        oldValue: '$13.99',
        newValue: null,
        message: 'Book is currently out of stock, price update skipped',
      },
      {
        id: 4,
        itemId: 'book-004',
        itemName: 'Pride and Prejudice',
        status: 'warning',
        oldValue: '$11.99',
        newValue: '$13.19',
        message: 'Price updated but below minimum margin threshold',
      },
      {
        id: 5,
        itemId: 'book-005',
        itemName: 'The Hobbit',
        status: 'error',
        oldValue: '$16.99',
        newValue: null,
        message: 'Invalid price calculation - exceeds maximum allowed price',
      },
      // Add more mock results...
    ],
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getOperationIcon = (type) => {
    switch (type) {
      case 'price-update':
        return <BarChart3 className="h-6 w-6" />;
      case 'stock-update':
        return <Package className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const calculateDuration = () => {
    const start = new Date(operationData.startTime);
    const end = new Date(operationData.endTime);
    const duration = Math.round((end - start) / 1000);
    return `${duration} seconds`;
  };

  const calculateSuccessRate = () => {
    return ((operationData.successCount / operationData.totalItems) * 100).toFixed(1);
  };

  const exportReport = (format) => {
    const data = {
      operation: operationData.name,
      startTime: operationData.startTime,
      endTime: operationData.endTime,
      duration: calculateDuration(),
      totalItems: operationData.totalItems,
      successCount: operationData.successCount,
      errorCount: operationData.errorCount,
      warningCount: operationData.warningCount,
      successRate: calculateSuccessRate(),
      results: operationData.results,
    };

    if (format === 'csv') {
      const csvContent = [
        ['Item ID', 'Item Name', 'Status', 'Old Value', 'New Value', 'Message'].join(','),
        ...operationData.results.map(result => [
          result.itemId,
          `"${result.itemName}"`,
          result.status,
          result.oldValue || '',
          result.newValue || '',
          `"${result.message}"`,
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulk-operation-report-${operationData.id}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulk-operation-report-${operationData.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const retryFailedItems = () => {
    const failedItems = operationData.results.filter(r => r.status === 'error');
    console.log('Retrying failed items:', failedItems);
    // In real app, this would trigger a new bulk operation for failed items
  };

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
              Bulk Operation Report
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Operation ID: {operationData.id}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportReport('csv')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={() => exportReport('json')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </button>
          {operationData.errorCount > 0 && (
            <button
              onClick={retryFailedItems}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Failed
            </button>
          )}
        </div>
      </div>

      {/* Operation Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg text-amber-600 dark:text-amber-400">
            {getOperationIcon(operationData.type)}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {operationData.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Completed on {new Date(operationData.endTime).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-800 dark:text-white">Duration</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {calculateDuration()}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-800 dark:text-white">Total Items</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {operationData.totalItems}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium text-gray-800 dark:text-white">Success Rate</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {calculateSuccessRate()}%
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="font-medium text-gray-800 dark:text-white">Errors</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {operationData.errorCount}
            </p>
          </div>
        </div>
      </div>

      {/* Results Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Results Summary
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Successful</span>
              </div>
              <span className="font-semibold text-green-600">
                {operationData.successCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-700 dark:text-gray-300">Warnings</span>
              </div>
              <span className="font-semibold text-yellow-600">
                {operationData.warningCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-gray-700 dark:text-gray-300">Errors</span>
              </div>
              <span className="font-semibold text-red-600">
                {operationData.errorCount}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Operation Parameters
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Update Type:</span>
              <p className="font-medium text-gray-800 dark:text-white">
                {operationData.parameters.updateType}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Value:</span>
              <p className="font-medium text-gray-800 dark:text-white">
                {operationData.parameters.value}%
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Categories:</span>
              <p className="font-medium text-gray-800 dark:text-white">
                {operationData.parameters.selectedCategories.join(', ')}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Timing Information
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Started:</span>
              <p className="font-medium text-gray-800 dark:text-white">
                {new Date(operationData.startTime).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Completed:</span>
              <p className="font-medium text-gray-800 dark:text-white">
                {new Date(operationData.endTime).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Duration:</span>
              <p className="font-medium text-gray-800 dark:text-white">
                {calculateDuration()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Detailed Results
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Individual item processing results
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Old Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  New Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {operationData.results.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {result.itemName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {result.itemId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {result.oldValue || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {result.newValue || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    <div className="max-w-xs truncate" title={result.message}>
                      {result.message}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationReport;