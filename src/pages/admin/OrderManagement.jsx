import React, { useState, useEffect } from "react";
import { useOrder } from "../../contexts/OrderContext";
import {
  PageHeader,
  Table,
  ActionButtons,
  SearchFilter,
  Modal,
} from "../../components/admin";
import {
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  User,
} from "lucide-react";

const OrderManagement = () => {
  const {
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    loading,
  } = useOrder();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    // Force clear localStorage and reload orders
    localStorage.removeItem('orders');
    
    // Load orders after a brief delay to ensure context is ready
    const loadOrders = () => {
      const allOrders = getAllOrders();
      console.log('Loaded orders:', allOrders.length); // Debug log
      setOrders(allOrders);
      setFilteredOrders(allOrders);
    };

    // Load immediately and also after a short delay
    loadOrders();
    const timer = setTimeout(loadOrders, 100);
    
    return () => clearTimeout(timer);
  }, [getAllOrders]);

  useEffect(() => {
    // Filter and search orders
    let filtered = orders;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "createdAt" || sortField === "updatedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await updateOrderStatus(selectedOrder.id, newStatus);
      
      // Update local state
      const updatedOrders = orders.map((order) =>
        order.id === selectedOrder.id
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      );
      setOrders(updatedOrders);
      
      setIsStatusModalOpen(false);
      setSelectedOrder(null);
      setNewStatus("");
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "processing":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "shipped":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="h-3 w-3" />;
      case "paypal":
        return <CreditCard className="h-3 w-3" />;
      case "bank_transfer":
        return <CreditCard className="h-3 w-3" />;
      case "cod":
      default:
        return <Package className="h-3 w-3" />;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case "credit_card":
        return "Credit Card";
      case "paypal":
        return "PayPal";
      case "bank_transfer":
        return "Bank Transfer";
      case "cod":
      default:
        return "COD";
    }
  };

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const columns = [
    { id: "id", label: "Order ID", sortable: true },
    { id: "customerName", label: "Customer", sortable: true },
    { id: "createdAt", label: "Date", sortable: true },
    { id: "total", label: "Total", sortable: true },
    { id: "status", label: "Status", sortable: false },
    { id: "paymentMethod", label: "Payment", sortable: false },
    { id: "actions", label: "Actions", sortable: false },
  ];

  // Show loading state or empty state
  if (orders.length === 0 && !loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Order Management" hideAddButton />
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            No orders found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Orders will appear here once customers start placing them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Order Management" hideAddButton />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Orders
              </p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                {orders.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 mr-4">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending
              </p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mr-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Delivered
              </p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mr-4">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Revenue
              </p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search orders, customers..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={statusOptions}
        filterPlaceholder="All Statuses"
      />

      <Table
        columns={columns}
        data={filteredOrders}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        renderRow={(order) => (
          <tr
            key={order.id}
            className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => handleViewOrder(order)}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
              {order.id}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              <div className="flex items-center gap-3">
                {order.customerAvatar && (
                  <img
                    src={order.customerAvatar}
                    alt={order.customerName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {order.customerName}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">
                    {order.customerEmail}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              <div>
                <div className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              <div className="font-semibold text-gray-900 dark:text-white">
                ${order.total.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">
                {order.items?.length || 0} items
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.status
                )}`}>
                {getStatusIcon(order.status)}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                {getPaymentMethodIcon(order.paymentMethod)}
                {getPaymentMethodLabel(order.paymentMethod)}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleViewOrder(order)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  title="View Details">
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleUpdateStatus(order)}
                  className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                  title="Update Status">
                  <Package className="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* View Order Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Order Details - ${selectedOrder?.id}`}>
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Order ID
                </label>
                <p className="text-gray-900 dark:text-white">{selectedOrder.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    selectedOrder.status
                  )}`}>
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status.charAt(0).toUpperCase() +
                    selectedOrder.status.slice(1)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Order Date
                </label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Amount
                </label>
                <p className="text-gray-900 dark:text-white font-semibold">
                  ${selectedOrder.total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Customer Information
              </h3>
              <div className="flex items-center gap-4 mb-4">
                {selectedOrder.customerAvatar && (
                  <img
                    src={selectedOrder.customerAvatar}
                    alt={selectedOrder.customerName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {selectedOrder.customerName}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedOrder.customerEmail}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedOrder.customerEmail}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedOrder.contactInfo?.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Shipping Address
              </h3>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <div className="text-gray-700 dark:text-gray-300">
                  <p>
                    {selectedOrder.shippingAddress?.firstName}{" "}
                    {selectedOrder.shippingAddress?.lastName}
                  </p>
                  <p>{selectedOrder.shippingAddress?.address}</p>
                  <p>
                    {selectedOrder.shippingAddress?.city},{" "}
                    {selectedOrder.shippingAddress?.state}{" "}
                    {selectedOrder.shippingAddress?.postalCode}
                  </p>
                  <p>{selectedOrder.shippingAddress?.country}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Order Items
              </h3>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        by {item.author}
                      </p>
                      {item.isbn && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          ISBN: {item.isbn}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="text-gray-900 dark:text-white">${selectedOrder.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                    <span className="text-gray-900 dark:text-white">
                      {selectedOrder.shipping === 0 ? 'Free' : `$${selectedOrder.shipping?.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                    <span className="text-gray-900 dark:text-white">${selectedOrder.tax?.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({selectedOrder.discountCode}):</span>
                      <span>-${selectedOrder.discountAmount?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t border-gray-200 dark:border-gray-700 pt-2">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-gray-900 dark:text-white">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Information */}
            {selectedOrder.trackingNumber && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Tracking Information
                </h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-800 dark:text-blue-200">
                      Tracking Number: {selectedOrder.trackingNumber}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Notes */}
            {selectedOrder.notes && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Order Notes
                </h3>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  {selectedOrder.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Update Order Status"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsStatusModalOpen(false)}>
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              onClick={handleStatusUpdate}
              disabled={loading}>
              {loading ? "Updating..." : "Update Status"}
            </button>
          </div>
        }>
        {selectedOrder && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order ID: {selectedOrder.id}
              </label>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Status: {selectedOrder.status}
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  Changing the order status will notify the customer via email.
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement;