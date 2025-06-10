import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ReviewContext = createContext();

export const useReview = () => {
  return useContext(ReviewContext);
};

export const ReviewProvider = ({ children }) => {
  const { user } = useAuth();
  const [reviewInteractions, setReviewInteractions] = useState({});
  const [loading, setLoading] = useState(false);

  // Load user's review interactions from localStorage
  useEffect(() => {
    if (user) {
      const storedInteractions = localStorage.getItem(`reviewInteractions_${user.id}`);
      if (storedInteractions) {
        setReviewInteractions(JSON.parse(storedInteractions));
      }
    } else {
      setReviewInteractions({});
    }
  }, [user]);

  // Save interactions to localStorage whenever they change
  useEffect(() => {
    if (user && Object.keys(reviewInteractions).length > 0) {
      localStorage.setItem(`reviewInteractions_${user.id}`, JSON.stringify(reviewInteractions));
    }
  }, [reviewInteractions, user]);

  const likeReview = async (reviewId) => {
    if (!user) {
      throw new Error('You must be logged in to like reviews');
    }

    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));

      setReviewInteractions(prev => {
        const current = prev[reviewId];
        const newInteraction = { ...prev };

        if (current?.type === 'like') {
          // Remove like if already liked
          delete newInteraction[reviewId];
        } else {
          // Add like (or change from dislike to like)
          newInteraction[reviewId] = {
            type: 'like',
            timestamp: new Date().toISOString()
          };
        }

        return newInteraction;
      });

      return true;
    } catch (error) {
      console.error('Failed to like review:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const dislikeReview = async (reviewId) => {
    if (!user) {
      throw new Error('You must be logged in to dislike reviews');
    }

    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));

      setReviewInteractions(prev => {
        const current = prev[reviewId];
        const newInteraction = { ...prev };

        if (current?.type === 'dislike') {
          // Remove dislike if already disliked
          delete newInteraction[reviewId];
        } else {
          // Add dislike (or change from like to dislike)
          newInteraction[reviewId] = {
            type: 'dislike',
            timestamp: new Date().toISOString()
          };
        }

        return newInteraction;
      });

      return true;
    } catch (error) {
      console.error('Failed to dislike review:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getReviewInteraction = (reviewId) => {
    return reviewInteractions[reviewId] || null;
  };

  const getUserInteractionStats = () => {
    const interactions = Object.values(reviewInteractions);
    return {
      totalLikes: interactions.filter(i => i.type === 'like').length,
      totalDislikes: interactions.filter(i => i.type === 'dislike').length,
      totalInteractions: interactions.length
    };
  };

  const value = {
    reviewInteractions,
    loading,
    likeReview,
    dislikeReview,
    getReviewInteraction,
    getUserInteractionStats,
    isAuthenticated: !!user
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};