const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { cacheMiddleware, invalidateCache } = require('../middleware/cache');
const { CACHE_TTL, CACHE_KEYS } = require('../config/cache');
const {
  getShows,
  getShow,
  createShow,
  updateShow,
  deleteShow,
  getShowsByMovie,
  getShowsByTheater,
  getShowsByMovieAndCity,
  getBookedSeats
} = require('../controllers/showController');

router.route('/')
  .get(
    cacheMiddleware((req) => CACHE_KEYS.ALL_SHOWS(req.query.date), CACHE_TTL.SHOWS),
    getShows
  )
  .post(
    protect,
    authorize('admin', 'theater-owner'),
    invalidateCache(['show']),
    createShow
  );

router.get(
  '/movie/:movieId',
  cacheMiddleware((req) => CACHE_KEYS.SHOWS_BY_MOVIE(req.params.movieId), CACHE_TTL.SHOWS),
  getShowsByMovie
);

router.get(
  '/theater/:theaterId',
  cacheMiddleware((req) => CACHE_KEYS.SHOWS_BY_THEATER(req.params.theaterId), CACHE_TTL.SHOWS),
  getShowsByTheater
);

router.get(
  '/movie/:movieId/city/:city',
  cacheMiddleware((req) => CACHE_KEYS.SHOWS_BY_MOVIE_CITY(req.params.movieId, req.params.city), CACHE_TTL.SHOWS),
  getShowsByMovieAndCity
);

router.route('/:id')
  .get(
    cacheMiddleware((req) => CACHE_KEYS.SHOW_BY_ID(req.params.id), CACHE_TTL.SHOW_DETAILS),
    getShow
  )
  .put(
    protect,
    authorize('admin', 'theater-owner'),
    invalidateCache(['show']),
    updateShow
  )
  .delete(
    protect,
    authorize('admin', 'theater-owner'),
    invalidateCache(['show']),
    deleteShow
  );

// Get booked seats for a show (CRITICAL for frontend to load locked seats)
router.get('/:id/booked-seats', getBookedSeats);

module.exports = router;
