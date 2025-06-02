import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-500" />
              <span className="ml-2 text-2xl font-serif font-bold text-gray-800 dark:text-white">
                Bookify
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your premier destination for books across all genres. Discover, read, and connect with fellow book lovers.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/books" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                >
                  Browse Books
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link 
                  to="/recommendations" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                >
                  Recommendations
                </Link>
              </li>
              <li>
                <Link 
                  to="/bestsellers" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                >
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link 
                  to="/new-releases" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                >
                  New Releases
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Account</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/login" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link 
                  to="/my-books" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                >
                  My Books
                </Link>
              </li>
              <li>
                <Link 
                  to="/orders" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                >
                  Order History
                </Link>
              </li>
              <li>
                <Link 
                  to="/wishlist" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/returns" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">Subscribe to our Newsletter</h3>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow py-2 px-4 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                required
              />
              <button 
                type="submit" 
                className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-r-md transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              Stay updated with new releases, special offers, and reading recommendations.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            &copy; {currentYear} Bookify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;