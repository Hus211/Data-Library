const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Check for required environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_not_for_production';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/scholarly-library';

console.log('Server starting with configuration:');
console.log(`- Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`- MongoDB URI: ${MONGODB_URI.substring(0, 20)}...`);
console.log(`- JWT Secret is ${JWT_SECRET ? 'set' : 'not set'}`);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define API routes
app.use('/api/papers', require('./routes/papers'));

// Define a simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Mock login endpoint
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  
  // In a real app, you would validate against DB
  if (email === 'demo@example.com' && password === 'password') {
    const token = jwt.sign(
      { id: '123', email, name: 'Demo User' },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    
    res.json({
      token,
      user: {
        id: '123',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'user'
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Change port to 5002 to avoid conflict
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
