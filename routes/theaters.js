const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { cacheMiddleware, invalidateCache } = require('../middleware/cache');
const { CACHE_TTL, CACHE_KEYS } = require('../config/cache');
const {
  getTheaters,
  getTheater,
  createTheater,
  updateTheater,
  deleteTheater,
  getTheatersByLocation
} = require('../controllers/theaterController');

router.route('/')
  .get(
    cacheMiddleware((req) => CACHE_KEYS.ALL_THEATERS(), CACHE_TTL.THEATERS),
    getTheaters
  )
  .post(
    protect,
    authorize('admin', 'theater-owner'),
    invalidateCache(['theater', 'show']),
    createTheater
  );

router.get(
  '/location/:city',
  cacheMiddleware((req) => CACHE_KEYS.THEATERS_BY_CITY(req.params.city), CACHE_TTL.THEATERS),
  getTheatersByLocation
);

router.route('/:id')
  .get(
    cacheMiddleware((req) => CACHE_KEYS.THEATER_BY_ID(req.params.id), CACHE_TTL.THEATERS),
    getTheater
  )
  .put(
    protect,
    authorize('admin', 'theater-owner'),
    invalidateCache(['theater', 'show']),
    updateTheater
  )
  .delete(
    protect,
    authorize('admin', 'theater-owner'),
    invalidateCache(['theater', 'show']),
    deleteTheater
  );

module.exports = router;
