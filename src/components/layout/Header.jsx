import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Moon,
  Sun,
  BookOpen,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSwitcher from "../common/LanguageSwitcher";
import NotificationDropdown from "../common/NotificationDropdown";
import UserProfileDropdown from "../common/UserProfileDropdown";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize darkMode state based on localStorage or system preference
    if (typeof window !== "undefined") {
      return (
        localStorage.theme === "dark" ||
        (!localStorage.theme &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { user, logout } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getItemCount } = useCart();
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Apply initial theme
    document.documentElement.classList.toggle("dark", darkMode);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e) => {
      if (!localStorage.theme) {
        setDarkMode(e.matches);
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };

    window.addEventListener("scroll", handleScroll);
    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      localStorage.theme = "dark";
      document.documentElement.classList.add("dark");
    } else {
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white dark:bg-gray-800 shadow-md py-2"
            : "bg-transparent backdrop-blur-sm py-4"
        }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-500 transition-transform group-hover:rotate-6 duration-300" />
              <span className="ml-2 text-2xl font-serif font-bold text-gray-800 dark:text-white">
                {t("app.name")}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/books"
                className={`font-medium hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200 ${
                  location.pathname.includes("/books") &&
                  !location.pathname.includes("/books/")
                    ? "text-amber-600 dark:text-amber-500"
                    : "text-gray-700 dark:text-gray-300"
                }`}>
                {t("nav.books")}
              </Link>
              <Link
                to="/categories"
                className={`font-medium hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200 ${
                  location.pathname.includes("/categories")
                    ? "text-amber-600 dark:text-amber-500"
                    : "text-gray-700 dark:text-gray-300"
                }`}>
                {t("nav.categories")}
              </Link>
              <Link
                to="/recommendations"
                className={`font-medium hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200 ${
                  location.pathname.includes("/recommendations")
                    ? "text-amber-600 dark:text-amber-500"
                    : "text-gray-700 dark:text-gray-300"
                }`}>
                Recommendations
              </Link>
            </nav>

            {/* Search, Cart, User Section */}
            <div className="hidden md:flex items-center space-x-6">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder={t("nav.search") + "..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="py-2 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 w-40 focus:w-60"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </form>

              {/* Language Switcher */}
              <LanguageSwitcher />

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }>
                {darkMode ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700" />
                )}
              </button>

              {/* Notification Dropdown */}
              {user && <NotificationDropdown />}

              {/* Cart Button - Link to Cart Page */}
              <Link
                to="/cart"
                className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label={`Shopping cart ${getItemCount() > 0 ? `(${getItemCount()} items)` : ''}`}
              >
                <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                
                {getItemCount() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium border-2 border-white dark:border-gray-800"
                  >
                    {getItemCount() > 99 ? '99+' : getItemCount()}
                  </motion.span>
                )}
              </Link>

              {user ? (
                <UserProfileDropdown />
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors duration-200">
                  {t("nav.login")}
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-800 dark:text-white" />
              ) : (
                <Menu className="h-6 w-6 text-gray-800 dark:text-white" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("nav.search") + "..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </form>

              {/* Mobile Language Switcher */}
              <div className="mb-4">
                <LanguageSwitcher />
              </div>
              
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/books"
                  className={`font-medium hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200 ${
                    location.pathname.includes("/books") &&
                    !location.pathname.includes("/books/")
                      ? "text-amber-600 dark:text-amber-500"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setIsMenuOpen(false)}>
                  {t("nav.books")}
                </Link>
                <Link
                  to="/categories"
                  className={`font-medium hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200 ${
                    location.pathname.includes("/categories")
                      ? "text-amber-600 dark:text-amber-500"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setIsMenuOpen(false)}>
                  {t("nav.categories")}
                </Link>
                <Link
                  to="/recommendations"
                  className={`font-medium hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200 ${
                    location.pathname.includes("/recommendations")
                      ? "text-amber-600 dark:text-amber-500"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setIsMenuOpen(false)}>
                  Recommendations
                </Link>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to="/cart"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                    onClick={() => setIsMenuOpen(false)}>
                    <div className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {getItemCount() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full min-w-[16px] h-[16px] flex items-center justify-center font-medium">
                          {getItemCount() > 99 ? '99+' : getItemCount()}
                        </span>
                      )}
                    </div>
                    <span>
                      {t("nav.cart")}
                      {cartItems?.length > 0 ? ` (${getItemCount()})` : ""}
                    </span>
                  </Link>
                  <div className="flex items-center gap-2">
                    {user && <NotificationDropdown />}
                    <button
                      onClick={() => {
                        toggleDarkMode();
                        setIsMenuOpen(false);
                      }}
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                      aria-label={
                        darkMode ? "Switch to light mode" : "Switch to dark mode"
                      }>
                      {darkMode ? (
                        <Sun className="h-5 w-5 text-amber-500" />
                      ) : (
                        <Moon className="h-5 w-5 text-gray-700" />
                      )}
                    </button>
                  </div>
                </div>

                {user ? (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-medium uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {user.name}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <Link
                        to={`/profile/${user.username}`}
                        className="text-gray-700 dark:text-gray-300"
                        onClick={() => setIsMenuOpen(false)}>
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="text-gray-700 dark:text-gray-300"
                        onClick={() => setIsMenuOpen(false)}>
                        My Orders
                      </Link>
                      {user.isAdmin && (
                        <Link
                          to="/admin"
                          className="text-gray-700 dark:text-gray-300"
                          onClick={() => setIsMenuOpen(false)}>
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="text-left text-red-600 dark:text-red-500">
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      to="/login"
                      className="block w-full px-4 py-2 text-center rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}>
                      {t("nav.login")}
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full mt-2 px-4 py-2 text-center rounded-md border border-amber-600 text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-gray-800 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}>
                      {t("nav.register")}
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;