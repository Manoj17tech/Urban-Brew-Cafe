// ===== ADMIN PAGE FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPage();
    
    // Refresh button functionality
    const refreshBtn = document.getElementById('refreshOrders');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadOrders);
    }
    
    // Initial load
    loadOrders();
});

function initializeAdminPage() {
    // Check if we're on admin page
    const ordersTable = document.getElementById('ordersTable');
    if (!ordersTable) return;
    
    // Set up auto-refresh (optional)
    // setInterval(loadOrders, 30000); // Refresh every 30 seconds
}

function loadOrders() {
    const ordersTable = document.getElementById('ordersTable');
    const noDataMessage = document.getElementById('noDataMessage');
    
    if (!ordersTable) return;
    
    // Clear existing rows (except header)
    while (ordersTable.rows.length > 1) {
        ordersTable.deleteRow(1);
    }
    
    // Get orders from localStorage
    const orders = getOrdersFromStorage();
    
    if (orders.length === 0) {
        if (noDataMessage) {
            noDataMessage.style.display = 'block';
        }
        return;
    }
    
    if (noDataMessage) {
        noDataMessage.style.display = 'none';
    }
    
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date));
    
    // Populate table
    orders.forEach((order, index) => {
        const row = ordersTable.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${formatDate(order.timestamp || order.date)}</td>
            <td>${escapeHTML(order.name || 'N/A')}</td>
            <td>${escapeHTML(order.phone || 'N/A')}</td>
            <td>${escapeHTML(order.email || 'N/A')}</td>
            <td>${truncateText(order.message || 'No message', 50)}</td>
            <td><span class="status-badge ${getStatusClass(order.status)}">${order.status || 'pending'}</span></td>
        `;
    });
    
    // Update order count
    updateOrderCount(orders.length);
}

function getOrdersFromStorage() {
    try {
        return JSON.parse(localStorage.getItem('urbanBrewOrders')) || [];
    } catch (error) {
        console.error('Error reading orders from localStorage:', error);
        return [];
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return escapeHTML(text);
    
    return escapeHTML(text.substring(0, maxLength)) + '...';
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getStatusClass(status) {
    const statusMap = {
        'pending': 'status-pending',
        'confirmed': 'status-confirmed',
        'completed': 'status-completed',
        'cancelled': 'status-cancelled'
    };
    
    return statusMap[status] || 'status-pending';
}

function updateOrderCount(count) {
    const countElement = document.getElementById('orderCount');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Expose function for external updates
window.updateAdminTable = loadOrders;