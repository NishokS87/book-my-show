// Login functionality
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    
    // Clear previous errors
    errorDiv.textContent = '';
    errorDiv.classList.remove('show');
    
    // Show loading
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    
    try {
        const response = await fetch(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Check for redirect URL
            const redirectUrl = localStorage.getItem('redirectAfterLogin');
            if (redirectUrl) {
                localStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectUrl;
            } else {
                // Default redirect to home page
                window.location.href = 'index.html';
            }
        } else {
            errorDiv.textContent = data.message || 'Login failed';
            errorDiv.classList.add('show');
        }
    } catch (error) {
        errorDiv.textContent = handleError(error);
        errorDiv.classList.add('show');
    } finally {
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});

