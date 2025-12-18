let currentMovie = null;
let currentShows = [];

// Get movie ID from URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

console.log('Movie ID from URL:', movieId);

// Load movie details
async function loadMovieDetails() {
    if (!movieId) {
        console.error('No movie ID provided');
        alert('No movie selected');
        window.location.href = 'index.html';
        return;
    }
    
    const detailsContainer = document.getElementById('movieDetails');
    
    try {
        console.log('Fetching movie details for ID:', movieId);
        const response = await fetch(`${API_ENDPOINTS.MOVIES}/${movieId}`);
        const data = await response.json();
        
        console.log('Movie API Response:', data);
        
        if (response.ok && data.status === 'success') {
            currentMovie = data.data;
            console.log('Movie loaded:', currentMovie.title);
            displayMovieDetails(currentMovie);
            loadShows();
        } else {
            console.error('Movie not found:', data);
            detailsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${data.message || 'Movie not found'}</p>
                    <p><a href="index.html" style="color: #f84464; text-decoration: underline;">← Back to Movies</a></p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading movie:', error);
        detailsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading movie details</p>
                <p>Error: ${error.message}</p>
                <p><a href="index.html" style="color: #f84464; text-decoration: underline;">← Back to Movies</a></p>
            </div>
        `;
    }
}

// Display movie details
function displayMovieDetails(movie) {
    console.log('Displaying movie details:', movie);
    const detailsContainer = document.getElementById('movieDetails');
    
    detailsContainer.innerHTML = `
        <div class="movie-banner">
            <div class="container">
                <div class="banner-poster">
                    <i class="fas fa-film"></i>
                </div>
                <div class="banner-info">
                    <h1>${movie.title}</h1>
                    <div class="banner-meta">
                        <div class="meta-item">
                            <i class="fas fa-star"></i>
                            <span>${movie.rating}/10</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${movie.duration} mins</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-language"></i>
                            <span>${movie.language}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-tag"></i>
                            <span>${movie.genre.join(', ')}</span>
                        </div>
                    </div>
                    <p>${movie.description}</p>
                    <div class="cast-list">
                        <strong>Cast:</strong> ${movie.cast.join(', ')}
                    </div>
                    <div class="cast-list">
                        <strong>Director:</strong> ${movie.director}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Load shows for movie
async function loadShows() {
    console.log('Loading shows for movie:', movieId);
    document.getElementById('showsSection').style.display = 'block';
    const showsList = document.getElementById('showsList');
    showsList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>Loading shows...</p></div>';
    
    try {
        const url = API_ENDPOINTS.SHOWS_BY_MOVIE(movieId);
        console.log('Fetching shows from:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('Shows API Response:', data);
        
        if (response.ok && data.status === 'success') {
            currentShows = data.data || [];
            console.log('Shows loaded:', currentShows.length);
            displayShows(currentShows);
        } else {
            console.error('Failed to load shows:', data);
            showsList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-calendar-times"></i>
                    <p>${data.message || 'No shows available for this movie'}</p>
                    <p style="color: #666; font-size: 14px; margin-top: 10px;">Check back later for new shows!</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading shows:', error);
        showsList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading shows</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}

// Display shows grouped by theater
function displayShows(shows) {
    console.log('Displaying shows:', shows);
    const showsList = document.getElementById('showsList');
    
    if (!shows || shows.length === 0) {
        showsList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-calendar-times"></i>
                <p>No shows available for this movie at the moment</p>
                <p style="color: #666; font-size: 14px; margin-top: 10px;">Please check back later for show times!</p>
            </div>
        `;
        return;
    }
    
    // Group shows by theater
    const groupedShows = {};
    shows.forEach(show => {
        const theaterName = show.theater?.name || 'Unknown Theater';
        const theaterLocation = show.theater?.location || '';
        const theaterKey = `${theaterName}|${theaterLocation}`;
        
        if (!groupedShows[theaterKey]) {
            groupedShows[theaterKey] = {
                name: theaterName,
                location: theaterLocation,
                shows: []
            };
        }
        groupedShows[theaterKey].shows.push(show);
    });
    
    console.log('Grouped shows by theater:', groupedShows);
    
    showsList.innerHTML = Object.values(groupedShows).map(theater => `
        <div class="theater-group">
            <div class="theater-name">
                <i class="fas fa-building"></i> ${theater.name}
                ${theater.location ? `<span style="color: #666; font-size: 14px; margin-left: 10px;">${theater.location}</span>` : ''}
            </div>
            <div class="shows-grid">
                ${theater.shows.map(show => {
                    const availableCount = show.availableSeats?.filter(s => s.status === 'available').length || 0;
                    const totalSeats = show.totalSeats || show.availableSeats?.length || 0;
                    const showDate = new Date(show.showTime);
                    const timeStr = showDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                    const dateStr = showDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    
                    return `
                        <div class="show-time-card" onclick="selectShow('${show._id}')">
                            <div class="show-time">${timeStr}</div>
                            <div class="show-format">${show.format}</div>
                            <div class="show-format" style="font-size: 11px; color: #999;">${dateStr}</div>
                            <div class="seats-available" style="color: ${availableCount > 20 ? '#28a745' : availableCount > 10 ? '#ffc107' : '#dc3545'}">
                                <i class="fas fa-couch"></i> ${availableCount}/${totalSeats}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `).join('');
}

// Select show
function selectShow(showId) {
    console.log('Show selected:', showId);
    
    if (!isLoggedIn()) {
        console.log('User not logged in, redirecting to login');
        alert('Please login to book tickets');
        // Store the intended destination
        localStorage.setItem('redirectAfterLogin', `booking.html?showId=${showId}`);
        window.location.href = 'login.html';
        return;
    }
    
    console.log('Navigating to booking page');
    window.location.href = `booking.html?showId=${showId}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, loading movie details');
    loadMovieDetails();
});
