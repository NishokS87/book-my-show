const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const Show = require('./models/Show');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Movie.deleteMany();
    await Theater.deleteMany();
    await Show.deleteMany();
    
    console.log('  Cleared existing data');

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@bookmyshow.com',
      password: 'admin123',
      phone: '9999999999',
      role: 'admin'
    });
    
    console.log('Created admin user');

    // Create Regular User
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '9876543210',
      role: 'user'
    });
    
    console.log('Created regular user');

    // Create Theater Owner
    const theaterOwner = await User.create({
      name: 'Theater Owner',
      email: 'owner@pvr.com',
      password: 'owner123',
      phone: '9888888888',
      role: 'theater-owner'
    });
    
    console.log('Created theater owner');

    // Create Movies (10 movies)
    const movies = await Movie.insertMany([
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through dream-sharing technology is given a chance at redemption if he can successfully perform inception.',
        language: 'English',
        genre: ['Action', 'Sci-Fi', 'Thriller'],
        duration: 148,
        releaseDate: new Date('2010-07-16'),
        rating: 8.8,
        director: 'Christopher Nolan',
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page', 'Tom Hardy'],
        isActive: true
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
        language: 'English',
        genre: ['Action', 'Crime', 'Drama'],
        duration: 152,
        releaseDate: new Date('2008-07-18'),
        rating: 9.0,
        director: 'Christopher Nolan',
        cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
        isActive: true
      },
      {
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        language: 'English',
        genre: ['Adventure', 'Drama', 'Sci-Fi'],
        duration: 169,
        releaseDate: new Date('2014-11-07'),
        rating: 8.6,
        director: 'Christopher Nolan',
        cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
        isActive: true
      },
      {
        title: 'Avengers: Endgame',
        description: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos\' actions and restore balance to the universe.',
        language: 'English',
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        duration: 181,
        releaseDate: new Date('2019-04-26'),
        rating: 8.4,
        director: 'Anthony Russo, Joe Russo',
        cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Scarlett Johansson'],
        isActive: true
      },
      {
        title: 'Spider-Man: No Way Home',
        description: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
        language: 'English',
        genre: ['Action', 'Adventure', 'Fantasy'],
        duration: 148,
        releaseDate: new Date('2021-12-17'),
        rating: 8.3,
        director: 'Jon Watts',
        cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch', 'Jacob Batalon'],
        isActive: true
      },
      {
        title: 'RRR',
        description: 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.',
        language: 'Telugu',
        genre: ['Action', 'Drama', 'Historical'],
        duration: 187,
        releaseDate: new Date('2022-03-25'),
        rating: 8.1,
        director: 'S.S. Rajamouli',
        cast: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Ajay Devgn', 'Alia Bhatt'],
        isActive: true
      },
      {
        title: 'Pathaan',
        description: 'An Indian spy takes on the leader of a group of mercenaries who have nefarious plans to target his homeland.',
        language: 'Hindi',
        genre: ['Action', 'Thriller'],
        duration: 146,
        releaseDate: new Date('2023-01-25'),
        rating: 7.5,
        director: 'Siddharth Anand',
        cast: ['Shah Rukh Khan', 'Deepika Padukone', 'John Abraham', 'Dimple Kapadia'],
        isActive: true
      },
      {
        title: '3 Idiots',
        description: 'Two friends embark on a quest for a lost buddy. On this journey, they encounter a long-forgotten bet, a wedding they must crash, and a funeral that goes impossibly out of control.',
        language: 'Hindi',
        genre: ['Comedy', 'Drama'],
        duration: 170,
        releaseDate: new Date('2009-12-25'),
        rating: 8.4,
        director: 'Rajkumar Hirani',
        cast: ['Aamir Khan', 'R. Madhavan', 'Sharman Joshi', 'Kareena Kapoor'],
        isActive: true
      },
      {
        title: 'Dune',
        description: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset while its heir becomes troubled by visions of a dark future.',
        language: 'English',
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        duration: 155,
        releaseDate: new Date('2021-10-22'),
        rating: 8.0,
        director: 'Denis Villeneuve',
        cast: ['Timothée Chalamet', 'Rebecca Ferguson', 'Zendaya', 'Oscar Isaac'],
        isActive: true
      },
      {
        title: 'Jawan',
        description: 'A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.',
        language: 'Hindi',
        genre: ['Action', 'Thriller'],
        duration: 169,
        releaseDate: new Date('2023-09-07'),
        rating: 7.2,
        director: 'Atlee',
        cast: ['Shah Rukh Khan', 'Nayanthara', 'Vijay Sethupathi', 'Deepika Padukone'],
        isActive: true
      }
    ]);
    
    console.log('Created movies');

    // Create Theaters
    const theaters = await Theater.insertMany([
      {
        name: 'PVR Cinemas',
        location: {
          city: 'Mumbai',
          area: 'Andheri West',
          address: 'Link Road, Andheri West',
          pincode: '400053'
        },
        screens: [
          {
            screenNumber: 1,
            screenName: 'Audi 1',
            totalSeats: 150,
            seatLayout: {
              rows: 10,
              seatsPerRow: 15,
              seatTypes: [
                {
                  type: 'premium',
                  price: 350,
                  seats: Array.from({ length: 30 }, (_, i) => ({
                    row: 'A',
                    number: i + 1
                  }))
                },
                {
                  type: 'gold',
                  price: 250,
                  seats: Array.from({ length: 60 }, (_, i) => ({
                    row: String.fromCharCode(66 + Math.floor(i / 15)),
                    number: (i % 15) + 1
                  }))
                },
                {
                  type: 'silver',
                  price: 150,
                  seats: Array.from({ length: 60 }, (_, i) => ({
                    row: String.fromCharCode(70 + Math.floor(i / 15)),
                    number: (i % 15) + 1
                  }))
                }
              ]
            }
          },
          {
            screenNumber: 2,
            screenName: 'Audi 2',
            totalSeats: 120,
            seatLayout: {
              rows: 8,
              seatsPerRow: 15,
              seatTypes: [
                {
                  type: 'premium',
                  price: 300,
                  seats: Array.from({ length: 30 }, (_, i) => ({
                    row: 'A',
                    number: i + 1
                  }))
                },
                {
                  type: 'gold',
                  price: 200,
                  seats: Array.from({ length: 90 }, (_, i) => ({
                    row: String.fromCharCode(66 + Math.floor(i / 15)),
                    number: (i % 15) + 1
                  }))
                }
              ]
            }
          }
        ],
        facilities: ['Parking', 'Food Court', 'M-Ticket', 'Wheelchair Accessible'],
        owner: theaterOwner._id,
        isActive: true
      },
      {
        name: 'INOX',
        location: {
          city: 'Mumbai',
          area: 'Malad',
          address: 'Inorbit Mall, Malad West',
          pincode: '400064'
        },
        screens: [
          {
            screenNumber: 1,
            screenName: 'Screen 1',
            totalSeats: 100,
            seatLayout: {
              rows: 10,
              seatsPerRow: 10,
              seatTypes: [
                {
                  type: 'premium',
                  price: 320,
                  seats: Array.from({ length: 20 }, (_, i) => ({
                    row: 'A',
                    number: i + 1
                  }))
                },
                {
                  type: 'gold',
                  price: 220,
                  seats: Array.from({ length: 80 }, (_, i) => ({
                    row: String.fromCharCode(66 + Math.floor(i / 10)),
                    number: (i % 10) + 1
                  }))
                }
              ]
            }
          }
        ],
        facilities: ['Parking', 'Food Court', 'Dolby Atmos'],
        owner: theaterOwner._id,
        isActive: true
      },
      {
        name: 'Cinepolis',
        location: {
          city: 'Delhi',
          area: 'Saket',
          address: 'Select Citywalk, Saket',
          pincode: '110017'
        },
        screens: [
          {
            screenNumber: 1,
            screenName: 'Premium 1',
            totalSeats: 80,
            seatLayout: {
              rows: 8,
              seatsPerRow: 10,
              seatTypes: [
                {
                  type: 'premium',
                  price: 400,
                  seats: Array.from({ length: 80 }, (_, i) => ({
                    row: String.fromCharCode(65 + Math.floor(i / 10)),
                    number: (i % 10) + 1
                  }))
                }
              ]
            }
          }
        ],
        facilities: ['Parking', 'Food Court', '4DX', 'Recliner Seats'],
        owner: theaterOwner._id,
        isActive: true
      }
    ]);
    
    console.log('Created theaters');

    // Create Shows
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const shows = [];

    // Create shows for each movie in different theaters
    for (const movie of movies) {
      for (const theater of theaters.slice(0, 2)) { // First 2 theaters
        for (const screen of theater.screens.slice(0, 1)) { // First screen only
          // Morning show
          const morningShow = {
            movie: movie._id,
            theater: theater._id,
            screenNumber: screen.screenNumber,
            showDate: tomorrow,
            showTime: '10:00',
            language: movie.language,
            format: '2D',
            pricing: screen.seatLayout.seatTypes.map(st => ({
              seatType: st.type,
              price: st.price
            })),
            availableSeats: screen.seatLayout.seatTypes.flatMap(st =>
              st.seats.map(seat => ({
                row: seat.row,
                number: seat.number,
                seatType: st.type,
                status: 'available'
              }))
            ),
            totalSeats: screen.totalSeats,
            bookedSeats: 0,
            isActive: true
          };

          // Evening show
          const eveningShow = {
            ...morningShow,
            showTime: '18:30'
          };

          // Night show
          const nightShow = {
            ...morningShow,
            showTime: '21:30'
          };

          shows.push(morningShow, eveningShow, nightShow);
        }
      }
    }

    await Show.insertMany(shows);
    
    console.log(' Created shows');

    console.log('\n Sample Data Summary:');
    console.log(`- Users: ${await User.countDocuments()}`);
    console.log(`- Movies: ${await Movie.countDocuments()}`);
    console.log(`- Theaters: ${await Theater.countDocuments()}`);
    console.log(`- Shows: ${await Show.countDocuments()}`);
    
    console.log('\n👤 Test Credentials:');
    console.log('Admin: admin@bookmyshow.com / admin123');
    console.log('User: john@example.com / password123');
    console.log('Theater Owner: owner@pvr.com / owner123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
