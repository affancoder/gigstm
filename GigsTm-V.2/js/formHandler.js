"""// API configuration
const ORIGIN = window.location.origin;
const API_PORT = '3001';
const BASE_URL = window.API_BASE_URL || `${window.location.protocol}//${window.location.hostname}:${API_PORT}/api`;

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

const FILE_INPUT_IDS = [
    'profile-image', 'aadhaar-file', 'pan-file', 'resume-file',
    'resumeStep2', 'aadhaarFront', 'aadhaarBack', 'panCardUpload', 'passbookUpload'
];

const FILE_INPUT_MAPPING = {
    'profile-image': { fieldName: 'profileImage', bucket: 'profile_images' },
    'aadhaar-file': { fieldName: 'aadhaarFile', bucket: 'aadhaar_documents' },
    'pan-file': { fieldName: 'panFile', bucket: 'pan_documents' },
    'resume-file': { fieldName: 'resume', bucket: 'resumes' },
    'resumeStep2': { fieldName: 'resumeStep2', bucket: 'resumes' },
    'aadhaarFront': { fieldName: 'aadhaarFront', bucket: 'aadhaar_documents' },
    'aadhaarBack': { fieldName: 'aadhaarBack', bucket: 'aadhaar_documents' },
    'panCardUpload': { fieldName: 'panCardUpload', bucket: 'pan_documents' },
    'passbookUpload': { fieldName: 'passbookUpload', bucket: 'bank_documents' }
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

// Tab Management
const enableTab = (target) => {
    const tab = document.querySelector(`button[data-target="${target}"]`);
    if (tab) {
        tab.disabled = false;
    }
};

const switchToTab = (target) => {
    const tabs = document.querySelectorAll('.tab-link');
    const panels = document.querySelectorAll('.step-panel');
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    const tab = document.querySelector(`button[data-target="${target}"]`);
    if (tab) {
        tab.classList.add('active');
    }
    const panel = getElement(target.substring(1));
    if (panel) {
        panel.classList.add('active');
    }
};

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
        const messageText = (message && typeof message === 'object' && message.message) ? message.message : (typeof message === 'string' ? message : 'An unknown error occurred');

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
const getStep1FormData = () => ({
    name: getElementValue('name'),
    email: getElementValue('email'),
    mobile: getElementValue('mobile'),
    jobRole: getElementValue('job-role'),
    gender: getElementValue('gender'),
    dob: getElementValue('dob'),
    aadhaar: getElementValue('aadhaar'),
    pan: getElementValue('pan'),
    address: {
        address1: getElementValue('address1'),
        address2: getElementValue('address2'),
        city: getElementValue('city'),
        state: getElementValue('state'),
        country: getElementValue('country') || 'in',
        pincode: getElementValue('pincode')
    },
    about: getElementValue('about'),
});

const getStep2FormData = () => ({
    experience: {
        years: parseInt(getElementValue('experienceYears')) || 0,
        months: parseInt(getElementValue('experienceMonths')) || 0
    },
    employmentType: getElementValue('employmentType'),
    occupation: getElementValue('occupation'),
    jobRequirement: getElementValue('jobRequirement'),
    heardAbout: getElementValue('heardAbout'),
    interestType: getElementValue('interestType'),
});

const getKYCFormData = () => ({
    bankDetails: {
        bankName: getElementValue('bankName'),
        accountNumber: getElementValue('accountNumber'),
        ifscCode: getElementValue('ifscCode')
    },
});


// Validation Functions
const validateStep1 = (formData) => {
    const errors = [];
    if (!formData.name) errors.push({ field: 'name', message: 'Please enter your full name' });
    if (!formData.email) errors.push({ field: 'email', message: 'Email address is required' });
    if (formData.email && !VALIDATION_PATTERNS.email.test(formData.email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
    if (!formData.mobile) errors.push({ field: 'mobile', message: 'Mobile number is required' });
    if (formData.mobile && !VALIDATION_PATTERNS.mobile.test(formData.mobile)) {
        errors.push({ field: 'mobile', message: 'Please enter a valid 10-digit mobile number' });
    }
    if (formData.aadhaar && !VALIDATION_PATTERNS.aadhaar.test(formData.aadhaar)) {
        errors.push({ field: 'aadhaar', message: 'Aadhaar must be 12 digits' });
    }
    if (formData.pan && !VALIDATION_PATTERNS.pan.test(formData.pan)) {
        errors.push({ field: 'pan', message: 'Please enter a valid PAN number' });
    }
    if (formData.address.pincode && !VALIDATION_PATTERNS.pincode.test(formData.address.pincode)) {
        errors.push({ field: 'pincode', message: 'Please enter a valid 6-digit pincode' });
    }
    return errors;
};

// API Communication
const makeAuthenticatedRequest = async (url, options = {}) => {
    const finalOptions = { ...options };
    finalOptions.credentials = 'include'; // Important for sending cookies

    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

    finalOptions.headers = {
        ...(options.headers || {})
    };

    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    if (!isFormData && options.body && typeof options.body === 'object') {
        finalOptions.headers['Content-Type'] = 'application/json';
        finalOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(fullUrl, finalOptions);

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
const handleStep1Submit = async (e) => {
    e.preventDefault();
    clearAllFieldErrors();
    const formData = getStep1FormData();
    const errors = validateStep1(formData);

    if (errors.length > 0) {
        errors.forEach(err => showFieldError(err.field, err.message));
        showMessage('Please fix the errors before proceeding.', MESSAGE_TYPES.ERROR);
        return;
    }

    const submitBtn = getElement('submit-btn');
    const originalBtnText = submitBtn?.innerHTML;

    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        }

        // Here you would typically save the data for Step 1
        console.log("Submitting Step 1", formData);
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        showMessage('Step 1 completed successfully!', MESSAGE_TYPES.SUCCESS);
        enableTab('#step2-panel');
        switchToTab('#step2-panel');

    } catch (error) {
        console.error('Error saving step 1 data:', error);
        showMessage(error.message || 'Failed to save step 1 data. Please try again.', MESSAGE_TYPES.ERROR);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
};

const handleStep2Submit = async (e) => {
    e.preventDefault();
    const formData = getStep2FormData();
    
    const submitBtn = getElement('submit-step2');
    const originalBtnText = submitBtn?.innerHTML;

    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        }

        console.log("Submitting Step 2", formData);
        await new Promise(resolve => setTimeout(resolve, 1000));

        showMessage('Step 2 completed successfully!', MESSAGE_TYPES.SUCCESS);
        enableTab('#kyc-panel');
        switchToTab('#kyc-panel');

    } catch (error) {
        console.error('Error saving step 2 data:', error);
        showMessage(error.message || 'Failed to save step 2 data. Please try again.', MESSAGE_TYPES.ERROR);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
};

const handleKYCSubmit = async (e) => {
    e.preventDefault();
    const formData = getKYCFormData();

    const submitBtn = getElement('submit-kyc');
    const originalBtnText = submitBtn?.innerHTML;

    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        }

        console.log("Submitting KYC", formData);
        await new Promise(resolve => setTimeout(resolve, 1000));

        showMessage('KYC details submitted successfully!', MESSAGE_TYPES.SUCCESS);
        enableTab('#password-panel');
        switchToTab('#password-panel');

    } catch (error) {
        console.error('Error saving KYC data:', error);
        showMessage(error.message || 'Failed to save KYC data. Please try again.', MESSAGE_TYPES.ERROR);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
};


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
        console.log("Changing password");
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
    const step1SubmitBtn = getElement('submit-btn');
    if (step1SubmitBtn) {
        step1SubmitBtn.addEventListener('click', handleStep1Submit);
    }

    const step2SubmitBtn = getElement('submit-step2');
    if (step2SubmitBtn) {
        step2SubmitBtn.addEventListener('click', handleStep2Submit);
    }

    const kycSubmitBtn = getElement('submit-kyc');
    if (kycSubmitBtn) {
        kycSubmitBtn.addEventListener('click', handleKYCSubmit);
    }

    const changePasswordBtn = getElement('change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', handlePasswordChange);
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
};

// Initialization
const initializeApp = async () => {
    try {
        setupEventHandlers();
        setupFileInputs();
    } catch (error) {
        console.error('Initialization error:', error);
        showMessage('Failed to initialize the application. Please refresh the page.', MESSAGE_TYPES.ERROR);
    }
};

// DOM Ready
document.addEventListener('DOMContentLoaded', initializeApp);
""