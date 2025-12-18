// Check if user is theater owner
if (!isLoggedIn() || getUser().role !== 'theater-owner') {
    alert('Access denied. Theater owners only!');
    window.location.href = 'index.html';
}

// Display user name
document.getElementById('userName').textContent = `Theater Owner: ${getUser().name}`;

let myTheaters = [];
let allMovies = [];
let myShows = [];

// Load statistics
async function loadStats() {
    try {
        const token = getToken();
        
        const [theatersRes, showsRes] = await Promise.all([
            fetch(API_ENDPOINTS.THEATERS, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(API_ENDPOINTS.SHOWS, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const theaters = await theatersRes.json();
        const shows = await showsRes.json();

        myTheaters = theaters.data || [];
        myShows = shows.data || [];

        document.getElementById('totalTheaters').textContent = myTheaters.length;
        document.getElementById('totalShows').textContent = myShows.length;
        
        // Count total bookings from shows
        const totalBookings = myShows.reduce((sum, show) => {
            const bookedSeats = show.availableSeats?.filter(s => s.status === 'booked').length || 0;
            return sum + bookedSeats;
        }, 0);
        document.getElementById('totalBookings').textContent = totalBookings;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load movies for dropdown
async function loadMovies() {
    try {
        const response = await fetch(API_ENDPOINTS.MOVIES);
        const data = await response.json();
        allMovies = data.data || [];

        const select = document.getElementById('movieSelect');
        select.innerHTML = '<option value="">Select a movie</option>' + 
            allMovies.map(movie => `
                <option value="${movie._id}">${movie.title} (${movie.language})</option>
            `).join('');
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

// Load theaters for dropdown
async function loadTheatersList() {
    try {
        const response = await fetch(API_ENDPOINTS.THEATERS, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await response.json();
        myTheaters = data.data || [];

        const select = document.getElementById('theaterSelect');
        select.innerHTML = '<option value="">Select a theater</option>' + 
            myTheaters.map(theater => `
                <option value="${theater._id}">${theater.name} - ${theater.location?.city}</option>
            `).join('');
    } catch (error) {
        console.error('Error loading theaters:', error);
    }
}

// Add Theater
document.getElementById('addTheaterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const theaterData = {
        name: formData.get('name'),
        location: {
            city: formData.get('city'),
            area: formData.get('area'),
            address: formData.get('address'),
            pincode: formData.get('pincode')
        },
        screens: [
            {
                screenNumber: 1,
                screenName: 'Screen 1',
                totalSeats: 100,
                seatLayout: {
                    rows: 10,
                    seatsPerRow: 10
                }
            }
        ]
    };

    try {
        const response = await fetch(API_ENDPOINTS.THEATERS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(theaterData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('✅ Theater added successfully!');
            e.target.reset();
            loadStats();
            loadTheatersList();
        } else {
            alert('❌ ' + (data.message || 'Failed to add theater'));
        }
    } catch (error) {
        console.error('Error adding theater:', error);
        alert('❌ Error adding theater');
    }
});

// Add Show
document.getElementById('addShowForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Combine date and time
    const showDate = new Date(formData.get('showDate'));
    const [hours, minutes] = formData.get('showTime').split(':');
    showDate.setHours(parseInt(hours), parseInt(minutes), 0);

    const totalSeats = parseInt(formData.get('totalSeats'));
    const premiumCount = Math.floor(totalSeats * 0.3);
    const goldCount = Math.floor(totalSeats * 0.4);
    const silverCount = totalSeats - premiumCount - goldCount;

    // Generate seat layout
    const availableSeats = [];
    const pricing = [];

    // Premium seats
    for (let i = 1; i <= premiumCount; i++) {
        availableSeats.push({
            seatNumber: `P${i}`,
            type: 'premium',
            status: 'available'
        });
    }
    pricing.push({
        seatType: 'premium',
        price: parseInt(formData.get('premiumPrice'))
    });

    // Gold seats
    for (let i = 1; i <= goldCount; i++) {
        availableSeats.push({
            seatNumber: `G${i}`,
            type: 'gold',
            status: 'available'
        });
    }
    pricing.push({
        seatType: 'gold',
        price: parseInt(formData.get('goldPrice'))
    });

    // Silver seats
    for (let i = 1; i <= silverCount; i++) {
        availableSeats.push({
            seatNumber: `S${i}`,
            type: 'silver',
            status: 'available'
        });
    }
    pricing.push({
        seatType: 'silver',
        price: parseInt(formData.get('silverPrice'))
    });

    const showData = {
        movie: formData.get('movieId'),
        theater: formData.get('theaterId'),
        showTime: showDate.toISOString(),
        format: formData.get('format'),
        totalSeats: totalSeats,
        availableSeats: availableSeats,
        pricing: pricing,
        isActive: true
    };

    try {
        const response = await fetch(API_ENDPOINTS.SHOWS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(showData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('✅ Show added successfully!');
            e.target.reset();
            loadStats();
            loadShows();
        } else {
            alert('❌ ' + (data.message || 'Failed to add show'));
        }
    } catch (error) {
        console.error('Error adding show:', error);
        alert('❌ Error adding show');
    }
});

// Load Shows
async function loadShows() {
    try {
        const response = await fetch(API_ENDPOINTS.SHOWS, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await response.json();

        const tbody = document.getElementById('showsTableBody');
        
        if (data.data && data.data.length > 0) {
            myShows = data.data;
            tbody.innerHTML = data.data.map(show => {
                const availableCount = show.availableSeats?.filter(s => s.status === 'available').length || 0;
                const showTime = new Date(show.showTime);
                const isPast = showTime < new Date();
                
                return `
                    <tr>
                        <td>${show.movie?.title || 'N/A'}</td>
                        <td>${show.theater?.name || 'N/A'}</td>
                        <td>${showTime.toLocaleString('en-IN', { 
                            dateStyle: 'medium', 
                            timeStyle: 'short' 
                        })}</td>
                        <td><span style="background: #667eea; color: white; padding: 3px 8px; border-radius: 3px;">${show.format}</span></td>
                        <td>${availableCount}/${show.totalSeats}</td>
                        <td>
                            <span style="color: ${isPast ? 'red' : 'green'}">
                                ${isPast ? 'Completed' : 'Active'}
                            </span>
                        </td>
                        <td>
                            <button class="action-btn btn-delete" onclick="deleteShow('${show._id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No shows found. Add your first show above!</td></tr>';
        }
    } catch (error) {
        console.error('Error loading shows:', error);
    }
}

// Delete Show
async function deleteShow(id) {
    if (!confirm('Are you sure you want to delete this show?')) return;

    try {
        const response = await fetch(`${API_ENDPOINTS.SHOWS}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (response.ok) {
            alert('✅ Show deleted successfully!');
            loadStats();
            loadShows();
        } else {
            alert('❌ Failed to delete show');
        }
    } catch (error) {
        console.error('Error deleting show:', error);
        alert('❌ Error deleting show');
    }
}

// Set minimum date to today
document.querySelector('[name="showDate"]').min = new Date().toISOString().split('T')[0];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadMovies();
    loadTheatersList();
    loadShows();
});
