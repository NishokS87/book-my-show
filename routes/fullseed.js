const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Show = require('../models/Show');

// @route   GET /api/fullseed
// @desc    Complete seed with movies, theaters and shows
// @access  Public
router.get('/', async (req, res) => {
    try {
        console.log('🌱 Starting full database seed...');

        // Clear existing data
        await Movie.deleteMany({});
        await Theater.deleteMany({});
        await Show.deleteMany({});
        
        // Create movies
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
            }
        ]);
        
        console.log('✅ Created movies:', movies.length);

        // Create theaters with proper seat layouts
        const theaters = await Theater.insertMany([
            {
                name: 'PVR Cinemas',
                location: 'Phoenix Market City, Chennai',
                city: 'Chennai',
                screens: [
                    {
                        screenNumber: 1,
                        name: 'Audi 1',
                        capacity: 200,
                        seatLayout: {
                            rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
                            seatsPerRow: 20,
                            seatTypes: [
                                {
                                    type: 'Premium',
                                    price: 300,
                                    rows: ['A', 'B', 'C']
                                },
                                {
                                    type: 'Gold',
                                    price: 200,
                                    rows: ['D', 'E', 'F']
                                },
                                {
                                    type: 'Silver',
                                    price: 150,
                                    rows: ['G', 'H']
                                }
                            ]
                        }
                    },
                    {
                        screenNumber: 2,
                        name: 'Audi 2',
                        capacity: 150,
                        seatLayout: {
                            rows: ['A', 'B', 'C', 'D', 'E', 'F'],
                            seatsPerRow: 18,
                            seatTypes: [
                                {
                                    type: 'Premium',
                                    price: 280,
                                    rows: ['A', 'B']
                                },
                                {
                                    type: 'Gold',
                                    price: 180,
                                    rows: ['C', 'D']
                                },
                                {
                                    type: 'Silver',
                                    price: 130,
                                    rows: ['E', 'F']
                                }
                            ]
                        }
                    }
                ]
            },
            {
                name: 'INOX',
                location: 'Express Avenue Mall, Chennai',
                city: 'Chennai',
                screens: [
                    {
                        screenNumber: 1,
                        name: 'Screen 1',
                        capacity: 180,
                        seatLayout: {
                            rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                            seatsPerRow: 20,
                            seatTypes: [
                                {
                                    type: 'Premium',
                                    price: 320,
                                    rows: ['A', 'B']
                                },
                                {
                                    type: 'Gold',
                                    price: 220,
                                    rows: ['C', 'D', 'E']
                                },
                                {
                                    type: 'Silver',
                                    price: 160,
                                    rows: ['F', 'G']
                                }
                            ]
                        }
                    }
                ]
            },
            {
                name: 'AGS Cinemas',
                location: 'OMR, Chennai',
                city: 'Chennai',
                screens: [
                    {
                        screenNumber: 1,
                        name: 'Screen 1',
                        capacity: 220,
                        seatLayout: {
                            rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
                            seatsPerRow: 22,
                            seatTypes: [
                                {
                                    type: 'Premium',
                                    price: 290,
                                    rows: ['A', 'B', 'C']
                                },
                                {
                                    type: 'Gold',
                                    price: 190,
                                    rows: ['D', 'E', 'F']
                                },
                                {
                                    type: 'Silver',
                                    price: 140,
                                    rows: ['G', 'H', 'I']
                                }
                            ]
                        }
                    }
                ]
            }
        ]);
        
        console.log('✅ Created theaters:', theaters.length);

        // Create shows for today and next 7 days
        const shows = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const showtimes = ['10:30 AM', '02:00 PM', '06:00 PM', '09:30 PM'];
        
        // Create shows for each movie in each theater
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
            const showDate = new Date(today);
            showDate.setDate(today.getDate() + dayOffset);
            
            for (const movie of movies) {
                for (const theater of theaters) {
                    for (const screen of theater.screens) {
                        // Add 2-3 shows per screen
                        const numShows = Math.floor(Math.random() * 2) + 2; // 2 or 3 shows
                        for (let i = 0; i < numShows; i++) {
                            const timeStr = showtimes[i];
                            const [time, period] = timeStr.split(' ');
                            const [hours, minutes] = time.split(':');
                            let hour = parseInt(hours);
                            
                            if (period === 'PM' && hour !== 12) hour += 12;
                            if (period === 'AM' && hour === 12) hour = 0;
                            
                            const showDateTime = new Date(showDate);
                            showDateTime.setHours(hour, parseInt(minutes), 0, 0);
                            
                            // Initialize all seats as available
                            const seats = [];
                            const pricing = [];
                            const seatTypesUsed = new Set();
                            
                            for (const row of screen.seatLayout.rows) {
                                for (let seatNum = 1; seatNum <= screen.seatLayout.seatsPerRow; seatNum++) {
                                    const seatType = screen.seatLayout.seatTypes.find(st => st.rows.includes(row));
                                    seats.push({
                                        row: row,
                                        number: seatNum,
                                        seatType: seatType.type,
                                        status: 'available'
                                    });
                                    
                                    // Add to pricing if not already added
                                    if (!seatTypesUsed.has(seatType.type)) {
                                        pricing.push({
                                            seatType: seatType.type,
                                            price: seatType.price
                                        });
                                        seatTypesUsed.add(seatType.type);
                                    }
                                }
                            }
                            
                            shows.push({
                                movie: movie._id,
                                theater: theater._id,
                                screenNumber: screen.screenNumber,
                                showDate: showDate,
                                showTime: timeStr,
                                language: movie.language,
                                format: ['2D', '3D', 'IMAX'][Math.floor(Math.random() * 3)],
                                pricing: pricing,
                                availableSeats: seats,
                                totalSeats: seats.length,
                                bookedSeats: 0
                            });
                        }
                    }
                }
            }
        }
        
        const createdShows = await Show.insertMany(shows);
        console.log('✅ Created shows:', createdShows.length);

        res.status(200).json({
            status: 'success',
            message: '✅ Full database seeded successfully!',
            data: {
                movies: movies.length,
                theaters: theaters.length,
                shows: createdShows.length
            },
            movieTitles: movies.map(m => m.title),
            theaterNames: theaters.map(t => `${t.name} - ${t.location}`)
        });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
            name: error.name,
            stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
        });
    }
});

module.exports = router;
