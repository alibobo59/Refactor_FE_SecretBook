import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { PageHeader, StatCard } from '../../components/admin';
import { LineChart, BarChart, DoughnutChart } from '../../components/charts';
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
  Eye,
  MousePointer,
  Package,
  Globe,
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

  // Prepare chart data
  const revenueChartData = {
    labels: sales.dailySales?.map(day => 
      new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ) || [],
    values: sales.dailySales?.map(day => day.revenue) || [],
    label: 'Daily Revenue'
  };

  const ordersChartData = {
    labels: sales.dailySales?.map(day => 
      new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ) || [],
    values: sales.dailySales?.map(day => day.orders) || [],
    label: 'Daily Orders'
  };

  const monthlyRevenueData = {
    labels: sales.monthlySales?.map(month => 
      new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    ) || [],
    values: sales.monthlySales?.map(month => month.revenue) || [],
    label: 'Monthly Revenue'
  };

  const topProductsData = {
    labels: sales.topProducts?.map(product => product.title) || [],
    values: sales.topProducts?.map(product => product.revenue) || [],
    label: 'Revenue by Product'
  };

  const categoryPerformanceData = {
    labels: sales.categoryPerformance?.map(cat => cat.category) || [],
    values: sales.categoryPerformance?.map(cat => cat.revenue) || [],
    label: 'Revenue by Category'
  };

  const userSegmentsData = {
    labels: users.userSegments?.map(segment => segment.segment) || [],
    values: users.userSegments?.map(segment => segment.count) || [],
    label: 'User Distribution'
  };

  const deviceBreakdownData = {
    labels: performance.deviceBreakdown?.map(device => device.device) || [],
    values: performance.deviceBreakdown?.map(device => device.sessions) || [],
    label: 'Sessions by Device'
  };

  const userRegistrationsData = {
    labels: users.userRegistrations?.slice(-14).map(day => 
      new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ) || [],
    values: users.userRegistrations?.slice(-14).map(day => day.registrations) || [],
    label: 'Daily Registrations'
  };

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

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Revenue Trend (Last 30 Days)
            </h3>
            <button
              onClick={() => handleExport('sales')}
              className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
          
          <LineChart
            data={revenueChartData}
            height={350}
            fill={true}
            color="#10b981"
            backgroundColor="rgba(16, 185, 129, 0.1)"
            showLegend={false}
          />
        </motion.div>

        {/* Orders Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Orders Trend (Last 30 Days)
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <ShoppingCart className="h-4 w-4" />
              {sales.totalOrders} total
            </div>
          </div>
          
          <LineChart
            data={ordersChartData}
            height={350}
            fill={true}
            color="#3b82f6"
            backgroundColor="rgba(59, 130, 246, 0.1)"
            showLegend={false}
          />
        </motion.div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Top Products by Revenue
          </h3>
          
          <BarChart
            data={topProductsData}
            height={300}
            horizontal={true}
            showLegend={false}
            colors={['#f59e0b']}
          />
        </motion.div>

        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Revenue by Category
          </h3>
          
          <DoughnutChart
            data={categoryPerformanceData}
            height={300}
            showLegend={true}
            colors={['#f59e0b', '#3b82f6', '#10b981', '#ef4444']}
          />
        </motion.div>

        {/* User Segments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            User Segments
          </h3>
          
          <DoughnutChart
            data={userSegmentsData}
            height={300}
            showLegend={true}
            colors={['#8b5cf6', '#06b6d4', '#f97316', '#ef4444']}
          />
        </motion.div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Monthly Revenue Trend
          </h3>
          
          <BarChart
            data={monthlyRevenueData}
            height={300}
            showLegend={false}
            colors={['#10b981']}
          />
        </motion.div>

        {/* User Registrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            User Registrations (Last 14 Days)
          </h3>
          
          <LineChart
            data={userRegistrationsData}
            height={300}
            fill={true}
            color="#8b5cf6"
            backgroundColor="rgba(139, 92, 246, 0.1)"
            showLegend={false}
          />
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Sessions by Device
          </h3>
          
          <DoughnutChart
            data={deviceBreakdownData}
            height={300}
            showLegend={true}
            colors={['#3b82f6', '#10b981', '#f59e0b']}
          />
        </motion.div>

        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Site Performance
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Page Views
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {performance.pageViews?.toLocaleString()}
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Unique Visitors
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {performance.uniqueVisitors?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Bounce Rate</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {performance.bounceRate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Avg. Session Duration</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {Math.floor(performance.averageSessionDuration / 60)}m {performance.averageSessionDuration % 60}s
                </span>
              </div>
            </div>

            {/* Top Pages */}
            <div>
              <h4 className="font-medium text-gray-800 dark:text-white mb-3">Top Pages</h4>
              <div className="space-y-2">
                {performance.topPages?.slice(0, 3).map((page, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400 truncate">
                      {page.page}
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {page.views.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;