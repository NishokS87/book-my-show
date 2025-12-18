// Auth helpers
function updateAuthUI() {
    const authBtn = document.getElementById('authBtn');
    const myBookingsBtn = document.getElementById('myBookingsBtn');
    
    if (!authBtn) return;
    
    if (isLoggedIn()) {
        const user = getUserInfo();
        authBtn.textContent = user?.name || 'Profile';
        authBtn.onclick = logout;
        
        if (myBookingsBtn) {
            myBookingsBtn.onclick = (e) => {
                e.preventDefault();
                window.location.href = 'my-bookings.html';
            };
        }
    } else {
        authBtn.textContent = 'Sign In';
        authBtn.href = 'login.html';
        
        if (myBookingsBtn) {
            myBookingsBtn.onclick = (e) => {
                e.preventDefault();
                alert('Please login to view your bookings');
                window.location.href = 'login.html';
            };
        }
    }
}

// Update navigation based on auth status
function updateNavigation() {
    const navLinks = document.querySelector('.nav-links');
    
    if (!navLinks) return;
    
    if (isLoggedIn()) {
        const user = getUser();
        let dashboardLink = '';
        
        if (user.role === 'admin') {
            dashboardLink = '<a href="admin-dashboard.html" class="nav-link"><i class="fas fa-user-shield"></i> Admin</a>';
        } else if (user.role === 'theater-owner') {
            dashboardLink = '<a href="theater-owner-dashboard.html" class="nav-link"><i class="fas fa-building"></i> Dashboard</a>';
        } else {
            dashboardLink = '<a href="my-bookings.html" class="nav-link"><i class="fas fa-ticket-alt"></i> My Bookings</a>';
        }
        
        navLinks.innerHTML = `
            <a href="index.html" class="nav-link"><i class="fas fa-home"></i> Home</a>
            ${dashboardLink}
            <span class="user-name"><i class="fas fa-user"></i> ${user.name}</span>
            <button onclick="logout()" class="btn-secondary">Logout</button>
        `;
    } else {
        navLinks.innerHTML = `
            <a href="index.html" class="nav-link"><i class="fas fa-home"></i> Home</a>
            <a href="login.html" class="nav-link">Login</a>
            <a href="register.html" class="btn-primary">Register</a>
        `;
    }
}

// Check auth on protected pages
function requireAuth() {
    if (!isLoggedIn()) {
        alert('Please login to continue');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize auth UI and navigation
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    updateNavigation();
});
