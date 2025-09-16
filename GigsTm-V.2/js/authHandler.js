// API base URL
const API_BASE_URL = '/api';
// expose for inline scripts that may check window.API_BASE_URL
window.API_BASE_URL = API_BASE_URL;

// Check if user is logged in
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Handle user login
async function handleLogin(credentials) {
    try {
        if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required');
        }

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: credentials.email.trim().toLowerCase(),
                password: credentials.password
            })
        });

        const data = await response.json().catch(() => ({
            success: false,
            message: 'Invalid server response'
        }));

        if (!response.ok) {
            throw new Error(data.message || 'Invalid credentials');
        }

        if (!data.success) {
            throw new Error(data.message || 'Login failed');
        }

        if (!data.token) {
            throw new Error('No authentication token received');
        }

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('authToken', data.token);
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        return { 
            success: true, 
            data,
            message: data.message || 'Login successful',
            redirect: 'userform.html'
        };
    } catch (error) {
        console.error('Login error:', error);
        return { 
            success: false, 
            message: error.message || 'An error occurred during login. Please try again.'
        };
    }
}

// Handle user registration
async function handleRegister(userData) {
    try {
        // Validate required fields
        if (!userData.fullName || !userData.email || !userData.password) {
            throw new Error('Please provide full name, email, and password');
        }

        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                fullName: userData.fullName.trim(),
                email: userData.email.trim().toLowerCase(),
                phoneNumber: userData.phoneNumber?.trim(),
                password: userData.password
            })
        });

        const data = await response.json().catch(() => ({
            success: false,
            message: 'Invalid server response'
        }));

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        if (!data.success) {
            throw new Error(data.message || 'Registration failed');
        }

        if (!data.token) {
            throw new Error('No authentication token received');
        }

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('authToken', data.token);
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        return { 
            success: true, 
            data,
            message: 'Account created successfully'
        };
    } catch (error) {
        console.error('Registration error:', error);
        return { 
            success: false, 
            message: error.message || 'An error occurred during registration' 
        };
    }
}

// Handle user logout
async function handleLogout() {
    try {
        // Call logout endpoint to clear server-side cookie
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (token) {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error('Logout API call failed:', error);
        // Continue with local cleanup even if API call fails
    }
    
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Update UI based on auth state
function updateAuthUI() {
    const user = getCurrentUser();
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const userInfo = document.getElementById('user-info');
    const userGreeting = document.getElementById('user-greeting');

    if (user) {
        if (userGreeting) {
            userGreeting.textContent = `Hello, ${user.fullName || user.name || user.email}`;
        }
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'block';
        if (userInfo) userInfo.style.display = 'block';
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
        if (userInfo) userInfo.style.display = 'none';
    }
}

// Initialize auth state when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a protected page
    const protectedPages = ['userform.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update UI
    updateAuthUI();
    
    // Add logout handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Expose a namespaced API to avoid collisions with inline handlers
window.Auth = {
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated,
    requireAuth,
    getCurrentUser,
    updateAuthUI
};
