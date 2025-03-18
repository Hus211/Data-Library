import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PaperDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [paper, setPaper] = useState(null);
  const [relatedPapers, setRelatedPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaper = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/papers/${id}`);
        setPaper(res.data);
        
        // Fetch related papers (papers with similar keywords)
        const relatedRes = await axios.get('/papers');
        const filtered = relatedRes.data
          .filter(p => p._id !== id && p.keywords.some(k => res.data.keywords.includes(k)))
          .slice(0, 4);
        setRelatedPapers(filtered);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load paper');
        console.error('Error fetching paper:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaper();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this paper?')) {
      try {
        await axios.delete(`/papers/${id}`);
        navigate('/search');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete paper');
        console.error('Error deleting paper:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading paper details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <Link to="/search" className="mt-4 inline-block text-blue-600 hover:underline">
          Back to search
        </Link>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Paper not found</p>
        <Link to="/search" className="mt-4 inline-block text-blue-600 hover:underline">
          Back to search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <Link to="/search" className="text-blue-600 hover:underline flex items-center gap-1">
            ← Back to search results
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">{paper.title}</h1>
        
        <div className="flex justify-between items-start mb-6">
          <div className="text-gray-600">
            <div className="mb-1"><strong>Authors:</strong> {paper.authors.join(', ')}</div>
            <div className="mb-1"><strong>Journal:</strong> {paper.journal}</div>
            <div className="mb-1"><strong>Year:</strong> {paper.year}</div>
            <div><strong>Citations:</strong> {paper.citations}</div>
          </div>
          
          <div className="flex gap-2">
            {paper.url && (
              <a 
                href={paper.url} 
                target="_blank" 
                rel="noopener noreferrer"