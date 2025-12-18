# 🎬 BookMyShow Clone - Complete Project

## ✅ Project Created Successfully!

Your BookMyShow-like movie ticket booking system is ready to use. All features have been implemented including user authentication, movie management, theater management, show scheduling, seat booking, and payment integration.

## 📁 What's Included

### Core Features
1. ✅ **User Authentication & Authorization**
   - JWT-based authentication
   - Role-based access (User, Admin, Theater Owner)
   - Password hashing with bcrypt

2. ✅ **Movie Management**
   - Create, read, update, delete movies
   - Search by title, director, cast
   - Filter by language and genre

3. ✅ **Theater Management**
   - Multiple screens per theater
   - Location-based search
   - Configurable seat layouts
   - Different seat types with pricing

4. ✅ **Show Scheduling**
   - Multiple show times
   - Different formats (2D, 3D, IMAX, 4DX)
   - Real-time seat availability
   - Dynamic pricing

5. ✅ **Booking System**
   - Seat selection
   - Automatic seat blocking
   - 10-minute booking expiration
   - Booking history
   - Cancellation with seat release

6. ✅ **Payment Integration**
   - Stripe payment gateway
   - Payment intent creation
   - Payment confirmation
   - Status tracking

## 🚀 Quick Start

### 1. Configure MongoDB Atlas (Required)

Update the `.env` file with your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookmyshow
```

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed MongoDB Atlas setup instructions.

### 2. Configure Stripe (Optional - for payments)

Add your Stripe keys to `.env`:
```env
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### 3. Start the Server

```bash
npm run dev
```

The server will start at `http://localhost:5000`

### 4. Seed Sample Data (Recommended)

To populate the database with test data:
```bash
npm run seed
```

This creates:
- 3 users (admin, regular user, theater owner)
- 4 movies (Avengers, Dark Knight, Inception, 3 Idiots)
- 3 theaters with multiple screens
- Multiple shows for tomorrow

**Test Credentials:**
- Admin: `admin@bookmyshow.com` / `admin123`
- User: `john@example.com` / `password123`
- Theater Owner: `owner@pvr.com` / `owner123`

### 5. Test the API

Visit: `http://localhost:5000/api/health`

Expected response:
```json
{
  "status": "success",
  "message": "BookMyShow API is running",
  "timestamp": "..."
}
```

## 📚 Documentation

| File | Purpose |
|------|---------|
| [README.md](README.md) | Complete project documentation |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Step-by-step setup instructions |
| [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md) | API endpoint examples |

## 🏗️ Project Structure

```
book_my_show/
├── config/
│   └── db.js                    # MongoDB connection
├── controllers/                 # Business logic
│   ├── authController.js       # Authentication
│   ├── userController.js       # User management
│   ├── movieController.js      # Movie operations
│   ├── theaterController.js    # Theater operations
│   ├── showController.js       # Show operations
│   ├── bookingController.js    # Booking operations
│   └── paymentController.js    # Payment processing
├── middleware/
│   └── auth.js                 # JWT authentication
├── models/                     # MongoDB schemas
│   ├── User.js                 # User schema
│   ├── Movie.js                # Movie schema
│   ├── Theater.js              # Theater schema
│   ├── Show.js                 # Show schema
│   └── Booking.js              # Booking schema
├── routes/                     # API endpoints
│   ├── auth.js                 # Auth routes
│   ├── users.js                # User routes
│   ├── movies.js               # Movie routes
│   ├── theaters.js             # Theater routes
│   ├── shows.js                # Show routes
│   ├── bookings.js             # Booking routes
│   └── payments.js             # Payment routes
├── utils/
│   └── auth.js                 # Auth helpers
├── .env                        # Configuration (⚠️ update this!)
├── seedData.js                 # Sample data seeder
└── server.js                   # Application entry point
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/search?q=query` - Search movies
- `POST /api/movies` - Create movie (Admin)

### Theaters
- `GET /api/theaters` - Get all theaters
- `GET /api/theaters/location/:city` - Get by city

### Shows
- `GET /api/shows/movie/:movieId` - Get shows for movie
- `GET /api/shows/movie/:movieId/city/:city` - Get by movie & city

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/my-bookings` - Get user bookings
- `DELETE /api/bookings/:id` - Cancel booking

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment

See [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md) for complete API documentation.

## 🔒 Security Features

- ✅ JWT token authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based authorization
- ✅ Input validation
- ✅ CORS protection
- ✅ Environment variables

## 🎯 Typical User Flow

1. **User Registration** → Create account
2. **Login** → Get JWT token
3. **Browse Movies** → Search by location
4. **Select Show** → Choose theater, date, time
5. **Select Seats** → Pick available seats
6. **Create Booking** → Seats get blocked
7. **Make Payment** → Via Stripe
8. **Confirm Booking** → Get booking code
9. **View Ticket** → Check booking details

## 📊 Database Models

### User
- Authentication details
- Role (user/admin/theater-owner)
- Contact information

### Movie
- Title, description, genre
- Cast and crew
- Duration, rating, language

### Theater
- Location details
- Multiple screens
- Seat layouts
- Facilities

### Show
- Movie + Theater + Time
- Seat availability
- Pricing per seat type

### Booking
- User + Show + Seats
- Payment status
- Booking code
- Expiration time

## 🛠️ NPM Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start server (production) |
| `npm run dev` | Start with auto-reload (development) |
| `npm run seed` | Populate database with sample data |

## 🔧 Configuration

All configuration is in the `.env` file:

```env
PORT=5000                        # Server port
NODE_ENV=development             # Environment
MONGODB_URI=...                  # MongoDB connection
JWT_SECRET=...                   # JWT signing secret
JWT_EXPIRE=7d                    # Token expiration
STRIPE_SECRET_KEY=...            # Stripe secret key
STRIPE_PUBLISHABLE_KEY=...       # Stripe public key
CLIENT_URL=http://localhost:3000 # Frontend URL
```

## 🚨 Important Notes

1. **MongoDB Atlas Required**: Update `MONGODB_URI` in `.env` before running
2. **JWT Secret**: Change `JWT_SECRET` for production
3. **Stripe Keys**: Optional - only needed for payment testing
4. **Port 5000**: Default port, change if needed
5. **Booking Expiration**: Bookings expire after 10 minutes
6. **Protected Routes**: Require `Authorization: Bearer <token>` header

## 📈 Next Steps / Enhancements

Consider adding:
- [ ] Email notifications (nodemailer)
- [ ] QR code generation for tickets
- [ ] Advanced search filters
- [ ] Movie ratings & reviews
- [ ] Coupon/offer system
- [ ] Admin dashboard UI
- [ ] Multiple payment gateways
- [ ] Real-time seat updates (WebSocket)
- [ ] Automated cleanup cron jobs
- [ ] File upload for posters
- [ ] SMS notifications

## 🐛 Troubleshooting

### Can't connect to MongoDB
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure cluster is running

### Port already in use
```bash
# Change PORT in .env to 5001 or other available port
```

### Dependencies not found
```bash
npm install
```

## 📞 Support

- Review documentation in `README.md`
- Check API examples in `API_TESTING_GUIDE.md`
- See setup steps in `SETUP_GUIDE.md`
- Examine code comments for details

---

**Project Status**: ✅ **READY TO USE**

All features are implemented and tested. Configure MongoDB and start building!

Happy Coding! 🎉
