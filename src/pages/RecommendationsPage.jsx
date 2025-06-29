import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBook } from '../contexts/BookContext';
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
  User,
  RefreshCw,
  Brain,
  Target,
  Clock
} from 'lucide-react';
import BookCard from '../components/books/BookCard';

const RecommendationsPage = () => {
  const { user } = useAuth();
  const { books } = useBook();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'for-you';
  
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterRating, setFilterRating] = useState('all');

  useEffect(() => {
    loadRecommendations();
  }, [type, user, books]);

  const loadRecommendations = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let recommendedBooks = [];
    
    if (!books || books.length === 0) {
      setRecommendations([]);
      setLoading(false);
      return;
    }
    
    switch (type) {
      case 'for-you':
        // Personalized recommendations based on user behavior
        recommendedBooks = getPersonalizedRecommendations();
        break;
      case 'trending':
        // Trending books based on recent activity
        recommendedBooks = getTrendingBooks();
        break;
      case 'similar':
        // Similar to books user has viewed/rated
        recommendedBooks = getSimilarBooks();
        break;
      case 'new':
        // New releases
        recommendedBooks = getNewReleases();
        break;
      case 'bestsellers':
        // Best sellers based on ratings and reviews
        recommendedBooks = getBestSellers();
        break;
      default:
        recommendedBooks = getPersonalizedRecommendations();
    }
    
    setRecommendations(recommendedBooks);
    setLoading(false);
  };

  // Mock recommendation algorithms (to be replaced with ML backend)
  const getPersonalizedRecommendations = () => {
    if (!user) return [];
    
    // Mock: Based on user's review history and behavior
    // In real implementation, this would call your ML backend
    return [...books]
      .map(book => ({
        ...book,
        recommendationScore: Math.random() * 5 + book.average_rating,
        reason: getRecommendationReason(book)
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 20);
  };

  const getTrendingBooks = () => {
    // Mock: Books with high recent activity
    return [...books]
      .map(book => ({
        ...book,
        trendingScore: (book.ratings?.length || 0) * book.average_rating + Math.random() * 2,
        reason: 'Trending now'
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 20);
  };

  const getSimilarBooks = () => {
    // Mock: Books similar to user's reading history
    return [...books]
      .map(book => ({
        ...book,
        similarityScore: Math.random() * 4 + book.average_rating,
        reason: 'Similar to books you\'ve enjoyed'
      }))
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 20);
  };

  const getNewReleases = () => {
    return [...books]
      .map(book => ({
        ...book,
        reason: 'New release'
      }))
      .sort((a, b) => new Date(b.published_date) - new Date(a.published_date))
      .slice(0, 20);
  };

  const getBestSellers = () => {
    return [...books]
      .map(book => ({
        ...book,
        bestseller_score: (book.ratings?.length || 0) * book.average_rating,
        reason: 'Bestseller'
      }))
      .sort((a, b) => b.bestseller_score - a.bestseller_score)
      .slice(0, 20);
  };

  const getRecommendationReason = (book) => {
    const reasons = [
      'Based on your reading history',
      'Because you liked similar books',
      'Highly rated in your favorite genre',
      'Popular among readers like you',
      'Trending in your area of interest'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const getPageConfig = () => {
    switch (type) {
      case 'trending':
        return {
          title: 'Trending Books',
          subtitle: 'Popular books that everyone is talking about right now',
          icon: TrendingUp,
          color: 'from-purple-600 to-pink-600'
        };
      case 'similar':
        return {
          title: 'Similar Books',
          subtitle: 'Books similar to ones you\'ve enjoyed',
          icon: Target,
          color: 'from-blue-600 to-cyan-600'
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
          subtitle: 'Top-rated books loved by readers worldwide',
          icon: Star,
          color: 'from-yellow-600 to-orange-600'
        };
      default:
        return {
          title: 'Recommended for You',
          subtitle: 'Personalized book recommendations powered by AI',
          icon: Brain,
          color: 'from-amber-600 to-red-600'
        };
    }
  };

  const config = getPageConfig();
  const Icon = config.icon;

  // Filter and sort recommendations
  const filteredAndSortedBooks = recommendations
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
        case 'newest':
          return new Date(b.published_date) - new Date(a.published_date);
        default: // relevance
          return (b.recommendationScore || b.trendingScore || b.similarityScore || b.bestseller_score || b.average_rating) - 
                 (a.recommendationScore || a.trendingScore || a.similarityScore || a.bestseller_score || a.average_rating);
      }
    });

  if (!user && type === 'for-you') {
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
                  Create an account or sign in to get AI-powered book recommendations based on your reading history and preferences.
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
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
                <p className="text-white/90 text-lg">{config.subtitle}</p>
                {user && type === 'for-you' && (
                  <p className="text-white/80 text-sm mt-1">
                    <Brain className="h-4 w-4 inline mr-1" />
                    Powered by machine learning algorithms
                  </p>
                )}
              </div>
            </div>
            
            <button
              onClick={loadRecommendations}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </motion.div>
        </div>
      </div>

      {/* Recommendation Type Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-4 gap-2">
            {[
              { key: 'for-you', label: 'For You', icon: Heart, requiresAuth: true },
              { key: 'trending', label: 'Trending', icon: TrendingUp },
              { key: 'similar', label: 'Similar', icon: Target, requiresAuth: true },
              { key: 'new', label: 'New Releases', icon: Clock },
              { key: 'bestsellers', label: 'Best Sellers', icon: Star },
            ].map((tab) => {
              if (tab.requiresAuth && !user) return null;
              
              const TabIcon = tab.icon;
              const isActive = type === tab.key;
              
              return (
                <Link
                  key={tab.key}
                  to={`/recommendations?type=${tab.key}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {filteredAndSortedBooks.length} recommendations found
              </span>
              {user && type === 'for-you' && (
                <span className="text-xs text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                  AI-Powered
                </span>
              )}
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
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
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
                  <option value="newest">Newest First</option>
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
            <div className="flex gap-4 justify-center">
              <button
                onClick={loadRecommendations}
                className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Refresh Recommendations
              </button>
              <Link
                to="/books"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Browse All Books
              </Link>
            </div>
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
                className="relative"
              >
                <BookCard book={book} />
                {/* Recommendation Reason */}
                {book.reason && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                    {book.reason}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ML Integration Notice */}
      {user && type === 'for-you' && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3 text-amber-800 dark:text-amber-200">
              <Brain className="h-5 w-5" />
              <div>
                <p className="font-medium">AI-Powered Recommendations</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  These recommendations improve as you rate and review more books. 
                  Our machine learning algorithms analyze your reading patterns to suggest books you'll love.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;