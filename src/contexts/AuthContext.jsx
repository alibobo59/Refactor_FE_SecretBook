import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

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
      
      // Show success toast
      if (toast) {
        toast.showLoginSuccess(user.name);
      }
      
      return user;
    } catch (error) {
      setError(error.message || 'Failed to login');
      
      // Show error toast
      if (toast) {
        toast.showError(
          'Login Failed',
          error.message || 'Invalid email or password. Please try again.'
        );
      }
      
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
      
      // Show success toast
      if (toast) {
        toast.showSuccess(
          'Welcome to Secret Bookstore!',
          `Account created successfully. Welcome aboard, ${user.name}!`,
          {
            action: {
              label: 'Explore Books',
              onClick: () => window.location.href = '/books',
            },
          }
        );
      }
      
      // Notify admin about new user registration
      if (toast && !user.isAdmin) {
        toast.showAdminUserRegistered(user.email);
      }
      
      return user;
    } catch (error) {
      setError(error.message || 'Failed to register');
      
      // Show error toast
      if (toast) {
        toast.showError(
          'Registration Failed',
          error.message || 'Unable to create account. Please try again.'
        );
      }
      
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
    
    // Show logout toast
    if (toast) {
      toast.showLogoutSuccess();
    }
    
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