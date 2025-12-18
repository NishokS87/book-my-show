const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// @route   GET /api/test
// @desc    Test database connection by adding one movie
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Clear existing movies
        await Movie.deleteMany({});
        
        // Create one test movie
        const movie = await Movie.create({
            title: 'Inception',
            description: 'A thief who steals corporate secrets through dream-sharing technology.',
            director: 'Christopher Nolan',
            cast: ['Leonardo DiCaprio', 'Tom Hardy', 'Elliot Page'],
            genre: ['Action', 'Sci-Fi', 'Thriller'],
            duration: 148,
            language: 'English',
            rating: 8.8,
            releaseDate: new Date('2010-07-16')
        });
        
        res.status(200).json({
            status: 'success',
            message: 'Test movie created successfully!',
            data: movie
        });
    } catch (error) {
        console.error('Test error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;
