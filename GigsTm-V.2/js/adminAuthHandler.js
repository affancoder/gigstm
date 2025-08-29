// API base URL
const API_BASE_URL = '/api/v1';

// Check if user is already logged in
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (token && window.location.pathname.endsWith('admin-login.html')) {
        window.location.href = 'dashboard.html';
    } else if (!token && !window.location.pathname.endsWith('admin-login.html') && 
              !window.location.pathname.includes('admin-login.html')) {
        window.location.href = '/admin-login.html';
    }
}

// Handle login form submission
function handleLoginForm() {
    const loginForm = document.getElementById('adminLoginForm');
    const errorMessage = document.getElementById('login-error');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Basic validation
        if (!email || !password) {
            showError('Please enter both email and password');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...';
        
        try {
            const response = await fetch(`${API_BASE_URL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || 'Login failed. Please check your credentials.');
            }

            // Save token and update UI
            if (data.token) {
                localStorage.setItem('adminToken', data.token);
                // Show success message or update UI as needed
                showSuccess('Login successful!');
            } else {
                throw new Error('No authentication token received');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError(error.message || 'Login failed. Please try again.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('login-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.className = 'error-message';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Show success message
function showSuccess(message) {
    const errorDiv = document.getElementById('login-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.className = 'success-message';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Handle signup form submission
function handleSignupForm() {
    const signupForm = document.getElementById('adminSignupForm');
    if (!signupForm) return;

    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            showError('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }
        
        if (password.length < 8) {
            showError('Password must be at least 8 characters long');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating account...';
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/admin/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed. Please try again.');
            }

            // Save token and update UI
            if (data.token) {
                localStorage.setItem('adminToken', data.token);
                // Show success message or update UI as needed
                showSuccess('Account created successfully!');
            } else {
                throw new Error('Registration successful but no authentication token received');
            }
        } catch (error) {
            console.error('Signup error:', error);
            showError(error.message || 'Registration failed. Please try again.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    // handleLoginForm();
    // handleSignupForm();
});

// Logout function
function adminLogout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'admin-login.html';
}

// Make logout function available globally
window.adminLogout = adminLogout;
