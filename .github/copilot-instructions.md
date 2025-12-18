# BookMyShow Clone - Project Instructions

## Project Overview
A comprehensive movie ticket booking system built with Node.js, Express, and MongoDB Atlas. Features include user authentication, movie listings, theater management, show scheduling, seat selection, booking management, and Stripe payment integration.

## Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **Payment Gateway**: Stripe
- **Validation**: express-validator
- **CORS**: Enabled for cross-origin requests

## Project Structure
```
├── config/          # Database configuration
├── models/          # MongoDB schemas (User, Movie, Theater, Show, Booking)
├── controllers/     # Business logic for all features
├── routes/          # API endpoint definitions
├── middleware/      # Authentication & authorization
├── utils/           # Helper functions
├── .env            # Environment variables
└── server.js       # Application entry point
```

## Completed Features ✅

### 1. User Management
- User registration with email validation
- JWT-based authentication
- Role-based access control (User, Admin, Theater Owner)
- Password hashing with bcrypt
- User profile management

### 2. Movie Management
- CRUD operations for movies
- Search by title, director, or cast
- Filter by language and genre
- Movie details with cast, duration, rating

### 3. Theater Management
- Theater listings by location/city
- Multiple screens per theater
- Configurable seat layouts
- Different seat types (Premium, Gold, Silver) with pricing
- Theater owner authorization

### 4. Show Management
- Schedule shows with date and time
- Multiple formats (2D, 3D, IMAX, 4DX)
- Real-time seat availability tracking
- Dynamic pricing per seat type
- Shows filtered by movie, theater, or city

### 5. Booking System
- Seat selection and booking
- Real-time seat status (available/blocked/booked)
- Automatic seat blocking during checkout
- 10-minute booking expiration
- Unique booking codes
- Booking history and cancellation
- Automatic seat release on cancellation

### 6. Payment Integration
- Stripe payment gateway integration
- Payment intent creation
- Payment confirmation
- Payment status tracking
- Secure payment processing

## API Endpoints

All endpoints are documented in `API_TESTING_GUIDE.md`

**Authentication**: `/api/auth/*`
**Users**: `/api/users/*`
**Movies**: `/api/movies/*`
**Theaters**: `/api/theaters/*`
**Shows**: `/api/shows/*`
**Bookings**: `/api/bookings/*`
**Payments**: `/api/payments/*`

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   - Edit `.env` file
   - Add MongoDB Atlas connection string
   - Add Stripe API keys
   - Set JWT secret

3. **MongoDB Atlas Setup**:
   - Create account at mongodb.com/cloud/atlas
   - Create cluster and database user
   - Whitelist IP address
   - Copy connection string to `.env`

4. **Run Application**:
   ```bash
   npm run dev  # Development mode
   npm start    # Production mode
   ```

5. **Test API**:
   - Use Postman/Insomnia
   - Refer to `API_TESTING_GUIDE.md`
   - Start with user registration and login

## Security Features
- JWT token authentication
- Password hashing with bcrypt
- Role-based authorization
- Input validation
- CORS protection
- Environment variable configuration

## Next Steps / Future Enhancements
- Email notifications for bookings
- QR code ticket generation
- Advanced search filters
- Movie ratings and reviews
- Coupon and offer management
- Admin dashboard UI
- Multiple payment gateways (Razorpay, PayPal)
- Automated show expiration cleanup
- Real-time seat updates with WebSockets

## Important Notes
- Default server port: 5000
- All protected routes require `Authorization: Bearer <token>` header
- Booking expires after 10 minutes if payment not completed
- Seats are automatically released on booking cancellation
- MongoDB Atlas free tier is sufficient for development

## Files Overview
- `server.js` - Express app setup and middleware
- `config/db.js` - MongoDB connection
- `models/*.js` - Database schemas
- `controllers/*.js` - Business logic
- `routes/*.js` - API endpoints
- `middleware/auth.js` - JWT authentication
- `.env` - Configuration (DO NOT commit to git)
