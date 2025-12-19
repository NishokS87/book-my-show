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

        // Create demo users
        const User = require('../models/User');
        const bcrypt = require('bcryptjs');
        
        // Delete existing demo users
        await User.deleteMany({ 
            email: { $in: ['admin@bookmyshow.com', 'john@example.com', 'owner@theaters.com'] } 
        });
        
        // Create Admin User
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@bookmyshow.com',
            password: await bcrypt.hash('admin123', 10),
            phone: '9999999999',
            role: 'admin'
        });
        console.log('✅ Created admin user: admin@bookmyshow.com');
        
        // Create Regular User
        const regularUser = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: await bcrypt.hash('password123', 10),
            phone: '9876543210',
            role: 'user'
        });
        console.log('✅ Created regular user: john@example.com');
        
        // Create Theater Owner
        let owner = await User.create({
            name: 'Theater Owner',
            email: 'owner@theaters.com',
            phone: '8888888888',
            password: await bcrypt.hash('owner123', 10),
            role: 'theater-owner'
        });
        console.log('✅ Created theater owner: owner@theaters.com');

        // Create theaters with proper seat layouts
        const theaters = await Theater.insertMany([
            {
                name: 'PVR Cinemas',
                location: {
                    city: 'Chennai',
                    area: 'Velachery',
                    address: 'Phoenix Market City, 142, Velachery Main Road',
                    pincode: '600042'
                },
                owner: owner._id,
                facilities: ['Parking', 'Food Court', 'M-Ticket', 'Wheelchair'],
                screens: [
                    {
                        screenNumber: 1,
                        screenName: 'Audi 1',
                        totalSeats: 160,
                        seatLayout: {
                            rows: 8,
                            seatsPerRow: 20,
                            seatTypes: [
                                {
                                    type: 'Premium',
                                    price: 300,
                                    seats: Array.from({ length: 60 }, (_, i) => ({
                                        row: ['A', 'B', 'C'][Math.floor(i / 20)],
                                        number: (i % 20) + 1
                                    }))
                                },
                                {
                                    type: 'Gold',
                                    price: 200,
                                    seats: Array.from({ length: 60 }, (_, i) => ({
                                        row: ['D', 'E', 'F'][Math.floor(i / 20)],
                                        number: (i % 20) + 1
                                    }))
                                },
                                {
                                    type: 'Silver',
                                    price: 150,
                                    seats: Array.from({ length: 40 }, (_, i) => ({
                                        row: ['G', 'H'][Math.floor(i / 20)],
                                        number: (i % 20) + 1
                                    }))
                                }
                            ]
                        }
                    },
                    {
                        screenNumber: 2,
                        screenName: 'Audi 2',
                        totalSeats: 108,
                        seatLayout: {
                            rows: 6,
                            seatsPerRow: 18,
                            seatTypes: [
                                {
                                    type: 'Premium',
                                    price: 280,
                                    seats: Array.from({ length: 36 }, (_, i) => ({
                                        row: ['A', 'B'][Math.floor(i / 18)],
                                        number: (i % 18) + 1
                                    }))
                                },
                                {
                                    type: 'Gold',
                                    price: 180,
                                    seats: Array.from({ length: 36 }, (_, i) => ({
                                        row: ['C', 'D'][Math.floor(i / 18)],
                                        number: (i % 18) + 1
                                    }))
                                },
                                {
                                    type: 'Silver',
                                    price: 130,
                                    seats: Array.from({ length: 36 }, (_, i) => ({
                                        row: ['E', 'F'][Math.floor(i / 18)],
                                        number: (i % 18) + 1
                                    }))
                                }
                            ]
                        }
                    }
                ]
            },
            {
                name: 'INOX',
                location: {
                    city: 'Chennai',
                    area: 'Express Avenue',
                    address: 'Express Avenue Mall, Whites Road',
                    pincode: '600002'
                },
                owner: owner._id,
                facilities: ['Parking', 'Food Court', 'M-Ticket'],
                screens: [
                    {
                        screenNumber: 1,
                        screenName: 'Screen 1',
                        totalSeats: 140,
                        seatLayout: {
                            rows: 7,
                            seatsPerRow: 20,
                            seatTypes: [
                                {
                                    type: 'Premium',
                                    price: 320,
                                    seats: Array.from({ length: 40 }, (_, i) => ({
                                        row: ['A', 'B'][Math.floor(i / 20)],
                                        number: (i % 20) + 1
                                    }))
                                },
                                {
                                    type: 'Gold',
                                    price: 220,
                                    seats: Array.from({ length: 60 }, (_, i) => ({
                                        row: ['C', 'D', 'E'][Math.floor(i / 20)],
                                        number: (i % 20) + 1
                                    }))
                                },
                                {
                                    type: 'Silver',
                                    price: 160,
                                    seats: Array.from({ length: 40 }, (_, i) => ({
                                        row: ['F', 'G'][Math.floor(i / 20)],
                                        number: (i % 20) + 1
                                    }))
                                }
                            ]
                        }
                    }
                ]
            },
            {
                name: 'AGS Cinemas',
                location: {
                    city: 'Chennai',
                    area: 'OMR',
                    address: 'Navalur, OMR Road',
                    pincode: '600130'
                },
                owner: owner._id,
                facilities: ['Parking', 'Food Court', '3D'],
                screens: [
                    {
                        screenNumber: 1,
                        screenName: 'Screen 1',
                        totalSeats: 198,
                        seatLayout: {
                            rows: 9,
                            seatsPerRow: 22,
                            seatTypes: [
                                {
                                    type: 'Premium',
                                    price: 290,
                                    seats: Array.from({ length: 66 }, (_, i) => ({
                                        row: ['A', 'B', 'C'][Math.floor(i / 22)],
                                        number: (i % 22) + 1
                                    }))
                                },
                                {
                                    type: 'Gold',
                                    price: 190,
                                    seats: Array.from({ length: 66 }, (_, i) => ({
                                        row: ['D', 'E', 'F'][Math.floor(i / 22)],
                                        number: (i % 22) + 1
                                    }))
                                },
                                {
                                    type: 'Silver',
                                    price: 140,
                                    seats: Array.from({ length: 66 }, (_, i) => ({
                                        row: ['G', 'H', 'I'][Math.floor(i / 22)],
                                        number: (i % 22) + 1
                                    }))
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
                            
                            // Build available seats from screen layout
                            const availableSeats = [];
                            const pricing = [];
                            
                            for (const seatType of screen.seatLayout.seatTypes) {
                                // Add pricing
                                pricing.push({
                                    seatType: seatType.type,
                                    price: seatType.price
                                });
                                
                                // Add all seats from this type
                                for (const seat of seatType.seats) {
                                    availableSeats.push({
                                        seatId: `${seat.row}${seat.number}`,  // e.g., "A5"
                                        row: seat.row,
                                        number: seat.number,
                                        seatType: seatType.type,
                                        status: 'available'
                                    });
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
                                availableSeats: availableSeats,
                                totalSeats: screen.totalSeats,
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
