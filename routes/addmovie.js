const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// @route   POST /api/addmovie
// @desc    Add one movie for testing
// @access  Public
router.post('/', async (req, res) => {
    try {
        const movie = new Movie({
            title: 'Inception',
            description: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
            director: 'Christopher Nolan',
            cast: ['Leonardo DiCaprio', 'Tom Hardy', 'Elliot Page'],
            genre: ['Action', 'Sci-Fi', 'Thriller'],
            duration: 148,
            language: 'English',
            rating: 8.8,
            releaseDate: new Date('2010-07-16')
        });
        
        await movie.save();
        
        res.json({
            status: 'success',
            message: 'Movie added!',
            movie: movie
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router;
