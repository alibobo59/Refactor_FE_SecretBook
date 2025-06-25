import React, { useState, useEffect } from 'react';
import { useRecommendation } from '../../contexts/RecommendationContext';
import { motion } from 'framer-motion';
import { BookOpen, RefreshCw } from 'lucide-react';
import BookCard from '../books/BookCard';

const SimilarBooks = ({ bookId, currentBook, className = "" }) => {
  const { getSimilarBooks } = useRecommendation();
  const [similarBooks, setSimilarBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (bookId) {
      loadSimilarBooks();
    }
  }, [bookId]);

  const loadSimilarBooks = async () => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const books = getSimilarBooks(bookId, 6);
    setSimilarBooks(books);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className={`py-8 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Similar Books
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-96 animate-pulse">
                <div className="h-52 bg-gray-300 dark:bg-gray-700 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (similarBooks.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Similar Books
              </h2>
              {currentBook && (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Books similar to "{currentBook.title}"
                </p>
              )}
            </div>
          </div>
          
          <button
            onClick={loadSimilarBooks}
            className="flex items-center gap-2 px-4 py-2 text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Similar Books Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {similarBooks.map(book => (
            <motion.div key={book.id} variants={itemVariants}>
              <BookCard book={book} />
            </motion.div>
          ))}
        </motion.div>

        {/* Recommendation Explanation */}
        {currentBook && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg"
          >
            <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
              Why these recommendations?
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              These books are recommended based on similar genres, authors, ratings, and reader preferences. 
              Our algorithm considers multiple factors to find books you're likely to enjoy.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SimilarBooks;