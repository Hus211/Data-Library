import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import PaperDetail from './pages/PaperDetail';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';

// Auth Context
import { AuthProvider } from './context/AuthContext';

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = API_URL;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<Search />} />
              <Route path="/papers/:id" element={<PaperDetail />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }
  
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/" />;
};

// Custom Hook for Auth Context
const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default App;
