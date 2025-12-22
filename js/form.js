// ===== CONTACT FORM HANDLING =====
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // Form elements
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const successMessage = document.getElementById('successMessage');
    
    // Initialize form
    initializeForm();
    
    function initializeForm() {
        // Real-time validation
        nameInput.addEventListener('blur', validateName);
        phoneInput.addEventListener('blur', validatePhone);
        emailInput.addEventListener('blur', validateEmail);
        messageInput.addEventListener('blur', validateMessage);
        
        // Form submission
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Clear success message on input
        contactForm.addEventListener('input', function() {
            if (successMessage.style.display === 'block') {
                successMessage.style.display = 'none';
            }
        });
    }
    
    // ===== VALIDATION FUNCTIONS =====
    function validateName() {
        const name = nameInput.value.trim();
        const errorElement = document.getElementById('nameError');
        
        if (!name) {
            showError(nameInput, errorElement, 'Name is required');
            return false;
        }
        
        if (name.length < 2) {
            showError(nameInput, errorElement, 'Name must be at least 2 characters');
            return false;
        }
        
        clearError(nameInput, errorElement);
        return true;
    }
    
    function validatePhone() {
        const phone = phoneInput.value.trim();
        const errorElement = document.getElementById('phoneError');
        
        if (!phone) {
            showError(phoneInput, errorElement, 'Phone number is required');
            return false;
        }
        
        // Remove non-digits for validation
        const digitsOnly = phone.replace(/\D/g, '');
        
        if (digitsOnly.length < 10) {
            showError(phoneInput, errorElement, 'Phone number must be at least 10 digits');
            return false;
        }
        
        clearError(phoneInput, errorElement);
        return true;
    }
    
    function validateEmail() {
        const email = emailInput.value.trim();
        const errorElement = document.getElementById('emailError');
        
        if (!email) {
            showError(emailInput, errorElement, 'Email is required');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError(emailInput, errorElement, 'Please enter a valid email address');
            return false;
        }
        
        clearError(emailInput, errorElement);
        return true;
    }
    
    function validateMessage() {
        const message = messageInput.value.trim();
        const errorElement = document.getElementById('messageError');
        
        if (!message) {
            showError(messageInput, errorElement, 'Message is required');
            return false;
        }
        
        if (message.length < 10) {
            showError(messageInput, errorElement, 'Message must be at least 10 characters');
            return false;
        }
        
        clearError(messageInput, errorElement);
        return true;
    }
    
    // ===== ERROR HANDLING =====
    function showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function clearError(input, errorElement) {
        input.classList.remove('error');
        errorElement.style.display = 'none';
    }
    
    // ===== FORM SUBMISSION =====
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateName();
        const isPhoneValid = validatePhone();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();
        
        if (!isNameValid || !isPhoneValid || !isEmailValid || !isMessageValid) {
            // Scroll to first error
            const firstError = document.querySelector('.form-control.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }
        
        // Prepare form data
        const formData = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim(),
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        // Save to localStorage
        const saved = saveOrder(formData);
        
        if (saved) {
            // Show success message
            successMessage.textContent = `Thank you, ${formData.name}! Your order has been received. We'll contact you shortly.`;
            successMessage.style.display = 'block';
            
            // Reset form
            contactForm.reset();
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Clear any remaining errors
            document.querySelectorAll('.error-message').forEach(el => {
                el.style.display = 'none';
            });
            document.querySelectorAll('.form-control').forEach(el => {
                el.classList.remove('error');
            });
            
            // Optional: Send to server (for future implementation)
            // sendToServer(formData);
        } else {
            alert('There was an error submitting your order. Please try again.');
        }
    }
    
    // ===== LOCALSTORAGE FUNCTIONS =====
    function saveOrder(orderData) {
        try {
            // Get existing orders or initialize empty array
            const existingOrders = JSON.parse(localStorage.getItem('urbanBrewOrders')) || [];
            
            // Add new order with unique ID
            orderData.id = Date.now();
            existingOrders.push(orderData);
            
            // Save back to localStorage
            localStorage.setItem('urbanBrewOrders', JSON.stringify(existingOrders));
            
            // Update admin page if open
            if (typeof updateAdminTable === 'function') {
                updateAdminTable();
            }
            
            return true;
        } catch (error) {
            console.error('Error saving order:', error);
            return false;
        }
    }
});