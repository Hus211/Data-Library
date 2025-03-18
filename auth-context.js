import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Set the Authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get user profile
        const res = await axios.get('/api/users/profile');
        
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Register user
  const register = async (formData) => {
    setError(null);
    try {
      const res = await axios.post('/users/register', formData);
      
      // Set token to localStorage
      localStorage.setItem('token', res.data.token);
      
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during registration');
      return false;
    }
  };

  // Login user
  const login = async (formData) => {
    setError(null);
    try {
      const res = await axios.post('/users/login', formData);
      
      // Set token to localStorage
      localStorage.setItem('token', res.data.token);
      
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
      return false;
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      error,
      register,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
