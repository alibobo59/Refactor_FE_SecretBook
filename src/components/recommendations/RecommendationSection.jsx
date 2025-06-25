import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Star, TrendingUp, Clock, Award } from 'lucide-react';
import BookCard from '../books/BookCard';

const RecommendationSection = ({ 
  title, 
  books, 
  icon: Icon = TrendingUp,
  viewAllLink,
  className = "",
  showRating = true,
  layout = "grid" // "grid" or "horizontal"
}) => {
  if (!books || books.length === 0) return null;

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
    <section className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Icon className="h-6 w-6 text-amber-600 dark:text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {title}
            </h2>
          </div>
          
          {viewAllLink && (
            <Link 
              to={viewAllLink}
              className="flex items-center gap-2 text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 font-medium transition-colors"
            >
              View All
              <ChevronRight className="h-5 w-5" />
            </Link>
          )}
        </div>

        {/* Books Display */}
        {layout === "grid" ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {books.map(book => (
              <motion.div key={book.id} variants={itemVariants}>
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {books.map(book => (
              <motion.div 
                key={book.id} 
                variants={itemVariants}
                className="flex-shrink-0 w-64"
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default RecommendationSection;