// ===== MENU PAGE FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    initializeMenuTabs();
    initializeAddToOrderButtons();
    loadOrderFromStorage();
    updateOrderSummary();
    
    // Restore category from localStorage if available
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
        switchCategory(savedCategory);
    }
});

// ===== CATEGORY TABS =====
function initializeMenuTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    const categoryContents = document.querySelectorAll('.category-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected category content
            switchCategory(category);
            
            // Save to localStorage
            localStorage.setItem('selectedCategory', category);
        });
    });
}

function switchCategory(category) {
    // Hide all category contents
    document.querySelectorAll('.category-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected category
    const targetCategory = document.getElementById(`${category}-category`);
    if (targetCategory) {
        targetCategory.classList.add('active');
        
        // Smooth scroll to category
        targetCategory.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== ADD TO ORDER FUNCTIONALITY =====
function initializeAddToOrderButtons() {
    const addButtons = document.querySelectorAll('.btn-add');
    
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemName = this.getAttribute('data-item');
            const itemPrice = parseFloat(this.getAttribute('data-price'));
            
            addItemToOrder(itemName, itemPrice);
            
            // Visual feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.backgroundColor = 'var(--success-color)';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.backgroundColor = '';
            }, 1500);
            
            // Show toast notification
            showToast(`${itemName} added to order!`);
        });
    });
}

function addItemToOrder(itemName, itemPrice) {
    // Get current order from localStorage
    let order = JSON.parse(localStorage.getItem('urbanBrewOrder')) || [];
    
    // Check if item already exists in order
    const existingItemIndex = order.findIndex(item => item.name === itemName);
    
    if (existingItemIndex > -1) {
        // Increment quantity if item exists
        order[existingItemIndex].quantity += 1;
        order[existingItemIndex].total = order[existingItemIndex].quantity * order[existingItemIndex].price;
    } else {
        // Add new item
        order.push({
            name: itemName,
            price: itemPrice,
            quantity: 1,
            total: itemPrice
        });
    }
    
    // Save back to localStorage
    localStorage.setItem('urbanBrewOrder', JSON.stringify(order));
    
    // Update order display
    updateOrderSummary();
}

function loadOrderFromStorage() {
    const order = JSON.parse(localStorage.getItem('urbanBrewOrder')) || [];
    return order;
}

function updateOrderSummary() {
    const order = loadOrderFromStorage();
    const orderItemsContainer = document.getElementById('orderItems');
    const orderTotalElement = document.getElementById('orderTotal');
    
    if (order.length === 0) {
        orderItemsContainer.innerHTML = '<p class="empty-order">No items added yet. Browse our menu and add items to your order!</p>';
        orderTotalElement.textContent = '$0.00';
        return;
    }
    
    // Calculate total
    let total = 0;
    let itemsHTML = '';
    
    order.forEach(item => {
        total += item.total;
        itemsHTML += `
            <div class="order-item">
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-quantity">×${item.quantity}</span>
                </div>
                <div class="item-price">$${item.total.toFixed(2)}</div>
                <button class="item-remove" data-item="${item.name}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    
    orderItemsContainer.innerHTML = itemsHTML;
    orderTotalElement.textContent = `$${total.toFixed(2)}`;
    
    // Add remove functionality
    document.querySelectorAll('.item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const itemName = this.getAttribute('data-item');
            removeItemFromOrder(itemName);
        });
    });
}

function removeItemFromOrder(itemName) {
    let order = JSON.parse(localStorage.getItem('urbanBrewOrder')) || [];
    
    // Filter out the item to remove
    order = order.filter(item => item.name !== itemName);
    
    // Save back to localStorage
    localStorage.setItem('urbanBrewOrder', JSON.stringify(order));
    
    // Update display
    updateOrderSummary();
    
    // Show toast
    showToast(`${itemName} removed from order`);
}

function clearOrder() {
    localStorage.removeItem('urbanBrewOrder');
    updateOrderSummary();
    showToast('Order cleared');
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Style the toast
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
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateY(100px);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);
    
    // Remove after delay
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

// ===== PAGE-SPECIFIC STYLES (to be added to CSS) =====
function addMenuStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Menu Page Styles */
        .menu-hero {
            background-image: url('https://images.unsplash.com/photo-1507133750040-4a8f57021571?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');
        }
        
        .category-tabs {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 3rem;
            flex-wrap: wrap;
        }
        
        .category-tab {
            padding: 0.75rem 1.5rem;
            background: transparent;
            border: 2px solid var(--border-color);
            border-radius: 50px;
            font-weight: 600;
            color: var(--text-color);
            cursor: pointer;
            transition: var(--transition);
        }
        
        .category-tab:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
        }
        
        .category-tab.active {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            color: white;
        }
        
        .category-content {
            display: none;
        }
        
        .category-content.active {
            display: block;
            animation: fadeIn 0.5s ease;
        }
        
        .menu-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .menu-item {
            background-color: var(--card-bg);
            border-radius: var(--border-radius);
            overflow: hidden;
            box-shadow: 0 5px 15px var(--shadow);
            transition: var(--transition);
            border: 1px solid var(--border-color);
        }
        
        .menu-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px var(--shadow);
        }
        
        .menu-item-img {
            height: 200px;
            overflow: hidden;
        }
        
        .menu-item-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: var(--transition);
        }
        
        .menu-item:hover .menu-item-img img {
            transform: scale(1.05);
        }
        
        .menu-item-content {
            padding: 1.5rem;
        }
        
        .menu-item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.75rem;
        }
        
        .menu-item-header h3 {
            margin: 0;
            font-size: 1.25rem;
        }
        
        .price {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--primary-color);
        }
        
        .menu-item-desc {
            color: var(--text-light);
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
            line-height: 1.5;
        }
        
        .menu-item-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .calories {
            font-size: 0.875rem;
            color: var(--text-light);
        }
        
        .btn-add {
            background-color: var(--accent-color);
            color: var(--dark-color);
            border: none;
            padding: 0.5rem 1.25rem;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
        }
        
        .btn-add:hover {
            background-color: var(--secondary-color);
        }
        
        .order-summary {
            background-color: var(--bg-alt);
            border-radius: var(--border-radius);
            padding: 2rem;
            margin-top: 4rem;
            border: 1px solid var(--border-color);
        }
        
        .order-summary h3 {
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .order-items {
            margin-bottom: 1.5rem;
        }
        
        .order-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--border-color);
        }
        
        .order-item:last-child {
            border-bottom: none;
        }
        
        .item-info {
            flex: 1;
        }
        
        .item-name {
            font-weight: 500;
            display: block;
        }
        
        .item-quantity {
            font-size: 0.875rem;
            color: var(--text-light);
        }
        
        .item-price {
            font-weight: 600;
            margin: 0 1rem;
        }
        
        .item-remove {
            background: none;
            border: none;
            color: var(--error-color);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            transition: var(--transition);
        }
        
        .item-remove:hover {
            background-color: rgba(198, 40, 40, 0.1);
        }
        
        .order-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1.5rem;
            border-top: 2px solid var(--border-color);
        }
        
        .order-total p {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 700;
        }
        
        .empty-order {
            text-align: center;
            color: var(--text-light);
            padding: 2rem;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
            .category-tabs {
                gap: 0.5rem;
            }
            
            .category-tab {
                padding: 0.5rem 1rem;
                font-size: 0.875rem;
            }
            
            .menu-grid {
                grid-template-columns: 1fr;
            }
            
            .order-total {
                flex-direction: column;
                gap: 1rem;
                align-items: stretch;
            }
            
            .order-total .btn {
                width: 100%;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize styles when page loads
addMenuStyles();