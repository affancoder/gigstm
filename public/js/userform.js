console.log('userform.js loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Get all tab links and panels
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanels = document.querySelectorAll('.step-panel');
    
    console.log('Found tab links:', tabLinks.length);
    console.log('Found tab panels:', tabPanels.length);

    // Function to switch tabs
    function switchTab(clickedTab) {
        if (!clickedTab) return;
        
        console.log('Switching to tab:', clickedTab.textContent.trim());
        
        // Get the target panel ID from data-target attribute
        const targetId = clickedTab.getAttribute('data-target');
        console.log('Target panel ID:', targetId);
        
        if (!targetId) {
            console.error('No data-target attribute found on tab');
            return;
        }

        // Remove active class from all tabs and panels
        tabLinks.forEach(tab => tab.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));

        // Add active class to clicked tab
        clickedTab.classList.add('active');
        
        // Show the corresponding panel
        const targetPanel = document.querySelector(targetId);
        if (targetPanel) {
            console.log('Found target panel');
            targetPanel.classList.add('active');
        } else {
            console.error('Target panel not found:', targetId);
        }
    }

    // Add click event listeners to all tab links
    tabLinks.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Tab clicked:', this.textContent.trim());
            switchTab(this);
        });
    });

    // Initialize first tab as active if no tab is active
    const activeTab = document.querySelector('.tab-link.active');
    if (tabLinks.length > 0 && !activeTab) {
        console.log('No active tab found, activating first tab');
        tabLinks[0].classList.add('active');
        const firstPanel = document.querySelector(tabLinks[0].getAttribute('data-target'));
        if (firstPanel) {
            firstPanel.classList.add('active');
        }
    } else if (activeTab) {
        console.log('Active tab found:', activeTab.textContent.trim());
        // Make sure the corresponding panel is also active
        const targetId = activeTab.getAttribute('data-target');
        if (targetId) {
            const targetPanel = document.querySelector(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        }
    }
});
