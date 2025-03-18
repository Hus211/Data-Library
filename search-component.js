import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [authorFilter, setAuthorFilter] = useState('');
  const [journalFilter, setJournalFilter] = useState('');
  const [years, setYears] = useState([]);

  // Fetch available years for the filter
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await axios.get('/papers');
        const uniqueYears = [...new Set(res.data.map(paper => paper.year))].sort((a, b) => b - a);
        setYears(uniqueYears);
      } catch (error) {
        console.error('Error fetching years:', error);
      }
    };
    
    fetchYears();
  }, []);

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterYear) params.append('year', filterYear);
      if (sortBy) params.append('sortBy', sortBy);
      if (authorFilter) params.append('author', authorFilter);
      if (journalFilter) params.append('journal', journalFilter);
      
      const res = await axios.get(`/papers?${params.toString()}`);
      setResults(res.data);
    } catch (error) {
      console.error('Error searching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Search Scholarly Papers</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by title, keyword, or author"
              className="flex-grow border rounded-md px-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <select 
                value={filterYear} 
                onChange={(e) => setFilterYear(e.target.value)}
                className="border rounded-md px-3 py-1"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-md px-3 py-1"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="citations">Sort by Citations</option>
                <option value="year">Sort by Year</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
            
            <button 
              type="button"
              onClick={() => setAdvancedSearch(!advancedSearch)}
              className="text-blue-600 text-sm"
            >
              {advancedSearch ? 'Simple Search' : 'Advanced Search'}
            </button>
          </div>
          
          {advancedSearch && (
            <div className="flex flex-col md:flex-row gap-4 mt-2">
              <input
                type="text"
                placeholder="Filter by author"
                className="flex-grow border rounded-md px-4 py-2"
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
              />
              <input
                type="text"
                placeholder="Filter by journal"
                className="flex-grow border rounded-md px-4 py-2"
                value={journalFilter}
                onChange={(e) => setJournalFilter(e.target.value)}
              />
            </div>
          )}
        </div>
      </form>
      
      {/* Results */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Results ({results.length})</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Searching...</p>
          </div>
        ) : (
          <div className="divide-y">
            {results.length > 0 ? (
              results.map(paper => (
                <div key={paper._id} className="p-4 hover:bg-gray-50">
                  <h3 className="text-lg text-blue-600 font-medium">
                    <Link to={`/papers/${paper._id}`} className="hover:underline">
                      {paper.title}
                    </Link>
                  </h3>
                  <div className="text-sm text-gray-500 mt-1">
                    {paper.authors.join(', ')} - {paper.journal}, {paper.year}
                  </div>
                  <p className="text-gray-700 mt-2 line-clamp-2">
                    {paper.abstract}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-gray-500">
                      Citations: {paper.citations}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {paper.keywords.slice(0, 3).map((keyword, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                {searchTerm || filterYear || authorFilter || journalFilter ? 
                  'No results found. Try adjusting your search criteria.' : 
                  'Search for papers using the form above.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
