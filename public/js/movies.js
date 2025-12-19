let allMovies = [];

// Load movies
async function loadMovies() {
    const moviesGrid = document.getElementById('moviesGrid');
    
    if (!moviesGrid) {
        console.error('Movies grid element not found!');
        return;
    }
    
    // Show loading
    moviesGrid.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading movies...</p>
        </div>
    `;
    
    console.log('Loading movies from:', API_ENDPOINTS.MOVIES);
    
    try {
        const response = await fetch(API_ENDPOINTS.MOVIES, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.status === 'success') {
            // Handle both response formats: data.data or data.movies
            allMovies = Array.isArray(data.data) ? data.data : (data.movies || []);
            console.log('✅ Loaded movies:', allMovies.length);
            
            if (allMovies.length === 0) {
                moviesGrid.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-film"></i>
                        <p>No movies in database</p>
                        <p>Seed database: POST /api/fullseed</p>
                    </div>
                `;
            } else {
                displayMovies(allMovies);
            }
        } else {
            console.error('❌ Failed to load movies:', data);
            moviesGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load movies: ${data.message || 'Unknown error'}</p>
                    <p><a href="javascript:location.reload()">Reload Page</a></p>
                </div>
            `;
        }
    } catch (error) {
        console.error('❌ Error loading movies:', error);
        moviesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error connecting to server</p>
                <p>${error.message}</p>
                <p>Make sure server is running on port 5001</p>
                <p><a href="javascript:location.reload()">Reload Page</a></p>
            </div>
        `;
    }
}

// Display movies
function displayMovies(movies) {
    const moviesGrid = document.getElementById('moviesGrid');
    
    if (!movies || movies.length === 0) {
        moviesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-film"></i>
                <p>No movies found</p>
            </div>
        `;
        return;
    }
    
    console.log('Displaying movies:', movies);
    
    moviesGrid.innerHTML = movies.map(movie => {
        const genre = Array.isArray(movie.genre) ? movie.genre.join(', ') : (movie.genre || 'General');
        const rating = movie.rating || 'N/A';
        const language = movie.language || 'Unknown';
        const title = movie.title || 'Untitled';
        
        return `
            <div class="movie-card" onclick="viewMovie('${movie._id}')">
                <div class="movie-poster">
                    ${movie.posterUrl ? `<img src="${movie.posterUrl}" alt="${title}">` : '<i class="fas fa-film"></i>'}
                </div>
                <div class="movie-info">
                    <h3>${title}</h3>
                    <div class="movie-meta">
                        <span class="badge badge-language">${language}</span>
                        <span class="badge badge-rating">
                            <i class="fas fa-star"></i> ${rating}
                        </span>
                    </div>
                    <div class="movie-genre">${genre}</div>
                </div>
            </div>
        `;
    }).join('');
    
    console.log('Movies rendered successfully');
}

// View movie details
function viewMovie(movieId) {
    window.location.href = `movie-details.html?id=${movieId}`;
}

// Search movies
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        console.log('Search query:', query);
        
        if (!query) {
            displayMovies(allMovies);
            return;
        }
        
        const filtered = allMovies.filter(movie => {
            const title = (movie.title || '').toLowerCase();
            const director = (movie.director || '').toLowerCase();
            const cast = Array.isArray(movie.cast) ? movie.cast : [];
            
            return title.includes(query) ||
                   director.includes(query) ||
                   cast.some(actor => (actor || '').toLowerCase().includes(query));
        });
        
        console.log(`Found ${filtered.length} movies matching "${query}"`);
        displayMovies(filtered);
    });
}

// Filter by language
const languageFilter = document.getElementById('languageFilter');
if (languageFilter) {
    languageFilter.addEventListener('change', (e) => {
        const language = e.target.value;
        const genre = document.getElementById('genreFilter')?.value || '';
        filterMovies(language, genre);
    });
}

// Filter by genre
const genreFilter = document.getElementById('genreFilter');
if (genreFilter) {
    genreFilter.addEventListener('change', (e) => {
        const genre = e.target.value;
        const language = document.getElementById('languageFilter')?.value || '';
        filterMovies(language, genre);
    });
}

// Filter movies
function filterMovies(language, genre) {
    let filtered = allMovies;
    
    if (language) {
        filtered = filtered.filter(movie => movie.language === language);
    }
    
    if (genre) {
        filtered = filtered.filter(movie => {
            const genres = Array.isArray(movie.genre) ? movie.genre : [movie.genre];
            return genres.includes(genre);
        });
    }
    
    console.log(`Filtered to ${filtered.length} movies (language: ${language || 'all'}, genre: ${genre || 'all'})`);
    displayMovies(filtered);
}

// Load movies on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI(); // Initialize auth UI
    loadMovies();
});
