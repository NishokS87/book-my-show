# API Testing Guide

This guide provides sample requests for testing all API endpoints using tools like Postman, Insomnia, or cURL.

## Setup

1. Start the server: `npm run dev`
2. Base URL: `http://localhost:5000/api`

## 1. Authentication

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**: Save the `token` for authenticated requests

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <your_token>
```

## 2. Movies

### Get All Movies
```http
GET /api/movies
```

### Search Movies
```http
GET /api/movies/search?q=avengers
```

### Create Movie (Admin only)
```http
POST /api/movies
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Avengers: Endgame",
  "description": "The epic conclusion to the Infinity Saga",
  "language": "English",
  "genre": ["Action", "Adventure", "Sci-Fi"],
  "duration": 181,
  "releaseDate": "2019-04-26",
  "rating": "UA",
  "posterUrl": "https://example.com/poster.jpg",
  "director": "Anthony Russo",
  "cast": [
    { "name": "Robert Downey Jr.", "role": "Tony Stark" },
    { "name": "Chris Evans", "role": "Steve Rogers" }
  ]
}
```

## 3. Theaters

### Get All Theaters
```http
GET /api/theaters
```

### Get Theaters by City
```http
GET /api/theaters/location/Mumbai
```

### Create Theater (Admin/Theater Owner)
```http
POST /api/theaters
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "PVR Cinemas",
  "location": {
    "city": "Mumbai",
    "area": "Andheri",
    "address": "Link Road, Andheri West",
    "pincode": "400053"
  },
  "screens": [
    {
      "screenNumber": 1,
      "screenName": "Audi 1",
      "totalSeats": 100,
      "seatLayout": {
        "rows": 10,
        "seatsPerRow": 10,
        "seatTypes": [
          {
            "type": "premium",
            "price": 300,
            "seats": [
              { "row": "A", "number": 1 },
              { "row": "A", "number": 2 }
            ]
          },
          {
            "type": "gold",
            "price": 200,
            "seats": [
              { "row": "B", "number": 1 },
              { "row": "B", "number": 2 }
            ]
          }
        ]
      }
    }
  ],
  "facilities": ["Parking", "Food Court", "M-Ticket"],
  "owner": "user_id_here"
}
```

## 4. Shows

### Get All Shows
```http
GET /api/shows
```

### Get Shows by Movie
```http
GET /api/shows/movie/<movie_id>
```

### Get Shows by Movie and City
```http
GET /api/shows/movie/<movie_id>/city/Mumbai
```

### Create Show (Admin/Theater Owner)
```http
POST /api/shows
Authorization: Bearer <token>
Content-Type: application/json

{
  "movie": "movie_id_here",
  "theater": "theater_id_here",
  "screenNumber": 1,
  "showDate": "2024-01-20",
  "showTime": "18:30",
  "language": "English",
  "format": "2D",
  "pricing": [
    { "seatType": "premium", "price": 300 },
    { "seatType": "gold", "price": 200 }
  ]
}
```

## 5. Bookings

### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "showId": "show_id_here",
  "seats": [
    { "row": "A", "number": 1 },
    { "row": "A", "number": 2 }
  ]
}
```

### Get My Bookings
```http
GET /api/bookings/user/my-bookings
Authorization: Bearer <token>
```

### Get Booking Details
```http
GET /api/bookings/<booking_id>
Authorization: Bearer <token>
```

### Cancel Booking
```http
DELETE /api/bookings/<booking_id>
Authorization: Bearer <token>
```

## 6. Payments

### Create Payment Intent
```http
POST /api/payments/create-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "booking_id_here"
}
```

### Confirm Payment
```http
POST /api/payments/confirm
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "booking_id_here",
  "paymentIntentId": "payment_intent_id_from_stripe"
}
```

### Get Payment Status
```http
GET /api/payments/status/<booking_id>
Authorization: Bearer <token>
```

## Testing Flow

1. **Register** a new user
2. **Login** to get authentication token
3. **Create a movie** (requires admin role)
4. **Create a theater** with screens and seat layout
5. **Create a show** for the movie at the theater
6. **Search shows** by movie and city
7. **Create a booking** by selecting seats
8. **Create payment intent** for the booking
9. **Confirm payment** after successful payment
10. **View booking** details and history

## Error Responses

All error responses follow this format:
```json
{
  "status": "error",
  "message": "Error description here"
}
```

## Success Responses

All success responses follow this format:
```json
{
  "status": "success",
  "data": { /* response data */ }
}
```

## Notes

- All dates should be in ISO 8601 format
- Times should be in "HH:MM" format (24-hour)
- Protected routes require `Authorization: Bearer <token>` header
- Admin routes require user role to be "admin"
- Theater owner routes require user role to be "theater-owner" or "admin"
