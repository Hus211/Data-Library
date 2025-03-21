import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaperDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [relatedPapers, setRelatedPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin from localStorage
    const checkAdmin = () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      setIsAdmin(userData?.role === 'admin');
    };
    
    checkAdmin();
    
    const fetchPaper = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/papers/${id}`);
        setPaper(res.data);
        
        // Fetch related papers (papers with similar keywords)
        const relatedRes = await axios.get('/api/papers');
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
        await axios.delete(`/api/papers/${id}`);
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
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                View Paper
              </a>
            )}
            {isAdmin && (
              <>
                <Link 
                  to={`/edit-paper/${paper._id}`}
                  className="bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded-md hover:bg-blue-100"
                >
                  Edit
                </Link>
                <button 
                  onClick={handleDelete}
                  className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-md hover:bg-red-100"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-2">Abstract</h2>
          <p className="text-gray-700">{paper.abstract}</p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-2">Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {paper.keywords.map((keyword, idx) => (
              <span key={idx} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                {keyword}
              </span>
            ))}
          </div>
        </div>
        
        {relatedPapers.length > 0 && (
          <div>
            <h2 className="text-xl font-medium mb-2">Related Papers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPapers.map(relatedPaper => (
                <Link 
                  key={relatedPaper._id}
                  to={`/papers/${relatedPaper._id}`}
                  className="p-4 border rounded-lg hover:bg-blue-50"
                >
                  <h3 className="font-medium text-blue-600">{relatedPaper.title}</h3>
                  <p className="text-sm text-gray-500">
                    {relatedPaper.authors.join(', ')} - {relatedPaper.year}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperDetail;
