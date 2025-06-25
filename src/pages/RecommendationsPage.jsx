import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useRecommendation } from '../contexts/RecommendationContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Filter, 
  SortAsc, 
  Heart,
  TrendingUp,
  BookOpen,
  Star,
  Sparkles,
  User
} from 'lucide-react';
import BookCard from '../components/books/BookCard';

const RecommendationsPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'personalized';
  
  const {
    getPersonalizedRecommendations,
    getTrendingBooks,
    getNewReleases,
    getBestSellers,
  } = useRecommendation();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterRating, setFilterRating] = useState('all');

  useEffect(() => {
    loadRecommendations();
  }, [type, user]);

  const loadRecommendations = async () => {
    setLoading(true);
    
    let recommendedBooks = [];
    
    switch (type) {
      case 'personalized':
        recommendedBooks = getPersonalizedRecommendations(20);
        break;
      case 'trending':
        recommendedBooks = getTrendingBooks(20);
        break;
      case 'new':
        recommendedBooks = getNewReleases(20);
        break;
      case 'bestsellers':
        recommendedBooks = getBestSellers(20);
        break;
      default:
        recommendedBooks = getPersonalizedRecommendations(20);
    }
    
    setBooks(recommendedBooks);
    setLoading(false);
  };

  const getPageConfig = () => {
    switch (type) {
      case 'trending':
        return {
          title: 'Trending Books',
          subtitle: 'Popular books that everyone is talking about',
          icon: TrendingUp,
          color: 'from-purple-600 to-pink-600'
        };
      case 'new':
        return {
          title: 'New Releases',
          subtitle: 'Fresh books just added to our collection',
          icon: BookOpen,
          color: 'from-green-600 to-teal-600'
        };
      case 'bestsellers':
        return {
          title: 'Best Sellers',
          subtitle: 'Top-rated books loved by readers',
          icon: Star,
          color: 'from-yellow-600 to-orange-600'
        };
      default:
        return {
          title: 'Personalized Recommendations',
          subtitle: 'Books curated just for you based on your preferences',
          icon: Heart,
          color: 'from-amber-600 to-red-600'
        };
    }
  };

  const config = getPageConfig();
  const Icon = config.icon;

  // Filter and sort books
  const filteredAndSortedBooks = books
    .filter(book => {
      if (filterRating === 'all') return true;
      const rating = parseFloat(filterRating);
      return book.average_rating >= rating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.average_rating - a.average_rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        default: // relevance
          return b.recommendationScore - a.recommendationScore || b.average_rating - a.average_rating;
      }
    });

  if (!user && type === 'personalized') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 mb-6">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <User className="h-16 w-16 text-amber-600 dark:text-amber-500 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Sign In for Personalized Recommendations
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Create an account or sign in to get book recommendations tailored to your reading preferences and history.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    to="/login"
                    className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-3 border border-amber-600 text-amber-600 dark:text-amber-500 rounded-md hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.color} text-white py-12`}>
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 bg-white/20 rounded-lg">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
              <p className="text-white/90 text-lg">{config.subtitle}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {filteredAndSortedBooks.length} books found
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {/* Rating Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                >
                  <option value="all">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="title">Title A-Z</option>
                  <option value="author">Author A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-96 animate-pulse">
                <div className="h-52 bg-gray-300 dark:bg-gray-700 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedBooks.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              No recommendations found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Try adjusting your filters or check back later for new recommendations.
            </p>
            <Link
              to="/books"
              className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
            >
              Browse All Books
            </Link>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {filteredAndSortedBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;