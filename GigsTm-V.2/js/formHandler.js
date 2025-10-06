// API configuration
const ORIGIN = window.location.origin;
const API_PORT = '3001';
const BASE_URL = window.API_BASE_URL || `${ORIGIN.split(':').slice(0, 2).join(':')}:${API_PORT}/api`;

// Constants
const VALIDATION_PATTERNS = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    mobile: /^[0-9]{10}$/,
    aadhaar: /^\d{12}$/,
    pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    pincode: /^\d{6}$/
};

const MESSAGE_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

const AUTO_DISMISS_DELAYS = {
    [MESSAGE_TYPES.ERROR]: 10000,
    [MESSAGE_TYPES.WARNING]: 8000,
    [MESSAGE_TYPES.SUCCESS]: 5000,
    [MESSAGE_TYPES.INFO]: 5000
};

const REQUIRED_FILE_INPUTS = [
    { id: 'aadhaar-file', name: 'Aadhaar Card' },
    { id: 'pan-file', name: 'PAN Card' },
    { id: 'resume-file', name: 'Resume' }
];

const FILE_INPUT_IDS = [
    'profile-image', 'aadhaar-file', 'pan-file', 'resume-file',
    'resumeStep2', 'aadhaarFront', 'aadhaarBack', 'panCardUpload', 'passbookUpload'
];

const FILE_INPUT_MAPPING = {
    'profile-image': 'profileImage',
    'aadhaar-file': 'aadhaarFile',
    'pan-file': 'panFile',
    'resume-file': 'resume'
};

// Utility Functions
const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
};

const getElement = (id) => document.getElementById(id);

const getElementValue = (id) => getElement(id)?.value || '';

const setElementValue = (id, value) => {
    const element = getElement(id);
    if (element && value) element.value = value;
};

const getAuthToken = () => localStorage.getItem('token') || localStorage.getItem('authToken');

// User Interface Updates
const updateUserUI = (userData) => {
    const userPhoto = getElement('user-photo');
    if (userPhoto && userData.profileImageUrl) {
        userPhoto.src = userData.profileImageUrl;
    }

    const userNameElements = document.querySelectorAll('#logged-in-name, #user-display-name');
    if (userNameElements.length > 0 && userData.name) {
        userNameElements.forEach(el => el.textContent = userData.name);
    }

    const userEmailElements = document.querySelectorAll('#logged-in-email, #user-email');
    if (userEmailElements.length > 0 && userData.email) {
        userEmailElements.forEach(el => el.textContent = userData.email);
    }
};

// Error Handling
const showFieldError = (fieldId, message) => {
    const field = getElement(fieldId);
    if (!field) return;

    clearFieldError(fieldId);

    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    field.parentNode.insertBefore(errorElement, field.nextSibling);
    field.classList.add('error');

    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
    field.focus();
};

const clearFieldError = (fieldId) => {
    const field = getElement(fieldId);
    if (!field) return;

    field.classList.remove('error');
    const errorElement = field.nextElementSibling;
    if (errorElement?.classList.contains('field-error')) {
        errorElement.remove();
    }
};

const clearAllFieldErrors = () => {
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
};

// Message Display
const showMessage = (message, type = MESSAGE_TYPES.ERROR, containerId = 'message-container') => {
    try {
        const messageText = typeof message === 'string' ? message : 
                           (message?.message || 'An unknown error occurred');

        console.log(`[${type.toUpperCase()}]`, message);

        const container = getElement(containerId);
        if (!container) {
            console.error('Message container not found');
            alert(`[${type}] ${messageText}`);
            return;
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type === MESSAGE_TYPES.ERROR ? 'danger' : type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.style.cssText = 'margin: 10px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);';

        const iconMap = {
            [MESSAGE_TYPES.SUCCESS]: '<i class="fas fa-check-circle me-2"></i>',
            [MESSAGE_TYPES.WARNING]: '<i class="fas fa-exclamation-triangle me-2"></i>',
            [MESSAGE_TYPES.INFO]: '<i class="fas fa-info-circle me-2"></i>',
            [MESSAGE_TYPES.ERROR]: '<i class="fas fa-exclamation-circle me-2"></i>'
        };

        alertDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <div style="flex-grow: 1; display: flex; align-items: center;">
                    ${iconMap[type] || iconMap[MESSAGE_TYPES.ERROR]}
                    <span>${messageText}</span>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        container.appendChild(alertDiv);

        // Auto-remove after delay
        setTimeout(() => {
            if (alertDiv.parentNode === container) {
                dismissAlert(alertDiv, container);
            }
        }, AUTO_DISMISS_DELAYS[type] || AUTO_DISMISS_DELAYS[MESSAGE_TYPES.INFO]);

    } catch (e) {
        console.error('Error in showMessage:', e);
        alert(`[${type}] ${messageText}`);
    }
};

const dismissAlert = (alertDiv, container) => {
    try {
        if (typeof bootstrap !== 'undefined' && bootstrap.Alert) {
            bootstrap.Alert.getOrCreateInstance(alertDiv).close();
        } else {
            alertDiv.style.transition = 'opacity 0.5s';
            alertDiv.style.opacity = '0';
            setTimeout(() => {
                if (alertDiv.parentNode === container) {
                    container.removeChild(alertDiv);
                }
            }, 500);
        }
    } catch (e) {
        console.error('Error dismissing alert:', e);
        if (alertDiv.parentNode === container) {
            container.removeChild(alertDiv);
        }
    }
};

// Form Data Management
const getAllFormData = () => ({
    // Personal Information
    name: getElementValue('name'),
    email: getElementValue('email'),
    mobile: getElementValue('mobile'),
    jobRole: getElementValue('job-role'),
    gender: getElementValue('gender'),
    dob: getElementValue('dob'),

    // Documents
    aadhaar: getElementValue('aadhaar'),
    pan: getElementValue('pan'),

    // Address Information
    address: {
        address1: getElementValue('address1'),
        address2: getElementValue('address2'),
        city: getElementValue('city'),
        state: getElementValue('state'),
        country: getElementValue('country') || 'in',
        pincode: getElementValue('pincode')
    },

    // Professional Information
    about: getElementValue('about'),
    experience: {
        years: parseInt(getElementValue('experienceYears')) || 0,
        months: parseInt(getElementValue('experienceMonths')) || 0
    },
    employmentType: getElementValue('employmentType'),
    occupation: getElementValue('occupation'),
    jobRequirement: getElementValue('jobRequirement'),
    heardAbout: getElementValue('heardAbout'),
    interestType: getElementValue('interestType'),

    // Bank Details
    bankDetails: {
        bankName: getElementValue('bankName'),
        accountNumber: getElementValue('accountNumber'),
        ifscCode: getElementValue('ifscCode')
    },

    // Draft Status
    isDraft: true
});

// Legacy compatibility function
const getFormData = () => ({
    personalInfo: {
        name: getElementValue('name'),
        email: getElementValue('email'),
        mobile: getElementValue('mobile'),
        jobRole: getElementValue('job-role'),
        gender: getElementValue('gender'),
        dob: getElementValue('dob')
    },
    documents: {
        aadhaar: getElementValue('aadhaar'),
        pan: getElementValue('pan')
    },
    address: {
        street: getElementValue('address1'),
        city: getElementValue('city'),
        state: getElementValue('state'),
        country: getElementValue('country'),
        pincode: getElementValue('pincode')
    },
    about: getElementValue('about')
});

// Validation Functions
const validateField = (value, pattern, fieldName, errorMessage) => {
    if (!value) return null;
    return pattern.test(value) ? null : errorMessage;
};

const validateForm = (formData) => {
    const errors = [];

    // Required field validation
    if (!formData.name) errors.push({ field: 'name', message: 'Please enter your full name' });
    if (!formData.email) errors.push({ field: 'email', message: 'Email address is required' });
    if (!formData.mobile) errors.push({ field: 'mobile', message: 'Mobile number is required' });

    // Pattern validation
    if (formData.email && !VALIDATION_PATTERNS.email.test(formData.email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
    if (formData.mobile && !VALIDATION_PATTERNS.mobile.test(formData.mobile)) {
        errors.push({ field: 'mobile', message: 'Please enter a valid 10-digit mobile number' });
    }

    // Password validation
    if (formData.newPassword || formData.confirmPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
            errors.push({ field: 'newPassword', message: 'Passwords do not match' });
            errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
        } else if (formData.newPassword.length < 6) {
            errors.push({ field: 'newPassword', message: 'Password must be at least 6 characters long' });
        }
    }

    // Document validation
    const aadhaarError = validateField(formData.aadhaar, VALIDATION_PATTERNS.aadhaar, 'aadhaar', 'Aadhaar must be 12 digits');
    if (aadhaarError) errors.push({ field: 'aadhaar', message: aadhaarError });

    const panError = validateField(formData.pan, VALIDATION_PATTERNS.pan, 'pan', 'Please enter a valid PAN number');
    if (panError) errors.push({ field: 'pan', message: panError });

    const pincodeError = validateField(formData.pincode, VALIDATION_PATTERNS.pincode, 'pincode', 'Please enter a valid 6-digit pincode');
    if (pincodeError) errors.push({ field: 'pincode', message: pincodeError });

    return errors;
};

// Friendly names for user-facing error summary
const getFriendlyFieldName = (field) => ({
    name: 'Full Name',
    email: 'Email Address',
    mobile: 'Mobile Number',
    aadhaar: 'Aadhaar Number',
    pan: 'PAN Number',
    pincode: 'Pincode',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password'
}[field] || field);

const validateFileUploads = () => {
    const missing = REQUIRED_FILE_INPUTS.filter(({ id }) => {
        const fileInput = getElement(id);
        return !fileInput?.files?.[0];
    }).map(({ id, name }) => ({ id, name }));
    return missing;
};

// File Upload Management
const prepareFormDataForUpload = (formData) => {
    const formDataToSend = new FormData();

    // Add form fields
    Object.entries(formData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
            formDataToSend.append(key, value);
        }
    });

    // Add file uploads
    FILE_INPUT_IDS.forEach(inputId => {
        const fileInput = getElement(inputId);
        if (fileInput?.files?.[0]) {
            const fieldName = FILE_INPUT_MAPPING[inputId] || inputId;
            formDataToSend.append(fieldName, fileInput.files[0]);
        }
    });

    return formDataToSend;
};

// API Communication
const formatErrorMessage = (error) => {
    if (!error) return 'An unknown error occurred';
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.error) return error.error;
    
    if (error.errors) {
        if (Array.isArray(error.errors)) {
            return error.errors.map(e => e.msg || e.message || e).join('\n');
        }
        if (typeof error.errors === 'object') {
            return Object.values(error.errors).join('\n');
        }
    }
    
    return JSON.stringify(error);
};

const handleUnauthorized = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    showMessage('Your session has expired. Please log in again.', MESSAGE_TYPES.ERROR);
    setTimeout(() => {
        window.location.href = 'login.html?sessionExpired=true';
    }, 2000);
};

const makeAuthenticatedRequest = async (url, options = {}) => {
    const finalOptions = { ...options };
    finalOptions.credentials = 'include'; // Important for sending cookies

    // Do not set Authorization header, the browser will handle the cookie
    finalOptions.headers = {
        ...(options.headers || {})
    };

    // If body is a plain object, stringify it, unless it's FormData
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    if (!isFormData && options.body && typeof options.body === 'object') {
        finalOptions.headers['Content-Type'] = 'application/json';
        finalOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, finalOptions);

    if (response.status === 401) {
        showMessage('Your session has expired. Redirecting to login...', MESSAGE_TYPES.ERROR);
        setTimeout(() => {
            window.location.href = 'login.html?sessionExpired=true';
        }, 2000);
        throw new Error('Unauthorized');
    }

    const result = await response.json();

    if (!response.ok) {
        const errorMessage = result.error || result.message || 'An API error occurred.';
        throw new Error(errorMessage);
    }

    return result;
};

// Form Submission
const handleFormSubmit = async (e) => {
    e.preventDefault();
    const submitBtn = getElement('submit-btn');
    const originalBtnText = submitBtn?.innerHTML;

    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        }

        const profileImageInput = getElement('profile-image');
        const file = profileImageInput?.files?.[0];

        if (!file) {
            showMessage('Please select a profile image to upload.', MESSAGE_TYPES.WARNING);
            // In a real scenario, you would proceed to save other form data here.
            return;
        }

        // Prepare and send file data
        const formData = new FormData();
        formData.append('file', file);

        console.log('Uploading profile image...');

        const result = await makeAuthenticatedRequest(`/api/storage/upload`, {
            method: 'POST',
            body: formData
        });

        if (result && result.url) {
            showMessage('Profile image updated successfully!', MESSAGE_TYPES.SUCCESS);
            
            // Update the profile image on the page
            const userPhoto = getElement('user-photo');
            if (userPhoto) {
                userPhoto.src = result.url;
            }
<<<<<<< HEAD
            
            // Here you would typically save the result.url to the user's profile
            // along with the other form data.
            console.log('New image URL:', result.url);
        } else {
            throw new Error('File upload succeeded but no URL was returned.');
=======

            // Redirect to dashboard/profile after brief pause, keep token intact
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 800);
>>>>>>> 6a403c59a0b1da471dea4f9bf5762332ab4a4feb
        }

    } catch (error) {
        console.error('Error saving form data:', error);
        showMessage(error.message || 'Failed to save form data. Please try again.', MESSAGE_TYPES.ERROR);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
};

// Form Population
const populateForm = (profileData) => {
    if (!profileData) return;

    // Direct field mapping
    const fieldMap = {
        name: 'name',
        email: 'email',
        mobile: 'mobile',
        jobRole: 'job-role',
        gender: 'gender',
        dob: 'dob',
        aadhaar: 'aadhaar',
        pan: 'pan',
        country: 'country',
        state: 'state',
        city: 'city',
        address1: 'address1',
        address2: 'address2',
        pincode: 'pincode',
        about: 'about',
        experienceYears: 'experienceYears',
        experienceMonths: 'experienceMonths',
        employmentType: 'employmentType',
        occupation: 'occupation',
        jobRequirement: 'jobRequirement',
        heardAbout: 'heardAbout',
        interestType: 'interestType',
        bankName: 'bankName',
        accountNumber: 'accountNumber',
        ifscCode: 'ifscCode'
    };

    Object.entries(fieldMap).forEach(([dataKey, elementId]) => {
        const value = profileData[dataKey];
        if (value) {
            if (dataKey === 'dob') {
                setElementValue(elementId, formatDate(value));
            } else {
                setElementValue(elementId, value);
            }
        }
    });

    // Legacy nested data support
    if (profileData.personalInfo) {
        const legacyPersonalMap = {
            name: 'name',
            email: 'email',
            mobile: 'mobile',
            jobRole: 'job-role',
            gender: 'gender',
            dob: 'dob'
        };

        Object.entries(legacyPersonalMap).forEach(([key, elementId]) => {
            const value = profileData.personalInfo[key];
            if (value) {
                setElementValue(elementId, key === 'dob' ? formatDate(value) : value);
            }
        });
    }

    if (profileData.documents) {
        setElementValue('aadhaar', profileData.documents.aadhaar);
        setElementValue('pan', profileData.documents.pan);
    }

    if (profileData.address) {
        const { street, city, state, country, pincode } = profileData.address;
        setElementValue('address1', street);
        setElementValue('city', city);
        setElementValue('state', state);
        setElementValue('country', country);
        setElementValue('pincode', pincode);
    }
};

// Profile Loading
const loadUserProfile = async () => {
    try {
        // Load from localStorage first for instant display
        const savedFormData = localStorage.getItem('userFormData');
        if (savedFormData) {
            populateForm(JSON.parse(savedFormData));
        }

        // Fetch current authenticated profile
        const result = await makeAuthenticatedRequest(`http://localhost:3001/api/profile`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        if (result?.data) {
            populateForm(result.data);
            localStorage.setItem('userFormData', JSON.stringify(result.data));
        }

    } catch (error) {
        console.error('Error loading form data:', error);
    }
};

// Password Change
const handlePasswordChange = async () => {
    const newPassword = getElementValue('newPassword');
    const confirmPassword = getElementValue('confirmPassword');

    if (!newPassword || !confirmPassword) {
        showMessage('Please fill in both password fields', MESSAGE_TYPES.ERROR);
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage('Passwords do not match', MESSAGE_TYPES.ERROR);
        return;
    }

    if (newPassword.length < 6) {
        showMessage('Password must be at least 6 characters long', MESSAGE_TYPES.ERROR);
        return;
    }

    try {
        const formData = new FormData();
        formData.append('newPassword', newPassword);
        formData.append('confirmPassword', confirmPassword);

        const response = await fetch(`${BASE_URL}/v1/userform`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to change password');
        }

        showMessage('Password changed successfully!', MESSAGE_TYPES.SUCCESS);
        setElementValue('newPassword', '');
        setElementValue('confirmPassword', '');

    } catch (error) {
        console.error('Error changing password:', error);
        showMessage(error.message || 'Failed to change password. Please try again.', MESSAGE_TYPES.ERROR);
    }
};

// File Input Setup
const setupFileInputs = () => {
    FILE_INPUT_IDS.forEach(inputId => {
        const fileInput = getElement(inputId);
        const statusElement = getElement(inputId + '-status');

        if (fileInput && statusElement) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    statusElement.textContent = file.name;
                    statusElement.style.color = '#28a745';
                } else {
                    statusElement.textContent = 'No file chosen';
                    statusElement.style.color = '#6c757d';
                }
            });
        }
    });
};

// Event Handlers
const setupEventHandlers = () => {
    const form = getElement('profile-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    const logoutBtn = getElement('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userFormData');
            window.location.href = 'index.html';
        });
    }

    const changePasswordBtn = getElement('change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', handlePasswordChange);
    }

    const saveDraftBtn = getElement('save-draft-btn');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', saveDraft);
    }

    const editBtn = getElement('edit-profile-btn');
    if (editBtn) {
        editBtn.addEventListener('click', async () => {
            await loadDraft();
            showMessage('Loaded latest draft for editing', MESSAGE_TYPES.INFO);
        });
    }
};

// Initialization
const initializeApp = async () => {
    try {
        setupEventHandlers();
        setupFileInputs();
        // Load draft first (prefill), then fallback to profile if needed
        // await loadDraft();
        // await loadUserProfile();
    } catch (error) {
        console.error('Initialization error:', error);
        showMessage('Failed to initialize the application. Please refresh the page.', MESSAGE_TYPES.ERROR);
    }
};

// DOM Ready
document.addEventListener('DOMContentLoaded', initializeApp);