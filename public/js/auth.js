// ==========================
// API URL
// ==========================
const API_URL = "https://gigstm-az6v.onrender.com/api";
const TOKEN_KEY = "jwt_token";


// ==========================
// DOM ELEMENTS
// ==========================
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

const signupName = document.getElementById("signup-name");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupConfirmPassword = document.getElementById("signup-confirm-password");


// ==========================
// MESSAGE HANDLER
// ==========================
function showMessage(id, msg, type = "error") {
    const el = document.getElementById(id);
    if (!el) return;

    el.textContent = msg;
    el.className = `auth-message ${type}`;
    el.style.display = "block";

    if (type === "success") {
        setTimeout(() => (el.style.display = "none"), 3000);
    }
}


// ==========================
// LOGIN
// ==========================
async function handleLogin(event) {
    event.preventDefault();

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: loginEmail.value,
                password: loginPassword.value
            })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        localStorage.setItem(TOKEN_KEY, data.token);
        if (data.data?.user)
            localStorage.setItem("user", JSON.stringify(data.data.user));

        window.location.href = "/userform.html";

    } catch (err) {
        showMessage("login-message", err.message);
    }
}


// ==========================
// SIGNUP
// ==========================
async function handleSignUp(event) {
    event.preventDefault();
    
    try {
        // Get form values
        const name = signupName?.value.trim();
        const email = signupEmail?.value.trim().toLowerCase();
        const password = signupPassword?.value;
        const confirmPassword = signupConfirmPassword?.value;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            return showMessage("signup-message", "All fields are required");
        }

        if (password !== confirmPassword) {
            return showMessage("signup-message", "Passwords do not match");
        }

        if (password.length < 8) {
            return showMessage("signup-message", "Password must be at least 8 characters long");
        }

        console.log('Attempting to sign up with:', { name, email });
        
        // Show loading state
        const signupBtn = document.getElementById('signup-btn');
        const originalBtnText = signupBtn.innerHTML;
        signupBtn.disabled = true;
        signupBtn.innerHTML = 'Creating Account...';

        // Make signup request
        const signupResponse = await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                passwordConfirm: confirmPassword
            })
        });

        const signupData = await signupResponse.json();
        console.log('Signup response:', signupData);

        if (!signupResponse.ok) {
            const errorMsg = signupData.message || 'Signup failed. Please try again.';
            if (signupData.errors) {
                const errorDetails = Object.values(signupData.errors).join(' ');
                throw new Error(`${errorMsg} ${errorDetails}`);
            }
            throw new Error(errorMsg);
        }

        // Auto login after successful signup
        console.log('Signup successful, attempting auto-login...');
        const loginResponse = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const loginData = await loginResponse.json();
        console.log('Login response:', loginData);

        if (!loginResponse.ok) {
            throw new Error(loginData.message || 'Auto-login failed. Please login manually.');
        }

        // Store token and redirect
        localStorage.setItem(TOKEN_KEY, loginData.token);
        if (loginData.data?.user) {
            localStorage.setItem("user", JSON.stringify(loginData.data.user));
        }

        window.location.href = "/userform.html";

    } catch (err) {
        console.error('Signup error:', err);
        showMessage("signup-message", err.message || 'An error occurred during signup. Please try again.');
        
        // Reset button state
        const signupBtn = document.getElementById('signup-btn');
        if (signupBtn) {
            signupBtn.disabled = false;
            signupBtn.innerHTML = 'Create Account';
        }
    }
}


// ==========================
// LOGOUT
// ==========================
function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("user");
    window.location.href = "/index.html";
}


// ==========================
// TAB SWITCHING
// ==========================
function showTab(tabName, event) {
    if (event) event.preventDefault();

    document.querySelectorAll(".auth-form").forEach(f => f.style.display = "none");
    document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));

    document.getElementById(`${tabName}-form`).style.display = "block";
    document.querySelector(`.auth-tab[onclick*="${tabName}"]`)?.classList.add("active");
}

window.showTab = showTab;  // FIX showTab not defined


// ==========================
// EVENT LISTENERS
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    if (loginForm) loginForm.addEventListener("submit", handleLogin);
    if (signupForm) signupForm.addEventListener("submit", handleSignUp);

    const logoutBtn = document.getElementById("logout-btn") || document.getElementById("logout-button");
    if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
});

// --------------------------

// // API base URL
// const API_URL = 'http://localhost:3000/api';

// // Store JWT token in localStorage
// const TOKEN_KEY = 'jwt_token';

// // DOM Elements
// const loginForm = document.getElementById('login-form');
// const signupForm = document.getElementById('signup-form');
// const loginEmail = document.getElementById('login-email');
// const loginPassword = document.getElementById('login-password');
// const signupName = document.getElementById('signup-name');
// const signupEmail = document.getElementById('signup-email');
// const signupPassword = document.getElementById('signup-password');
// const signupConfirmPassword = document.getElementById('signup-confirm-password');

// // Show message function
// function showMessage(elementId, message, type = 'error') {
//   const messageElement = document.getElementById(elementId);
//   messageElement.textContent = message;
//   messageElement.className = `auth-message ${type}`;
//   messageElement.style.display = 'block';
  
//   // Auto-hide success messages after 3 seconds
//   if (type === 'success') {
//     setTimeout(() => {
//       messageElement.style.display = 'none';
//     }, 3000);
//   }
// }

// // Handle login form submission
// async function handleLogin(event) {
//   event.preventDefault();
  
//   try {
//     const response = await fetch(`${API_URL}/auth/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email: loginEmail.value,
//         password: loginPassword.value
//       })
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || 'Login failed');
//     }

//     // Store the token and user data in localStorage
//     if (data.token) {
//       localStorage.setItem(TOKEN_KEY, data.token);
//       if (data.data && data.data.user) {
//         localStorage.setItem('user', JSON.stringify(data.data.user));
//       }
//       // Redirect to user form page
//       window.location.href = '/userform.html';
//     }
    
//   } catch (error) {
//     showMessage('login-message', error.message || 'Login failed. Please try again.');
//   }
// }

// // Handle signup form submission
// async function handleSignUp() {
//   // Get form elements directly by their IDs
//   const email = document.getElementById('signup-email')?.value;
//   const name = document.getElementById('signup-name')?.value;
//   const password = document.getElementById('signup-password')?.value;
//   const confirmPassword = document.getElementById('confirm-password')?.value;
//   const signupBtn = document.getElementById('signup-btn');
//   const messageElement = document.getElementById('signup-message');

//   // Basic validation
//   if (!email || !name || !password || !confirmPassword) {
//     showMessage('signup-message', 'Please fill in all fields');
//     return false;
//   }

//   if (password !== confirmPassword) {
//     showMessage('signup-message', 'Passwords do not match');
//     return false;
//   }

//   try {
//     // Show loading state
//     if (signupBtn) {
//       signupBtn.disabled = true;
//       signupBtn.textContent = 'Creating account...';
//     }

//     const response = await fetch(`${API_URL}/auth/signup`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         name,
//         email,
//         password,
//         passwordConfirm: confirmPassword
//       })
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || 'Signup failed');
//     }

//     // Auto-login after successful signup
//     const loginResponse = await fetch(`${API_URL}/auth/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email,
//         password
//       })
//     });

//     const loginData = await loginResponse.json();

//     if (!loginResponse.ok) {
//       throw new Error(loginData.message || 'Auto-login after signup failed');
//     }

//     // Store token and redirect
//     if (loginData.token) {
//       localStorage.setItem(TOKEN_KEY, loginData.token);
//       window.location.href = '/userform.html';
//     }
//     return false; // Prevent form submission

//   } catch (error) {
//     showMessage('signup-message', error.message || 'Signup failed. Please try again.');
//     return false;
//   } finally {
//     // Reset button state
//     if (signupBtn) {
//       signupBtn.disabled = false;
//       signupBtn.textContent = 'Create Account';
//     }
//   }
// }

// // Check if user is logged in
// function checkAuth() {
//   const token = localStorage.getItem(TOKEN_KEY);
//   if (!token) return false;

//   // You can add token validation here if needed
//   // For now, just check if token exists
//   return true;
// }

// // Logout function
// function handleLogout() {
//   // Remove token from localStorage
//   localStorage.removeItem(TOKEN_KEY);
//   localStorage.removeItem('user');
  
//   // Redirect to index page
//   window.location.href = '/index.html';
// }

// // Event Listeners
// document.addEventListener('DOMContentLoaded', () => {
//   // Check authentication status
//   if (checkAuth() && window.location.pathname === '/login.html') {
//     window.location.href = '/';
//   }
  
//   // Add form submission handlers if forms exist
//   if (loginForm) {
//     loginForm.addEventListener('submit', handleLogin);
//   }
  
//   if (signupForm) {
//     signupForm.addEventListener('submit', handleSignUp);
//   }
  
//   // Add logout button handler if it exists
//   const logoutButton = document.getElementById('logout-button');
//   if (logoutButton) {
//     logoutButton.addEventListener('click', handleLogout);
//   }
// });

// // Tab switching functionality
// function showTab(tabName, event) {
//   if (event) event.preventDefault();
  
//   // Hide all forms
//   document.querySelectorAll('.auth-form').forEach(form => {
//     form.style.display = 'none';
//   });
  
//   // Remove active class from all tabs
//   document.querySelectorAll('.auth-tab').forEach(tab => {
//     tab.classList.remove('active');
//   });
  
//   // Show selected form and set active tab
//   document.getElementById(`${tabName}-form`).style.display = 'block';
//   if (event) {
//     event.currentTarget.classList.add('active');
//   } else {
//     document.querySelector(`.auth-tab[onclick*="${tabName}"]`).classList.add('active');
//   }
// }
