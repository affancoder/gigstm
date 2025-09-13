// API configuration
const ORIGIN = window.location.origin;
const BASE_URL = (window.API_BASE_URL) 
    ? window.API_BASE_URL 
    : (ORIGIN && ORIGIN.startsWith('http') ? ORIGIN + '/api' : '/api');

// Helper function to format date to YYYY-MM-DD
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Function to show messages to the user
function showMessage(message, type = 'error', containerId = 'message-container') {
    const messageDiv = document.getElementById(containerId);
    if (!messageDiv) {
        console.log(`Message container '${containerId}' not found`);
        return;
    }
    
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Helper function to get form data
function getFormData() {
    return {
        personalInfo: {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            mobile: document.getElementById('mobile')?.value || '',
            jobRole: document.getElementById('job-role')?.value || '',
            gender: document.getElementById('gender')?.value || '',
            dob: document.getElementById('dob')?.value || ''
        },
        documents: {
            aadhaar: document.getElementById('aadhaar')?.value || '',
            pan: document.getElementById('pan')?.value || ''
        },
        address: {
            street: document.getElementById('address')?.value || '',
            city: document.getElementById('city')?.value || '',
            state: document.getElementById('state')?.value || '',
            country: document.getElementById('country')?.value || '',
            pincode: document.getElementById('pincode')?.value || ''
        },
        about: document.getElementById('about')?.value || ''
    };
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = document.getElementById('profile-form');
    const submitBtn = document.getElementById('submit-btn');
    if (!submitBtn) {
        console.error('Submit button not found');
        return;
    }
    
    const originalBtnText = submitBtn.innerHTML;
    
    try {
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        
        // Get form data
        const formData = getFormData();
        
        // Get auth token
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Authentication required. Please log in again.');
        }

        // Send data to server
        const response = await fetch(`${BASE_URL}/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
                localStorage.removeItem('authToken');
                window.location.href = 'index.html';
                return;
            }
            throw new Error(result.message || 'Failed to save profile');
        }

        // Show success message
        showMessage('Profile saved successfully!', 'success');
        
        // Store profile data in localStorage for offline access
        localStorage.setItem('userProfile', JSON.stringify(result.data));
    } catch (error) {
        console.error('Error saving profile:', error);
        showMessage(error.message || 'Failed to save profile. Please try again.', 'error');
    } finally {
        // Re-enable submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
}

// Populate form fields with profile data
function populateForm(profileData) {
    if (!profileData) return;
    
    // Personal Info
    if (profileData.personalInfo) {
        const { name, email, mobile, jobRole, gender, dob } = profileData.personalInfo;
        if (name) document.getElementById('name').value = name;
        if (email) document.getElementById('email').value = email;
        if (mobile) document.getElementById('mobile').value = mobile;
        if (jobRole) document.getElementById('job-role').value = jobRole;
        if (gender) document.getElementById('gender').value = gender;
        if (dob) document.getElementById('dob').value = formatDate(dob);
    }
    
    // Documents
    if (profileData.documents) {
        const { aadhaar, pan } = profileData.documents;
        if (aadhaar) document.getElementById('aadhaar').value = aadhaar;
        if (pan) document.getElementById('pan').value = pan;
    }
    
    // Address
    if (profileData.address) {
        const { street, city, state, country, pincode } = profileData.address;
        if (street) document.getElementById('address').value = street;
        if (city) document.getElementById('city').value = city;
        if (state) document.getElementById('state').value = state;
        if (country) document.getElementById('country').value = country;
        if (pincode) document.getElementById('pincode').value = pincode;
    }
    
    // About
    if (profileData.about) {
        document.getElementById('about').value = profileData.about;
    }
}

// Load user profile data
async function loadUserProfile() {
    try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }

        // Try to load from localStorage first for instant display
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            const data = JSON.parse(savedProfile);
            populateForm(data);
        }

        // Then fetch from server to get latest data
        const response = await fetch(`${BASE_URL}/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
                localStorage.removeItem('authToken');
                window.location.href = 'index.html';
                return;
            }
            throw new Error('Failed to load profile');
        }

        const result = await response.json();
        if (result.data) {
            populateForm(result.data);
            // Update localStorage with fresh data
            localStorage.setItem('userProfile', JSON.stringify(result.data));
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        // showMessage('Failed to load profile data', 'error');
    }
}

// Initialize the form when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Set up form submission
        const form = document.getElementById('profile-form');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }
        
        // Set up file input previews
        setupFileInputs();
        
        // Load profile data
        await loadUserProfile();
        
        // Set up logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('userProfile');
                window.location.href = 'login.html';
            });
        }
    } catch (error) {
        console.error('Initialization error:', error);
        showMessage('Failed to initialize the application. Please refresh the page.', 'error');
    }
});

// Set up file input previews
function setupFileInputs() {
    // Aadhaar file input
    const aadhaarFileInput = document.getElementById('aadhaar-file');
    const aadhaarFileName = document.getElementById('aadhaar-file-name');
    const aadhaarPreview = document.getElementById('aadhaar-preview');
    
    if (aadhaarFileInput && aadhaarFileName) {
        aadhaarFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                aadhaarFileName.textContent = file.name;
                
                // Show preview for images
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        aadhaarPreview.src = e.target.result;
                        aadhaarPreview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                } else {
                    aadhaarPreview.style.display = 'none';
                }
            }
        });
    }
    
    // Add similar setup for other file inputs (pan, profile photo, etc.)
    const panFileInput = document.getElementById('pan-file');
    const panFileName = document.getElementById('pan-file-name');
    const panPreview = document.getElementById('pan-preview');
    
    if (panFileInput && panFileName) {
        panFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                panFileName.textContent = file.name;
                
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        panPreview.src = e.target.result;
                        panPreview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                } else {
                    panPreview.style.display = 'none';
                }
            }
        });
    }
}
