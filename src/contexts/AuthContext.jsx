import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call to the Laravel backend
      // For now, we'll simulate a successful login
      const response = await simulateApiCall({ email, password }, 500);
      
      const { user, token } = response.data;
      
      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      // Set axios default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return user;
    } catch (error) {
      setError(error.message || 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, password_confirmation) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call to the Laravel backend
      // For now, we'll simulate a successful registration
      const response = await simulateApiCall({ name, email, password, password_confirmation }, 800);
      
      const { user, token } = response.data;
      
      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      // Set axios default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return user;
    } catch (error) {
      setError(error.message || 'Failed to register');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove user data and token from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Remove axios default authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear user state
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper function to simulate API calls (for development only)
const simulateApiCall = (data, delay = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate login/register logic
      if (data.email === 'admin@example.com') {
        resolve({
          data: {
            user: {
              id: 1,
              name: 'Admin User',
              email: 'admin@example.com',
              username: 'admin',
              isAdmin: true,
            },
            token: 'fake-jwt-token-for-admin',
          },
        });
      } else if (data.email) {
        resolve({
          data: {
            user: {
              id: 2,
              name: data.name || 'John Doe',
              email: data.email,
              username: data.email.split('@')[0],
              isAdmin: false,
            },
            token: 'fake-jwt-token-for-user',
          },
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, delay);
  });
};