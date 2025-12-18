const { cache } = require('../config/cache');

/**
 * Cache middleware factory
 * @param {Function} keyGenerator - Function to generate cache key from req
 * @param {Number} ttl - Time to live in seconds
 */
const cacheMiddleware = (keyGenerator, ttl = 300) => {
  return (req, res, next) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = keyGenerator(req);
    const cachedData = cache.get(key);

    if (cachedData) {
      console.log(`✅ Cache HIT: ${key}`);
      return res.status(200).json(cachedData);
    }

    console.log(`❌ Cache MISS: ${key}`);

    // Store the original res.json function
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = (data) => {
      // Only cache successful responses
      if (res.statusCode === 200 && data.status === 'success') {
        cache.set(key, data, ttl);
        console.log(`💾 Cached: ${key} (TTL: ${ttl}s)`);
      }
      return originalJson(data);
    };

    next();
  };
};

/**
 * Invalidate cache for specific patterns
 */
const invalidateCache = (patterns) => {
  return (req, res, next) => {
    // Store original json function
    const originalJson = res.json.bind(res);

    res.json = (data) => {
      // If the operation was successful, invalidate cache
      if (res.statusCode >= 200 && res.statusCode < 300) {
        patterns.forEach(pattern => {
          const keys = cache.keys().filter(key => key.includes(pattern));
          if (keys.length > 0) {
            cache.del(keys);
            console.log(`🗑️  Invalidated ${keys.length} cache entries for pattern: ${pattern}`);
          }
        });
      }
      return originalJson(data);
    };

    next();
  };
};

module.exports = {
  cacheMiddleware,
  invalidateCache
};
