const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// @route   GET /api/quickseed
// @desc    Quick seed - just add movies
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Clear movies
        await Movie.deleteMany({});
        
        // Add 10 movies
        const movies = await Movie.insertMany([
            {
                title: 'Inception',
                description: 'A thief who steals corporate secrets through dream-sharing technology.',
                director: 'Christopher Nolan',
                cast: ['Leonardo DiCaprio', 'Tom Hardy', 'Elliot Page'],
                genre: ['Action', 'Sci-Fi', 'Thriller'],
                duration: 148,
                language: 'English',
                rating: 8.8,
                releaseDate: new Date('2010-07-16')
            },
            {
                title: 'The Dark Knight',
                description: 'Batman faces the Joker in this epic superhero thriller.',
                director: 'Christopher Nolan',
                cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
                genre: ['Action', 'Crime', 'Drama'],
                duration: 152,
                language: 'English',
                rating: 9.0,
                releaseDate: new Date('2008-07-18')
            },
            {
                title: 'Interstellar',
                description: 'A team of explorers travel through a wormhole in space.',
                director: 'Christopher Nolan',
                cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
                genre: ['Adventure', 'Drama', 'Sci-Fi'],
                duration: 169,
                language: 'English',
                rating: 8.6,
                releaseDate: new Date('2014-11-07')
            },
            {
                title: 'Avengers: Endgame',
                description: 'The Avengers assemble one final time to undo Thanos actions.',
                director: 'Anthony and Joe Russo',
                cast: ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson'],
                genre: ['Action', 'Adventure', 'Sci-Fi'],
                duration: 181,
                language: 'English',
                rating: 8.4,
                releaseDate: new Date('2019-04-26')
            },
            {
                title: 'Spider-Man: No Way Home',
                description: 'Spider-Mans identity is revealed, changing his life forever.',
                director: 'Jon Watts',
                cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch'],
                genre: ['Action', 'Adventure', 'Sci-Fi'],
                duration: 148,
                language: 'English',
                rating: 8.3,
                releaseDate: new Date('2021-12-17')
            },
            {
                title: 'RRR',
                description: 'A fictional story about two revolutionaries in 1920s India.',
                director: 'S. S. Rajamouli',
                cast: ['N. T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt'],
                genre: ['Action', 'Drama'],
                duration: 187,
                language: 'Telugu',
                rating: 7.9,
                releaseDate: new Date('2022-03-25')
            },
            {
                title: 'Pathaan',
                description: 'An Indian spy takes on a former RAW agent who has gone rogue.',
                director: 'Siddharth Anand',
                cast: ['Shah Rukh Khan', 'Deepika Padukone', 'John Abraham'],
                genre: ['Action', 'Thriller'],
                duration: 146,
                language: 'Hindi',
                rating: 6.1,
                releaseDate: new Date('2023-01-25')
            },
            {
                title: '3 Idiots',
                description: 'Two friends search for their long-lost companion.',
                director: 'Rajkumar Hirani',
                cast: ['Aamir Khan', 'Madhavan', 'Sharman Joshi'],
                genre: ['Comedy', 'Drama'],
                duration: 170,
                language: 'Hindi',
                rating: 8.4,
                releaseDate: new Date('2009-12-25')
            },
            {
                title: 'Dune',
                description: 'Paul Atreides arrives on the desert planet Arrakis.',
                director: 'Denis Villeneuve',
                cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
                genre: ['Adventure', 'Drama', 'Sci-Fi'],
                duration: 155,
                language: 'English',
                rating: 8.0,
                releaseDate: new Date('2021-10-22')
            },
            {
                title: 'Jawan',
                description: 'A man is driven by a personal vendetta to rectify the wrongs.',
                director: 'Atlee',
                cast: ['Shah Rukh Khan', 'Nayanthara', 'Vijay Sethupathi'],
                genre: ['Action', 'Thriller'],
                duration: 169,
                language: 'Hindi',
                rating: 7.2,
                releaseDate: new Date('2023-09-07')
            }
        ]);
        
        res.status(200).json({
            status: 'success',
            message: '✅ 10 movies added successfully!',
            count: movies.length,
            movies: movies.map(m => ({ id: m._id, title: m.title }))
        });
    } catch (error) {
        console.error('Quick seed error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
            stack: error.stack
        });
    }
});

module.exports = router;
