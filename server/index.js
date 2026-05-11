require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authMiddleware = require('./middleware/auth');
const triggerRoutes = require('./routes/trigger');
const historyRoutes = require('./routes/history');
const statusRoutes = require('./routes/status');

// Initialize dependencies that need to run immediately
require('./whatsapp');
require('./scheduler');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
// Configure CORS
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(url => {
    try {
      const parsed = new URL(url.trim());
      return `${parsed.protocol}//${parsed.host}`;
    } catch (e) {
      return url.trim();
    }
  })
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Daily Love Note API is running' });
});

// Public routes
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Protected routes
app.use('/api/trigger', authMiddleware, triggerRoutes);
app.use('/api/history', authMiddleware, historyRoutes);
app.use('/api/status', authMiddleware, statusRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
