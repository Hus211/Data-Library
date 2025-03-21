const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure upload middleware
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'), false);
    }
    cb(null, true);
  }
});

// Mock paper data (replace with database implementation)
let papers = [];

// GET /api/papers - Get all papers
router.get('/', async (req, res) => {
  res.json(papers);
});

// GET /api/papers/user - Get user's papers
router.get('/user', auth, async (req, res) => {
  const userPapers = papers.filter(paper => paper.userId === req.user.id);
  res.json(userPapers);
});

// POST /api/papers/upload - Upload a paper
router.post('/upload', auth, upload.single('paper'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // In a real app, you would extract metadata from the PDF
    // and save it to the database along with the file path
    const newPaper = {
      _id: Date.now().toString(),
      title: req.body.title || path.basename(req.file.originalname, path.extname(req.file.originalname)),
      authors: req.body.authors ? req.body.authors.split(',') : ['Unknown Author'],
      abstract: req.body.abstract || 'No abstract provided',
      fileUrl: `/uploads/${req.file.filename}`,
      uploadDate: new Date(),
      userId: req.user.id
    };

    papers.push(newPaper);
    res.status(201).json(newPaper);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

module.exports = router;
