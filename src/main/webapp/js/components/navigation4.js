export async function initNavigation() {
    const navContainer = document.getElementById('navigation-container');
    if (!navContainer) return;

    try {
        const userData = await checkLoginStatus();
        navContainer.innerHTML = createNavigation(userData);

        // Add logout button event listener if user is logged in
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }

        // Add event listeners for submenu interactions
        setupSubmenuInteractions();
        
    } catch (error) {
        console.error('Navigation initialization error:', error);
        navContainer.innerHTML = createNavigation(null);
    }
}

async function checkLoginStatus() {
    try {
        const response = await fetch('CheckLoginStatusServlet');
        if (!response.ok) {
            throw new Error('Login status check failed');
        }
        return await response.json();
    } catch (error) {
        console.error('Error checking login status:', error);
        return { isLoggedIn: false };
    }
}

function createNavigation(userData) {
    return `
        <div class="nav-wrapper">
            <!-- Header Row -->
            <div class="header-row">
                <div class="spacer"></div>
                
                <!-- Logo -->
                <div class="logo-section">
                    <a href="index.html" class="logo-link">
                        <h1 class="logo-title">TAIKE Life</h1>
                    </a>
                    <div class="logo-subtitle">Explorer Your Water Activities in Taiwan.</div>
                </div>
                
                <!-- User Section -->
                <div class="user-section">
                    ${userData && userData.isLoggedIn ? `
                        <span class="user-greeting">Hi, ${userData.username}</span>
                        <button class="logout-btn" id="logoutBtn">Logout</button>
                    ` : `
                        <div class="auth-links">
                            <a href="login.html" class="login-link">Login</a>
                            <span class="divider">/</span>
                            <a href="register.html" class="register-link">Signup</a>
                        </div>
                    `}
                </div>
            </div>

            <!-- Navigation Menu -->
            <nav class="main-nav">
                <ul class="nav-list">
                    <li class="nav-item has-submenu">
                        <a href="#" class="nav-link">Go Diving</a>
                        <ul class="submenu">
                            <li><a href="DivingSpotRe.html">Find Diving Spot</a></li>
                            <li><a href="find-guide.html">Find Diving Guide</a></li>
                            <li><a href="diving-course.html">Find Divind experience/class</a></li>
                        </ul>
                    </li>
                    <li class="nav-item has-submenu">
                        <a href="#" class="nav-link">Go SUP</a>
                        <ul class="submenu">
                            <li><a href="sup-spots.html">Find SUP Spot</a></li>
                        </ul>
                    </li>
                    <li class="nav-item has-submenu">
                        <a href="#" class="nav-link">Go Surfing</a>
                        <ul class="submenu">
                            <li><a href="surf-spots.html">Find Surfing Spot</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="join-us.html" class="nav-link">Join Us</a>
                    </li>
                    <li class="nav-item has-submenu">
                        <a href="#" class="nav-link">Member Area</a>
                        <ul class="submenu">
                            ${userData && userData.isLoggedIn ? `
                                <li><a href="Collection2.html">My Collection❤️</a></li>
                                <li><a href="orders.html">My Booking</a></li>
                                <li><a href="profile.html">User Profile</a></li>
                            ` : `
                                <li><a href="login.html">Login</a></li>
                                <li><a href="register.html">Signup</a></li>
                            `}
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    `;
}

function setupSubmenuInteractions() {
    // Add hover effects for desktop
    const navItems = document.querySelectorAll('.nav-item.has-submenu');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const submenu = item.querySelector('.submenu');
            if (submenu) {
                submenu.style.opacity = '1';
                submenu.style.visibility = 'visible';
                submenu.style.transform = 'translateY(0)';
            }
        });

        item.addEventListener('mouseleave', () => {
            const submenu = item.querySelector('.submenu');
            if (submenu) {
                submenu.style.opacity = '0';
                submenu.style.visibility = 'hidden';
                submenu.style.transform = 'translateY(-10px)';
            }
        });
    });

    // Add click events for mobile
    if (window.innerWidth <= 768) {
        const navLinks = document.querySelectorAll('.nav-item.has-submenu > .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const submenu = link.nextElementSibling;
                if (submenu) {
                    submenu.style.display = 
                        submenu.style.display === 'block' ? 'none' : 'block';
                }
            });
        });
    }
}

async function handleLogout(event) {
    event.preventDefault();
    
    try {
        const confirmLogout = confirm('確定要登出嗎？');
        
        if (confirmLogout) {
            const response = await fetch('LogoutServlet', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                showMessage('登出成功！');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                throw new Error('Logout failed');
            }
        }
    } catch (error) {
        console.error('Logout error:', error);
        showError('登出失敗，請稍後再試');
    }
}

function showMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message-popup';
    messageElement.textContent = message;
    document.body.appendChild(messageElement);

    setTimeout(() => {
        messageElement.remove();
    }, 2000);
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-popup';
    errorElement.textContent = message;
    document.body.appendChild(errorElement);

    setTimeout(() => {
        errorElement.remove();
    }, 3000);
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('頁面載入，開始初始化...');
    await initNavigation();
});