import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useBook } from './BookContext';

const RecommendationContext = createContext();

export const useRecommendation = () => {
  return useContext(RecommendationContext);
};

export const RecommendationProvider = ({ children }) => {
  const { user } = useAuth();
  const { books, categories } = useBook();
  const [userPreferences, setUserPreferences] = useState({
    favoriteGenres: [],
    favoriteAuthors: [],
    priceRange: { min: 0, max: 100 },
    ratingThreshold: 3.5,
  });
  const [userBehavior, setUserBehavior] = useState({
    viewedBooks: [],
    purchasedBooks: [],
    cartItems: [],
    searchHistory: [],
    ratedBooks: [],
  });

  // Load user data from localStorage
  useEffect(() => {
    if (user) {
      const savedPreferences = localStorage.getItem(`preferences_${user.id}`);
      const savedBehavior = localStorage.getItem(`behavior_${user.id}`);
      
      if (savedPreferences) {
        setUserPreferences(JSON.parse(savedPreferences));
      }
      
      if (savedBehavior) {
        setUserBehavior(JSON.parse(savedBehavior));
      }
    }
  }, [user]);

  // Save user data to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`preferences_${user.id}`, JSON.stringify(userPreferences));
      localStorage.setItem(`behavior_${user.id}`, JSON.stringify(userBehavior));
    }
  }, [user, userPreferences, userBehavior]);

  // Track user behavior
  const trackBookView = (bookId) => {
    if (!user) return;
    
    setUserBehavior(prev => ({
      ...prev,
      viewedBooks: [
        bookId,
        ...prev.viewedBooks.filter(id => id !== bookId)
      ].slice(0, 50) // Keep last 50 viewed books
    }));
  };

  const trackBookPurchase = (bookId) => {
    if (!user) return;
    
    setUserBehavior(prev => ({
      ...prev,
      purchasedBooks: [...prev.purchasedBooks, bookId]
    }));
  };

  const trackSearch = (query) => {
    if (!user || !query.trim()) return;
    
    setUserBehavior(prev => ({
      ...prev,
      searchHistory: [
        query.toLowerCase(),
        ...prev.searchHistory.filter(q => q !== query.toLowerCase())
      ].slice(0, 20) // Keep last 20 searches
    }));
  };

  const trackRating = (bookId, rating) => {
    if (!user) return;
    
    setUserBehavior(prev => ({
      ...prev,
      ratedBooks: [
        { bookId, rating, date: new Date().toISOString() },
        ...prev.ratedBooks.filter(r => r.bookId !== bookId)
      ]
    }));
  };

  // Update user preferences
  const updatePreferences = (newPreferences) => {
    setUserPreferences(prev => ({
      ...prev,
      ...newPreferences
    }));
  };

  // Recommendation algorithms
  const getPersonalizedRecommendations = (limit = 10) => {
    if (!books || books.length === 0) return [];
    
    let recommendations = [...books];
    
    // Filter out already purchased books
    recommendations = recommendations.filter(
      book => !userBehavior.purchasedBooks.includes(book.id)
    );

    // Score books based on various factors
    recommendations = recommendations.map(book => {
      let score = 0;
      
      // Base score from book rating
      score += book.average_rating * 2;
      
      // Boost for favorite genres
      if (userPreferences.favoriteGenres.includes(book.category_id)) {
        score += 5;
      }
      
      // Boost for favorite authors
      if (userPreferences.favoriteAuthors.includes(book.author)) {
        score += 4;
      }
      
      // Price preference
      if (book.price >= userPreferences.priceRange.min && 
          book.price <= userPreferences.priceRange.max) {
        score += 2;
      }
      
      // Rating threshold
      if (book.average_rating >= userPreferences.ratingThreshold) {
        score += 3;
      }
      
      // Boost for books similar to viewed books
      const viewedBooksScore = userBehavior.viewedBooks.reduce((acc, viewedId) => {
        const viewedBook = books.find(b => b.id === viewedId);
        if (viewedBook && viewedBook.category_id === book.category_id) {
          return acc + 1;
        }
        return acc;
      }, 0);
      score += viewedBooksScore * 0.5;
      
      // Boost for books with similar ratings to user's rated books
      const userAvgRating = userBehavior.ratedBooks.length > 0 
        ? userBehavior.ratedBooks.reduce((sum, r) => sum + r.rating, 0) / userBehavior.ratedBooks.length
        : 4;
      
      const ratingDiff = Math.abs(book.average_rating - userAvgRating);
      score += Math.max(0, 2 - ratingDiff);
      
      // Random factor for diversity
      score += Math.random() * 0.5;
      
      return { ...book, recommendationScore: score };
    });

    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);
  };

  const getSimilarBooks = (bookId, limit = 6) => {
    if (!books || books.length === 0) return [];
    
    const targetBook = books.find(book => book.id === bookId);
    if (!targetBook) return [];
    
    let similarBooks = books.filter(book => book.id !== bookId);
    
    // Score books based on similarity
    similarBooks = similarBooks.map(book => {
      let similarity = 0;
      
      // Same category
      if (book.category_id === targetBook.category_id) {
        similarity += 5;
      }
      
      // Same author
      if (book.author === targetBook.author) {
        similarity += 4;
      }
      
      // Similar rating
      const ratingDiff = Math.abs(book.average_rating - targetBook.average_rating);
      similarity += Math.max(0, 3 - ratingDiff);
      
      // Similar price
      const priceDiff = Math.abs(book.price - targetBook.price);
      similarity += Math.max(0, 2 - (priceDiff / 10));
      
      // Random factor
      similarity += Math.random() * 0.5;
      
      return { ...book, similarity };
    });
    
    return similarBooks
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  };

  const getTrendingBooks = (limit = 8) => {
    if (!books || books.length === 0) return [];
    
    // Mock trending algorithm based on rating and recent activity
    return books
      .map(book => ({
        ...book,
        trendingScore: book.average_rating * (book.ratings?.length || 1) + Math.random()
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit);
  };

  const getNewReleases = (limit = 8) => {
    if (!books || books.length === 0) return [];
    
    return books
      .sort((a, b) => new Date(b.published_date) - new Date(a.published_date))
      .slice(0, limit);
  };

  const getBestSellers = (limit = 8) => {
    if (!books || books.length === 0) return [];
    
    // Mock bestseller algorithm based on ratings count and rating
    return books
      .map(book => ({
        ...book,
        bestseller_score: (book.ratings?.length || 0) * book.average_rating
      }))
      .sort((a, b) => b.bestseller_score - a.bestseller_score)
      .slice(0, limit);
  };

  const getRecommendationsByCategory = (categoryId, limit = 8) => {
    if (!books || books.length === 0) return [];
    
    return books
      .filter(book => book.category_id === categoryId)
      .sort((a, b) => b.average_rating - a.average_rating)
      .slice(0, limit);
  };

  const getSearchBasedRecommendations = (query, limit = 8) => {
    if (!books || books.length === 0 || !query) return [];
    
    const searchTerms = query.toLowerCase().split(' ');
    
    return books
      .map(book => {
        let relevance = 0;
        const bookText = `${book.title} ${book.author} ${book.description}`.toLowerCase();
        
        searchTerms.forEach(term => {
          if (bookText.includes(term)) {
            relevance += 1;
          }
        });
        
        return { ...book, relevance };
      })
      .filter(book => book.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit);
  };

  // Auto-update preferences based on behavior
  useEffect(() => {
    if (!user || !books || userBehavior.ratedBooks.length === 0) return;
    
    // Update favorite genres based on highly rated books
    const genreRatings = {};
    userBehavior.ratedBooks.forEach(({ bookId, rating }) => {
      const book = books.find(b => b.id === bookId);
      if (book && rating >= 4) {
        genreRatings[book.category_id] = (genreRatings[book.category_id] || 0) + 1;
      }
    });
    
    const favoriteGenres = Object.entries(genreRatings)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genreId]) => parseInt(genreId));
    
    // Update favorite authors
    const authorRatings = {};
    userBehavior.ratedBooks.forEach(({ bookId, rating }) => {
      const book = books.find(b => b.id === bookId);
      if (book && rating >= 4) {
        authorRatings[book.author] = (authorRatings[book.author] || 0) + 1;
      }
    });
    
    const favoriteAuthors = Object.entries(authorRatings)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([author]) => author);
    
    setUserPreferences(prev => ({
      ...prev,
      favoriteGenres,
      favoriteAuthors
    }));
  }, [user, books, userBehavior.ratedBooks]);

  const value = {
    userPreferences,
    userBehavior,
    updatePreferences,
    trackBookView,
    trackBookPurchase,
    trackSearch,
    trackRating,
    getPersonalizedRecommendations,
    getSimilarBooks,
    getTrendingBooks,
    getNewReleases,
    getBestSellers,
    getRecommendationsByCategory,
    getSearchBasedRecommendations,
  };

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  );
};