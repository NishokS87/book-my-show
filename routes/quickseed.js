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
                cast: [
                    { name: 'Leonardo DiCaprio', role: 'Dom Cobb' },
                    { name: 'Tom Hardy', role: 'Eames' },
                    { name: 'Elliot Page', role: 'Ariadne' }
                ],
                genre: ['Action', 'Sci-Fi', 'Thriller'],
                duration: 148,
                language: 'English',
                rating: 'UA',
                releaseDate: new Date('2010-07-16')
            },
            {
                title: 'The Dark Knight',
                description: 'Batman faces the Joker in this epic superhero thriller.',
                director: 'Christopher Nolan',
                cast: [
                    { name: 'Christian Bale', role: 'Bruce Wayne' },
                    { name: 'Heath Ledger', role: 'Joker' },
                    { name: 'Aaron Eckhart', role: 'Harvey Dent' }
                ],
                genre: ['Action', 'Crime', 'Drama'],
                duration: 152,
                language: 'English',
                rating: 'UA',
                releaseDate: new Date('2008-07-18')
            },
            {
                title: 'Interstellar',
                description: 'A team of explorers travel through a wormhole in space.',
                director: 'Christopher Nolan',
                cast: [
                    { name: 'Matthew McConaughey', role: 'Cooper' },
                    { name: 'Anne Hathaway', role: 'Brand' },
                    { name: 'Jessica Chastain', role: 'Murph' }
                ],
                genre: ['Adventure', 'Drama', 'Sci-Fi'],
                duration: 169,
                language: 'English',
                rating: 'UA',
                releaseDate: new Date('2014-11-07')
            },
            {
                title: 'Avengers: Endgame',
                description: 'The Avengers assemble one final time to undo Thanos actions.',
                director: 'Anthony and Joe Russo',
                cast: [
                    { name: 'Robert Downey Jr.', role: 'Iron Man' },
                    { name: 'Chris Evans', role: 'Captain America' },
                    { name: 'Scarlett Johansson', role: 'Black Widow' }
                ],
                genre: ['Action', 'Adventure', 'Sci-Fi'],
                duration: 181,
                language: 'English',
                rating: 'UA',
                releaseDate: new Date('2019-04-26')
            },
            {
                title: 'Spider-Man: No Way Home',
                description: 'Spider-Mans identity is revealed, changing his life forever.',
                director: 'Jon Watts',
                cast: [
                    { name: 'Tom Holland', role: 'Peter Parker' },
                    { name: 'Zendaya', role: 'MJ' },
                    { name: 'Benedict Cumberbatch', role: 'Doctor Strange' }
                ],
                genre: ['Action', 'Adventure', 'Sci-Fi'],
                duration: 148,
                language: 'English',
                rating: 'UA',
                releaseDate: new Date('2021-12-17')
            },
            {
                title: 'RRR',
                description: 'A fictional story about two revolutionaries in 1920s India.',
                director: 'S. S. Rajamouli',
                cast: [
                    { name: 'N. T. Rama Rao Jr.', role: 'Komaram Bheem' },
                    { name: 'Ram Charan', role: 'Alluri Sitarama Raju' },
                    { name: 'Alia Bhatt', role: 'Sita' }
                ],
                genre: ['Action', 'Drama'],
                duration: 187,
                language: 'Telugu',
                rating: 'UA',
                releaseDate: new Date('2022-03-25')
            },
            {
                title: 'Pathaan',
                description: 'An Indian spy takes on a former RAW agent who has gone rogue.',
                director: 'Siddharth Anand',
                cast: [
                    { name: 'Shah Rukh Khan', role: 'Pathaan' },
                    { name: 'Deepika Padukone', role: 'Rubina' },
                    { name: 'John Abraham', role: 'Jim' }
                ],
                genre: ['Action', 'Thriller'],
                duration: 146,
                language: 'Hindi',
                rating: 'UA',
                releaseDate: new Date('2023-01-25')
            },
            {
                title: '3 Idiots',
                description: 'Two friends search for their long-lost companion.',
                director: 'Rajkumar Hirani',
                cast: [
                    { name: 'Aamir Khan', role: 'Rancho' },
                    { name: 'Madhavan', role: 'Farhan' },
                    { name: 'Sharman Joshi', role: 'Raju' }
                ],
                genre: ['Comedy', 'Drama'],
                duration: 170,
                language: 'Hindi',
                rating: 'UA',
                releaseDate: new Date('2009-12-25')
            },
            {
                title: 'Dune',
                description: 'Paul Atreides arrives on the desert planet Arrakis.',
                director: 'Denis Villeneuve',
                cast: [
                    { name: 'Timothée Chalamet', role: 'Paul Atreides' },
                    { name: 'Zendaya', role: 'Chani' },
                    { name: 'Rebecca Ferguson', role: 'Lady Jessica' }
                ],
                genre: ['Adventure', 'Drama', 'Sci-Fi'],
                duration: 155,
                language: 'English',
                rating: 'UA',
                releaseDate: new Date('2021-10-22')
            },
            {
                title: 'Jawan',
                description: 'A man is driven by a personal vendetta to rectify the wrongs.',
                director: 'Atlee',
                cast: [
                    { name: 'Shah Rukh Khan', role: 'Azad' },
                    { name: 'Nayanthara', role: 'Narmada' },
                    { name: 'Vijay Sethupathi', role: 'Kaalie' }
                ],
                genre: ['Action', 'Thriller'],
                duration: 169,
                language: 'Hindi',
                rating: 'UA',
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
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            status: 'error',
            message: error.message,
            name: error.name,
            stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
            details: JSON.stringify(error, null, 2)
        });
    }
});

module.exports = router;
