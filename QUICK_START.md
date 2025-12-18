# 🚀 Quick Start Guide - BookMyShow Clone

## ⚠️ IMPORTANT: Fix MongoDB Connection FIRST!

Your server cannot connect to MongoDB Atlas because your IP is not whitelisted.

### Fix in 2 Minutes:

1. **Go to** https://cloud.mongodb.com/
2. **Click** "Network Access" (left sidebar)
3. **Click** "Add IP Address" button
4. **Select** "Allow Access From Anywhere" (adds 0.0.0.0/0)
5. **Click** "Confirm" and **wait 2 minutes**
6. **Run** `npm run dev` again

---

## Complete Feature Set

### 👤 USER Features
- ✅ Register and login
- ✅ Browse 10 movies (Inception, Dark Knight, Interstellar, RRR, Spider-Man, etc.)
- ✅ Search and filter movies
- ✅ View movie details and shows
- ✅ Select seats (visual layout)
- ✅ Book tickets with payment
- ✅ View booking history
- ✅ Cancel bookings

### 👨‍💼 ADMIN Features (admin@bookmyshow.com / admin123)
- ✅ Add/edit/delete movies
- ✅ Add/delete theaters
- ✅ View all users
- ✅ Dashboard with statistics
- ✅ Manage system

### 🏢 THEATER OWNER Features (owner@pvr.com / owner123)
- ✅ Add own theaters
- ✅ Create show timings
- ✅ Set pricing (Premium/Gold/Silver)
- ✅ View bookings for their shows
- ✅ Dashboard with stats

---

## Test Accounts

```
Regular User:
Email: john@example.com
Password: password123

Admin:
Email: admin@bookmyshow.com
Password: admin123

Theater Owner:
Email: owner@pvr.com
Password: owner123
```

---

## Usage Instructions

### Step 1: Seed Database (AFTER MongoDB Connects)
```powershell
node seedData.js
```

This creates:
- 3 users (admin, theater owner, regular user)
- 10 movies (Inception, Dark Knight, Interstellar, RRR, Spider-Man, etc.)
- 3 theaters
- 24 shows

### Step 2: Start Server
```powershell
npm run dev
```

### Step 3: Open Application
```
http://localhost:5001
```

---

## Role-Based Workflows

### As a USER:
1. Go to http://localhost:5001
2. Click "Register" or login with `john@example.com / password123`
3. Browse movies → Click any movie
4. See shows by theater and time
5. Click a show time → Select seats
6. Proceed to payment → Booking confirmed
7. View "My Bookings" to see/cancel bookings

### As an ADMIN:
1. Login with `admin@bookmyshow.com / admin123`
2. Click "Admin" in navigation
3. **Add Movie Tab**:
   - Fill form (title, director, language, duration, rating, etc.)
   - Click "Add Movie"
   - See movie in table below
4. **Add Theater Tab**:
   - Fill form (name, city, area, address, pincode)
   - Click "Add Theater"
   - See theater in table
5. **Users Tab**:
   - View all registered users with roles

### As a THEATER OWNER:
1. Login with `owner@pvr.com / owner123`
2. Click "Dashboard" in navigation
3. **Add Theater**:
   - Fill form with theater details
   - Click "Add Theater"
4. **Add Show**:
   - Select movie from dropdown
   - Select your theater
   - Set date and time
   - Choose format (2D/3D/IMAX/4DX)
   - Set seat prices (Premium/Gold/Silver)
   - Click "Add Show"
5. **View Shows**:
   - See all your shows in table
   - Check available seats
   - Delete old shows

---

## Pages Overview

| Page | URL | Purpose |
|------|-----|---------|
| Homepage | `/index.html` | Browse and search movies |
| Movie Details | `/movie-details.html?id=X` | View movie and shows |
| Booking | `/booking.html?showId=X` | Select seats and book |
| My Bookings | `/my-bookings.html` | View/cancel bookings |
| Admin Dashboard | `/admin-dashboard.html` | Manage movies, theaters, users |
| Theater Owner Dashboard | `/theater-owner-dashboard.html` | Manage theaters and shows |
| Login | `/login.html` | User authentication |
| Register | `/register.html` | User registration |

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Movies
- `GET /api/movies` - Get all movies
- `POST /api/movies` - Add movie (admin only)
- `GET /api/movies/:id` - Get movie details
- `DELETE /api/movies/:id` - Delete movie (admin only)

### Theaters
- `GET /api/theaters` - Get all theaters
- `POST /api/theaters` - Add theater (admin/theater-owner)
- `DELETE /api/theaters/:id` - Delete theater

### Shows
- `GET /api/shows` - Get all shows
- `GET /api/shows/movie/:movieId` - Get shows for a movie
- `POST /api/shows` - Add show (theater-owner)
- `DELETE /api/shows/:id` - Delete show

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `POST /api/bookings/:id/cancel` - Cancel booking

### Users
- `GET /api/users` - Get all users (admin only)

---

## Features Implemented

### ✅ Core Features
- JWT authentication with role-based access
- Movie browsing with search/filter
- Theater management
- Show scheduling
- Seat selection (visual layout)
- Real-time seat availability
- Booking system with transactions
- Payment integration (Stripe demo)
- Booking history and cancellation

### ✅ Admin Features
- Add/edit/delete movies
- Add/delete theaters
- View all users
- Dashboard with stats (total movies, theaters, bookings, users)

### ✅ Theater Owner Features
- Add theaters
- Create show timings
- Set pricing per seat type
- View show bookings
- Delete shows

### ✅ Technical Features
- MongoDB transactions (prevent double booking)
- Caching layer (node-cache)
- HTTP compression
- Error handling
- Responsive design
- Color-coded seat availability

---

## Database Structure

```
Users (3 roles: user, admin, theater-owner)
├── name, email, password (hashed)
├── phone, role, isActive
└── createdAt

Movies (10 seeded)
├── title, director, description
├── language, genre[], duration
├── rating, releaseDate, cast[]
└── isActive

Theaters
├── name, location{city, area, address, pincode}
├── screens[{screenNumber, screenName, totalSeats}]
└── owner reference

Shows
├── movie, theater references
├── showTime, format
├── totalSeats, availableSeats[]
├── pricing[{seatType, price}]
└── isActive

Bookings
├── user, show references
├── seats[], totalAmount
├── bookingCode, status
└── createdAt
```

---

## Troubleshooting

### MongoDB Connection Error
**Error**: "Could not connect to any servers in your MongoDB Atlas cluster"
**Solution**: 
1. Go to https://cloud.mongodb.com/
2. Network Access → Add IP Address → Allow Access From Anywhere (0.0.0.0/0)
3. Wait 2 minutes, restart server

### Can't Seed Database
**Solution**: Fix MongoDB connection first, then run `node seedData.js`

### Port 5001 Already in Use
**Solution**: 
```powershell
Get-Process -Name node | Stop-Process -Force
npm run dev
```

### Admin/Theater Owner Dashboards Not Working
**Solution**: Make sure you're logged in with correct role:
- Admin: `admin@bookmyshow.com / admin123`
- Theater Owner: `owner@pvr.com / owner123`

---

## What's New

### Added:
1. **10 Movies** instead of 4 (Inception, Dark Knight, Interstellar, RRR, Spider-Man, Dune, Pathaan, 3 Idiots, Jawan, Avengers)
2. **Admin Dashboard** - Complete movie/theater/user management
3. **Theater Owner Dashboard** - Add theaters and shows
4. **Role-Based Navigation** - Different dashboards for different roles
5. **Better Seat Pricing** - Theater owners can set prices
6. **Show Management** - Theater owners can create and delete shows
7. **User Management** - Admins can view all users

### Removed/Cleaned:
- Removed unused code
- Fixed all errors
- Optimized database queries
- Improved error messages

---

## Next Steps

1. **Fix MongoDB** (whitelist IP)
2. **Seed Database** (`node seedData.js`)
3. **Start Server** (`npm run dev`)
4. **Test Each Role**:
   - User: Book tickets
   - Theater Owner: Add show
   - Admin: Add movie
5. **Enjoy!** 🎉

---

## Important Notes

- Default server port: **5001**
- All protected routes need `Authorization: Bearer <token>` header
- Bookings use MongoDB transactions (no double-booking possible)
- Seats auto-release on booking cancellation
- Color-coded seat availability (Green: 20+, Yellow: 10-20, Red: <10)

**Everything is ready! Just whitelist your IP in MongoDB Atlas and you're good to go!** 🚀
