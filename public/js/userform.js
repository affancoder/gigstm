console.log("userform.js loaded");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");

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

  // profile form script
  document
    .getElementById("user-profile")
    .addEventListener("submit", async function (e) {
      e.preventDefault(); // Prevent default form submission

      const form = e.target;
      const formData = new FormData(form); // Collect all form fields including files

      // Get JWT token from localStorage
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        alert("Authentication token missing. Please login.");
        return;
      }

      try {
        const response = await fetch("/api/user/profile", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT in Authorization header
            // 'Content-Type': 'multipart/form-data' // DO NOT set this manually; FormData handles it
          },
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          alert("Profile submitted successfully!");
          window.location.href = "/success.html";
          console.log(result);
        } else {
          alert("Error: " + (result.message || "Something went wrong"));
          console.error(result);
        }
      } catch (error) {
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

      const form = e.target;
      const formData = new FormData(form);

      // Get JWT token
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        alert("Authentication token missing. Please login.");
        return;
      }

      try {
        const response = await fetch("/api/user/experience", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // DO NOT SET Content-Type manually
          },
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          alert("Experience details saved successfully!");
          console.log(result);
          window.location.href = "/success.html";
        } else {
          alert("Error: " + (result.message || "Something went wrong"));
          console.error(result);
        }
      } catch (error) {
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

      const form = e.target;
      const formData = new FormData(form);

      // Get JWT Token
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        alert("Authentication token missing. Please login.");
        return;
      }

      try {
        const response = await fetch("/api/user/kyc", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // DO NOT set content-type manually
          },
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          alert("KYC details saved successfully!");
          console.log(result);
          window.location.href = "/success.html";
        } else {
          alert("Error: " + (result.message || "Something went wrong"));
          console.error(result);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        alert("An error occurred while submitting KYC details.");
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
});
