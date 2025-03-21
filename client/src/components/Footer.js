import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Scholarly Library</h3>
            <p className="text-gray-400">
              Your comprehensive platform for academic research and paper management.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/search" className="text-gray-400 hover:text-white">Search</Link></li>
              <li><Link to="/profile" className="text-gray-400 hover:text-white">My Profile</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">API Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Contact</h4>
            <p className="text-gray-400 mb-2">info@scholarlylibrary.com</p>
            <p className="text-gray-400">+1 (555) 123-4567</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Scholarly Library. All rights reserved.</p>
          <p className="mt-1 text-gray-500 text-sm">
            Demo version for client presentation purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
