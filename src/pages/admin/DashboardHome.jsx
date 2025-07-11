import React, { useEffect } from "react";
import { BookOpen, Tag, AlertCircle, DollarSign } from "lucide-react";
import { StatCard, Table } from "../../components/admin";
import { useNotification } from "../../contexts/NotificationContext";
import { useToast } from "../../contexts/ToastContext";
import NotificationTestPanel from "../../components/admin/NotificationTestPanel";

/**
 * Dashboard home component showing statistics and low stock books
 */
const DashboardHome = ({ books, categories }) => {
  const { notifyLowStock } = useNotification();
  const toast = useToast();

  // Calculate statistics
  const totalBooks = books.length;
  const totalCategories = categories.length;
  const lowStockBooks = books.filter((book) => book.stock < 10).length;
  const totalValue = books.reduce(
    (sum, book) => sum + book.price * book.stock,
    0
  );

  // Check for low stock and send notifications
  useEffect(() => {
    const lowStockItems = books.filter((book) => book.stock < 5 && book.stock > 0);
    
    // Send notifications for critically low stock items (less than 5)
    lowStockItems.forEach((book) => {
      // Check if we've already notified about this book recently
      const lastNotified = localStorage.getItem(`lowStock_${book.id}`);
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      
      if (!lastNotified || (now - parseInt(lastNotified)) > oneDay) {
        notifyLowStock(book.title, book.stock);
        
        // Also show admin toast for low stock
        if (toast) {
          toast.showAdminLowStock(book.title, book.stock);
        }
        
        localStorage.setItem(`lowStock_${book.id}`, now.toString());
      }
    });
  }, [books, notifyLowStock, toast]);

  // Define columns for the low stock books table
  const columns = [
    { id: "id", label: "ID", sortable: false },
    { id: "title", label: "Title", sortable: false },
    { id: "author", label: "Author", sortable: false },
    { id: "stock", label: "Stock", sortable: false },
    { id: "price", label: "Price", sortable: false },
  ];

  // Filter books with low stock
  const lowStockBooksData = books.filter((book) => book.stock < 10);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<BookOpen className="h-6 w-6" />}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
          title="Total Books"
          value={totalBooks}
        />

        <StatCard
          icon={<Tag className="h-6 w-6" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          title="Categories"
          value={totalCategories}
        />

        <StatCard
          icon={<AlertCircle className="h-6 w-6" />}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          title="Low Stock"
          value={lowStockBooks}
        />

        <StatCard
          icon={<DollarSign className="h-6 w-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          title="Inventory Value"
          value={`$${totalValue.toFixed(2)}`}
        />
      </div>

      {/* Notification Test Panel */}
      <NotificationTestPanel />

      {/* Low Stock Alert */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Low Stock Alert</h3>
        <Table
          columns={columns}
          data={lowStockBooksData}
          renderRow={(book) => (
            <tr
              key={book.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {book.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {book.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {book.author}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  book.stock < 5 
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}>
                  {book.stock}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${book.price.toFixed(2)}
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
};

export default DashboardHome;