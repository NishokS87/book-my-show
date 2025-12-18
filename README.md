# BookMyShow Clone - Movie Ticket Booking System

A comprehensive movie ticket booking system built with Node.js, Express, and MongoDB Atlas. This application provides features similar to BookMyShow including user authentication, movie listings, theater management, show scheduling, seat selection, booking management, and payment integration.

## Features

### User Management
- User registration and authentication with JWT
- Role-based access control (User, Admin, Theater Owner)
- User profile management

### Movie Management
- Browse movies with filters (language, genre)
- Search movies by title, director, or cast
- View movie details (cast, duration, rating, trailer)
- Admin can add/update/delete movies

### Theater Management
- List theaters by location/city
- Theater details with screen information
- Seat layout configuration
- Multiple seat types (Premium, Gold, Silver) with different pricing

### Show Management
- Schedule shows for movies across theaters
- Multiple show times and dates
- Different formats (2D, 3D, IMAX, 4DX)
- Real-time seat availability

### Booking System
- Select seats from interactive layout
- Real-time seat blocking during booking process
- Booking expiration (10 minutes)
- View booking history
- Cancel bookings with automatic seat release
- Unique booking codes

### Payment Integration
- Stripe payment gateway integration
- Secure payment processing
- Payment status tracking
- Refund support

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Payment**: Stripe
- **Validation**: express-validator
- **CORS**: cors middleware

## Project Structure

```
bookmyshow-clone/
├── config/
│   └── db.js                 # Database configuration
├── models/
│   ├── User.js              # User model
│   ├── Movie.js             # Movie model
│   ├── Theater.js           # Theater model
│   ├── Show.js              # Show model
│   └── Booking.js           # Booking model
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   ├── movieController.js   # Movie operations
│   ├── theaterController.js # Theater operations
│   ├── showController.js    # Show operations
│   ├── bookingController.js # Booking operations
│   └── paymentController.js # Payment processing
├── routes/
│   ├── auth.js              # Auth routes
│   ├── users.js             # User routes
│   ├── movies.js            # Movie routes
│   ├── theaters.js          # Theater routes
│   ├── shows.js             # Show routes
│   ├── bookings.js          # Booking routes
│   └── payments.js          # Payment routes
├── middleware/
│   └── auth.js              # Auth middleware
├── utils/
│   └── auth.js              # Auth utilities
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore file
├── package.json            # Dependencies
└── server.js               # Entry point
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd book_my_show
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bookmyshow?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
CLIENT_URL=http://localhost:3000
```

## MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and update `MONGODB_URI` in `.env`

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Protected)
- `PUT /api/users/:id` - Update user (Protected)
- `DELETE /api/users/:id` - Delete user (Protected)

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `GET /api/movies/search?q=query` - Search movies
- `POST /api/movies` - Create movie (Admin only)
- `PUT /api/movies/:id` - Update movie (Admin only)
- `DELETE /api/movies/:id` - Delete movie (Admin only)

### Theaters
- `GET /api/theaters` - Get all theaters
- `GET /api/theaters/:id` - Get theater by ID
- `GET /api/theaters/location/:city` - Get theaters by city
- `POST /api/theaters` - Create theater (Admin/Theater Owner)
- `PUT /api/theaters/:id` - Update theater (Admin/Theater Owner)
- `DELETE /api/theaters/:id` - Delete theater (Admin/Theater Owner)

### Shows
- `GET /api/shows` - Get all shows
- `GET /api/shows/:id` - Get show by ID
- `GET /api/shows/movie/:movieId` - Get shows by movie
- `GET /api/shows/theater/:theaterId` - Get shows by theater
- `GET /api/shows/movie/:movieId/city/:city` - Get shows by movie and city
- `POST /api/shows` - Create show (Admin/Theater Owner)
- `PUT /api/shows/:id` - Update show (Admin/Theater Owner)
- `DELETE /api/shows/:id` - Delete show (Admin/Theater Owner)

### Bookings
- `POST /api/bookings` - Create booking (Protected)
- `GET /api/bookings` - Get all bookings (Protected)
- `GET /api/bookings/user/my-bookings` - Get user's bookings (Protected)
- `GET /api/bookings/:id` - Get booking by ID (Protected)
- `DELETE /api/bookings/:id` - Cancel booking (Protected)

### Payments
- `POST /api/payments/create-intent` - Create payment intent (Protected)
- `POST /api/payments/confirm` - Confirm payment (Protected)
- `GET /api/payments/status/:bookingId` - Get payment status (Protected)

## API Request Examples

### Register User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

### Create Booking
```json
POST /api/bookings
Headers: { "Authorization": "Bearer <token>" }
{
  "showId": "show_id_here",
  "seats": [
    { "row": "A", "number": 5 },
    { "row": "A", "number": 6 }
  ]
}
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based authorization
- Input validation with express-validator
- CORS protection
- Environment variable configuration

## Features to Extend

- Email notifications for bookings
- QR code generation for tickets
- Seat hold timer with auto-release
- Advanced search and filters
- Rating and review system
- Offer and coupon management
- Integration with multiple payment gateways (Razorpay, PayPal)
- Admin dashboard
- Analytics and reporting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@bookmyshow-clone.com or raise an issue in the repository.
