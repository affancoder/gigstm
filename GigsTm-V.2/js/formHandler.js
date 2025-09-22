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
    country: getElementValue('country') || 'in',
    state: getElementValue('state'),
    city: getElementValue('city'),
    address1: getElementValue('address1'),
    address2: getElementValue('address2'),
    pincode: getElementValue('pincode'),

    // About
    about: getElementValue('about'),

    // Professional Information
    experienceYears: getElementValue('experienceYears'),
    experienceMonths: getElementValue('experienceMonths'),
    employmentType: getElementValue('employmentType'),
    occupation: getElementValue('occupation'),
    jobRequirement: getElementValue('jobRequirement'),
    heardAbout: getElementValue('heardAbout'),
    interestType: getElementValue('interestType'),

    // KYC Details
    bankName: getElementValue('bankName'),
    accountNumber: getElementValue('accountNumber'),
    ifscCode: getElementValue('ifscCode'),

    // Password
    newPassword: getElementValue('newPassword'),
    confirmPassword: getElementValue('confirmPassword')
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
    const token = getAuthToken();
    if (!token) {
        throw new Error('Authentication required. Please login again.');
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    });

    if (response.status === 401) {
        handleUnauthorized();
        return null;
    }

    let result;
    try {
        result = await response.json();
    } catch (jsonError) {
        const text = await response.text();
        throw new Error(`Server returned ${response.status} ${response.statusText}. ${text.substring(0, 200)}`);
    }

    if (!response.ok) {
        const errorMessage = formatErrorMessage(result) || 
            (response.status === 404 ? 'API endpoint not found. Please check the server configuration.' : 
            `Request failed with status ${response.status}`);
        throw new Error(errorMessage);
    }

    return result;
};

// Draft save/load
const saveDraft = async () => {
    try {
        const data = getAllFormData();
        const result = await makeAuthenticatedRequest(`http://localhost:3001/api/profile/draft`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (result) {
            localStorage.setItem('userFormDraft', JSON.stringify(result.data?.data || data));
            showMessage('Draft saved', MESSAGE_TYPES.SUCCESS);
        }
    } catch (error) {
        console.error('Draft save failed:', error);
        showMessage(error.message || 'Failed to save draft', MESSAGE_TYPES.ERROR);
    }
};

const loadDraft = async () => {
    try {
        // Local first
        const local = localStorage.getItem('userFormDraft');
        if (local) {
            populateForm(JSON.parse(local));
        }

        const result = await makeAuthenticatedRequest(`http://localhost:3001/api/profile/draft`, {
            method: 'GET'
        });
        if (result?.data?.data) {
            populateForm(result.data.data);
            localStorage.setItem('userFormDraft', JSON.stringify(result.data.data));
        }
    } catch (error) {
        // 404 no draft is fine
        console.log('No remote draft or failed to load draft:', error?.message || error);
    }
};

// Form Submission
const handleFormSubmit = async (e) => {
    e.preventDefault();

    const submitBtn = getElement('submit-btn');
    const originalBtnText = submitBtn?.innerHTML;

    try {
        // Update UI state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        }

        // Clear previous errors
        clearAllFieldErrors();
        // Also clear inline file errors
        (() => {
            FILE_INPUT_IDS.forEach(inputId => {
                const statusElement = getElement(inputId + '-status');
                if (!statusElement) return;
                const next = statusElement.nextElementSibling;
                if (next && next.classList && next.classList.contains('field-error')) {
                    next.remove();
                }
            });
        })();

        // Get and validate form data
        const formData = getAllFormData();
        const validationErrors = validateForm(formData);

        if (validationErrors.length > 0) {
            validationErrors.forEach(({ field, message }) => showFieldError(field, message));
            showMessage('Please correct the errors in the form', MESSAGE_TYPES.ERROR);
            return;
        }

        // Check required file uploads
        const missingFiles = validateFileUploads();
        if (missingFiles.length > 0) {
            const list = missingFiles.map(m => m.name).join(', ');
            const errorMessage = `Please upload the following required files: ${list}`;
            showMessage(errorMessage, MESSAGE_TYPES.WARNING);
            // Show inline errors next to each missing file status label
            missingFiles.forEach(({ id, name }) => {
                const statusElement = getElement(id + '-status');
                if (statusElement) {
                    const exists = statusElement.nextElementSibling;
                    if (!(exists && exists.classList && exists.classList.contains('field-error'))) {
                        const errorElement = document.createElement('div');
                        errorElement.className = 'field-error';
                        errorElement.textContent = `${name} is required.`;
                        statusElement.parentNode.insertBefore(errorElement, statusElement.nextSibling);
                    }
                }
            });
            const firstMissingId = missingFiles[0]?.id;
            if (firstMissingId) {
                getElement(firstMissingId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                getElement(firstMissingId)?.focus();
            }
            return;
        }

        // Prepare and send data
        const formDataToSend = prepareFormDataForUpload(formData);
        console.log('Sending form data to:', `${BASE_URL}/profile`);

        const result = await makeAuthenticatedRequest(`${BASE_URL}/profile`, {
            method: 'POST',
            body: formDataToSend
        });

        if (result) {
            showMessage('Profile updated successfully!', MESSAGE_TYPES.SUCCESS);
            localStorage.setItem('userFormData', JSON.stringify(result.data || {}));

            // Clear password fields
            setElementValue('newPassword', '');
            setElementValue('confirmPassword', '');

            // Update UI
            if (result.data) {
                updateUserUI(result.data);
            }
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

        // Get user email
        const userEmail = localStorage.getItem('userEmail') || getElementValue('email');
        if (!userEmail) {
            console.log('No user email found, skipping server fetch');
            return;
        }

        // Fetch from server
        const response = await fetch(`${BASE_URL}/v1/userform/${encodeURIComponent(userEmail)}`, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const result = await response.json();
            if (result.data) {
                populateForm(result.data);
                localStorage.setItem('userFormData', JSON.stringify(result.data));
            }
        } else if (response.status !== 404) {
            console.warn('Failed to load form data:', response.statusText);
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
        await loadDraft();
        await loadUserProfile();
    } catch (error) {
        console.error('Initialization error:', error);
        showMessage('Failed to initialize the application. Please refresh the page.', MESSAGE_TYPES.ERROR);
    }
};

// DOM Ready
document.addEventListener('DOMContentLoaded', initializeApp);