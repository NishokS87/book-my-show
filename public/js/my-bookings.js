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
        
        console.log('Bookings API Response:', data);
        console.log('Response status:', response.status);
        console.log('Data status:', data.status);
        
        if (response.ok && data.status === 'success') {
            const bookings = Array.isArray(data.data) ? data.data : (data.bookings || []);
            console.log('Bookings found:', bookings.length);
            console.log('Bookings data:', bookings);
            window.currentBookings = bookings; // Store for print function
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
        // Handle both 'status' and 'bookingStatus' field names
        const bookingStatus = booking.bookingStatus || booking.status || 'pending';
        const statusClass = bookingStatus === 'confirmed' ? 'status-confirmed' :
                           bookingStatus === 'pending' ? 'status-pending' : 'status-cancelled';
        
        const canCancel = bookingStatus === 'confirmed' && 
                         new Date(booking.showDate) > new Date();
        
        // Safely access nested objects
        const movieTitle = booking.movie?.title || 'Movie';
        const theaterName = booking.theater?.name || 'Theater';
        const showDate = booking.show?.showDate || booking.showDate;
        const showTime = booking.show?.showTime || booking.showTime;
        const showFormat = booking.show?.format || '2D';
        
        // IMPORTANT: Format seat list clearly
        const seatsList = booking.seats && booking.seats.length > 0 
            ? booking.seats.map(s => `${s.row}${s.number}`).join(', ')
            : 'No seats';
        
        // Log for debugging
        console.log('Booking seats:', booking.seats);
        console.log('Formatted seats:', seatsList);
        
        return `
            <div class="booking-card">
                <div class="booking-header">
                    <div class="booking-title">
                        <h3>${movieTitle}</h3>
                        <div class="booking-code">
                            Booking Code: ${booking.bookingCode}
                        </div>
                    </div>
                    <div class="booking-status ${statusClass}">
                        ${bookingStatus.toUpperCase()}
                    </div>
                </div>
                
                <!-- HIGHLIGHTED SEATS SECTION -->
                <div class="seats-highlight" style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); padding: 20px; border-radius: 10px; margin: 15px 0; text-align: center; border: 2px solid #4caf50;">
                    <div style="font-size: 14px; color: #2e7d32; font-weight: 600; margin-bottom: 8px;">
                        <i class="fas fa-couch"></i> YOUR SEATS
                    </div>
                    <div style="font-size: 24px; font-weight: bold; color: #1b5e20; letter-spacing: 2px;">
                        ${seatsList}
                    </div>
                    <div style="font-size: 12px; color: #388e3c; margin-top: 5px;">
                        ${booking.totalSeats || booking.seats.length} Seat(s)
                    </div>
                </div>
                
                <div class="booking-details">
                    <div class="detail-item">
                        <div class="detail-label">Theater</div>
                        <div class="detail-value">
                            <i class="fas fa-building"></i> ${theaterName}
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Show Date & Time</div>
                        <div class="detail-value">
                            <i class="fas fa-calendar"></i> ${formatDate(showDate)}
                            <br>
                            <i class="fas fa-clock"></i> ${showTime}
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Format</div>
                        <div class="detail-value">
                            <i class="fas fa-film"></i> ${showFormat}
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
                            ${formatDate(booking.createdAt || booking.bookingDate)}
                        </div>
                    </div>
                </div>
                <div class="booking-actions">
                    ${bookingStatus === 'confirmed' ? `
                        <button class="btn-print" onclick="printTicket('${booking._id}')">
                            <i class="fas fa-print"></i> Print Ticket
                        </button>
                    ` : ''}
                    ${canCancel ? `
                        <button class="btn-danger" onclick="cancelBooking('${booking._id}')">
                            <i class="fas fa-times-circle"></i> Cancel Booking
                        </button>
                    ` : ''}
                    ${bookingStatus === 'cancelled' ? `
                        <div style="color: #dc3545; font-weight: 600; padding: 10px; background: #ffe0e0; border-radius: 5px;">
                            <i class="fas fa-ban"></i> BOOKING CANCELLED
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Cancel booking
async function cancelBooking(bookingId) {
    if (!confirm('Cancel Booking?\n\nYour seats will be released and made available for others.\n\nThis action cannot be undone.')) {
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
            alert('✅ Booking Cancelled Successfully\n\nYour booking has been cancelled.\nSeats are now available for booking.');
            loadBookings(); // Reload bookings
        } else {
            alert('❌ Cancellation Failed\n\n' + (data.message || 'Please try again.'));
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('❌ Network Error\n\nPlease check your connection and try again.');
    }
}

// Print ticket function
function printTicket(bookingId) {
    const bookings = window.currentBookings || [];
    const booking = bookings.find(b => b._id === bookingId);
    
    if (!booking) {
        alert('Booking not found!');
        return;
    }
    
    // Safely extract data
    const bookingStatus = booking.bookingStatus || booking.status || 'Confirmed';
    const movieTitle = booking.movie?.title || 'Movie';
    const theaterName = booking.theater?.name || 'Theater';
    const showDate = booking.show?.showDate || booking.showDate;
    const showTime = booking.show?.showTime || booking.showTime;
    const showFormat = booking.show?.format || '2D';
    const seatsList = booking.seats.map(s => `${s.row}${s.number}`).join(', ');
    
    // Create print content
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Ticket - ${booking.bookingCode}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; background: #f5f5f5; }
                .ticket { border: 3px solid #f84464; border-radius: 15px; padding: 30px; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                .header { text-align: center; border-bottom: 2px dashed #ccc; padding-bottom: 20px; margin-bottom: 20px; }
                .header h1 { color: #f84464; margin: 0 0 10px 0; font-size: 36px; }
                .header .tagline { color: #666; font-size: 14px; }
                .ticket-code { background: #f84464; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 8px; margin: 20px 0; }
                .details { margin: 30px 0; }
                .detail-row { display: flex; padding: 12px 0; border-bottom: 1px solid #eee; }
                .detail-label { width: 200px; font-weight: bold; color: #333; }
                .detail-value { flex: 1; color: #666; }
                .seats { background: #e8f5e9; padding: 15px; border-radius: 8px; text-align: center; font-size: 20px; font-weight: bold; color: #2e7d32; margin: 20px 0; }
                .amount { background: #fff3e0; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; color: #e65100; margin: 20px 0; }
                .qr-code { text-align: center; margin: 30px 0; }
                .qr-placeholder { width: 200px; height: 200px; border: 2px dashed #ccc; margin: 0 auto; display: flex; align-items: center; justify-content: center; color: #999; border-radius: 8px; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px dashed #ccc; color: #666; font-size: 12px; line-height: 1.8; }
                .status { display: inline-block; padding: 8px 20px; background: #4caf50; color: white; border-radius: 20px; font-size: 14px; font-weight: bold; margin-top: 10px; }
                .btn-group { text-align: center; margin-top: 30px; }
                .btn { background: #f84464; color: white; border: none; padding: 15px 40px; font-size: 16px; border-radius: 8px; cursor: pointer; margin: 0 10px; transition: transform 0.2s; }
                .btn:hover { transform: scale(1.05); }
                .btn-secondary { background: #666; }
                @media print { 
                    body { padding: 20px; background: white; } 
                    .btn-group { display: none; }
                    .ticket { box-shadow: none; }
                }
            </style>
        </head>
        <body>
            <div class="ticket">
                <div class="header">
                    <h1>🎬 BookMyShow</h1>
                    <div class="tagline">Your Movie Ticket</div>
                    <span class="status">${bookingStatus.toUpperCase()}</span>
                </div>
                
                <div class="ticket-code">
                    BOOKING CODE: ${booking.bookingCode}
                </div>
                
                <div class="details">
                    <div class="detail-row">
                        <div class="detail-label">🎬 Movie:</div>
                        <div class="detail-value">${movieTitle}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">🏢 Theater:</div>
                        <div class="detail-value">${theaterName}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">📅 Show Date:</div>
                        <div class="detail-value">${new Date(showDate).toLocaleDateString()}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">🕐 Show Time:</div>
                        <div class="detail-value">${showTime}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">🎥 Format:</div>
                        <div class="detail-value">${showFormat}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">🎫 Seats:</div>
                        <div class="detail-value">${booking.seats.length} seat(s)</div>
                    </div>
                </div>
                
                <div class="seats">
                    🪑 SEAT NUMBERS: ${seatsList}
                </div>
                
                <div class="amount">
                    💰 TOTAL: ₹${booking.totalAmount.toFixed(2)}
                </div>
                
                <div class="qr-code">
                    <div class="qr-placeholder">
                        <div style="text-align: center;">
                            <div style="font-size: 48px; margin-bottom: 10px;">📱</div>
                            <div>QR Code</div>
                            <div style="font-size: 10px; margin-top: 5px; word-break: break-all; padding: 0 10px;">${booking.bookingCode}</div>
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Please arrive 15 minutes before showtime</p>
                    <p>Booked on: ${new Date(booking.bookingDate || booking.createdAt).toLocaleString()}</p>
                    <p style="margin-top: 10px;">Thank you for choosing BookMyShow!</p>
                </div>
            </div>
            
            <div class="btn-group">
                <button class="btn" onclick="window.print()">
                    🖨️ Print Ticket
                </button>
                <button class="btn btn-secondary" onclick="window.close()">
                    ❌ Close
                </button>
            </div>
            
            <script>
                // Auto-focus for easy printing
                window.onload = function() {
                    document.querySelector('.btn').focus();
                };
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Store bookings for print function
window.currentBookings = [];

// Initialize
document.addEventListener('DOMContentLoaded', loadBookings);
