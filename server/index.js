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
app.use(cors({
  origin: process.env.FRONTEND_URL
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
