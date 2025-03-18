const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'S/tvOsbc9WNPUW6EO/ZBRJE6uroHaMRkfs9LgVDLoBg=';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scholarly_library', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Paper Schema
const paperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: [{ type: String, required: true }],
  journal: { type: String, required: true },
  year: { type: Number, required: true },
  abstract: { type: String, required: true },
  citations: { type: Number, default: 0 },
  keywords: [{ type: String }],
  url: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Paper = mongoose.model('Paper', paperSchema);

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new Error();
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Routes

// Register a new user
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Create and send token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Create and send token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
app.get('/api/users/profile', auth, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
});

// Get all papers
app.get('/api/papers', async (req, res) => {
  try {
    const { search, year, author, journal, sortBy } = req.query;
    let query = {};
    
    // Search term
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { abstract: { $regex: search, $options: 'i' } },
          { keywords: { $regex: search, $options: 'i' } },
          { authors: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Year filter
    if (year) {
      query.year = parseInt(year);
    }
    
    // Author filter
    if (author) {
      query.authors = { $regex: author, $options: 'i' };
    }
    
    // Journal filter
    if (journal) {
      query.journal = { $regex: journal, $options: 'i' };
    }
    
    // Sort by
    let sort = {};
    if (sortBy === 'citations') {
      sort = { citations: -1 };
    } else if (sortBy === 'year') {
      sort = { year: -1 };
    } else if (sortBy === 'title') {
      sort = { title: 1 };
    } else {
      // Default: sort by relevance (actually by creation date)
      sort = { createdAt: -1 };
    }
    
    const papers = await Paper.find(query).sort(sort);
    res.json(papers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific paper
app.get('/api/papers/:id', async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    res.json(paper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new paper (requires auth)
app.post('/api/papers', auth, async (req, res) => {
  try {
    const paper = new Paper(req.body);
    await paper.save();
    res.status(201).json(paper);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a paper (requires auth)
app.put('/api/papers/:id', auth, async (req, res) => {
  try {
    const paper = await Paper.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    res.json(paper);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a paper (requires auth)
app.delete('/api/papers/:id', auth, async (req, res) => {
  try {
    const paper = await Paper.findByIdAndDelete(req.params.id);
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    res.json({ message: 'Paper deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed the database with sample data
app.post('/api/seed', async (req, res) => {
  try {
    const samplePapers = [
      {
        title: "Machine Learning Applications in Financial Markets",
        authors: ["Johnson, A.", "Williams, R.", "Chen, L."],
        journal: "Journal of Financial Technology",
        year: 2023,
        abstract: "This paper explores recent advancements in machine learning algorithms for predicting market trends and optimizing investment portfolios.",
        citations: 87,
        keywords: ["machine learning", "finance", "market prediction", "portfolio optimization"],
        url: "#"
      },
      {
        title: "Data Privacy Challenges in Healthcare Systems",
        authors: ["Martinez, S.", "Brown, K."],
        journal: "Medical Informatics Review",
        year: 2022,
        abstract: "An analysis of privacy preservation techniques for sensitive medical data, considering both regulatory compliance and practical implementations.",
        citations: 124,
        keywords: ["healthcare", "data privacy", "HIPAA", "medical records"],
        url: "#"
      },
      {
        title: "Sustainable Supply Chain Management: A Systematic Review",
        authors: ["Garcia, P.", "Smith, T.", "Kumar, A."],
        journal: "Journal of Operations Management",
        year: 2023,
        abstract: "This systematic review examines sustainability practices across global supply chains, identifying key trends and future research directions.",
        citations: 56,
        keywords: ["supply chain", "sustainability", "operations management", "systematic review"],
        url: "#"
      },
      {
        title: "Artificial Intelligence in Legal Document Processing",
        authors: ["Thompson, J.", "Anderson, M."],
        journal: "Legal Technology Journal",
        year: 2022,
        abstract: "Examines how AI-powered tools are transforming legal document review, contract analysis, and case research in law firms.",
        citations: 43,
        keywords: ["artificial intelligence", "legal tech", "document processing", "contract analysis"],
        url: "#"
      },
      {
        title: "Digital Transformation Strategies for Small and Medium Enterprises",
        authors: ["Patel, R.", "Wilson, E."],
        journal: "Business Technology Quarterly",
        year: 2023,
        abstract: "This paper provides a framework for SMEs to implement digital transformation strategies while minimizing disruption to core operations.",
        citations: 92,
        keywords: ["digital transformation", "SME", "business strategy", "technology adoption"],
        url: "#"
      },
      {
        title: "Cloud Computing Security Standards: Current State and Future Directions",
        authors: ["Lee, S.", "Novak, D.", "Ibrahim, M."],
        journal: "Journal of Cybersecurity",
        year: 2022,
        abstract: "A comprehensive review of security standards and compliance frameworks for cloud computing environments across various industries.",
        citations: 78,
        keywords: ["cloud computing", "security standards", "compliance", "cybersecurity"],
        url: "#"
      },
      {
        title: "Employee Engagement in Remote Work Environments",
        authors: ["Rodriguez, C.", "White, T."],
        journal: "Human Resource Management Review",
        year: 2023,
        abstract: "Investigates strategies for maintaining employee engagement and productivity in distributed and remote work settings.",
        citations: 65,
        keywords: ["remote work", "employee engagement", "human resources", "productivity"],
        url: "#"
      },
      {
        title: "Data Visualization Techniques for Complex Business Analytics",
        authors: ["Taylor, H.", "Kim, J."],
        journal: "Business Intelligence Quarterly",
        year: 2022,
        abstract: "Explores novel data visualization approaches to effectively communicate complex analytical insights to business stakeholders.",
        citations: 109,
        keywords: ["data visualization", "business analytics", "business intelligence", "decision support"],
        url: "#"
      }
    ];
    
    await Paper.insertMany(samplePapers);
    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
