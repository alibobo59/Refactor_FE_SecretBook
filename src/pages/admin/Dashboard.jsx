import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useBook } from "../../contexts/BookContext";
import {
  LayoutDashboard,
  BookOpen,
  Tag,
  Users,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  UserSquare2,
  Activity,
  BarChart3,
  Megaphone,
  Package,
  Shield,
  FileText,
  UserCheck,
} from "lucide-react";

import BookManagement from "./BookManagement";
import CategoryManagement from "./CategoryManagement";
import UserManagement from "./UserManagement";
import OrderManagement from "./OrderManagement";
import DashboardHome from "./DashboardHome";
import AuthorManagement from "./AuthorManagement";
import PublisherManagement from "./PublisherManagement";
import LogManagement from "./LogManagement";
import AnalyticsDashboard from "./AnalyticsDashboard";
import MarketingManagement from "./MarketingManagement";
import BulkOperations from "./BulkOperations";
import EnhancedUserManagement from "./EnhancedUserManagement";
import SecurityAudit from "./SecurityAudit";
import ContentManagement from "./ContentManagement";
import AdminHeader from "../../components/admin/AdminHeader";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { books, categories } = useBook();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "books", label: "Books", icon: <BookOpen size={20} /> },
    { id: "categories", label: "Categories", icon: <Tag size={20} /> },
    { id: "authors", label: "Authors", icon: <UserSquare2 size={20} /> },
    { id: "publishers", label: "Publishers", icon: <Building2 size={20} /> },
    { id: "users", label: "Users", icon: <Users size={20} /> },
    { id: "enhanced-users", label: "Enhanced Users", icon: <UserCheck size={20} /> },
    { id: "orders", label: "Orders", icon: <ShoppingCart size={20} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={20} /> },
    { id: "marketing", label: "Marketing", icon: <Megaphone size={20} /> },
    { id: "bulk-ops", label: "Bulk Operations", icon: <Package size={20} /> },
    { id: "security", label: "Security", icon: <Shield size={20} /> },
    { id: "content", label: "Content", icon: <FileText size={20} /> },
    { id: "logs", label: "System Logs", icon: <Activity size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-gray-800 ${
          isSidebarCollapsed ? "w-20" : "w-64"
        } shadow-md fixed inset-y-0 left-0 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-all duration-300 ease-in-out z-30`}>
        <div
          className={`${
            isSidebarCollapsed ? "p-4 flex justify-center" : "p-6"
          }`}>
          {!isSidebarCollapsed ? (
            <h1 className="text-2xl font-bold text-amber-600">Admin Panel</h1>
          ) : (
            <h1 className="text-xl font-bold text-amber-600">AP</h1>
          )}
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`flex ${
                isSidebarCollapsed ? "justify-center" : "items-center"
              } px-6 py-3 w-full ${
                activeTab === item.id
                  ? "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 border-r-4 border-amber-600"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}>
              <span className={isSidebarCollapsed ? "" : "mr-3"}>
                {item.icon}
              </span>
              {!isSidebarCollapsed && item.label}
            </button>
          ))}
          <button
            className={`flex ${
              isSidebarCollapsed ? "justify-center" : "items-center"
            } px-6 py-3 w-full text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700`}
            onClick={handleLogout}>
            <span className={isSidebarCollapsed ? "" : "mr-3"}>
              <LogOut size={20} />
            </span>
            {!isSidebarCollapsed && "Logout"}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 ${
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
        } transition-all duration-300 flex flex-col`}>
        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-0 left-0 z-40 p-4">
          <button
            className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Sidebar Toggle Button */}
        <div className="hidden md:block fixed top-4 z-40 p-1">
          <button
            className={`p-2 rounded-r-md bg-white dark:bg-gray-800 shadow-md ${
              isSidebarCollapsed ? "ml-20" : "ml-64"
            } transition-all duration-300`}
            onClick={toggleSidebar}>
            {isSidebarCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* Admin Header */}
        <AdminHeader isSidebarCollapsed={isSidebarCollapsed} />

        {/* Content Area */}
        <main className="p-6 mt-2 md:mt-0 md:pt-16 flex-1 overflow-auto">
          {activeTab === "dashboard" && (
            <DashboardHome books={books} categories={categories} />
          )}
          {activeTab === "books" && (
            <BookManagement books={books} categories={categories} />
          )}
          {activeTab === "categories" && <CategoryManagement />}
          {activeTab === "authors" && <AuthorManagement />}
          {activeTab === "publishers" && <PublisherManagement />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "enhanced-users" && <EnhancedUserManagement />}
          {activeTab === "orders" && <OrderManagement />}
          {activeTab === "analytics" && <AnalyticsDashboard />}
          {activeTab === "marketing" && <MarketingManagement />}
          {activeTab === "bulk-ops" && <BulkOperations />}
          {activeTab === "security" && <SecurityAudit />}
          {activeTab === "content" && <ContentManagement />}
          {activeTab === "logs" && <LogManagement />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;