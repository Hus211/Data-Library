import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [paperInfo, setPaperInfo] = useState({
    title: '',
    authors: '',
    abstract: ''
  });
  const [step, setStep] = useState(1);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMessage('');
    setStatus('');
    
    // Try to extract the title from filename
    if (selectedFile) {
      const fileName = selectedFile.name.replace('.pdf', '');
      setPaperInfo(prev => ({
        ...prev,
        title: fileName
      }));
    }
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setPaperInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (!file) {
      setMessage('Please select a PDF file first');
      setStatus('error');
      return;
    }
    
    // Check if file is a PDF
    if (file.type !== 'application/pdf') {
      setMessage('Only PDF files are accepted');
      setStatus('error');
      return;
    }
    
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleUpload = async () => {
    if (!file || !paperInfo.title) {
      setMessage('Please provide at least the title of the paper');
      setStatus('error');
      return;
    }

    const formData = new FormData();
    formData.append('paper', file);
    formData.append('title', paperInfo.title);
    formData.append('authors', paperInfo.authors);
    formData.append('abstract', paperInfo.abstract);

    setUploading(true);
    setMessage('Uploading your paper...');
    setStatus('info');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/papers/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setMessage('Paper uploaded successfully!');
      setStatus('success');
      setStep(3);
      
      // You can add a callback to refresh the papers list
      if (typeof onUploadSuccess === 'function') {
        onUploadSuccess();
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(error.response?.data?.message || 'Error uploading file');
      setStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Upload Academic Paper</h2>
      
      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          status === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
          status === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : 
          'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {message}
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            1
          </div>
          <div className={`flex-grow h-0.5 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
          <div className={`flex-grow h-0.5 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            3
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <div className="text-center">Select File</div>
          <div className="text-center">Paper Details</div>
          <div className="text-center">Complete</div>
        </div>
      </div>
      
      {step === 1 && (
        <div>
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-md p-10 text-center">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf"
              id="paper-upload"
              disabled={uploading}
            />
            {!file ? (
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  <label htmlFor="paper-upload" className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                    Click to upload
                  </label>{' '}
                  or drag and drop
                </p>
                <p className="mt-1 text-xs text-gray-500">PDF files only (max 10MB)</p>
              </div>
            ) : (
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2 text-sm font-medium text-gray-900">
                  {file.name}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="mt-3 text-sm text-red-600 hover:text-red-800"
                >
                  Remove file
                </button>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!file}
              className={`px-6 py-2 rounded-md ${
                !file 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div>
          <div className="bg-white p-6 border border-gray-200 rounded-md">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Paper Title *</label>
              <input
                type="text"
                name="title"
                value={paperInfo.title}
                onChange={handleInfoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Authors</label>
              <input
                type="text"
                name="authors"
                value={paperInfo.authors}
                onChange={handleInfoChange}
                placeholder="e.g., John Smith, Jane Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple authors with commas</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Abstract</label>
              <textarea
                name="abstract"
                value={paperInfo.abstract}
                onChange={handleInfoChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide a brief description of the paper..."
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || !paperInfo.title}
              className={`px-6 py-2 rounded-md ${
                uploading || !paperInfo.title
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload Paper'}
            </button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">Upload Complete!</h3>
          <p className="mt-2 text-gray-600">Your paper has been successfully uploaded.</p>
          <div className="mt-6">
            <button
              onClick={() => {
                setStep(1);
                setFile(null);
                setPaperInfo({
                  title: '',
                  authors: '',
                  abstract: ''
                });
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Upload Another Paper
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
