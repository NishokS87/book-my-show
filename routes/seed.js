const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Show = require('../models/Show');
const bcrypt = require('bcryptjs');

// @route   GET /api/seed
// @desc    Seed database with initial data (ONE-TIME USE ONLY)
// @access  Public (Remove this route after first use!)
router.get('/', async (req, res) => {
    try {
        console.log('🌱 Starting database seed...');

        // Clear existing data
        await User.deleteMany({});
        await Movie.deleteMany({});
        await Theater.deleteMany({});
        await Show.deleteMany({});
        
        console.log('✅ Cleared existing data');

        // Create users
        const salt = await bcrypt.genSalt(10);
        
        const users = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@bookmyshow.com',
                password: await bcrypt.hash('admin123', salt),
                role: 'admin'
            },
            {
                name: 'PVR Owner',
                email: 'owner@pvr.com',
                password: await bcrypt.hash('owner123', salt),
                role: 'theater-owner'
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: await bcrypt.hash('password123', salt),
                role: 'user'
            }
        ]);
        
        console.log('✅ Created users:', users.length);

        // Create movies
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
                description: 'The Avengers assemble one final time to undo Thanos\' actions.',
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
                description: 'Spider-Man\'s identity is revealed, changing his life forever.',
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
        
        console.log('✅ Created movies:', movies.length);

        // Create theaters
        const theaterOwner = users.find(u => u.role === 'theater-owner');
        
        const theaters = await Theater.insertMany([
            {
                name: 'PVR Cinemas - Phoenix Mall',
                location: 'Mumbai',
                city: 'Mumbai',
                owner: theaterOwner._id,
                screens: [
                    {
                        screenNumber: 1,
                        seats: [
                            { row: 'A', number: 1, type: 'Silver' },
                            { row: 'A', number: 2, type: 'Silver' },
                            { row: 'A', number: 3, type: 'Silver' },
                            { row: 'A', number: 4, type: 'Silver' },
                            { row: 'A', number: 5, type: 'Silver' },
                            { row: 'B', number: 1, type: 'Gold' },
                            { row: 'B', number: 2, type: 'Gold' },
                            { row: 'B', number: 3, type: 'Gold' },
                            { row: 'B', number: 4, type: 'Gold' },
                            { row: 'C', number: 1, type: 'Premium' },
                            { row: 'C', number: 2, type: 'Premium' },
                            { row: 'C', number: 3, type: 'Premium' }
                        ]
                    }
                ]
            },
            {
                name: 'INOX - R City Mall',
                location: 'Ghatkopar, Mumbai',
                city: 'Mumbai',
                owner: theaterOwner._id,
                screens: [
                    {
                        screenNumber: 1,
                        seats: [
                            { row: 'A', number: 1, type: 'Silver' },
                            { row: 'A', number: 2, type: 'Silver' },
                            { row: 'A', number: 3, type: 'Silver' },
                            { row: 'B', number: 1, type: 'Gold' },
                            { row: 'B', number: 2, type: 'Gold' },
                            { row: 'C', number: 1, type: 'Premium' },
                            { row: 'C', number: 2, type: 'Premium' }
                        ]
                    }
                ]
            },
            {
                name: 'Cinepolis - Andheri',
                location: 'Andheri West, Mumbai',
                city: 'Mumbai',
                owner: theaterOwner._id,
                screens: [
                    {
                        screenNumber: 1,
                        seats: [
                            { row: 'A', number: 1, type: 'Silver' },
                            { row: 'A', number: 2, type: 'Silver' },
                            { row: 'A', number: 3, type: 'Silver' },
                            { row: 'A', number: 4, type: 'Silver' },
                            { row: 'B', number: 1, type: 'Gold' },
                            { row: 'B', number: 2, type: 'Gold' },
                            { row: 'B', number: 3, type: 'Gold' }
                        ]
                    }
                ]
            }
        ]);
        
        console.log('✅ Created theaters:', theaters.length);

        // Create shows for each movie in each theater
        const shows = [];
        const today = new Date();
        
        for (const movie of movies.slice(0, 5)) {
            for (const theater of theaters) {
                // Create 3 shows per movie per theater
                const showTimes = [
                    new Date(today.setHours(10, 0, 0, 0)),
                    new Date(today.setHours(14, 30, 0, 0)),
                    new Date(today.setHours(19, 0, 0, 0))
                ];
                
                for (const showTime of showTimes) {
                    const screen = theater.screens[0];
                    
                    shows.push({
                        movie: movie._id,
                        theater: theater._id,
                        screen: screen._id,
                        showTime: new Date(showTime),
                        format: movie.language === 'English' ? '3D' : '2D',
                        pricing: [
                            { seatType: 'Silver', price: 150 },
                            { seatType: 'Gold', price: 250 },
                            { seatType: 'Premium', price: 350 }
                        ],
                        availableSeats: screen.seats.map(seat => ({
                            seatId: `${seat.row}${seat.number}`,
                            row: seat.row,
                            number: seat.number,
                            type: seat.type,
                            status: 'available'
                        })),
                        totalSeats: screen.seats.length
                    });
                }
            }
        }
        
        await Show.insertMany(shows);
        console.log('✅ Created shows:', shows.length);

        res.status(200).json({
            status: 'success',
            message: '✅ Database seeded successfully!',
            data: {
                users: users.length,
                movies: movies.length,
                theaters: theaters.length,
                shows: shows.length
            },
            credentials: {
                admin: { email: 'admin@bookmyshow.com', password: 'admin123' },
                theaterOwner: { email: 'owner@pvr.com', password: 'owner123' },
                user: { email: 'john@example.com', password: 'password123' }
            },
            warning: '⚠️ IMPORTANT: Remove /api/seed route after use for security!'
        });

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to seed database',
            error: error.message
        });
    }
});

module.exports = router;
