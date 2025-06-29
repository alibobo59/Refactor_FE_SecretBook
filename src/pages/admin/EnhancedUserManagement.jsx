import React, { useState, useEffect } from 'react';
import { PageHeader, Table, ActionButtons, Modal, FormField, StatCard, SearchFilter } from '../../components/admin';
import {
  Users,
  UserPlus,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  Activity,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  MoreVertical,
} from 'lucide-react';
import { motion } from 'framer-motion';

const EnhancedUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Mock user data
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        role: 'customer',
        status: 'active',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        joinDate: '2023-01-15',
        lastLogin: '2024-01-20T10:30:00Z',
        totalOrders: 15,
        totalSpent: 1250.75,
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        preferences: {
          newsletter: true,
          notifications: true,
          favoriteGenres: ['Fiction', 'Mystery'],
        },
        loginHistory: [
          { date: '2024-01-20T10:30:00Z', ip: '192.168.1.100', device: 'Chrome on Windows' },
          { date: '2024-01-19T15:45:00Z', ip: '192.168.1.100', device: 'Safari on iPhone' },
        ],
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 (555) 987-6543',
        role: 'customer',
        status: 'active',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
        joinDate: '2023-03-22',
        lastLogin: '2024-01-19T14:20:00Z',
        totalOrders: 8,
        totalSpent: 675.50,
        address: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA',
        },
        preferences: {
          newsletter: false,
          notifications: true,
          favoriteGenres: ['Romance', 'Fantasy'],
        },
        loginHistory: [
          { date: '2024-01-19T14:20:00Z', ip: '10.0.0.45', device: 'Firefox on Mac' },
        ],
      },
      {
        id: 3,
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '+1 (555) 555-0000',
        role: 'admin',
        status: 'active',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
        joinDate: '2022-01-01',
        lastLogin: '2024-01-21T09:00:00Z',
        totalOrders: 0,
        totalSpent: 0,
        address: {
          street: '789 Admin Blvd',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
          country: 'USA',
        },
        preferences: {
          newsletter: true,
          notifications: true,
          favoriteGenres: [],
        },
        loginHistory: [
          { date: '2024-01-21T09:00:00Z', ip: '192.168.1.1', device: 'Chrome on Windows' },
        ],
      },
      {
        id: 4,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1 (555) 246-8135',
        role: 'customer',
        status: 'suspended',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
        joinDate: '2023-06-10',
        lastLogin: '2024-01-10T16:45:00Z',
        totalOrders: 3,
        totalSpent: 125.25,
        address: {
          street: '321 Pine St',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA',
        },
        preferences: {
          newsletter: true,
          notifications: false,
          favoriteGenres: ['Sci-Fi'],
        },
        loginHistory: [
          { date: '2024-01-10T16:45:00Z', ip: '203.0.113.45', device: 'Chrome on Android' },
        ],
      },
    ];

    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Filter users
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter, roleFilter]);

  const getUserStats = () => {
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      suspended: users.filter(u => u.status === 'suspended').length,
      admins: users.filter(u => u.role === 'admin').length,
    };
  };

  const handleCreateUser = async () => {
    setLoading(true);
    try {
      const newUser = {
        id: Date.now(),
        ...formData,
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: null,
        totalOrders: 0,
        totalSpent: 0,
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        address: {},
        preferences: {
          newsletter: false,
          notifications: true,
          favoriteGenres: [],
        },
        loginHistory: [],
      };
      setUsers(prev => [...prev, newUser]);
      setIsCreateModalOpen(false);
      setFormData({});
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    setLoading(true);
    try {
      setUsers(prev => prev.map(user =>
        user.id === selectedUser.id ? { ...user, ...formData } : user
      ));
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setFormData({});
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleExportUsers = () => {
    const csvContent = [
      ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Join Date', 'Total Orders', 'Total Spent'].join(','),
      ...filteredUsers.map(user => [
        user.id,
        `"${user.name}"`,
        user.email,
        user.phone,
        user.role,
        user.status,
        user.joinDate,
        user.totalOrders,
        user.totalSpent,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stats = getUserStats();

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const roleOptions = [
    { value: 'customer', label: 'Customer' },
    { value: 'admin', label: 'Admin' },
    { value: 'moderator', label: 'Moderator' },
  ];

  const columns = [
    { id: 'user', label: 'User', sortable: true },
    { id: 'contact', label: 'Contact', sortable: false },
    { id: 'role', label: 'Role', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'joinDate', label: 'Join Date', sortable: true },
    { id: 'activity', label: 'Activity', sortable: false },
    { id: 'actions', label: 'Actions', sortable: false },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'customer':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader
          title="User Management"
          onAddNew={() => {
            setFormData({});
            setIsCreateModalOpen(true);
          }}
          addNewLabel="Add New User"
        />
        <button
          onClick={handleExportUsers}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          Export Users
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md: grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="h-6 w-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          title="Total Users"
          value={stats.total}
        />
        <StatCard
          icon={<CheckCircle className="h-6 w-6" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          title="Active Users"
          value={stats.active}
        />
        <StatCard
          icon={<Ban className="h-6 w-6" />}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          title="Suspended"
          value={stats.suspended}
        />
        <StatCard
          icon={<Shield className="h-6 w-6" />}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          title="Admins"
          value={stats.admins}
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search users..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              <option value="">All Roles</option>
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Table
        columns={columns}
        data={filteredUsers}
        renderRow={(user) => (
          <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {user.id}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {user.email}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {user.phone}
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(user.joinDate).toLocaleDateString()}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              <div className="space-y-1">
                <div>{user.totalOrders} orders</div>
                <div>${user.totalSpent.toFixed(2)} spent</div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setIsViewModalOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setFormData(user);
                    setIsEditModalOpen(true);
                  }}
                  className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                  title="Edit User"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setIsDeleteModalOpen(true);
                  }}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete User"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                {user.status === 'active' ? (
                  <button
                    onClick={() => handleStatusChange(user.id, 'suspended')}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Suspend User"
                  >
                    <Ban className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(user.id, 'active')}
                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    title="Activate User"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            </td>
          </tr>
        )}
      />

      {/* View User Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`User Details - ${selectedUser?.name}`}
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {selectedUser.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  {selectedUser.totalOrders}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Orders</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  ${selectedUser.totalSpent.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Spent</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  {Math.floor((new Date() - new Date(selectedUser.joinDate)) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Days</div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-medium text-gray-800 dark:text-white mb-3">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{selectedUser.phone}</span>
                </div>
              </div>
            </div>

            {/* Address */}
            {selectedUser.address && Object.keys(selectedUser.address).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white mb-3">Address</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>{selectedUser.address.street}</p>
                  <p>{selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.zipCode}</p>
                  <p>{selectedUser.address.country}</p>
                </div>
              </div>
            )}

            {/* Login History */}
            <div>
              <h4 className="font-medium text-gray-800 dark:text-white mb-3">Recent Login History</h4>
              <div className="space-y-2">
                {selectedUser.loginHistory?.slice(0, 3).map((login, index) => (
                  <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span>{new Date(login.date).toLocaleString()}</span>
                    <span className="text-gray-500">{login.ip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit User Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
          setFormData({});
        }}
        title={isCreateModalOpen ? 'Create New User' : 'Edit User'}
        footer={
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                setFormData({});
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
              onClick={isCreateModalOpen ? handleCreateUser : handleUpdateUser}
              disabled={loading}
            >
              {loading ? 'Saving...' : (isCreateModalOpen ? 'Create User' : 'Update User')}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField
            label="Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <FormField
            label="Email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <FormField
            label="Phone"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                value={formData.role || 'customer'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={formData.status || 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              onClick={handleDeleteUser}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        }
      >
        <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800">
          <XCircle className="w-5 h-5 mr-2" />
          <span>
            Are you sure you want to delete user{' '}
            <span className="font-semibold">{selectedUser?.name}</span>? This action cannot be undone.
          </span>
        </div>
      </Modal>
    </div>
  );
};

export default EnhancedUserManagement;