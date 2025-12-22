// ===== MAIN JAVASCRIPT FOR URBAN BREW CAFÉ =====

// ===== THEME TOGGLE FUNCTIONALITY =====
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    if (!themeToggle || !themeIcon) {
        console.warn('Theme toggle elements not found');
        return;
    }
    
    // Check for saved theme or prefer-color-scheme
    const savedTheme = localStorage.getItem('urbanBrewTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update icon based on current theme
    updateThemeIcon(themeIcon, currentTheme);
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply new theme
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update icon
        updateThemeIcon(themeIcon, newTheme);
        
        // Save preference
        localStorage.setItem('urbanBrewTheme', newTheme);
        
        // Add animation effect
        this.style.transform = 'scale(0.95) rotate(180deg)';
        setTimeout(() => {
            this.style.transform = 'scale(1) rotate(0)';
        }, 150);
        
        // Show feedback
        showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode enabled`);
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('urbanBrewTheme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(themeIcon, newTheme);
        }
    });
}

function updateThemeIcon(iconElement, theme) {
    if (!iconElement) return;
    
    if (theme === 'dark') {
        iconElement.className = 'fas fa-sun';
        iconElement.title = 'Switch to light mode';
    } else {
        iconElement.className = 'fas fa-moon';
        iconElement.title = 'Switch to dark mode';
    }
}

// ===== MOBILE MENU TOGGLE =====
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navList = document.querySelector('.nav-list');
    
    if (!mobileMenuBtn || !navList) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        navList.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.className = navList.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.main-nav') && !e.target.closest('.mobile-menu-btn')) {
            navList.classList.remove('active');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        }
    });
}

// ===== SMOOTH SCROLL =====
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle anchor links on the same page
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===== MENU CARD INTERACTIONS =====
function initializeMenuCardInteractions() {
    const menuCards = document.querySelectorAll('.menu-card');
    
    menuCards.forEach(card => {
        const addButton = card.querySelector('.btn-card');
        
        if (addButton) {
            addButton.addEventListener('click', function() {
                const itemName = card.querySelector('h3').textContent;
                const itemPrice = card.querySelector('.price').textContent;
                
                // Visual feedback
                const originalText = addButton.textContent;
                addButton.textContent = 'Added!';
                addButton.style.backgroundColor = 'var(--success-color)';
                
                // Create a temporary order object
                const orderItem = {
                    name: itemName,
                    price: itemPrice,
                    timestamp: new Date().toISOString()
                };
                
                // Get existing cart or create new array
                const currentCart = JSON.parse(localStorage.getItem('urbanBrewCart')) || [];
                currentCart.push(orderItem);
                localStorage.setItem('urbanBrewCart', JSON.stringify(currentCart));
                
                // Reset button after delay
                setTimeout(() => {
                    addButton.textContent = originalText;
                    addButton.style.backgroundColor = '';
                }, 2000);
                
                // Optional: Show a subtle notification
                showToast(`${itemName} added to your order!`);
            });
        }
    });
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--success-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateY(100px);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);
    
    // Remove toast after delay
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ===== FORM VALIDATION HELPERS =====
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\D/g, '').length >= 10);
}

// ===== LOCALSTORAGE UTILITIES =====
function saveToLocalStorage(key, data) {
    try {
        const existingData = JSON.parse(localStorage.getItem(key)) || [];
        existingData.push({
            ...data,
            id: Date.now(),
            date: new Date().toISOString()
        });
        localStorage.setItem(key, JSON.stringify(existingData));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
    }
}

// ===== PAGE DETECTION AND INITIALIZATION =====
function detectCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().toLowerCase();
    
    if (page === 'index.html' || page === '' || page.includes('index')) {
        return 'home';
    } else if (page.includes('menu')) {
        return 'menu';
    } else if (page.includes('about')) {
        return 'about';
    } else if (page.includes('contact')) {
        return 'contact';
    } else if (page.includes('admin')) {
        return 'admin';
    }
    return 'home';
}

function initializePageSpecificFeatures() {
    const currentPage = detectCurrentPage();
    
    switch(currentPage) {
        case 'home':
            // Home page specific initialization
            console.log('Initializing home page features');
            break;
            
        case 'menu':
            // Menu page features will be initialized by menu.js
            console.log('Menu page detected - menu.js will handle specific features');
            break;
            
        case 'about':
            // About page features will be initialized by about.js
            console.log('About page detected - about.js will handle specific features');
            break;
            
        case 'contact':
            // Contact page features will be initialized by contact.js and form.js
            console.log('Contact page detected - form.js and contact.js will handle specific features');
            break;
            
        case 'admin':
            // Admin page features will be initialized by admin.js
            console.log('Admin page detected - admin.js will handle specific features');
            break;
    }
}

// ===== INITIALIZE EVERYTHING WHEN DOM IS READY =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing Urban Brew Café');
    
    // Initialize core features (order matters)
    initializeTheme();
    initializeMobileMenu();
    initializeSmoothScroll();
    initializeMenuCardInteractions();
    
    // Set current year in footer if element exists
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize page-specific features
    initializePageSpecificFeatures();
    
    // Mark initialization complete
    console.log('Urban Brew Café initialization complete');
});

// ===== WINDOW LOAD EVENT FOR ADDITIONAL SETUP =====
window.addEventListener('load', function() {
    // Additional setup after all resources are loaded
    console.log('Page fully loaded');
    
    // Add loading animation removal
    document.body.classList.add('loaded');
});