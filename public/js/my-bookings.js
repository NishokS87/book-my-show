// Check authentication
if (!requireAuth()) {
    // requireAuth will redirect to login if not authenticated
}

// Load user's bookings
async function loadBookings() {
    const bookingsList = document.getElementById('bookingsList');
    
    try {
        const response = await fetch(API_ENDPOINTS.MY_BOOKINGS, {
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        console.log('Bookings response:', data);
        
        if (response.ok && data.status === 'success') {
            const bookings = Array.isArray(data.data) ? data.data : (data.bookings || []);
            displayBookings(bookings);
        } else {
            bookingsList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${data.message || 'Failed to load bookings'}</p>
                    <p><a href="index.html">Back to Home</a></p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        bookingsList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading bookings. Please check if you're logged in.</p>
                <p><a href="login.html">Login</a> | <a href="index.html">Home</a></p>
            </div>
        `;
    }
}

// Display bookings
function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-ticket-alt"></i>
                <p>No bookings found</p>
                <p><a href="index.html">Book your first movie!</a></p>
            </div>
        `;
        return;
    }
    
    bookingsList.innerHTML = bookings.map(booking => {
        const statusClass = booking.status === 'confirmed' ? 'status-confirmed' :
                           booking.status === 'pending' ? 'status-pending' : 'status-cancelled';
        
        const canCancel = booking.status === 'confirmed' && 
                         new Date(booking.show.showTime) > new Date();
        
        return `
            <div class="booking-card">
                <div class="booking-header">
                    <div class="booking-title">
                        <h3>${booking.show.movie.title}</h3>
                        <div class="booking-code">
                            Booking Code: ${booking.bookingCode}
                        </div>
                    </div>
                    <div class="booking-status ${statusClass}">
                        ${booking.status.toUpperCase()}
                    </div>
                </div>
                <div class="booking-details">
                    <div class="detail-item">
                        <div class="detail-label">Theater</div>
                        <div class="detail-value">
                            <i class="fas fa-building"></i> ${booking.show.theater.name}
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Show Date & Time</div>
                        <div class="detail-value">
                            <i class="fas fa-calendar"></i> ${formatDate(booking.show.showTime)}
                            <br>
                            <i class="fas fa-clock"></i> ${formatTime(booking.show.showTime)}
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Format</div>
                        <div class="detail-value">
                            <i class="fas fa-film"></i> ${booking.show.format}
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Seats</div>
                        <div class="detail-value">
                            <i class="fas fa-couch"></i> ${booking.seats.map(s => `${s.row}${s.number}`).join(', ')}
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Total Amount</div>
                        <div class="detail-value">
                            <i class="fas fa-rupee-sign"></i> ${formatCurrency(booking.totalAmount)}
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Booked On</div>
                        <div class="detail-value">
                            ${formatDate(booking.createdAt)}
                        </div>
                    </div>
                </div>
                ${canCancel ? `
                    <div class="booking-actions">
                        <button class="btn-danger" onclick="cancelBooking('${booking._id}')">
                            Cancel Booking
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Cancel booking
async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?\n\nYour seats will be released and made available to other users.')) {
        return;
    }
    
    try {
        console.log('Cancelling booking:', bookingId);
        
        const response = await fetch(API_ENDPOINTS.CANCEL_BOOKING(bookingId), {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        console.log('Cancel response:', data);
        
        if (response.ok && data.status === 'success') {
            alert('✓ Booking cancelled successfully!\n\nYour seats have been released.');
            loadBookings(); // Reload bookings
        } else {
            alert(data.message || 'Failed to cancel booking. Please try again.');
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Error cancelling booking. Please check your connection and try again.');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', loadBookings);
