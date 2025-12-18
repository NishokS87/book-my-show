// Check if user is admin
if (!isLoggedIn() || getUser().role !== 'admin') {
    alert('Access denied. Admin only!');
    window.location.href = 'index.html';
}

// Display user name
document.getElementById('userName').textContent = `Admin: ${getUser().name}`;

// Tab switching
function switchTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab
    event.target.classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

// Load statistics
async function loadStats() {
    try {
        const token = getToken();
        
        // Fetch all data
        const [moviesRes, theatersRes, bookingsRes, usersRes] = await Promise.all([
            fetch(API_ENDPOINTS.MOVIES, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(API_ENDPOINTS.THEATERS, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(API_ENDPOINTS.MY_BOOKINGS, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(API_ENDPOINTS.USERS, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const movies = await moviesRes.json();
        const theaters = await theatersRes.json();
        const bookings = await bookingsRes.json();
        const users = await usersRes.json();

        document.getElementById('totalMovies').textContent = movies.data?.length || 0;
        document.getElementById('totalTheaters').textContent = theaters.data?.length || 0;
        document.getElementById('totalBookings').textContent = bookings.data?.length || 0;
        document.getElementById('totalUsers').textContent = users.data?.length || 0;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Add Movie
document.getElementById('addMovieForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const movieData = {
        title: formData.get('title'),
        director: formData.get('director'),
        language: formData.get('language'),
        duration: parseInt(formData.get('duration')),
        rating: parseFloat(formData.get('rating')),
        releaseDate: formData.get('releaseDate'),
        description: formData.get('description'),
        cast: formData.get('cast').split(',').map(c => c.trim()),
        genre: formData.get('genre').split(',').map(g => g.trim()),
        isActive: true
    };

    try {
        const response = await fetch(API_ENDPOINTS.MOVIES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(movieData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('Movie added successfully!');
            e.target.reset();
            loadMovies();
            loadStats();
        } else {
            alert(data.message || 'Failed to add movie');
        }
    } catch (error) {
        console.error('Error adding movie:', error);
        alert('Error adding movie');
    }
});

// Load Movies
async function loadMovies() {
    try {
        const response = await fetch(API_ENDPOINTS.MOVIES);
        const data = await response.json();

        const tbody = document.getElementById('moviesTableBody');
        
        if (data.data && data.data.length > 0) {
            tbody.innerHTML = data.data.map(movie => `
                <tr>
                    <td>${movie.title}</td>
                    <td>${movie.language}</td>
                    <td>${movie.duration} mins</td>
                    <td>${movie.rating}/10</td>
                    <td>
                        <span style="color: ${movie.isActive ? 'green' : 'red'}">
                            ${movie.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                    <td>
                        <button class="action-btn btn-edit" onclick="editMovie('${movie._id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn btn-delete" onclick="deleteMovie('${movie._id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No movies found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

// Delete Movie
async function deleteMovie(id) {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    try {
        const response = await fetch(`${API_ENDPOINTS.MOVIES}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (response.ok) {
            alert('Movie deleted successfully!');
            loadMovies();
            loadStats();
        } else {
            alert('Failed to delete movie');
        }
    } catch (error) {
        console.error('Error deleting movie:', error);
        alert('Error deleting movie');
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
            alert('Theater added successfully!');
            e.target.reset();
            loadTheaters();
            loadStats();
        } else {
            alert(data.message || 'Failed to add theater');
        }
    } catch (error) {
        console.error('Error adding theater:', error);
        alert('Error adding theater');
    }
});

// Load Theaters
async function loadTheaters() {
    try {
        const response = await fetch(API_ENDPOINTS.THEATERS);
        const data = await response.json();

        const tbody = document.getElementById('theatersTableBody');
        
        if (data.data && data.data.length > 0) {
            tbody.innerHTML = data.data.map(theater => `
                <tr>
                    <td>${theater.name}</td>
                    <td>${theater.location?.city || 'N/A'}</td>
                    <td>${theater.location?.area || 'N/A'}</td>
                    <td>${theater.screens?.length || 0}</td>
                    <td>
                        <button class="action-btn btn-delete" onclick="deleteTheater('${theater._id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No theaters found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading theaters:', error);
    }
}

// Delete Theater
async function deleteTheater(id) {
    if (!confirm('Are you sure you want to delete this theater?')) return;

    try {
        const response = await fetch(`${API_ENDPOINTS.THEATERS}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (response.ok) {
            alert('Theater deleted successfully!');
            loadTheaters();
            loadStats();
        } else {
            alert('Failed to delete theater');
        }
    } catch (error) {
        console.error('Error deleting theater:', error);
        alert('Error deleting theater');
    }
}

// Load Users
async function loadUsers() {
    try {
        const response = await fetch(API_ENDPOINTS.USERS, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const data = await response.json();

        const tbody = document.getElementById('usersTableBody');
        
        if (data.data && data.data.length > 0) {
            tbody.innerHTML = data.data.map(user => `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>
                        <span style="padding: 5px 10px; border-radius: 20px; background: ${
                            user.role === 'admin' ? '#f84464' : 
                            user.role === 'theater-owner' ? '#667eea' : '#28a745'
                        }; color: white; font-size: 12px;">
                            ${user.role.toUpperCase()}
                        </span>
                    </td>
                    <td>
                        <span style="color: ${user.isActive ? 'green' : 'red'}">
                            ${user.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No users found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadMovies();
    loadTheaters();
    loadUsers();
});
