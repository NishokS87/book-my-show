const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const connectDB = require('./config/db');
const { getCacheStats } = require('./config/cache');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(compression()); // Enable gzip compression
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/theaters', require('./routes/theaters'));
app.use('/api/shows', require('./routes/shows'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/cache', require('./routes/cache'));
app.use('/api/seed', require('./routes/seed')); // Seed database (remove after first use)
app.use('/api/test', require('./routes/test')); // Test endpoint
app.use('/api/quickseed', require('./routes/quickseed')); // Quick seed - just movies
app.use('/api/addmovie', require('./routes/addmovie')); // Add single movie

app.get('/api/health', (req, res) => {
  const cacheStats = getCacheStats();
  res.status(200).json({ 
    status: 'success', 
    message: 'BookMyShow API is running',
    timestamp: new Date().toISOString(),
    cache: cacheStats,
    uptime: process.uptime()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}

// Export for Vercel serverless
module.exports = app;
