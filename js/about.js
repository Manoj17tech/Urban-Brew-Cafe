// ===== ABOUT PAGE FUNCTIONALITY =====

// Define all functions first
function initializeAboutPage() {
    console.log('Initializing About page features');
    addAboutStyles();
    initializeScrollAnimations();
    setupTeamMemberInteractions();
    initializeValueCards();
    initializeStatsAnimation();
}

function initializeTeamCards() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px var(--shadow)';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px var(--shadow)';
        });
    });
}

function initializeValueCards() {
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            valueCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Show toast with value description
            const valueTitle = this.querySelector('h3').textContent;
            showToast(`Learn more about: ${valueTitle}`);
        });
    });
}

function initializeStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    const statItems = document.querySelectorAll('.stat-item');
    
    if (stats.length === 0) return;
    
    // Set initial state
    statItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        animateStatCounter(item.querySelector('.stat-number'));
                    }, index * 300);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.story-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateStatCounter(element) {
    if (!element) return;
    
    const originalText = element.textContent;
    const targetValue = parseInt(originalText.replace(/[^0-9]/g, ''));
    if (isNaN(targetValue)) return;
    
    let currentValue = 0;
    const duration = 2000;
    const increment = targetValue / (duration / 16);
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
            element.textContent = originalText;
        } else {
            element.textContent = originalText.replace(targetValue, Math.floor(currentValue));
        }
    }, 16);
}

function initializeScrollAnimations() {
    const featureSections = document.querySelectorAll('.choose-feature');
    
    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    featureSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        featureObserver.observe(section);
    });
}

function setupTeamMemberInteractions() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        const image = member.querySelector('.member-image img');
        const info = member.querySelector('.member-info');
        
        if (image && info) {
            member.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.1)';
                info.style.backgroundColor = 'var(--primary-color)';
                info.style.color = 'white';
            });
            
            member.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
                info.style.backgroundColor = '';
                info.style.color = '';
            });
        }
    });
}

function addAboutStyles() {
    // Check if styles already added
    if (document.getElementById('about-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'about-styles';
    style.textContent = `
        /* About Page Specific Animations */
        .story-stats {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .stat-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .value-card.active {
            border: 2px solid var(--primary-color);
            transform: scale(1.05);
        }
        
        .team-member {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .member-info {
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        .choose-feature {
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .value-card:hover .value-icon {
            transform: rotate(15deg) scale(1.1);
            transition: transform 0.3s ease;
        }
        
        .value-card .value-icon {
            transition: transform 0.3s ease;
        }
        
        .member-image {
            overflow: hidden;
            position: relative;
        }
        
        .member-image::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, transparent 70%, rgba(0,0,0,0.3));
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .team-member:hover .member-image::after {
            opacity: 1;
        }
        
        @keyframes slideIn {
            from { width: 0; }
            to { width: 100px; }
        }
    `;
    
    document.head.appendChild(style);
}

function showToast(message) {
    if (typeof window.showToast === 'function') {
        window.showToast(message);
        return;
    }
    
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
    
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);
    
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

// ===== INITIALIZE ABOUT PAGE =====
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('about.html') || 
        document.querySelector('.about-hero') || 
        document.querySelector('.story-section')) {
        console.log('About page detected, initializing...');
        initializeAboutPage();
    }
});