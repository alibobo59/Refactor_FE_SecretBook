import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { PageHeader, StatCard } from '../../components/admin';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Download,
  RefreshCw,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
import { motion } from 'framer-motion';

const AnalyticsDashboard = () => {
  const { analytics, loading, refreshAnalytics, exportAnalytics } = useAnalytics();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedChart, setSelectedChart] = useState('revenue');

  useEffect(() => {
    refreshAnalytics();
  }, []);

  const handleExport = (type) => {
    const data = exportAnalytics(type, 'csv');
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics Dashboard" hideAddButton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { sales, users, inventory, performance } = analytics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader title="Analytics Dashboard" hideAddButton />
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={refreshAnalytics}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<DollarSign className="h-6 w-6" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          title="Total Revenue"
          value={`$${sales.totalRevenue?.toLocaleString() || 0}`}
        />
        <StatCard
          icon={<ShoppingCart className="h-6 w-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          title="Total Orders"
          value={sales.totalOrders?.toLocaleString() || 0}
        />
        <StatCard
          icon={<Users className="h-6 w-6" />}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          title="Total Users"
          value={users.totalUsers?.toLocaleString() || 0}
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
          title="Conversion Rate"
          value={`${sales.conversionRate || 0}%`}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Revenue Trend
            </h3>
            <button
              onClick={() => handleExport('sales')}
              className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
          
          {/* Simple chart representation */}
          <div className="space-y-3">
            {sales.dailySales?.slice(-7).map((day, index) => (
              <div key={day.date} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-20">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(day.revenue / 5000) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-white w-16 text-right">
                  ${day.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Top Selling Products
          </h3>
          <div className="space-y-4">
            {sales.topProducts?.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white text-sm">
                    {product.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {product.sales} sales
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  ${product.revenue.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* User Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            User Growth
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Active Users</span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {users.activeUsers?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">New Users</span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {users.newUsers?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Growth Rate</span>
              <span className="font-semibold text-green-600">
                +{users.userGrowth}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* User Segments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            User Segments
          </h3>
          <div className="space-y-3">
            {users.userSegments?.map((segment, index) => (
              <div key={segment.segment} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {segment.segment}
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {segment.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' : 'bg-gray-500'
                    }`}
                    style={{ width: `${segment.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Site Performance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Page Views</span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {performance.pageViews?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Unique Visitors</span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {performance.uniqueVisitors?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Bounce Rate</span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {performance.bounceRate}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Avg. Session</span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {Math.floor(performance.averageSessionDuration / 60)}m {performance.averageSessionDuration % 60}s
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Inventory Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Inventory Overview
          </h3>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
              {inventory.totalProducts} Total Products
            </span>
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
              {inventory.lowStockItems} Low Stock
            </span>
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm">
              {inventory.outOfStockItems} Out of Stock
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {inventory.categoryStock?.map((category, index) => (
            <div key={category.category} className="space-y-3">
              <h4 className="font-medium text-gray-800 dark:text-white">
                {category.category}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">In Stock</span>
                  <span className="font-medium">{category.inStock}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-600">Low Stock</span>
                  <span className="font-medium">{category.lowStock}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">Out of Stock</span>
                  <span className="font-medium">{category.outOfStock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;