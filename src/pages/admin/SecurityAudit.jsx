import React, { useState, useEffect } from 'react';
import { useSecurity } from '../../contexts/SecurityContext';
import { PageHeader, StatCard, Table, Modal } from '../../components/admin';
import {
  Shield,
  AlertTriangle,
  Lock,
  Eye,
  Download,
  RefreshCw,
  Settings,
  Ban,
  CheckCircle,
  XCircle,
  Activity,
  Globe,
  Server,
  Key,
  Scan,
} from 'lucide-react';
import { motion } from 'framer-motion';

const SecurityAudit = () => {
  const {
    securityLogs,
    securitySettings,
    threats,
    loading,
    updateSecuritySettings,
    blockIpAddress,
    unblockIpAddress,
    resolveSecurityIncident,
    getSecurityMetrics,
    exportSecurityReport,
    runSecurityScan,
    refreshData,
  } = useSecurity();

  const [activeTab, setActiveTab] = useState('overview');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isBlockIpModalOpen, setIsBlockIpModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState({});
  const [blockIpForm, setBlockIpForm] = useState({ ip: '', reason: '' });
  const [scanResults, setScanResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    setSettingsForm(securitySettings);
  }, [securitySettings]);

  const metrics = getSecurityMetrics();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'logs', label: 'Security Logs', icon: Activity },
    { id: 'threats', label: 'Threats', icon: AlertTriangle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSaveSettings = async () => {
    try {
      await updateSecuritySettings(settingsForm);
      setIsSettingsModalOpen(false);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const handleBlockIp = async () => {
    try {
      await blockIpAddress(blockIpForm.ip, blockIpForm.reason);
      setIsBlockIpModalOpen(false);
      setBlockIpForm({ ip: '', reason: '' });
    } catch (error) {
      console.error('Failed to block IP:', error);
    }
  };

  const handleRunScan = async () => {
    setIsScanning(true);
    try {
      const results = await runSecurityScan();
      setScanResults(results);
    } catch (error) {
      console.error('Security scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleExportReport = () => {
    const report = exportSecurityReport('json');
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLogTypeColor = (type) => {
    switch (type) {
      case 'failed_login':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'suspicious_activity':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'admin_access':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'brute_force':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getThreatStatusColor = (status) => {
    switch (status) {
      case 'blocked':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'mitigated':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'active':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const logColumns = [
    { id: 'timestamp', label: 'Time', sortable: true },
    { id: 'type', label: 'Type', sortable: true },
    { id: 'severity', label: 'Severity', sortable: true },
    { id: 'ipAddress', label: 'IP Address', sortable: false },
    { id: 'details', label: 'Details', sortable: false },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false },
  ];

  const threatColumns = [
    { id: 'timestamp', label: 'Time', sortable: true },
    { id: 'type', label: 'Type', sortable: true },
    { id: 'severity', label: 'Severity', sortable: true },
    { id: 'source', label: 'Source', sortable: false },
    { id: 'riskScore', label: 'Risk Score', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'description', label: 'Description', sortable: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader title="Security Audit" hideAddButton />
        <div className="flex gap-3">
          <button
            onClick={() => setIsScanModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Scan className="h-4 w-4" />
            Run Security Scan
          </button>
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Shield className="h-6 w-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          title="Security Score"
          value="85/100"
        />
        <StatCard
          icon={<AlertTriangle className="h-6 w-6" />}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          title="Active Threats"
          value={metrics.activeThreats}
        />
        <StatCard
          icon={<Ban className="h-6 w-6" />}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          title="Blocked IPs"
          value={metrics.blockedIps}
        />
        <StatCard
          icon={<Activity className="h-6 w-6" />}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          title="Recent Incidents"
          value={metrics.recentIncidents}
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg cursor-pointer"
                  onClick={() => setIsSettingsModalOpen(true)}
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-8 w-8" />
                    <div>
                      <h3 className="font-semibold">Security Settings</h3>
                      <p className="text-sm opacity-90">Configure security policies</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg cursor-pointer"
                  onClick={() => setIsBlockIpModalOpen(true)}
                >
                  <div className="flex items-center gap-3">
                    <Ban className="h-8 w-8" />
                    <div>
                      <h3 className="font-semibold">Block IP Address</h3>
                      <p className="text-sm opacity-90">Block suspicious IPs</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg cursor-pointer"
                  onClick={() => setIsScanModalOpen(true)}
                >
                  <div className="flex items-center gap-3">
                    <Scan className="h-8 w-8" />
                    <div>
                      <h3 className="font-semibold">Security Scan</h3>
                      <p className="text-sm opacity-90">Run vulnerability scan</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Recent Threats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Recent Security Threats
                </h3>
                <div className="space-y-3">
                  {threats.slice(0, 5).map((threat) => (
                    <div key={threat.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`h-5 w-5 ${
                          threat.severity === 'high' ? 'text-red-500' :
                          threat.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                        }`} />
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white">
                            {threat.type}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {threat.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThreatStatusColor(threat.status)}`}>
                          {threat.status}
                        </span>
                        <div className="text-sm text-gray-500 mt-1">
                          Risk: {threat.riskScore}/10
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Logs Tab */}
          {activeTab === 'logs' && (
            <Table
              columns={logColumns}
              data={securityLogs}
              renderRow={(log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLogTypeColor(log.type)}`}>
                      {log.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    <div className="max-w-xs truncate" title={log.details}>
                      {log.details}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {log.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {log.status !== 'resolved' && (
                        <button
                          onClick={() => resolveSecurityIncident(log.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Resolve"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => blockIpAddress(log.ipAddress, `Blocked due to: ${log.type}`)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Block IP"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            />
          )}

          {/* Threats Tab */}
          {activeTab === 'threats' && (
            <Table
              columns={threatColumns}
              data={threats}
              renderRow={(threat) => (
                <tr key={threat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(threat.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {threat.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                      {threat.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {threat.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        threat.riskScore >= 8 ? 'bg-red-500' :
                        threat.riskScore >= 5 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      {threat.riskScore}/10
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThreatStatusColor(threat.status)}`}>
                      {threat.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    <div className="max-w-xs truncate" title={threat.description}>
                      {threat.description}
                    </div>
                  </td>
                </tr>
              )}
            />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Authentication Settings */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Authentication
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        value={securitySettings.maxLoginAttempts || 5}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Lockout Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={securitySettings.lockoutDuration || 30}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        readOnly
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={securitySettings.requireTwoFactor || false}
                        className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                        readOnly
                      />
                      <label className="text-sm text-gray-700 dark:text-gray-300">
                        Require Two-Factor Authentication
                      </label>
                    </div>
                  </div>
                </div>

                {/* Network Security */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Network Security
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Blocked IP Addresses
                      </label>
                      <div className="max-h-32 overflow-y-auto">
                        {securitySettings.blockedIpAddresses?.map((ip, index) => (
                          <div key={index} className="flex items-center justify-between py-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{ip}</span>
                            <button
                              onClick={() => unblockIpAddress(ip)}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              Unblock
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={securitySettings.sslRequired || true}
                        className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                        readOnly
                      />
                      <label className="text-sm text-gray-700 dark:text-gray-300">
                        Require SSL/HTTPS
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              >
                Edit Security Settings
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Security Settings Modal */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Security Settings"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsSettingsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              onClick={handleSaveSettings}
            >
              Save Settings
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={settingsForm.maxLoginAttempts || 5}
                onChange={(e) => setSettingsForm({ ...settingsForm, maxLoginAttempts: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lockout Duration (minutes)
              </label>
              <input
                type="number"
                value={settingsForm.lockoutDuration || 30}
                onChange={(e) => setSettingsForm({ ...settingsForm, lockoutDuration: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settingsForm.requireTwoFactor || false}
              onChange={(e) => setSettingsForm({ ...settingsForm, requireTwoFactor: e.target.checked })}
              className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
            />
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Require Two-Factor Authentication
            </label>
          </div>
        </div>
      </Modal>

      {/* Block IP Modal */}
      <Modal
        isOpen={isBlockIpModalOpen}
        onClose={() => setIsBlockIpModalOpen(false)}
        title="Block IP Address"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsBlockIpModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={handleBlockIp}
            >
              Block IP
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              IP Address
            </label>
            <input
              type="text"
              value={blockIpForm.ip}
              onChange={(e) => setBlockIpForm({ ...blockIpForm, ip: e.target.value })}
              placeholder="192.168.1.100"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reason
            </label>
            <textarea
              value={blockIpForm.reason}
              onChange={(e) => setBlockIpForm({ ...blockIpForm, reason: e.target.value })}
              placeholder="Reason for blocking this IP address..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>
      </Modal>

      {/* Security Scan Modal */}
      <Modal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        title="Security Scan"
        footer={
          !scanResults && (
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsScanModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                onClick={handleRunScan}
                disabled={isScanning}
              >
                {isScanning && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isScanning ? 'Scanning...' : 'Start Scan'}
              </button>
            </div>
          )
        }
      >
        {scanResults ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Security Scan Complete
              </h3>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {scanResults.score}/100
              </div>
              <p className="text-gray-600 dark:text-gray-400">Security Score</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {scanResults.vulnerabilities}
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">
                  Vulnerabilities
                </div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {scanResults.warnings}
                </div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  Warnings
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                Recommendations
              </h4>
              <ul className="space-y-1">
                {scanResults.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            {isScanning ? (
              <div>
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Running comprehensive security scan...
                </p>
              </div>
            ) : (
              <div>
                <Scan className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Run a comprehensive security scan to identify vulnerabilities and get recommendations.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SecurityAudit;