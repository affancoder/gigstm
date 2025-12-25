console.log("userform.js loaded");

// Function to toggle password visibility
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
    const icon = document.querySelector(`[data-target="#${inputId}"] i`);
    if (icon) {
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");

  // Call populateForm to pre-fill data
  populateForm();

  // Add click event listeners for all password toggle buttons
  document.addEventListener('click', function(e) {
    const toggleBtn = e.target.closest('.toggle-visibility');
    if (toggleBtn) {
      e.preventDefault();
      const targetId = toggleBtn.getAttribute('data-target').replace('#', '');
      togglePasswordVisibility(targetId);
    }
  });

  // Get all tab links and panels
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabPanels = document.querySelectorAll(".step-panel");

  console.log("Found tab links:", tabLinks.length);
  console.log("Found tab panels:", tabPanels.length);

  // Function to switch tabs
  function switchTab(clickedTab) {
    if (!clickedTab) return;

    console.log("Switching to tab:", clickedTab.textContent.trim());

    // Get the target panel ID from data-target attribute
    const targetId = clickedTab.getAttribute("data-target");
    console.log("Target panel ID:", targetId);

    if (!targetId) {
      console.error("No data-target attribute found on tab");
      return;
    }

    // Remove active class from all tabs and panels
    tabLinks.forEach((tab) => tab.classList.remove("active"));
    tabPanels.forEach((panel) => panel.classList.remove("active"));

    // Add active class to clicked tab
    clickedTab.classList.add("active");

    // Show the corresponding panel
    const targetPanel = document.querySelector(targetId);
    if (targetPanel) {
      console.log("Found target panel");
      targetPanel.classList.add("active");
    } else {
      console.error("Target panel not found:", targetId);
    }
  }

  // Add click event listeners to all tab links
  tabLinks.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Tab clicked:", this.textContent.trim());
      switchTab(this);
    });
  });

  // Initialize first tab as active if no tab is active
  const activeTab = document.querySelector(".tab-link.active");
  if (tabLinks.length > 0 && !activeTab) {
    console.log("No active tab found, activating first tab");
    tabLinks[0].classList.add("active");
    const firstPanel = document.querySelector(
      tabLinks[0].getAttribute("data-target")
    );
    if (firstPanel) {
      firstPanel.classList.add("active");
    }
  } else if (activeTab) {
    console.log("Active tab found:", activeTab.textContent.trim());
    // Make sure the corresponding panel is also active
    const targetId = activeTab.getAttribute("data-target");
    if (targetId) {
      const targetPanel = document.querySelector(targetId);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    }
  }

  // Function to show loader
  function showLoader() {
    const loader = document.getElementById('loader-overlay');
    if (loader) {
      loader.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent scrolling while loading
    }
  }

  // Function to validate form fields
  function validateForm(formId) {
    const form = document.getElementById(formId);
    const requiredFields = form.querySelectorAll('[required]');
    const errors = [];

    requiredFields.forEach(field => {
      // Skip hidden fields and disabled fields
      if (field.offsetParent === null || field.disabled) return;
      
      // Check if field is empty
      if (!field.value.trim()) {
        const fieldName = field.labels?.[0]?.textContent?.replace('*', '').trim() || field.name || 'This field';
        errors.push(`- ${fieldName} is required`);
      }
      
      // Special validation for email fields
      if (field.type === 'email' && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        errors.push(`- Please enter a valid email address`);
      }
      
      // Special validation for phone numbers
      if (field.type === 'tel' && field.value.trim() && !/^[0-9]{10,15}$/.test(field.value)) {
        errors.push(`- Please enter a valid phone number`);
      }
      
      // Special validation for file inputs
      if (field.type === 'file' && field.required && !field.files.length) {
        const fieldName = field.labels?.[0]?.textContent?.replace('*', '').trim() || field.name || 'This file';
        errors.push(`- ${fieldName} is required`);
      }
    });

    // If there are errors, show them and return false
    if (errors.length > 0) {
      showError(errors.join('\n'));
      return false;
    }
    
    return true;
  }

  // Function to show error messages in a toast notification
  function showError(message) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.style.cssText = `
      background-color: #ffebee;
      color: #c62828;
      padding: 15px 20px;
      margin-bottom: 10px;
      border-radius: 4px;
      border-left: 4px solid #c62828;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      animation: slideIn 0.3s ease-out;
      position: relative;
      overflow: hidden;
    `;

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: #c62828;
      padding: 0 5px;
    `;
    closeButton.onclick = function() {
      toast.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    };

    // Add message content
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = 'padding-right: 20px;';
    messageDiv.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px;">
        <i class="fas fa-exclamation-circle" style="font-size: 20px; margin-top: 2px;"></i>
        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 16px; color: #b71c1c;">Please fix the following errors:</h4>
          <div style="margin-left: 0; font-size: 14px; line-height: 1.4;">${message}</div>
        </div>
      </div>
    `;

    // Add progress bar
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      height: 4px;
      background: rgba(198, 40, 40, 0.3);
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      animation: progress 5s linear forwards;
    `;

    toast.appendChild(closeButton);
    toast.appendChild(messageDiv);
    toast.appendChild(progressBar);
    toastContainer.prepend(toast);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 5000);

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeOut {
        to { opacity: 0; transform: translateX(100%); }
      }
      @keyframes progress {
        from { width: 100%; }
        to { width: 0%; }
      }
    `;
    document.head.appendChild(style);
  }

  // Function to hide loader
  function hideLoader() {
    const loader = document.getElementById('loader-overlay');
    if (loader) {
      loader.style.display = 'none';
      document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
  }

  // profile form script
  document
    .getElementById("user-profile")
    .addEventListener("submit", async function (e) {
      e.preventDefault(); // Prevent default form submission
      
      // Validate form before submission
      if (!validateForm('user-profile')) {
        return; // Stop if validation fails
      }
      
      showLoader(); // Show loader when form is submitted

      const form = e.target;
      const formData = new FormData(form); // Collect all form fields including files

      // Get JWT token from localStorage
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        hideLoader(); // Hide loader on error
        alert("Authentication token missing. Please login.");
        return;
      }

      try {
        const response = await fetch("/api/user/profile", {
          method: "POST",  credentials: "include",

          headers: {
            Authorization: `Bearer ${token}`, // Include JWT in Authorization header
            // 'Content-Type': 'multipart/form-data' // DO NOT set this manually; FormData handles it
          },
          body: formData,
        });

        const result = await response.json();
        hideLoader(); // Hide loader when request is complete

        if (response.ok) {
          alert("Profile submitted successfully!");
          window.location.href = "/success.html";
          console.log(result);
        } else {
          alert("Error: " + (result.message || "Something went wrong"));
          console.error(result);
        }
      } catch (error) {
        hideLoader(); // Hide loader on error
        console.error("Fetch error:", error);
        alert("An error occurred while submitting the form.");
      }
    });

  // Optional: Update file input status when a file is chosen
  const fileInputs = [
    { inputId: "profile-image", statusId: "profile-status" },
    { inputId: "aadhaar-file", statusId: "aadhaar-status" },
    { inputId: "pan-file", statusId: "pan-status" },
    { inputId: "resume-file", statusId: "resume-status" },
  ];

  fileInputs.forEach(({ inputId, statusId }) => {
    const input = document.getElementById(inputId);
    const status = document.getElementById(statusId);
    input.addEventListener("change", () => {
      status.textContent = input.files.length
        ? input.files[0].name
        : "No file chosen";
    });
  });

  // Handle STEP 2 form submission
  document
    .getElementById("user-experience")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      
      // Validate form before submission
      if (!validateForm('user-experience')) {
        return; // Stop if validation fails
      }
      
      showLoader(); // Show loader when form is submitted

      const form = e.target;
      const formData = new FormData(form);

      // Get JWT token
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        hideLoader(); // Hide loader on error
        alert("Authentication token missing. Please login.");
        return;
      }

      try {
        const response = await fetch("/api/user/experience", {
          method: "POST",  credentials: "include",

          headers: {
            Authorization: `Bearer ${token}`,
            // DO NOT SET Content-Type manually
          },
          body: formData,
        });

        const result = await response.json();
        hideLoader(); // Hide loader when request is complete

        if (response.ok) {
          alert("Experience details saved successfully!");
          console.log(result);
          window.location.href = "/success.html";
        } else {
          alert("Error: " + (result.message || "Something went wrong"));
          console.error(result);
        }
      } catch (error) {
        hideLoader(); // Hide loader on error
        console.error("Fetch error:", error);
        alert("An error occurred while submitting the form.");
      }
    });

  // Update file label for Resume Step 2
  const resumeInput = document.getElementById("resumeStep2");
  const resumeStatus = document.getElementById("resumeStep2-status");

  resumeInput.addEventListener("change", () => {
    resumeStatus.textContent = resumeInput.files.length
      ? resumeInput.files[0].name
      : "No file chosen";
  });

  // Handle STEP 3 - KYC FORM submission
  document
    .getElementById("user-kyc")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      
      // Validate form before submission
      if (!validateForm('user-kyc')) {
        return; // Stop if validation fails
      }
      
      showLoader();

      const form = e.target;
      const formData = new FormData(form);

      // Get JWT Token
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        hideLoader();
        alert("Authentication token missing. Please login again.");
        window.location.href = "/login.html";
        return;
      }

      try {
        // Use the correct endpoint for KYC submission
        const response = await fetch("/api/user/kyc", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
            // Let the browser set Content-Type with boundary for FormData
          },
          body: formData,
          credentials: 'include' // Important for cookies/sessions if used
        });

        const result = await response.json();
        hideLoader();

        if (response.ok) {
          alert("KYC details saved successfully!");
          console.log("KYC Response:", result);
          // Optionally redirect or update UI
          if (result.redirect) {
            window.location.href = result.redirect;
          }
        } else {
          throw new Error(result.message || "Failed to save KYC details");
        }
      } catch (error) {
        console.error("KYC submission error:", error);
        alert(error.message || "An error occurred while saving KYC details. Please try again.");
      } finally {
        hideLoader();
      }
    });

  // ===========================
  // Update Filename Preview
  // ===========================

  const kycFileInputs = [
    { inputId: "aadhaarFront", statusId: "aadhaarFront-status" },
    { inputId: "aadhaarBack", statusId: "aadhaarBack-status" },
    { inputId: "panCardUpload", statusId: "panCardUpload-status" },
    { inputId: "passbookUpload", statusId: "passbookUpload-status" },
  ];

  kycFileInputs.forEach(({ inputId, statusId }) => {
    const input = document.getElementById(inputId);
    const status = document.getElementById(statusId);

    input.addEventListener("change", () => {
      status.textContent = input.files.length
        ? input.files[0].name
        : "No file chosen";
    });
  });


  // ------------------------------
  // Change Password Button Handler
  // ------------------------------
  const toggleButtons = document.querySelectorAll(".toggle-visibility");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetInput = document.querySelector(btn.dataset.target);
      if (targetInput.type === "password") {
        targetInput.type = "text";
        btn.querySelector("i").classList.remove("fa-eye");
        btn.querySelector("i").classList.add("fa-eye-slash");
      } else {
        targetInput.type = "password";
        btn.querySelector("i").classList.remove("fa-eye-slash");
        btn.querySelector("i").classList.add("fa-eye");
      }
    });
  });

  // ===== Handle Change Password Form Submission =====
  document.getElementById("change-password-btn").addEventListener("click", async function() {
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    
    // Validate fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    // Get JWT Token
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      alert("Authentication token missing. Please login again.");
      window.location.href = "/login.html";
      return;
    }

    try {
      showLoader();
      const response = await fetch("/api/v1/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      const result = await response.json();
      hideLoader();

      if (response.ok) {
        alert("Password changed successfully! Please login again with your new password.");
        // Clear token and redirect to login
        localStorage.removeItem("jwt_token");
        window.location.href = "/login.html";
      } else {
        throw new Error(result.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      alert(error.message || "An error occurred while changing password. Please try again.");
    }
  });

  // ==========================================
  // Persistent Form Filling Logic
  // ==========================================

  function setFieldValue(id, value) {
    if (value === undefined || value === null) return;
    const element = document.getElementById(id);
    if (element) {
      element.value = value;
    }
  }

  function setFileStatus(id, path) {
    const element = document.getElementById(id);
    if (element && path) {
      // Extract filename from path
      const filename = path.split(/[\\/]/).pop();
      element.textContent = "Uploaded: " + filename;
      element.style.color = "green";
      element.style.fontWeight = "bold";
    }
  }

  async function populateForm() {
    const token = localStorage.getItem("jwt_token");
    if (!token) return;

    try {
      showLoader();

      const response = await fetch("/api/user/me/combined", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const result = await response.json();
      const { user, profile, experience, kyc } = result.data || {};

      console.log("Fetched user data:", result.data);

      // 1. Populate Profile
      if (profile) {
        setFieldValue("name", profile.name);
        setFieldValue("email", profile.email || user?.email);
        setFieldValue("mobile", profile.mobile);
        setFieldValue("job-role", profile.jobRole);
        setFieldValue("gender", profile.gender);
        
        if (profile.dob) {
           const dobDate = new Date(profile.dob);
           if (!isNaN(dobDate)) {
               setFieldValue("dob", dobDate.toISOString().split('T')[0]);
           }
        }
        
        setFieldValue("aadhaar", profile.aadhaar);
        setFieldValue("pan", profile.pan);
        setFieldValue("country", profile.country);
        setFieldValue("state", profile.state);
        setFieldValue("city", profile.city);
        setFieldValue("address1", profile.address1);
        setFieldValue("address2", profile.address2);
        setFieldValue("pincode", profile.pincode);
        setFieldValue("about", profile.about);

        // Files
        if (profile.profileImage) {
            setFileStatus("profile-status", profile.profileImage);
            const avatar = document.getElementById("user-photo");
            if (avatar) avatar.src = profile.profileImage;
        }
        if (profile.aadhaarFile) setFileStatus("aadhaar-status", profile.aadhaarFile);
        if (profile.panFile) setFileStatus("pan-status", profile.panFile);
        if (profile.resumeFile) setFileStatus("resume-status", profile.resumeFile);
        
        // Sidebar email
        const emailDisplay = document.getElementById("user-email");
        if(emailDisplay) emailDisplay.textContent = profile.email || user?.email;
      } else if (user) {
          setFieldValue("name", user.name);
          setFieldValue("email", user.email);
          const emailDisplay = document.getElementById("user-email");
          if(emailDisplay) emailDisplay.textContent = user.email;
      }

      // 2. Populate Experience
      if (experience) {
        setFieldValue("experienceYears", experience.experienceYears);
        setFieldValue("experienceMonths", experience.experienceMonths);
        setFieldValue("employmentType", experience.employmentType);
        setFieldValue("occupation", experience.occupation);
        setFieldValue("jobRequirement", experience.jobRequirement);
        setFieldValue("heardAbout", experience.heardAbout);
        setFieldValue("interestType", experience.interestType);
        
        if (experience.resumeStep2) setFileStatus("resumeStep2-status", experience.resumeStep2);
      }

      // 3. Populate KYC
      if (kyc) {
        setFieldValue("bankName", kyc.bankName);
        setFieldValue("accountNumber", kyc.accountNumber);
        setFieldValue("ifscCode", kyc.ifscCode);
        
        if (kyc.aadhaarFront) setFileStatus("aadhaarFront-status", kyc.aadhaarFront);
        if (kyc.aadhaarBack) setFileStatus("aadhaarBack-status", kyc.aadhaarBack);
        if (kyc.panCardUpload) setFileStatus("panCardUpload-status", kyc.panCardUpload);
        if (kyc.passbookUpload) setFileStatus("passbookUpload-status", kyc.passbookUpload);
      }

    } catch (error) {
      console.error("Error fetching user data for pre-fill:", error);
    } finally {
      hideLoader();
    }
  }
});
