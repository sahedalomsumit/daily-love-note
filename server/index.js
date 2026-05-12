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
const allowedOrigins = [
  'http://localhost:5173',
  'https://sahedalomsumit.github.io',
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, '')) : [])
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('github.io') || origin.includes('localhost')) {
      callback(null, true);
    } else {
      console.warn(`CORS request from unauthorized origin: ${origin}`);
      callback(null, true);
    }
  },
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
  cors: ['https://sahedalomsumit.github.io', 'http://localhost:5173']
}, app);

// Start local server if not running as a function
if (!process.env.FIREBASE_CONFIG) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
