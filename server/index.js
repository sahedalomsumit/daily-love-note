require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authMiddleware = require('./middleware/auth');
const triggerRoutes = require('./routes/trigger');
const historyRoutes = require('./routes/history');
const statusRoutes = require('./routes/status');

const { onRequest } = require('firebase-functions/v2/https');

// Initialize dependencies - only in non-functions environment or if needed
// Note: WhatsApp initialization is slow, so we might want to lazy-load it
if (!process.env.FUNCTIONS_EMULATOR && !process.env.FIREBASE_CONFIG) {
  require('./whatsapp');
  require('./scheduler');
}

const app = express();

// Configure CORS
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(url => url.trim().replace(/\/$/, '')) // Remove trailing slashes
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in our allowed list
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed === '*') return true;
      try {
        const allowedUrl = new URL(allowed);
        const originUrl = new URL(origin);
        return allowedUrl.hostname === originUrl.hostname;
      } catch (e) {
        return allowed === origin || origin.includes(allowed);
      }
    });

    if (isAllowed || origin.includes('github.io') || origin.includes('localhost')) {
      callback(null, true);
    } else {
      console.warn(`CORS request from unauthorized origin: ${origin}`);
      // For now, allow it but log it
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));




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

// Export Scheduled Task
const { dailyTask } = require('./scheduler');
exports.dailyTask = dailyTask;

// Export for Firebase Functions
exports.api = onRequest({
  memory: '1GiB',
  timeoutSeconds: 300,
  cors: true // Let Firebase handle CORS if needed, or keep our middleware
}, app);

// Start local server if not running as a function
if (!process.env.FIREBASE_CONFIG) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
