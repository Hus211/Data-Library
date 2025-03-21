import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import FileUpload from '../components/FileUpload';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    interests: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('papers');
  
  useEffect(() => {
    if (isAuthenticated && user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        interests: user.interests || []
      });
      
      // Fetch user's papers
      fetchPapers();
    }
  }, [isAuthenticated, user]);
  
  const fetchPapers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/papers/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPapers(response.data);
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/users/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
          <p className="mb-6">Please log in to view your profile.</p>
          <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-md">
            Sign In
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-blue-600 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">{profileData.name}'s Profile</h1>
          </div>
          
          <div className="p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                    disabled
                  />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Tell us about yourself and your research interests..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-600 font-bold rounded-full w-12 h-12 flex items-center justify-center mr-4">
                      {profileData.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{profileData.name}</h2>
                      <p className="text-gray-600">{profileData.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Profile
                  </button>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-3">About</h3>
                  <p className="text-gray-700">
                    {profileData.bio || 'No bio information provided yet.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Tabs navigation */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('papers')}
                className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                  activeTab === 'papers'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Papers
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                  activeTab === 'upload'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Upload Papers
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'papers' ? (
              <div>
                <h2 className="text-xl font-bold mb-4">My Papers</h2>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : papers.length > 0 ? (
                  <div className="space-y-6">
                    {papers.map((paper) => (
                      <div key={paper._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-200">
                        <h3 className="font-bold text-lg text-blue-600 hover:underline cursor-pointer">
                          {paper.title}
                        </h3>
                        <div className="text-sm text-gray-600 mt-1">
                          {paper.authors.join(', ')} · {paper.journal || 'No Journal'} · {new Date(paper.uploadDate).toLocaleDateString()}
                        </div>
                        <p className="mt-3 text-gray-700">{paper.abstract.substring(0, 150)}...</p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex space-x-2">
                            <a 
                              href={`/paper/${paper._id}`} 
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Details
                            </a>
                            <span className="text-gray-300">|</span>
                            <a 
                              href={paper.fileUrl} 
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              Download PDF
                            </a>
                          </div>
                          <div className="text-sm text-gray-500">
                            Citations: {paper.citations || 0}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No papers yet</h3>
                    <p className="mt-1 text-gray-500">Get started by uploading your first paper.</p>
                    <div className="mt-6">
                      <button
                        onClick={() => setActiveTab('upload')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Upload Paper
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <FileUpload onUploadSuccess={fetchPapers} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
