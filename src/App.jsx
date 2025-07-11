import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/client/HomePage";
import BookDetailPage from "./pages/client/BookDetailPage";
import BrowseBooksPage from "./pages/client/BrowseBooksPage";
import CartPage from "./pages/client/CartPage";
import CheckoutPage from "./pages/client/CheckoutPage";
import OrderConfirmationPage from "./pages/client/OrderConfirmationPage";
import OrderManagementPage from "./pages/client/OrderManagementPage";
import ProfilePage from "./pages/client/ProfilePage";
import ReviewerProfilePage from "./pages/client/ReviewerProfilePage";
import RecommendationsPage from "./pages/client/RecommendationsPage";
import LoginPage from "./pages/client/LoginPage";
import RegisterPage from "./pages/client/RegisterPage";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFoundPage from "./pages/client/NotFoundPage";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-amber-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {!isAdminRoute && <Header />}
      <main className={`flex-grow ${isAdminRoute ? 'p-0' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BrowseBooksPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderManagementPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/reviewer/:reviewerId" element={<ReviewerProfilePage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;