import React, { useState } from 'react';
import { PageHeader, FormField, StatCard } from '../../components/admin';
import {
  Settings,
  Globe,
  Mail,
  CreditCard,
  Truck,
  Bell,
  DollarSign,
  Package,
  Clock,
  AlertTriangle,
  Save,
  RefreshCw,
  Upload,
  Download,
  Shield,
  Database,
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Secret Bookstore',
    siteDescription: 'Your premier destination for books',
    contactEmail: 'contact@secretbookstore.com',
    contactPhone: '+1 (555) 123-4567',
    address: '123 Book Street, Reading City, RC 12345',
    timezone: 'America/New_York',
    language: 'en',
    currency: 'USD',
    logo: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'noreply@secretbookstore.com',
    smtpPassword: '',
    fromName: 'Secret Bookstore',
    fromEmail: 'noreply@secretbookstore.com',
    enableSsl: true,
    testMode: false,
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    enableCod: true,
    enableStripe: false,
    enablePaypal: false,
    stripePublicKey: '',
    stripeSecretKey: '',
    paypalClientId: '',
    paypalClientSecret: '',
    currency: 'USD',
    taxRate: 8.5,
    processingFee: 2.9,
  });

  // Order Processing Rules
  const [orderSettings, setOrderSettings] = useState({
    autoConfirmOrders: true,
    autoReserveStock: true,
    reservationDuration: 24, // hours
    allowBackorders: false,
    autoCancelUnpaid: true,
    unpaidCancelDuration: 72, // hours
    autoMarkShipped: false,
    requireSignature: false,
    orderNumberPrefix: 'ORD-',
    minOrderValue: 0,
    maxOrderValue: 10000,
  });

  // Shipping Settings
  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 50,
    standardShippingCost: 5.99,
    expressShippingCost: 12.99,
    internationalShipping: true,
    internationalShippingCost: 15.99,
    estimatedDeliveryDays: 7,
    expressDeliveryDays: 3,
    enableTracking: true,
    requireSignature: false,
    packagingCost: 1.50,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStockAlert: true,
    lowStockThreshold: 10,
    newOrderAlert: true,
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: false,
    systemMaintenance: true,
    securityAlerts: true,
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    sessionTimeout: 120, // minutes
    maxFileUploadSize: 10, // MB
    allowRegistration: true,
    requireEmailVerification: true,
    autoBackup: true,
    backupFrequency: 'daily',
    logRetentionDays: 30,
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'orders', label: 'Order Processing', icon: Package },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Settings },
  ];

  const handleSaveSettings = async (settingsType) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Saved ${settingsType} settings`);
      // Show success message
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      // Simulate sending test email
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Test email sent successfully!');
    } catch (error) {
      alert('Failed to send test email');
    }
  };

  const handleBackupNow = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      alert('Backup completed successfully!');
    } catch (error) {
      alert('Backup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="System Settings" hideAddButton />

      {/* Settings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<Globe className="h-6 w-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          title="Site Status"
          value={systemSettings.maintenanceMode ? 'Maintenance' : 'Online'}
        />
        <StatCard
          icon={<Mail className="h-6 w-6" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          title="Email Status"
          value={emailSettings.testMode ? 'Test Mode' : 'Live'}
        />
        <StatCard
          icon={<CreditCard className="h-6 w-6" />}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          title="Payment Methods"
          value={[paymentSettings.enableCod, paymentSettings.enableStripe, paymentSettings.enablePaypal].filter(Boolean).length}
        />
        <StatCard
          icon={<Shield className="h-6 w-6" />}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
          title="Security Level"
          value="High"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
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
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Site Name"
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                  required
                />
                <FormField
                  label="Contact Email"
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                  required
                />
                <div className="md:col-span-2">
                  <FormField
                    label="Site Description"
                    type="textarea"
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                    inputProps={{ rows: 3 }}
                  />
                </div>
                <FormField
                  label="Contact Phone"
                  value={generalSettings.contactPhone}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Timezone
                  </label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <FormField
                    label="Business Address"
                    type="textarea"
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                    inputProps={{ rows: 2 }}
                  />
                </div>
              </div>
              <button
                onClick={() => handleSaveSettings('general')}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save General Settings
              </button>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="SMTP Host"
                  value={emailSettings.smtpHost}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                  required
                />
                <FormField
                  label="SMTP Port"
                  type="number"
                  value={emailSettings.smtpPort}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                  required
                />
                <FormField
                  label="SMTP Username"
                  value={emailSettings.smtpUsername}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
                  required
                />
                <FormField
                  label="SMTP Password"
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                />
                <FormField
                  label="From Name"
                  value={emailSettings.fromName}
                  onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                  required
                />
                <FormField
                  label="From Email"
                  type="email"
                  value={emailSettings.fromEmail}
                  onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                  required
                />
              </div>
              
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={emailSettings.enableSsl}
                    onChange={(e) => setEmailSettings({ ...emailSettings, enableSsl: e.target.checked })}
                    className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Enable SSL/TLS</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={emailSettings.testMode}
                    onChange={(e) => setEmailSettings({ ...emailSettings, testMode: e.target.checked })}
                    className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Test Mode</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleSaveSettings('email')}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  Save Email Settings
                </button>
                <button
                  onClick={handleTestEmail}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Mail className="h-4 w-4" />
                  Send Test Email
                </button>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={paymentSettings.enableCod}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, enableCod: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="font-medium text-gray-800 dark:text-white">Cash on Delivery</span>
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Allow customers to pay when they receive their order
                  </p>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={paymentSettings.enableStripe}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, enableStripe: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="font-medium text-gray-800 dark:text-white">Stripe</span>
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Accept credit card payments via Stripe
                  </p>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={paymentSettings.enablePaypal}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, enablePaypal: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="font-medium text-gray-800 dark:text-white">PayPal</span>
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Accept payments via PayPal
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Tax Rate (%)"
                  type="number"
                  step="0.1"
                  value={paymentSettings.taxRate}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, taxRate: parseFloat(e.target.value) })}
                />
                <FormField
                  label="Processing Fee (%)"
                  type="number"
                  step="0.1"
                  value={paymentSettings.processingFee}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, processingFee: parseFloat(e.target.value) })}
                />
              </div>

              <button
                onClick={() => handleSaveSettings('payment')}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Payment Settings
              </button>
            </div>
          )}

          {/* Order Processing Settings */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Order Processing Rules
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={orderSettings.autoConfirmOrders}
                      onChange={(e) => setOrderSettings({ ...orderSettings, autoConfirmOrders: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Auto-confirm orders after payment</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={orderSettings.autoReserveStock}
                      onChange={(e) => setOrderSettings({ ...orderSettings, autoReserveStock: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Auto-reserve stock when order is placed</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={orderSettings.allowBackorders}
                      onChange={(e) => setOrderSettings({ ...orderSettings, allowBackorders: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Allow backorders for out-of-stock items</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={orderSettings.autoCancelUnpaid}
                      onChange={(e) => setOrderSettings({ ...orderSettings, autoCancelUnpaid: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Auto-cancel unpaid orders</span>
                  </label>
                </div>

                <div className="space-y-4">
                  <FormField
                    label="Stock Reservation Duration (hours)"
                    type="number"
                    value={orderSettings.reservationDuration}
                    onChange={(e) => setOrderSettings({ ...orderSettings, reservationDuration: parseInt(e.target.value) })}
                  />

                  <FormField
                    label="Unpaid Order Cancel Duration (hours)"
                    type="number"
                    value={orderSettings.unpaidCancelDuration}
                    onChange={(e) => setOrderSettings({ ...orderSettings, unpaidCancelDuration: parseInt(e.target.value) })}
                  />

                  <FormField
                    label="Order Number Prefix"
                    value={orderSettings.orderNumberPrefix}
                    onChange={(e) => setOrderSettings({ ...orderSettings, orderNumberPrefix: e.target.value })}
                  />

                  <FormField
                    label="Minimum Order Value ($)"
                    type="number"
                    step="0.01"
                    value={orderSettings.minOrderValue}
                    onChange={(e) => setOrderSettings({ ...orderSettings, minOrderValue: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <button
                onClick={() => handleSaveSettings('orders')}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Order Settings
              </button>
            </div>
          )}

          {/* Shipping Settings */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Free Shipping Threshold ($)"
                  type="number"
                  step="0.01"
                  value={shippingSettings.freeShippingThreshold}
                  onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingThreshold: parseFloat(e.target.value) })}
                />
                <FormField
                  label="Standard Shipping Cost ($)"
                  type="number"
                  step="0.01"
                  value={shippingSettings.standardShippingCost}
                  onChange={(e) => setShippingSettings({ ...shippingSettings, standardShippingCost: parseFloat(e.target.value) })}
                />
                <FormField
                  label="Express Shipping Cost ($)"
                  type="number"
                  step="0.01"
                  value={shippingSettings.expressShippingCost}
                  onChange={(e) => setShippingSettings({ ...shippingSettings, expressShippingCost: parseFloat(e.target.value) })}
                />
                <FormField
                  label="International Shipping Cost ($)"
                  type="number"
                  step="0.01"
                  value={shippingSettings.internationalShippingCost}
                  onChange={(e) => setShippingSettings({ ...shippingSettings, internationalShippingCost: parseFloat(e.target.value) })}
                />
                <FormField
                  label="Estimated Delivery Days"
                  type="number"
                  value={shippingSettings.estimatedDeliveryDays}
                  onChange={(e) => setShippingSettings({ ...shippingSettings, estimatedDeliveryDays: parseInt(e.target.value) })}
                />
                <FormField
                  label="Express Delivery Days"
                  type="number"
                  value={shippingSettings.expressDeliveryDays}
                  onChange={(e) => setShippingSettings({ ...shippingSettings, expressDeliveryDays: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={shippingSettings.internationalShipping}
                    onChange={(e) => setShippingSettings({ ...shippingSettings, internationalShipping: e.target.checked })}
                    className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Enable International Shipping</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={shippingSettings.enableTracking}
                    onChange={(e) => setShippingSettings({ ...shippingSettings, enableTracking: e.target.checked })}
                    className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Enable Package Tracking</span>
                </label>
              </div>

              <button
                onClick={() => handleSaveSettings('shipping')}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Shipping Settings
              </button>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Email Notifications
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800 dark:text-white">Customer Notifications</h4>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.orderConfirmation}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, orderConfirmation: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Order Confirmation</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.orderShipped}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, orderShipped: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Order Shipped</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.orderDelivered}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, orderDelivered: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Order Delivered</span>
                  </label>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800 dark:text-white">Admin Notifications</h4>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.newOrderAlert}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, newOrderAlert: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">New Order Alerts</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.lowStockAlert}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, lowStockAlert: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Low Stock Alerts</span>
                  </label>

                  <FormField
                    label="Low Stock Threshold"
                    type="number"
                    value={notificationSettings.lowStockThreshold}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, lowStockThreshold: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 dark:text-white mb-4">Report Frequency</h4>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.dailyReports}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, dailyReports: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Daily Reports</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.weeklyReports}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyReports: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Weekly Reports</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.monthlyReports}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, monthlyReports: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Monthly Reports</span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => handleSaveSettings('notifications')}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Notification Settings
              </button>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800 dark:text-white">System Status</h4>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Maintenance Mode</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={systemSettings.debugMode}
                      onChange={(e) => setSystemSettings({ ...systemSettings, debugMode: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Debug Mode</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={systemSettings.cacheEnabled}
                      onChange={(e) => setSystemSettings({ ...systemSettings, cacheEnabled: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enable Caching</span>
                  </label>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800 dark:text-white">User Registration</h4>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={systemSettings.allowRegistration}
                      onChange={(e) => setSystemSettings({ ...systemSettings, allowRegistration: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Allow User Registration</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={systemSettings.requireEmailVerification}
                      onChange={(e) => setSystemSettings({ ...systemSettings, requireEmailVerification: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Require Email Verification</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Session Timeout (minutes)"
                  type="number"
                  value={systemSettings.sessionTimeout}
                  onChange={(e) => setSystemSettings({ ...systemSettings, sessionTimeout: parseInt(e.target.value) })}
                />
                <FormField
                  label="Max File Upload Size (MB)"
                  type="number"
                  value={systemSettings.maxFileUploadSize}
                  onChange={(e) => setSystemSettings({ ...systemSettings, maxFileUploadSize: parseInt(e.target.value) })}
                />
                <FormField
                  label="Log Retention Days"
                  type="number"
                  value={systemSettings.logRetentionDays}
                  onChange={(e) => setSystemSettings({ ...systemSettings, logRetentionDays: parseInt(e.target.value) })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Backup Frequency
                  </label>
                  <select
                    value={systemSettings.backupFrequency}
                    onChange={(e) => setSystemSettings({ ...systemSettings, backupFrequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-medium text-gray-800 dark:text-white mb-4">Database Backup</h4>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={systemSettings.autoBackup}
                      onChange={(e) => setSystemSettings({ ...systemSettings, autoBackup: e.target.checked })}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enable Auto Backup</span>
                  </label>
                  <button
                    onClick={handleBackupNow}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Database className="h-4 w-4" />
                    )}
                    Backup Now
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleSaveSettings('system')}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save System Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;