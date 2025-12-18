# Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Stripe account (for payments)

## Step-by-Step Setup

### 1. Install Dependencies ✅
```bash
npm install
```
**Status**: Already completed

### 2. Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click "Create a New Cluster" (Free tier is fine)
4. Wait for cluster creation (2-5 minutes)
5. Click "Database Access" → "Add New Database User"
   - Username: `bookmyshow`
   - Password: Generate secure password (save it!)
   - Role: Atlas Admin
6. Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP
7. Click "Databases" → "Connect" → "Connect your application"
8. Copy the connection string
9. Replace in `.env`:
   ```
   MONGODB_URI=mongodb+srv://bookmyshow:<password>@cluster0.xxxxx.mongodb.net/bookmyshow?retryWrites=true&w=majority
   ```
   Replace `<password>` with your database user password

### 3. Configure Stripe (Optional for Testing)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up or log in
3. Go to "Developers" → "API keys"
4. Copy "Publishable key" and "Secret key"
5. Update in `.env`:
   ```
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
   ```

**Note**: You can skip Stripe setup initially and test other features first.

### 4. Update JWT Secret

In `.env`, change the JWT secret to something secure:
```
JWT_SECRET=MySecureRandomStringForJWT2024!@#
```

### 5. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

You should see:
```
Server is running on port 5000
Environment: development
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

### 6. Test the API

Open your browser or Postman and test:
```
http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "BookMyShow API is running",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

## Next Steps

1. **Register a user**: See `API_TESTING_GUIDE.md`
2. **Create test data**: Movies, theaters, shows
3. **Test booking flow**: Complete booking process
4. **Test payments**: With Stripe test mode

## Troubleshooting

### MongoDB Connection Error
- Check if IP is whitelisted
- Verify username/password in connection string
- Ensure cluster is active

### Port Already in Use
Change port in `.env`:
```
PORT=5001
```

### Module Not Found
Run:
```bash
npm install
```

### Environment Variables Not Loading
- Ensure `.env` file exists
- Check file encoding (UTF-8)
- Restart server after changes

## Project Structure

```
book_my_show/
├── config/
│   └── db.js                 # ✅ MongoDB connection
├── controllers/              # ✅ Business logic
│   ├── authController.js
│   ├── userController.js
│   ├── movieController.js
│   ├── theaterController.js
│   ├── showController.js
│   ├── bookingController.js
│   └── paymentController.js
├── middleware/
│   └── auth.js              # ✅ JWT authentication
├── models/                  # ✅ Database schemas
│   ├── User.js
│   ├── Movie.js
│   ├── Theater.js
│   ├── Show.js
│   └── Booking.js
├── routes/                  # ✅ API endpoints
│   ├── auth.js
│   ├── users.js
│   ├── movies.js
│   ├── theaters.js
│   ├── shows.js
│   ├── bookings.js
│   └── payments.js
├── utils/
│   └── auth.js             # ✅ Auth helpers
├── .env                    # ⚙️ Configuration (update this!)
├── .env.example           # ✅ Template
├── .gitignore             # ✅ Git ignore
├── package.json           # ✅ Dependencies
├── server.js              # ✅ Entry point
├── README.md              # ✅ Documentation
└── API_TESTING_GUIDE.md   # ✅ API reference

✅ = Completed
⚙️ = Needs configuration
```

## Support

- Check `README.md` for detailed documentation
- See `API_TESTING_GUIDE.md` for API examples
- Review code comments for inline help

Happy coding! 🚀
