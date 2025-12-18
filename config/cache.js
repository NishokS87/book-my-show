const NodeCache = require('node-cache');

// Initialize cache with default TTL of 5 minutes (300 seconds)
const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 320, // Check for expired keys every 320 seconds
  useClones: false, // Don't clone data for better performance
  deleteOnExpire: true
});

// Cache TTL configurations (in seconds)
const CACHE_TTL = {
  MOVIES: 600,        // 10 minutes - movies don't change often
  THEATERS: 600,      // 10 minutes - theater info is relatively static
  SHOWS: 180,         // 3 minutes - shows need fresher data
  SHOW_DETAILS: 120,  // 2 minutes - individual show data
  USER: 300,          // 5 minutes - user data
  SEARCH: 300         // 5 minutes - search results
};

// Cache key generators
const CACHE_KEYS = {
  ALL_MOVIES: () => 'movies:all',
  MOVIE_BY_ID: (id) => `movie:${id}`,
  MOVIES_SEARCH: (query) => `movies:search:${query}`,
  ALL_THEATERS: () => 'theaters:all',
  THEATER_BY_ID: (id) => `theater:${id}`,
  THEATERS_BY_CITY: (city) => `theaters:city:${city}`,
  ALL_SHOWS: (date) => date ? `shows:all:${date}` : 'shows:all',
  SHOW_BY_ID: (id) => `show:${id}`,
  SHOWS_BY_MOVIE: (movieId) => `shows:movie:${movieId}`,
  SHOWS_BY_THEATER: (theaterId) => `shows:theater:${theaterId}`,
  SHOWS_BY_MOVIE_CITY: (movieId, city) => `shows:movie:${movieId}:city:${city}`
};

// Clear cache functions
const clearCache = {
  movies: () => {
    const keys = cache.keys().filter(key => key.startsWith('movie'));
    cache.del(keys);
    console.log('🗑️  Movies cache cleared');
  },
  
  theaters: () => {
    const keys = cache.keys().filter(key => key.startsWith('theater'));
    cache.del(keys);
    console.log('🗑️  Theaters cache cleared');
  },
  
  shows: () => {
    const keys = cache.keys().filter(key => key.startsWith('show'));
    cache.del(keys);
    console.log('🗑️  Shows cache cleared');
  },
  
  all: () => {
    cache.flushAll();
    console.log('🗑️  All cache cleared');
  }
};

// Cache statistics
const getCacheStats = () => {
  return {
    keys: cache.keys().length,
    hits: cache.getStats().hits,
    misses: cache.getStats().misses,
    ksize: cache.getStats().ksize,
    vsize: cache.getStats().vsize
  };
};

// Log cache stats periodically
setInterval(() => {
  const stats = getCacheStats();
  if (stats.keys > 0) {
    console.log('📊 Cache Stats:', stats);
  }
}, 300000); // Every 5 minutes

module.exports = {
  cache,
  CACHE_TTL,
  CACHE_KEYS,
  clearCache,
  getCacheStats
};
