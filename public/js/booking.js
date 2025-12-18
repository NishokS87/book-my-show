// Check authentication
if (!requireAuth()) {
    // requireAuth will redirect to login if not authenticated
}

let currentShow = null;
let selectedSeats = [];

// Get show ID from URL
const urlParams = new URLSearchParams(window.location.search);
const showId = urlParams.get('showId');

// Load show details
async function loadShowDetails() {
    if (!showId) {
        alert('No show selected');
        window.location.href = 'index.html';
        return;
    }
    
    const seatsGrid = document.getElementById('seatsGrid');
    
    try {
        const response = await fetch(API_ENDPOINTS.SHOW_DETAILS(showId), {
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        console.log('Show details response:', data);
        
        if (response.ok && data.status === 'success') {
            currentShow = data.data;
            displayShowInfo(currentShow);
            displaySeats(currentShow);
        } else {
            alert(data.message || 'Show not found');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error loading show:', error);
        seatsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading show details. Please try again.</p>
            </div>
        `;
    }
}

// Display show info
function displayShowInfo(show) {
    const showInfo = document.getElementById('showInfo');
    const showDate = new Date(show.showDate);
    const dateStr = showDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const availableSeats = show.availableSeats?.filter(s => s.status === 'available').length || 0;
    const bookedSeats = show.bookedSeats || 0;
    const totalSeats = show.totalSeats || show.availableSeats?.length || 0;
    
    showInfo.innerHTML = `
        <h2>${show.movie.title}</h2>
        <div class="show-info-meta">
            <span><i class="fas fa-building"></i> ${show.theater.name}</span>
            <span><i class="fas fa-calendar"></i> ${dateStr}</span>
            <span style="font-weight: 600; font-size: 18px; color: #f84464;"><i class="fas fa-clock"></i> ${show.showTime}</span>
            <span><i class="fas fa-film"></i> ${show.format}</span>
            <span style="color: ${availableSeats > 20 ? '#28a745' : availableSeats > 10 ? '#ffc107' : '#dc3545'};"><i class="fas fa-couch"></i> ${availableSeats} Available / ${totalSeats} Total</span>
            <span style="color: #666;"><i class="fas fa-check-circle"></i> ${bookedSeats} Booked</span>
        </div>
    `;
}

// Display seats
function displaySeats(show) {
    const seatsGrid = document.getElementById('seatsGrid');
    
    if (!show.availableSeats || show.availableSeats.length === 0) {
        seatsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-couch"></i>
                <p>No seats available for this show</p>
            </div>
        `;
        return;
    }
    
    // Group seats by row
    const seatsByRow = {};
    show.availableSeats.forEach(seat => {
        if (!seatsByRow[seat.row]) {
            seatsByRow[seat.row] = [];
        }
        seatsByRow[seat.row].push(seat);
    });
    
    // Sort rows alphabetically
    const rows = Object.keys(seatsByRow).sort();
    
    seatsGrid.innerHTML = rows.map(row => {
        const seats = seatsByRow[row].sort((a, b) => a.number - b.number);
        return `
            <div class="seat-row">
                <span class="row-label">${row}</span>
                ${seats.map(seat => {
                    // Find pricing for this seat type
                    const seatType = seat.seatType || seat.type;
                    const pricing = show.pricing?.find(p => p.seatType === seatType) || show.pricing?.[0] || { price: 0 };
                    return `
                        <div class="seat ${seat.status}" 
                             data-seat-id="${seat._id}"
                             data-row="${seat.row}"
                             data-number="${seat.number}"
                             data-type="${seatType}"
                             data-price="${pricing.price}"
                             onclick="toggleSeat(this)">
                            ${seat.number}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }).join('');
}

// Toggle seat selection
function toggleSeat(seatElement) {
    const status = seatElement.classList.contains('booked') ? 'booked' : 
                   seatElement.classList.contains('selected') ? 'selected' : 'available';
    
    if (status === 'booked') {
        alert('❌ This seat is already booked!\n\nPlease select a different seat.');
        return; // Can't select booked seats
    }
    
    const seatId = seatElement.dataset.seatId;
    const row = seatElement.dataset.row;
    const number = parseInt(seatElement.dataset.number);
    const type = seatElement.dataset.type;
    const price = parseFloat(seatElement.dataset.price);
    
    if (status === 'selected') {
        // Deselect
        seatElement.classList.remove('selected');
        seatElement.classList.add('available');
        selectedSeats = selectedSeats.filter(s => s.seatId !== seatId);
    } else {
        // Select
        seatElement.classList.remove('available');
        seatElement.classList.add('selected');
        selectedSeats.push({ seatId, row, number, type, price });
    }
    
    updateBookingSummary();
}

// Update booking summary
function updateBookingSummary() {
    const summaryDiv = document.getElementById('bookingSummary');
    const selectedSeatsInfo = document.getElementById('selectedSeatsInfo');
    const totalAmount = document.getElementById('totalAmount');
    
    if (selectedSeats.length === 0) {
        summaryDiv.style.display = 'none';
        return;
    }
    
    summaryDiv.style.display = 'block';
    
    // Display selected seats
    const seatsList = selectedSeats.map(s => `${s.row}${s.number} (${s.type})`).join(', ');
    selectedSeatsInfo.textContent = `${selectedSeats.length} seat(s): ${seatsList}`;
    
    // Calculate total amount
    const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    totalAmount.textContent = `₹${total.toFixed(2)}`;
}

// Show payment modal
function showPaymentModal(booking) {
    const modal = document.getElementById('paymentModal');
    const bookingCode = document.getElementById('bookingCode');
    const paymentAmount = document.getElementById('paymentAmount');
    
    modal.dataset.bookingId = booking._id;
    bookingCode.textContent = booking.bookingCode;
    paymentAmount.textContent = `₹${booking.totalAmount.toFixed(2)}`;
    
    modal.style.display = 'flex';
}

// Close payment modal
const closeModal = document.getElementById('closeModal');
if (closeModal) {
    closeModal.addEventListener('click', () => {
        const modal = document.getElementById('paymentModal');
        modal.style.display = 'none';
    });
}

// Proceed to booking button
const proceedBtn = document.getElementById('proceedBtn');
if (proceedBtn) {
    proceedBtn.addEventListener('click', async () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }
        
        const btnText = document.getElementById('btnText');
        const btnLoader = document.getElementById('btnLoader');
        
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        
        try {
            console.log('Creating booking with seats:', selectedSeats.map(s => s.seatId));
            
            // Create booking
            const response = await fetch(API_ENDPOINTS.BOOKINGS, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    show: showId,
                    seats: selectedSeats.map(s => s.seatId)
                })
            });
            
            const data = await response.json();
            
            console.log('Booking response:', data);
            
            if (response.ok && data.status === 'success') {
                const booking = data.booking || data.data;
                showPaymentModal(booking);
            } else {
                // Show detailed error message
                const errorMsg = data.message || 'Booking failed. Please try again.';
                alert('❌ Booking Failed\n\n' + errorMsg + '\n\nThe page will refresh to show updated seat availability.');
                // Reload show to get updated seat availability
                window.location.reload();
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Error creating booking. Please check your connection and try again.');
        } finally {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });
}
// Confirm payment button
const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener('click', async () => {
        const modal = document.getElementById('paymentModal');
        const bookingId = modal.dataset.bookingId;
        const payBtnText = document.getElementById('payBtnText');
        const payBtnLoader = document.getElementById('payBtnLoader');
        
        payBtnText.style.display = 'none';
        payBtnLoader.style.display = 'inline-block';
        
        try {
            console.log('Confirming payment for booking:', bookingId);
            
            const response = await fetch(API_ENDPOINTS.CONFIRM_PAYMENT, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    bookingId,
                    paymentIntentId: 'demo_payment_' + Date.now()
                })
            });
            
            const data = await response.json();
            
            console.log('Payment response:', data);
            
            if (response.ok && data.status === 'success') {
                const booking = data.booking || data.data;
                const seatsList = booking.seats.map(s => `${s.row}${s.number}`).join(', ');
                alert(`✅ Booking Confirmed Successfully!\n\n` +
                      `Booking Code: ${booking.bookingCode}\n` +
                      `Seats: ${seatsList}\n` +
                      `Total Amount: ₹${booking.totalAmount}\n\n` +
                      `You can view your booking in "My Bookings"`);
                window.location.href = 'my-bookings.html';
            } else {
                alert('❌ Payment Failed\n\n' + (data.message || 'Please try again.'));
            }
        } catch (error) {
            console.error('Error confirming payment:', error);
            alert('Payment error. Please try again.');
        } finally {
            payBtnText.style.display = 'inline';
            payBtnLoader.style.display = 'none';
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', loadShowDetails);
