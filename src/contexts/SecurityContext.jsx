import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SecurityContext = createContext();

export const useSecurity = () => {
  return useContext(SecurityContext);
};

export const SecurityProvider = ({ children }) => {
  const { user } = useAuth();
  const [securityLogs, setSecurityLogs] = useState([]);
  const [securitySettings, setSecuritySettings] = useState({});
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.isAdmin) {
      loadSecurityData();
    }
  }, [user]);

  const loadSecurityData = () => {
    setLoading(true);

    // Mock security logs
    const mockSecurityLogs = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        type: 'failed_login',
        severity: 'medium',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: 'Multiple failed login attempts for user: john@example.com',
        status: 'active',
        attempts: 5,
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        type: 'suspicious_activity',
        severity: 'high',
        ipAddress: '10.0.0.45',
        userAgent: 'curl/7.68.0',
        details: 'Unusual API access pattern detected',
        status: 'investigating',
        attempts: 1,
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        type: 'admin_access',
        severity: 'low',
        ipAddress: '192.168.1.50',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        details: 'Admin panel accessed from new location',
        status: 'resolved',
        attempts: 1,
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        type: 'brute_force',
        severity: 'high',
        ipAddress: '203.0.113.45',
        userAgent: 'Python-requests/2.25.1',
        details: 'Brute force attack detected on login endpoint',
        status: 'blocked',
        attempts: 50,
      },
    ];

    // Mock security settings
    const mockSecuritySettings = {
      maxLoginAttempts: 5,
      lockoutDuration: 30, // minutes
      sessionTimeout: 120, // minutes
      requireTwoFactor: false,
      allowedIpRanges: ['192.168.1.0/24'],
      blockedIpAddresses: ['203.0.113.45', '198.51.100.23'],
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        preventReuse: 5,
      },
      auditLogRetention: 90, // days
      encryptionEnabled: true,
      sslRequired: true,
    };

    // Mock threats
    const mockThreats = [
      {
        id: 1,
        type: 'SQL Injection',
        severity: 'high',
        source: '203.0.113.45',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        status: 'blocked',
        description: 'Attempted SQL injection on search endpoint',
        riskScore: 8.5,
      },
      {
        id: 2,
        type: 'DDoS',
        severity: 'medium',
        source: 'Multiple IPs',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        status: 'mitigated',
        description: 'Distributed denial of service attack',
        riskScore: 6.2,
      },
      {
        id: 3,
        type: 'XSS Attempt',
        severity: 'medium',
        source: '198.51.100.23',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        status: 'blocked',
        description: 'Cross-site scripting attempt in comment field',
        riskScore: 5.8,
      },
    ];

    setTimeout(() => {
      setSecurityLogs(mockSecurityLogs);
      setSecuritySettings(mockSecuritySettings);
      setThreats(mockThreats);
      setLoading(false);
    }, 500);
  };

  const updateSecuritySettings = async (newSettings) => {
    setSecuritySettings(prev => ({ ...prev, ...newSettings }));
    return true;
  };

  const blockIpAddress = async (ipAddress, reason) => {
    setSecuritySettings(prev => ({
      ...prev,
      blockedIpAddresses: [...prev.blockedIpAddresses, ipAddress],
    }));

    // Add security log entry
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: 'ip_blocked',
      severity: 'medium',
      ipAddress,
      details: `IP address blocked: ${reason}`,
      status: 'active',
      attempts: 1,
    };
    setSecurityLogs(prev => [newLog, ...prev]);
  };

  const unblockIpAddress = async (ipAddress) => {
    setSecuritySettings(prev => ({
      ...prev,
      blockedIpAddresses: prev.blockedIpAddresses.filter(ip => ip !== ipAddress),
    }));

    // Add security log entry
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: 'ip_unblocked',
      severity: 'low',
      ipAddress,
      details: `IP address unblocked`,
      status: 'resolved',
      attempts: 1,
    };
    setSecurityLogs(prev => [newLog, ...prev]);
  };

  const resolveSecurityIncident = async (logId) => {
    setSecurityLogs(prev => prev.map(log => 
      log.id === logId ? { ...log, status: 'resolved' } : log
    ));
  };

  const getSecurityMetrics = () => {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogs = securityLogs.filter(log => new Date(log.timestamp) > last24Hours);
    
    return {
      totalIncidents: securityLogs.length,
      recentIncidents: recentLogs.length,
      highSeverityIncidents: securityLogs.filter(log => log.severity === 'high').length,
      blockedIps: securitySettings.blockedIpAddresses?.length || 0,
      activeThreats: threats.filter(threat => threat.status === 'active').length,
      averageRiskScore: threats.reduce((sum, threat) => sum + threat.riskScore, 0) / threats.length || 0,
    };
  };

  const exportSecurityReport = (format = 'json') => {
    const report = {
      generatedAt: new Date().toISOString(),
      metrics: getSecurityMetrics(),
      recentLogs: securityLogs.slice(0, 50),
      threats: threats,
      settings: securitySettings,
    };

    if (format === 'csv') {
      let csv = 'Timestamp,Type,Severity,IP Address,Details,Status\n';
      securityLogs.forEach(log => {
        csv += `${log.timestamp},${log.type},${log.severity},${log.ipAddress},"${log.details}",${log.status}\n`;
      });
      return csv;
    }

    return JSON.stringify(report, null, 2);
  };

  const runSecurityScan = async () => {
    setLoading(true);
    
    // Simulate security scan
    return new Promise((resolve) => {
      setTimeout(() => {
        const scanResults = {
          vulnerabilities: Math.floor(Math.random() * 5),
          warnings: Math.floor(Math.random() * 10) + 5,
          recommendations: [
            'Update SSL certificates',
            'Enable two-factor authentication',
            'Review user permissions',
            'Update security policies',
          ],
          score: Math.floor(Math.random() * 20) + 80, // 80-100
        };
        setLoading(false);
        resolve(scanResults);
      }, 3000);
    });
  };

  const value = {
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
    refreshData: loadSecurityData,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};