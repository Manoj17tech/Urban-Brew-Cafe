// ===== CONTACT PAGE FUNCTIONALITY =====

// Define all functions first
function initializeContactPage() {
    console.log('Initializing Contact page features');
    addContactStyles();
    loadCurrentOrder();
    setupContactInfoCards();
    initializeFormAutoSave();
    initializeFAQAccordion();
    initializeTimePicker();
    initializeMapPlaceholder();
}

function initializeFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const summary = item.querySelector('summary');
        
        if (summary) {
            summary.addEventListener('click', function(e) {
                const isOpening = !item.open;
                
                if (isOpening) {
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.open) {
                            otherItem.open = false;
                        }
                    });
                }
                
                if (isOpening) {
                    item.style.backgroundColor = 'var(--bg-alt)';
                } else {
                    item.style.backgroundColor = '';
                }
            });
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.faq-item')) {
            faqItems.forEach(item => {
                item.open = false;
                item.style.backgroundColor = '';
            });
        }
    });
}

function loadCurrentOrder() {
    const orderContainer = document.getElementById('currentOrder');
    if (!orderContainer) return;
    
    const order = JSON.parse(localStorage.getItem('urbanBrewOrder')) || [];
    
    if (order.length === 0) {
        orderContainer.innerHTML = `
            <p class="empty-order">
                No items in your cart yet. 
                <a href="menu.html" class="btn-link">Browse our menu</a> to add items!
            </p>
        `;
        return;
    }
    
    displayOrder(order);
    prefillOrderMessage(order);
}

function displayOrder(order) {
    const orderContainer = document.getElementById('currentOrder');
    if (!orderContainer) return;
    
    let total = 0;
    let itemsHTML = '<div class="order-items-list">';
    
    order.forEach(item => {
        total += item.total;
        itemsHTML += `
            <div class="order-item-row">
                <div class="item-info">
                    <span class="item-name">${escapeHTML(item.name)}</span>
                    <span class="item-quantity">×${item.quantity}</span>
                </div>
                <div class="item-price">$${item.total.toFixed(2)}</div>
            </div>
        `;
    });
    
    itemsHTML += '</div>';
    itemsHTML += `
        <div class="order-total-row">
            <strong>Order Total:</strong>
            <strong class="total-amount">$${total.toFixed(2)}</strong>
        </div>
        <div class="order-actions">
            <button class="btn btn-secondary" id="clearOrderBtn">
                <i class="fas fa-trash"></i> Clear Order
            </button>
            <a href="menu.html" class="btn btn-primary">
                <i class="fas fa-edit"></i> Edit Order
            </a>
        </div>
    `;
    
    orderContainer.innerHTML = itemsHTML;
    
    const clearBtn = document.getElementById('clearOrderBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearOrder);
    }
}

function prefillOrderMessage(order) {
    const messageField = document.getElementById('message');
    if (!messageField) return;
    
    if (!messageField.value.trim()) {
        let orderText = "I'd like to order:\n\n";
        
        order.forEach(item => {
            orderText += `• ${item.quantity}x ${item.name} - $${item.total.toFixed(2)}\n`;
        });
        
        const total = order.reduce((sum, item) => sum + item.total, 0);
        orderText += `\nTotal: $${total.toFixed(2)}`;
        
        messageField.value = orderText;
    }
}

function clearOrder() {
    localStorage.removeItem('urbanBrewOrder');
    loadCurrentOrder();
    showToast('Order cleared successfully');
}

function initializeFormEnhancements() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const messageField = document.getElementById('message');
    if (messageField) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.textContent = '0/500 characters';
        messageField.parentNode.appendChild(counter);
        
        messageField.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length}/500 characters`;
            
            if (length > 500) {
                counter.style.color = 'var(--error-color)';
            } else if (length > 400) {
                counter.style.color = 'orange';
            } else {
                counter.style.color = 'var(--text-light)';
            }
        });
    }
    
    const orderTypeSelect = document.getElementById('orderType');
    const timeField = document.getElementById('preferredTime');
    
    if (orderTypeSelect && timeField) {
        orderTypeSelect.addEventListener('change', function() {
            if (this.value === 'delivery') {
                timeField.disabled = false;
                timeField.placeholder = "Preferred delivery time";
                showToast('Delivery available within 5-mile radius. $3.99 delivery fee.');
            } else if (this.value === 'pickup') {
                timeField.disabled = false;
                timeField.placeholder = "Preferred pickup time";
            } else {
                timeField.disabled = true;
                timeField.value = '';
            }
        });
    }
}

function initializeTimePicker() {
    const timeField = document.getElementById('preferredTime');
    if (!timeField) return;
    
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const defaultTime = `${hours}:${minutes}`;
    
    timeField.value = defaultTime;
    
    const timeSuggestions = document.createElement('div');
    timeSuggestions.className = 'time-suggestions';
    timeSuggestions.innerHTML = `
        <small>Quick select:</small>
        <button type="button" class="time-suggestion" data-time="08:00">8:00 AM</button>
        <button type="button" class="time-suggestion" data-time="12:00">12:00 PM</button>
        <button type="button" class="time-suggestion" data-time="15:30">3:30 PM</button>
    `;
    
    timeField.parentNode.appendChild(timeSuggestions);
    
    document.querySelectorAll('.time-suggestion').forEach(button => {
        button.addEventListener('click', function() {
            timeField.value = this.getAttribute('data-time');
            showToast(`Time set to ${this.textContent}`);
        });
    });
}

function initializeMapPlaceholder() {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (!mapPlaceholder) return;
    
    mapPlaceholder.addEventListener('click', function() {
        showToast('This would open Google Maps with our location');
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
}

function setupContactInfoCards() {
    const infoCards = document.querySelectorAll('.info-card');
    
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px var(--shadow)';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.color = 'var(--primary-color)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px var(--shadow)';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1)';
                icon.style.color = '';
            }
        });
        
        if (card.querySelector('h3').textContent.includes('Visit Us')) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                showToast('Address copied to clipboard: 123 Coffee Street, Urban District');
            });
        }
    });
}

function initializeFormAutoSave() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const formFields = form.querySelectorAll('input, textarea, select');
    const storageKey = 'contactFormDraft';
    
    const savedDraft = localStorage.getItem(storageKey);
    if (savedDraft) {
        try {
            const draft = JSON.parse(savedDraft);
            formFields.forEach(field => {
                if (draft[field.id]) {
                    field.value = draft[field.id];
                }
            });
            showToast('Draft restored from previous session');
        } catch (e) {
            console.error('Error loading draft:', e);
        }
    }
    
    formFields.forEach(field => {
        field.addEventListener('input', saveFormDraft);
    });
    
    form.addEventListener('submit', function() {
        setTimeout(() => {
            if (form.checkValidity()) {
                localStorage.removeItem(storageKey);
            }
        }, 1000);
    });
    
    function saveFormDraft() {
        const draft = {};
        formFields.forEach(field => {
            draft[field.id] = field.value;
        });
        localStorage.setItem(storageKey, JSON.stringify(draft));
    }
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addContactStyles() {
    if (document.getElementById('contact-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'contact-styles';
    style.textContent = `
        .info-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: default;
        }
        
        .info-card i {
            transition: transform 0.3s ease, color 0.3s ease;
        }
        
        .faq-item {
            transition: background-color 0.3s ease;
        }
        
        .faq-item[open] {
            background-color: var(--bg-alt);
        }
        
        .faq-item summary::-webkit-details-marker {
            display: none;
        }
        
        .map-placeholder {
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        
        .map-placeholder:hover {
            background-color: var(--bg-color);
        }
        
        .order-review {
            animation: slideUp 0.5s ease;
        }
        
        .order-items-list {
            max-height: 300px;
            overflow-y: auto;
            margin-bottom: 1rem;
        }
        
        .order-item-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
            border-bottom: 1px solid var(--border-color);
            animation: fadeIn 0.3s ease;
        }
        
        .order-item-row:last-child {
            border-bottom: none;
        }
        
        .order-total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background-color: var(--bg-alt);
            border-radius: var(--border-radius);
            margin: 1rem 0;
            font-size: 1.1rem;
        }
        
        .total-amount {
            color: var(--primary-color);
            font-size: 1.25rem;
        }
        
        .order-actions {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        
        .char-counter {
            text-align: right;
            font-size: 0.875rem;
            color: var(--text-light);
            margin-top: 0.25rem;
            transition: color 0.3s ease;
        }
        
        .time-suggestions {
            display: flex;
            gap: 0.5rem;
            align-items: center;
            flex-wrap: wrap;
            margin-top: 0.5rem;
        }
        
        .time-suggestion {
            background-color: var(--bg-alt);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 0.25rem 0.75rem;
            font-size: 0.875rem;
            cursor: pointer;
            transition: var(--transition);
        }
        
        .time-suggestion:hover {
            background-color: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        
        .btn-link {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 600;
            transition: var(--transition);
        }
        
        .btn-link:hover {
            text-decoration: underline;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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

// ===== INITIALIZE CONTACT PAGE =====
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('contact.html') || 
        document.querySelector('.contact-hero') || 
        document.querySelector('.contact-section')) {
        console.log('Contact page detected, initializing...');
        initializeContactPage();
        initializeFormEnhancements();
    }
});