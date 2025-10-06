document.addEventListener('DOMContentLoaded', async () => {
    const protectedPages = ['userform.html', 'dashboard.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage)) {
        try {
            const response = await fetch('/api/auth/verify', {
                method: 'GET',
                credentials: 'include', // This is crucial for sending the HttpOnly cookie
            });

            if (!response.ok) {
                // If status is 401 Unauthorized or any other error, redirect to login
                console.log('Auth verification failed, redirecting to login.');
                window.location.href = 'login.html';
                return;
            }

            // Optional: If the verify endpoint returns user data, you can use it to update the UI
            const data = await response.json();
            if (data.user) {
                console.log('User verified:', data.user.email);
                const userEmailElement = document.getElementById('user-email');
                if (userEmailElement) {
                    userEmailElement.textContent = data.user.email;
                }
            }

        } catch (error) {
            console.error('Auth check failed:', error);
            window.location.href = 'login.html';
        }
    }
});