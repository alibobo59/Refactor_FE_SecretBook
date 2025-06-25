import React, { useState, useEffect } from 'react';
import { useRecommendation } from '../../contexts/RecommendationContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  RefreshCw, 
  Heart,
  Star,
  BookOpen,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import BookCard from '../books/BookCard';
import RecommendationSection from './RecommendationSection';

const PersonalizedRecommendations = () => {
  const { user } = useAuth();
  const { 
    getPersonalizedRecommendations,
    getTrendingBooks,
    getNewReleases,
    getBestSellers,
    userPreferences,
    updatePreferences
  } = useRecommendation();

  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    refreshRecommendations();
  }, [user]);

  const refreshRecommendations = async () => {
    setIsRefreshing(true);
    
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setRecommendations(getPersonalizedRecommendations(8));
    setTrending(getTrendingBooks(8));
    setNewReleases(getNewReleases(8));
    setBestSellers(getBestSellers(8));
    
    setIsRefreshing(false);
  };

  const handlePreferenceUpdate = (newPrefs) => {
    updatePreferences(newPrefs);
    refreshRecommendations();
    setShowPreferences(false);
  };

  if (!user) {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <User className="h-12 w-12 text-amber-600 dark:text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Get Personalized Recommendations
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Sign in to discover books tailored just for you based on your reading preferences and history.
              </p>
              <div className="flex gap-3 justify-center">
                <a
                  href="/login"
                  className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="px-6 py-2 border border-amber-600 text-amber-600 dark:text-amber-500 rounded-md hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-8 w-8" />
                <h1 className="text-3xl font-bold">
                  Recommendations for {user.name}
                </h1>
              </div>
              <p className="text-amber-100 text-lg">
                Discover your next favorite book with our personalized suggestions
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
              >
                <Settings className="h-5 w-5" />
                Preferences
              </button>
              
              <button
                onClick={refreshRecommendations}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Preferences Panel */}
      <AnimatePresence>
        {showPreferences && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
          >
            <div className="container mx-auto px-4 py-6">
              <PreferencesPanel 
                preferences={userPreferences}
                onUpdate={handlePreferenceUpdate}
                onClose={() => setShowPreferences(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommendation Sections */}
      <div className="space-y-8">
        {/* Personalized Recommendations */}
        <RecommendationSection
          title="Just for You"
          books={recommendations}
          icon={Heart}
          className="bg-white dark:bg-gray-800"
          viewAllLink="/recommendations/personalized"
        />

        {/* Trending Books */}
        <RecommendationSection
          title="Trending Now"
          books={trending}
          icon={TrendingUp}
          className="bg-gray-50 dark:bg-gray-900"
          viewAllLink="/recommendations/trending"
        />

        {/* New Releases */}
        <RecommendationSection
          title="New Releases"
          books={newReleases}
          icon={BookOpen}
          className="bg-white dark:bg-gray-800"
          viewAllLink="/recommendations/new"
        />

        {/* Best Sellers */}
        <RecommendationSection
          title="Best Sellers"
          books={bestSellers}
          icon={Star}
          className="bg-gray-50 dark:bg-gray-900"
          viewAllLink="/recommendations/bestsellers"
        />
      </div>
    </div>
  );
};

// Preferences Panel Component
const PreferencesPanel = ({ preferences, onUpdate, onClose }) => {
  const [localPrefs, setLocalPrefs] = useState(preferences);

  const handleSave = () => {
    onUpdate(localPrefs);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Recommendation Preferences
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price Range
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="number"
              value={localPrefs.priceRange.min}
              onChange={(e) => setLocalPrefs(prev => ({
                ...prev,
                priceRange: { ...prev.priceRange, min: Number(e.target.value) }
              }))}
              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              placeholder="Min"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              value={localPrefs.priceRange.max}
              onChange={(e) => setLocalPrefs(prev => ({
                ...prev,
                priceRange: { ...prev.priceRange, max: Number(e.target.value) }
              }))}
              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Rating Threshold */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Minimum Rating
          </label>
          <select
            value={localPrefs.ratingThreshold}
            onChange={(e) => setLocalPrefs(prev => ({
              ...prev,
              ratingThreshold: Number(e.target.value)
            }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            <option value={3}>3+ Stars</option>
            <option value={3.5}>3.5+ Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={4.5}>4.5+ Stars</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;