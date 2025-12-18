const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { cacheMiddleware, invalidateCache } = require('../middleware/cache');
const { CACHE_TTL, CACHE_KEYS } = require('../config/cache');
const {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  searchMovies
} = require('../controllers/movieController');

router.route('/')
  .get(
    cacheMiddleware((req) => CACHE_KEYS.ALL_MOVIES(), CACHE_TTL.MOVIES),
    getMovies
  )
  .post(
    protect,
    authorize('admin'),
    invalidateCache(['movie']),
    createMovie
  );

router.get(
  '/search',
  cacheMiddleware((req) => CACHE_KEYS.MOVIES_SEARCH(req.query.q), CACHE_TTL.SEARCH),
  searchMovies
);

router.route('/:id')
  .get(
    cacheMiddleware((req) => CACHE_KEYS.MOVIE_BY_ID(req.params.id), CACHE_TTL.MOVIES),
    getMovie
  )
  .put(
    protect,
    authorize('admin'),
    invalidateCache(['movie']),
    updateMovie
  )
  .delete(
    protect,
    authorize('admin'),
    invalidateCache(['movie']),
    deleteMovie
  );

module.exports = router;
