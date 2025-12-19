// API Configuration
// Use current domain for API calls (works both locally and on Vercel)
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5001/api' 
    : `${window.location.origin}/api`;

// API Endpoints
const API_ENDPOINTS = {
    // Auth
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    
    // Movies
    MOVIES: `${API_BASE_URL}/movies`,
    MOVIE_SEARCH: `${API_BASE_URL}/movies/search`,
    
    // Theaters
    THEATERS: `${API_BASE_URL}/theaters`,
    
    // Shows
    SHOWS: `${API_BASE_URL}/shows`,
    SHOWS_BY_MOVIE: (movieId) => `${API_BASE_URL}/shows/movie/${movieId}`,
    SHOW_DETAILS: (showId) => `${API_BASE_URL}/shows/${showId}`,
    
    // Bookings
    BOOKINGS: `${API_BASE_URL}/bookings`,
    MY_BOOKINGS: `${API_BASE_URL}/bookings/user/my-bookings`,
    CANCEL_BOOKING: (bookingId) => `${API_BASE_URL}/bookings/${bookingId}`,
    
    // Payments
    CREATE_PAYMENT: `${API_BASE_URL}/payments/create-payment-intent`,
    CONFIRM_PAYMENT: `${API_BASE_URL}/payments/confirm-payment`
};

// Helper function to get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}

// Helper function to get auth headers
function getAuthHeaders() {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
}

// Helper function to check if user is logged in
function isLoggedIn() {
    return !!getAuthToken();
}

// Helper function to get user info
function getUserInfo() {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr || userStr === 'undefined' || userStr === 'null') {
            return null;
        }
        return JSON.parse(userStr);
    } catch (error) {
        console.error('Error parsing user info:', error);
        return null;
    }
}

// Alias for compatibility
function getUser() {
    return getUserInfo();
}

// Helper function to get token
function getToken() {
    return getAuthToken();
}

// Add USERS endpoint
API_ENDPOINTS.USERS = `${API_BASE_URL}/users`;

// Helper function to logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });
}

// Helper function to format time
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
    });
}

// Helper function to format currency
function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

// Error handler
function handleError(error) {
    console.error('Error:', error);
    if (error.message) {
        return error.message;
    }
    return 'An error occurred. Please try again.';
}
