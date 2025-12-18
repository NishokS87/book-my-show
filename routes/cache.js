const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getCacheStats, clearCache } = require('../config/cache');

// Get cache statistics
router.get('/stats', protect, authorize('admin'), (req, res) => {
  try {
    const stats = getCacheStats();
    
    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Clear specific cache
router.delete('/clear/:type', protect, authorize('admin'), (req, res) => {
  try {
    const { type } = req.params;
    
    switch (type) {
      case 'movies':
        clearCache.movies();
        break;
      case 'theaters':
        clearCache.theaters();
        break;
      case 'shows':
        clearCache.shows();
        break;
      case 'all':
        clearCache.all();
        break;
      default:
        return res.status(400).json({
          status: 'error',
          message: 'Invalid cache type. Use: movies, theaters, shows, or all'
        });
    }

    res.status(200).json({
      status: 'success',
      message: `Cache cleared for: ${type}`
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
