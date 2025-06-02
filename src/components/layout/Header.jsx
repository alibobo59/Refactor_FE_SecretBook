import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const checkDarkMode = () => {
      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
        setDarkMode(true);
      } else {
        document.documentElement.classList.remove("dark");
        setDarkMode(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    checkDarkMode();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setDarkMode(true);
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
              Secret
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
              Browse
            </Link>
            <Link
              to="/categories"
              className={`font-medium hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200 ${
                location.pathname.includes("/categories")
                  ? "text-amber-600 dark:text-amber-500"
                  : "text-gray-700 dark:text-gray-300"
              }`}>
              Categories
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
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 w-40 focus:w-60"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle dark mode">
              {darkMode ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>

            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              {cartItems?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-medium uppercase">
                    {user.name.charAt(0)}
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 origin-top-right transition-all duration-200">
                  <div className="py-2">
                    <Link
                      to={`/profile/${user.username}`}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Profile
                    </Link>
                    <Link
                      to="/my-books"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      My Books
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      My Orders
                    </Link>
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors duration-200">
                Login
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
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
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
                Browse
              </Link>
              <Link
                to="/categories"
                className={`font-medium hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200 ${
                  location.pathname.includes("/categories")
                    ? "text-amber-600 dark:text-amber-500"
                    : "text-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setIsMenuOpen(false)}>
                Categories
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
                  <ShoppingCart className="h-5 w-5" />
                  <span>
                    Cart{cartItems?.length > 0 ? ` (${cartItems.length})` : ""}
                  </span>
                </Link>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  aria-label="Toggle dark mode">
                  {darkMode ? (
                    <Sun className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-700" />
                  )}
                </button>
              </div>

              {user ? (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-medium uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <Link
                      to={`/profile/${user.username}`}
                      className="text-gray-700 dark:text-gray-300"
                      onClick={() => setIsMenuOpen(false)}>
                      Profile
                    </Link>
                    <Link
                      to="/my-books"
                      className="text-gray-700 dark:text-gray-300"
                      onClick={() => setIsMenuOpen(false)}>
                      My Books
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
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full mt-2 px-4 py-2 text-center rounded-md border border-amber-600 text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
