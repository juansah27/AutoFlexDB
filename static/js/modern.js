/**
 * Modern UI JavaScript
 * Handles user interactions, theme switching, and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    initThemeToggle();
    
    // Mobile Navigation
    initMobileNav();
    
    // Form Animations
    initFormAnimations();
    
    // Ripple Effect
    initRippleEffect();
    
    // Scroll Animations
    initScrollAnimations();
    
    // Tooltips
    initTooltips();
    
    // Notifications
    initNotifications();
    
    // Fix Hover Issues
    fixHoverIssues();
});

/**
 * Initialize theme toggle functionality
 */
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use OS preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.setAttribute('data-tooltip', 'Beralih ke Tema Terang');
        }
    } else {
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.setAttribute('data-tooltip', 'Beralih ke Tema Gelap');
        }
    }
    
    // Toggle theme when button is clicked
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                themeToggle.setAttribute('data-tooltip', 'Beralih ke Tema Terang');
                
                // Trigger event for other components to update
                document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: 'dark' } }));
            } else {
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                themeToggle.setAttribute('data-tooltip', 'Beralih ke Tema Gelap');
                
                // Trigger event for other components to update
                document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: 'light' } }));
            }
            
            // Add animation
            themeToggle.classList.add('pulse');
            setTimeout(() => {
                themeToggle.classList.remove('pulse');
            }, 1000);
        });
    }
    
    // Listen for OS theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-theme');
                if (themeToggle) {
                    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                    themeToggle.setAttribute('data-tooltip', 'Beralih ke Tema Terang');
                }
            } else {
                document.body.classList.remove('dark-theme');
                if (themeToggle) {
                    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                    themeToggle.setAttribute('data-tooltip', 'Beralih ke Tema Gelap');
                }
            }
        }
    });
}

/**
 * Initialize mobile navigation
 */
function initMobileNav() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarNav = document.querySelector('.navbar-nav');
    
    if (navbarToggle && navbarNav) {
        navbarToggle.addEventListener('click', function() {
            navbarNav.classList.toggle('show');
            
            // Change icon
            const icon = navbarToggle.querySelector('i');
            if (icon) {
                if (navbarNav.classList.contains('show')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navbarToggle.contains(event.target) && !navbarNav.contains(event.target) && navbarNav.classList.contains('show')) {
                navbarNav.classList.remove('show');
                
                // Reset icon
                const icon = navbarToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
}

/**
 * Initialize form animations
 */
function initFormAnimations() {
    // Add floating label effect
    const formControls = document.querySelectorAll('.form-control');
    
    formControls.forEach(control => {
        // Create and add label if it doesn't exist
        const formGroup = control.closest('.form-group');
        if (formGroup) {
            const label = formGroup.querySelector('label');
            
            if (label) {
                // Add floating label class
                label.classList.add('form-label-floating');
                
                // Check if input has value on load
                if (control.value !== '') {
                    label.classList.add('active');
                }
                
                // Add event listeners
                control.addEventListener('focus', () => {
                    label.classList.add('active');
                });
                
                control.addEventListener('blur', () => {
                    if (control.value === '') {
                        label.classList.remove('active');
                    }
                });
            }
        }
    });
}

/**
 * Initialize ripple effect for buttons
 */
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple style if not already in CSS
    if (!document.querySelector('style#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            .btn {
                position: relative;
                overflow: hidden;
            }
            .ripple {
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animatedElements.forEach(element => {
            element.classList.add('animated');
        });
    }
    
    // Add animation styles if not already in CSS
    if (!document.querySelector('style#scroll-animations')) {
        const style = document.createElement('style');
        style.id = 'scroll-animations';
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .animate-on-scroll.animated {
                opacity: 1;
                transform: translateY(0);
            }
            .animate-fade-in {
                animation-name: fadeIn;
            }
            .animate-slide-up {
                animation-name: slideInUp;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Initialize tooltips
 */
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        const tooltipText = element.getAttribute('data-tooltip');
        if (!tooltipText) return; // Skip jika tidak ada teks tooltip
        
        element.addEventListener('mouseenter', () => {
            const tooltip = document.createElement('div');
            if (!tooltip) return; // Skip jika gagal membuat elemen
            
            tooltip.classList.add('tooltip');
            tooltip.textContent = tooltipText;
            
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            tooltip.style.top = `${rect.top - tooltipRect.height - 10}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltipRect.width / 2)}px`;
            
            setTimeout(() => {
                if (tooltip && tooltip.classList) {
                    tooltip.classList.add('show');
                }
            }, 10);
        });
        
        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.classList.remove('show');
                
                tooltip.addEventListener('transitionend', () => {
                    if (tooltip && tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                });
            }
        });
    });
    
    // Add tooltip styles if not already in CSS
    if (!document.querySelector('style#tooltip-style')) {
        const style = document.createElement('style');
        if (!style) return; // Skip jika gagal membuat elemen
        
        style.id = 'tooltip-style';
        style.textContent = `
            .tooltip {
                position: fixed;
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 9999;
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 0.2s, transform 0.2s;
                pointer-events: none;
            }
            .tooltip.show {
                opacity: 1;
                transform: translateY(0);
            }
            .tooltip::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
            }
            .dark-theme .tooltip {
                background-color: rgba(255, 255, 255, 0.8);
                color: black;
            }
            .dark-theme .tooltip::after {
                border-color: rgba(255, 255, 255, 0.8) transparent transparent transparent;
            }
        `;
        
        document.head.appendChild(style);
    }
}

/**
 * Initialize notification system
 */
function initNotifications() {
    // Create notification container if it doesn't exist
    if (!document.querySelector('.notification-container')) {
        const container = document.createElement('div');
        container.classList.add('notification-container');
        document.body.appendChild(container);
    }
    
    // Add notification styles if not already in CSS
    if (!document.querySelector('style#notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
            }
            .notification {
                background-color: white;
                color: #333;
                border-radius: 4px;
                padding: 15px 20px;
                margin-bottom: 10px;
                box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                transform: translateX(120%);
                transition: transform 0.3s ease;
                display: flex;
                align-items: center;
                min-width: 300px;
                max-width: 400px;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-icon {
                margin-right: 15px;
                font-size: 20px;
            }
            .notification-content {
                flex: 1;
            }
            .notification-title {
                font-weight: bold;
                margin-bottom: 5px;
            }
            .notification-close {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                font-size: 16px;
                margin-left: 10px;
            }
            .notification-success .notification-icon {
                color: #4caf50;
            }
            .notification-error .notification-icon {
                color: #f44336;
            }
            .notification-warning .notification-icon {
                color: #ff9800;
            }
            .notification-info .notification-icon {
                color: #2196f3;
            }
            .dark-theme .notification {
                background-color: #333;
                color: white;
            }
            .dark-theme .notification-close {
                color: rgba(255, 255, 255, 0.6);
            }
            .dark-theme .notification-close:hover {
                color: rgba(255, 255, 255, 0.9);
            }
            .dark-theme .notification-success .notification-icon {
                color: #81c784;
            }
            .dark-theme .notification-error .notification-icon {
                color: #e57373;
            }
            .dark-theme .notification-warning .notification-icon {
                color: #ffb74d;
            }
            .dark-theme .notification-info .notification-icon {
                color: #64b5f6;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Listen for theme changes to update notifications
    document.addEventListener('themeChanged', function(e) {
        const notifications = document.querySelectorAll('.notification');
        if (notifications.length > 0) {
            notifications.forEach(notification => {
                if (e.detail.theme === 'dark') {
                    notification.style.backgroundColor = '#333';
                    notification.style.color = 'white';
                } else {
                    notification.style.backgroundColor = 'white';
                    notification.style.color = '#333';
                }
            });
        }
    });
}

/**
 * Show a notification
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, warning, info)
 * @param {string} title - The notification title (optional)
 * @param {number} duration - How long to show the notification in ms (default: 5000)
 */
function showNotification(message, type = 'info', title = '', duration = 5000) {
    const container = document.querySelector('.notification-container');
    
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-exclamation-circle';
    if (type === 'warning') iconClass = 'fa-exclamation-triangle';
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="notification-content">
            ${title ? `<div class="notification-title">${title}</div>` : ''}
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Show notification with a slight delay for animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto close after duration
    if (duration > 0) {
        setTimeout(() => {
            closeNotification(notification);
        }, duration);
    }
}

/**
 * Close a notification
 * @param {HTMLElement} notification - The notification element to close
 */
function closeNotification(notification) {
    notification.classList.remove('show');
    
    notification.addEventListener('transitionend', () => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
}

/**
 * Fix hover issues where hover effects remain after mouse leaves
 */
function fixHoverIssues() {
    // Elements that commonly have hover issues
    const hoverElements = [
        '.btn', 
        '.btn-primary', 
        '.btn-secondary', 
        '.btn-success', 
        '.btn-error', 
        '.btn-warning', 
        '.btn-info', 
        '.btn-outline', 
        '.btn-text', 
        '.nav-link', 
        '.theme-toggle',
        '.card',
        '.form-control',
        '.toggle-password'
    ];
    
    // Add mouseout event listeners to all hover elements
    hoverElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('mouseout', function() {
                // Force removal of any hover state
                this.classList.remove('hover-active');
                
                // Reset any inline styles that might be causing the issue
                if (this.hasAttribute('style')) {
                    const style = this.getAttribute('style');
                    if (style.includes('background-color') || style.includes('color') || style.includes('box-shadow')) {
                        this.removeAttribute('style');
                    }
                }
            });
        });
    });
    
    // Add global mousemove listener to detect when mouse is not over any hover element
    document.addEventListener('mousemove', function(e) {
        const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
        
        // If we're not hovering over any of our hover elements, make sure none of them have hover effects
        if (hoveredElement) {
            let isHoverElement = false;
            
            for (const selector of hoverElements) {
                if (hoveredElement.matches(selector) || hoveredElement.closest(selector)) {
                    isHoverElement = true;
                    break;
                }
            }
            
            if (!isHoverElement) {
                // Clear any stuck hover effects
                hoverElements.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        element.classList.remove('hover-active');
                        
                        // Reset any inline styles that might be causing the issue
                        if (element.hasAttribute('style')) {
                            const style = element.getAttribute('style');
                            if (style.includes('background-color') || style.includes('color') || style.includes('box-shadow')) {
                                element.removeAttribute('style');
                            }
                        }
                    });
                });
            }
        }
    });
    
    // Add CSS to ensure hover effects are properly applied and removed
    const style = document.createElement('style');
    style.textContent = `
        /* Ensure hover effects are properly applied and removed */
        .btn:not(:hover),
        .nav-link:not(:hover),
        .theme-toggle:not(:hover),
        .card:not(:hover),
        .form-control:not(:hover),
        .toggle-password:not(:hover) {
            transition: all var(--transition-normal) !important;
        }
    `;
    document.head.appendChild(style);
}

// Fungsi untuk menguji status timeline chart
function testStatusTimelineChart() {
    console.log("[DEBUG] Testing status timeline chart");
    
    // Sample data untuk testing
    const sampleData = [
        { sku: 'SKU456-10', start_date: '2024-02-01', end_date: '2024-04-15', duration: 75 }, // Durasi terlama: 75 hari
        { sku: 'SKU789-11', start_date: '2024-03-10', end_date: '2024-05-20', duration: 72 }, // Durasi: 72 hari
        { sku: 'blablabla123-09', start_date: '2024-02-01', end_date: '2024-03-10', duration: 39 }, // Durasi: 39 hari
        { sku: 'SKU123-09', start_date: '2024-01-15', end_date: '2024-02-28', duration: 45 }, // Durasi: 45 hari
        { sku: 'TESTER-001', start_date: '2023-12-25', end_date: '2024-01-31', duration: 38 } // Durasi: 38 hari
    ];
    
    // Extract data
    const skus = sampleData.map(item => item.sku);
    const startDates = sampleData.map(item => item.start_date);
    const endDates = sampleData.map(item => item.end_date);
    
    // Get containers
    const timelineContainer = document.getElementById('timelineChart');
    const statusContainer = document.getElementById('statusChart');
    
    if (!timelineContainer || !statusContainer) {
        console.error("[ERROR] Chart containers not found! Menambahkan elemen canvas secara dinamis.");
        
        // Buat container untuk chart jika tidak ditemukan
        const chartSection = document.createElement('div');
        chartSection.id = 'dynamicChartSection';
        chartSection.style.padding = '20px';
        chartSection.style.marginTop = '20px';
        chartSection.style.backgroundColor = 'rgba(0,0,0,0.03)';
        chartSection.style.borderRadius = '8px';
        
        // Container untuk timelineChart
        const timelineDiv = document.createElement('div');
        timelineDiv.style.height = '300px';
        timelineDiv.style.marginBottom = '20px';
        
        const timelineCanvas = document.createElement('canvas');
        timelineCanvas.id = 'timelineChart';
        timelineDiv.appendChild(timelineCanvas);
        
        // Container untuk statusChart
        const statusDiv = document.createElement('div');
        statusDiv.style.height = '300px';
        
        const statusCanvas = document.createElement('canvas');
        statusCanvas.id = 'statusChart';
        statusDiv.appendChild(statusCanvas);
        
        // Tambahkan ke container
        chartSection.appendChild(timelineDiv);
        chartSection.appendChild(statusDiv);
        
        // Tambahkan ke body dokumen
        document.body.appendChild(chartSection);
        
        // Dapatkan referensi baru
        const timelineContainerNew = document.getElementById('timelineChart');
        const statusContainerNew = document.getElementById('statusChart');
        
        // Jika masih belum ditemukan, keluar
        if (!timelineContainerNew || !statusContainerNew) {
            console.error("[ERROR] Tidak dapat membuat container chart secara dinamis!");
            return;
        }
    }
    
    // Check if functions are available globally
    if (typeof window.createStatusTimelineChart !== 'function') {
        console.error('[ERROR] Function createStatusTimelineChart is not available');
        return;
    }
    
    if (typeof window.createBarChart !== 'function') {
        console.error('[ERROR] Function createBarChart is not available');
        return;
    }
    
    try {
        // Buat charts (gunakan fungsi yang tersedia di window)
        window.createStatusTimelineChart(
            timelineContainer || document.getElementById('timelineChart'), 
            skus,
            startDates,
            endDates,
            true // tampilkan semua data
        );
        
        // Buat chart kedua
        window.createBarChart(
            statusContainer || document.getElementById('statusChart'),
            skus,
            sampleData.map(item => item.duration),
            startDates,
            endDates
        );
        
        console.log("[DEBUG] Charts berhasil dibuat");
    } catch (error) {
        console.error("[ERROR] Gagal membuat chart:", error);
    }
}

// Fungsi untuk menguji BOM Timeline chart
function testBomTimelineChart() {
    console.log("[DEBUG] Testing BOM timeline chart");
    
    // Periksa apakah fungsi tersedia
    if (typeof window.createBomTimelineChart !== 'function') {
        console.error('[ERROR] Fungsi createBomTimelineChart tidak tersedia');
        return;
    }
    
    // Data contoh dengan urutan kolom sesuai file output:
    // - MainSKU: SKU produk utama
    // - BomSKU: SKU komponen yang digunakan
    // - Qty: Jumlah komponen yang dibutuhkan
    // - StartDate: Tanggal mulai penggunaan komponen
    // - EndDate: Tanggal akhir penggunaan komponen
    
    // Perhitungan durasi untuk setiap MainSKU
    const mainSkuData = [
        {
            mainSku: 'BUNDLE-A001',
            startDate: '2024-03-01',
            endDate: '2024-05-31',
            duration: 92 // Dihitung: 31 (Maret) + 30 (April) + 31 (Mei) = 92 hari
        },
        {
            mainSku: 'BUNDLE-B002',
            startDate: '2024-04-15',
            endDate: '2024-06-15',
            duration: 62 // Dihitung: 16 (April) + 31 (Mei) + 15 (Juni) = 62 hari
        },
        {
            mainSku: 'BUNDLE-C003',
            startDate: '2024-02-15',
            endDate: '2024-04-30',
            duration: 76 // Dihitung: 15 (Feb) + 31 (Maret) + 30 (April) = 76 hari
        }
    ];
    
    // Urutkan MainSKU berdasarkan durasi (dari terlama ke tersingkat)
    mainSkuData.sort((a, b) => b.duration - a.duration);
    
    // Atur ulang data berdasarkan urutan durasi yang baru
    const sampleData = [];
    
    // BUNDLE-A001 - Durasi terlama (92 hari)
    sampleData.push({
        mainSku: 'BUNDLE-A001',
        bomSku: 'COMP-0123',
        qty: 2,
        startDate: '2024-03-01',
        endDate: '2024-05-31'
    });
    sampleData.push({
        mainSku: 'BUNDLE-A001',
        bomSku: 'COMP-0456',
        qty: 1,
        startDate: '2024-03-01',
        endDate: '2024-05-31'
    });
    sampleData.push({
        mainSku: 'BUNDLE-A001',
        bomSku: 'COMP-0789',
        qty: 3,
        startDate: '2024-03-01',
        endDate: '2024-05-31'
    });
    
    // BUNDLE-C003 - Durasi kedua (76 hari)
    sampleData.push({
        mainSku: 'BUNDLE-C003',
        bomSku: 'COMP-0333',
        qty: 4,
        startDate: '2024-02-15',
        endDate: '2024-04-30'
    });
    sampleData.push({
        mainSku: 'BUNDLE-C003',
        bomSku: 'COMP-0444',
        qty: 2,
        startDate: '2024-02-15',
        endDate: '2024-04-30'
    });
    sampleData.push({
        mainSku: 'BUNDLE-C003',
        bomSku: 'COMP-0555',
        qty: 1,
        startDate: '2024-02-15',
        endDate: '2024-04-30'
    });
    
    // BUNDLE-B002 - Durasi tersingkat (62 hari)
    sampleData.push({
        mainSku: 'BUNDLE-B002',
        bomSku: 'COMP-0123',
        qty: 1,
        startDate: '2024-04-15',
        endDate: '2024-06-15'
    });
    sampleData.push({
        mainSku: 'BUNDLE-B002',
        bomSku: 'COMP-0222',
        qty: 2,
        startDate: '2024-04-15',
        endDate: '2024-06-15'
    });
    
    // Untuk setiap grup MainSKU, urutkan BomSKU berdasarkan qty (descending)
    const groupedSampleData = {};
    mainSkuData.forEach(mainSkuItem => {
        groupedSampleData[mainSkuItem.mainSku] = sampleData.filter(item => item.mainSku === mainSkuItem.mainSku)
            .sort((a, b) => b.qty - a.qty); // Urutkan berdasarkan qty (descending)
    });
    
    // Reconstruct sample data dengan urutan yang benar
    const finalSampleData = [];
    mainSkuData.forEach(mainSkuItem => {
        finalSampleData.push(...groupedSampleData[mainSkuItem.mainSku]);
    });
    
    // Warna untuk MainSKU
    const colorPalette = [
        'rgba(54, 162, 235, 0.8)',   // Biru
        'rgba(75, 192, 192, 0.8)',   // Hijau
        'rgba(255, 99, 132, 0.8)',   // Merah
        'rgba(255, 206, 86, 0.8)',   // Kuning
        'rgba(153, 102, 255, 0.8)',  // Ungu
        'rgba(255, 159, 64, 0.8)'    // Oranye
    ];
    
    // Dapatkan container untuk chart
    const bomTimelineContainer = document.getElementById('bomTimelineChart');
    
    if (!bomTimelineContainer) {
        console.error("[ERROR] Container untuk BOM Timeline Chart tidak ditemukan! Menambahkan elemen canvas secara dinamis.");
        
        // Buat container untuk chart jika tidak ditemukan
        const chartSection = document.createElement('div');
        chartSection.id = 'bomChartContainer';
        chartSection.style.padding = '20px';
        chartSection.style.marginTop = '20px';
        chartSection.style.backgroundColor = 'rgba(0,0,0,0.03)';
        chartSection.style.borderRadius = '8px';
        
        // Container untuk bomTimelineChart
        const bomTimelineDiv = document.createElement('div');
        bomTimelineDiv.style.height = '600px';
        bomTimelineDiv.style.marginBottom = '20px';
        
        const bomTimelineCanvas = document.createElement('canvas');
        bomTimelineCanvas.id = 'bomTimelineChart';
        bomTimelineDiv.appendChild(bomTimelineCanvas);
        
        // Tambahkan ke container
        chartSection.appendChild(bomTimelineDiv);
        
        // Tambahkan ke body dokumen
        document.body.appendChild(chartSection);
        
        // Dapatkan referensi baru
        const bomTimelineContainerNew = document.getElementById('bomTimelineChart');
        
        // Jika masih belum ditemukan, keluar
        if (!bomTimelineContainerNew) {
            console.error("[ERROR] Tidak dapat membuat container chart secara dinamis!");
            return;
        }
    }
    
    try {
        // Buat chart
        window.createBomTimelineChart(
            bomTimelineContainer || document.getElementById('bomTimelineChart'),
            finalSampleData,
            colorPalette
        );
        
        console.log("[DEBUG] BOM Timeline Chart berhasil dibuat");
    } catch (error) {
        console.error("[ERROR] Gagal membuat BOM Timeline Chart:", error);
    }
}

// Fungsi utilitas untuk update progress bar
function updateProgress(percent) {
    try {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = percent + '%';
            progressBar.textContent = percent + '%';
        }
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

// Fungsi utilitas untuk menambahkan log
function addLog(message) {
    try {
        const logOutput = document.getElementById('logOutput');
        if (logOutput) {
            const time = new Date().toLocaleTimeString();
            logOutput.innerHTML += `[${time}] ${message}\n`;
            logOutput.scrollTop = logOutput.scrollHeight;
        }
    } catch (error) {
        console.error('Error adding log:', error);
    }
}

// Menangani pengiriman formulir
try {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const processButton = document.getElementById('processButton');
    const progressBar = document.querySelector('.progress-bar');
    const logOutput = document.getElementById('logOutput');
    const downloadContainer = document.getElementById('downloadContainer');

    if (uploadForm) {
        uploadForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validasi file
            if (fileInput.files.length === 0) {
                showNotification('Silakan pilih file terlebih dahulu', 'error');
                return;
            }
        
            // Persiapan pengiriman data
            const formData = new FormData(this);
            
            // Reset UI
            logOutput.innerHTML = '';
            progressBar.style.width = '0%';
            progressBar.textContent = '0%';
            downloadContainer.style.display = 'none';
            
            // Tampilkan progres awal
            updateProgress(10);
            addLog('Mengunggah file...');
            
            // Nonaktifkan tombol selama pemrosesan
            processButton.disabled = true;
            
            // Kirim permintaan AJAX
            fetch('/process', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                updateProgress(50);
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    showNotification(data.error, 'error');
                    updateProgress(0);
                } else {
                    updateProgress(100);
                    addLog('File berhasil diproses!');
                    
                    // Tampilkan log dari server
                    if (data.log && Array.isArray(data.log)) {
                        data.log.forEach(logMessage => {
                            addLog(logMessage);
                        });
                    }
                    
                    // Tampilkan tombol unduh
                    if (data.output_file) {
                        outputFileName = data.output_file;
                        downloadContainer.style.display = 'block';
                        addLog(`File hasil: ${outputFileName}`);
                        addLog('Sheet "Validasi" berisi perbandingan data input dan output');
                        addLog('Sheet "Analisa Validasi" berisi visualisasi grafik dan statistik hasil validasi');
                    }
                    
                    showNotification(data.message || 'File berhasil diproses', 'success');
                }
            })
            .catch(error => {
                showNotification('Terjadi kesalahan: ' + error.message, 'error');
                updateProgress(0);
            })
            .finally(() => {
                // Aktifkan kembali tombol
                processButton.disabled = false;
            });
        });
    }
} catch (error) {
    console.warn('Form handling tidak diinisialisasi:', error.message);
}

// Fungsi utama untuk createStatusTimelineChart
function createStatusTimelineChart(container, categories, startTimes, endTimes, showAll = false) {
    console.log("[DEBUG] createStatusTimelineChart dipanggil");
    
    // Periksa apakah container tersedia
    if (!container) {
        console.error("[ERROR] Container untuk statusTimelineChart tidak ditemukan");
        
        // Coba cari container berdasarkan ID
        const statusContainer = document.getElementById('statusChart');
        if (statusContainer) {
            console.log("[INFO] Container ditemukan dengan ID, menggunakan container yang ditemukan");
            container = statusContainer;
        } else {
            // Coba buat container secara dinamis jika tidak ada
            console.warn("[WARNING] Mencoba membuat container Status Timeline Chart secara dinamis");
            const chartSection = document.createElement('div');
            chartSection.id = 'dynamicStatusChartSection';
            chartSection.style.padding = '20px';
            chartSection.style.marginTop = '20px';
            chartSection.style.backgroundColor = 'rgba(0,0,0,0.03)';
            chartSection.style.borderRadius = '8px';
            
            const statusTimelineDiv = document.createElement('div');
            statusTimelineDiv.style.height = '400px';
            statusTimelineDiv.style.marginBottom = '20px';
            
            const statusTimelineCanvas = document.createElement('canvas');
            statusTimelineCanvas.id = 'statusChart';
            statusTimelineDiv.appendChild(statusTimelineCanvas);
            chartSection.appendChild(statusTimelineDiv);
            
            // Tambahkan ke body atau elemen lain
            const mainContent = document.querySelector('main') || document.body;
            mainContent.appendChild(chartSection);
            
            container = statusTimelineCanvas;
            console.log("[INFO] Container Status Timeline Chart dibuat secara dinamis");
        }
    }
    
    // Jika container masih tidak tersedia, batalkan pembuatan chart
    if (!container) {
        console.error("[ERROR] Tidak dapat membuat atau menemukan container untuk Status Timeline Chart");
        return null;
    }
    
    // Periksa apakah Chart.js tersedia
    if (typeof Chart === 'undefined') {
        console.error("[ERROR] Chart.js tidak tersedia! Pastikan library Chart.js dimuat dengan benar.");
        return null;
    }
    
    // Periksa ketersediaan adapter tanggal untuk Chart.js
    if (typeof moment === 'undefined') {
        console.error("[ERROR] Moment.js tidak tersedia! Timeline chart tidak akan berfungsi.");
        return null;
    }
    
    // Verifikasi moment adapter untuk Chart.js
    let adapterAvailable = false;
    try {
        // Uji adapter dengan mencoba membuat objek skala waktu
        if (Chart._adapters && Chart._adapters._date) {
            adapterAvailable = true;
            console.log("[INFO] Chart.js menggunakan adapter tanggal bawaan");
        } else if (Chart.adapters && Chart.adapters._date) {
            adapterAvailable = true;
            console.log("[INFO] Chart.js menggunakan adapter tanggal kustom");
        } else {
            // Register adapter secara manual jika belum terdaftar
            console.warn("[WARNING] Adapter tanggal tidak terdeteksi, mencoba mendaftarkan secara manual");
            // Semua versi Chart.js 3.x seharusnya memiliki adapters API
            if (typeof Chart.register === 'function' && typeof window['chartjs-adapter-moment'] !== 'undefined') {
                Chart.register(window['chartjs-adapter-moment']);
                adapterAvailable = true;
                console.log("[INFO] Adapter tanggal berhasil didaftarkan secara manual");
            }
        }
    } catch (e) {
        console.error("[ERROR] Gagal memverifikasi adapter tanggal:", e);
    }
    
    if (!adapterAvailable) {
        console.error("[ERROR] Adapter tanggal untuk Chart.js tidak tersedia!");
        console.log("[INFO] Pastikan chartjs-adapter-moment dimuat SEBELUM Chart.js");
        
        // Tampilkan pesan di chart container
        if (container instanceof HTMLElement) {
            const ctx = container.getContext('2d');
            if (ctx) {
                ctx.font = '14px Arial';
                ctx.fillStyle = 'red';
                ctx.textAlign = 'center';
                ctx.fillText('Error: Adapter tanggal tidak tersedia', container.width / 2, container.height / 2);
            }
        }
        return null;
    }
    
    // Hapus chart lama jika ada dengan pengecekan null dan properti destroy
    try {
        if (window.statusChart) {
            if (typeof window.statusChart.destroy === 'function') {
                console.log("[INFO] Menghapus Status Timeline Chart lama");
                window.statusChart.destroy();
            } else {
                console.warn("[WARNING] Chart tidak memiliki metode destroy, menggunakan cara alternatif");
                // Alternatif untuk destroy chart
                if (container instanceof HTMLCanvasElement) {
                    // Reset canvas
                    const width = container.width;
                    const height = container.height;
                    container.width = width;
                    container.height = height;
                }
            }
            // Hapus referensi chart lama
            window.statusChart = null;
        }
    } catch (error) {
        console.warn("[WARNING] Error saat menghapus Status Timeline chart lama:", error);
        window.statusChart = null;
    }
    
    // Validasi input
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        console.error("[ERROR] Data kategori tidak valid");
        return null;
    }
    
    if (!startTimes || !Array.isArray(startTimes) || startTimes.length === 0) {
        console.error("[ERROR] Data waktu mulai tidak valid");
        return null;
    }
    
    if (!endTimes || !Array.isArray(endTimes) || endTimes.length === 0) {
        console.error("[ERROR] Data waktu selesai tidak valid");
        return null;
    }
    
    try {
        // Gunakan opsi dasar untuk chart dulu
        const chartOptions = {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month',
                        tooltipFormat: 'DD MMM YYYY'
                    }
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    mode: 'nearest',
                    intersect: false
                },
                legend: {
                    display: false
                }
            }
        };
        
        // Buat chart kosong dulu
        window.statusChart = new Chart(container, {
            type: 'bar',
            data: {
                labels: ["Memuat data..."],
                datasets: [{
                    data: [0],
                    backgroundColor: 'rgba(200, 200, 200, 0.2)'
                }]
            },
            options: chartOptions
        });
        
        console.log("[DEBUG] Status Timeline Chart berhasil dibuat dengan konfigurasi minimal");
        return window.statusChart;
        
    } catch (error) {
        console.error("[ERROR] Error saat membuat Status Timeline chart:", error);
        console.log(error.stack); // Tampilkan stack trace untuk debugging
        return null;
    }
}

// Fungsi utama untuk createBomTimelineChart
function createBomTimelineChart(container, data, colorPalette) {
    console.log("[DEBUG] createBomTimelineChart dipanggil");
    
    // Periksa apakah container tersedia
    if (!container) {
        console.error("[ERROR] Container untuk bomTimelineChart tidak ditemukan");
        
        // Coba cari container berdasarkan ID
        const bomContainer = document.getElementById('bomTimelineChart');
        if (bomContainer) {
            console.log("[INFO] Container ditemukan dengan ID, menggunakan container yang ditemukan");
            container = bomContainer;
        } else {
            // Coba buat container secara dinamis jika tidak ada
            console.warn("[WARNING] Mencoba membuat container BOM Timeline Chart secara dinamis");
            const chartSection = document.createElement('div');
            chartSection.id = 'dynamicBomChartSection';
            chartSection.style.padding = '20px';
            chartSection.style.marginTop = '20px';
            chartSection.style.backgroundColor = 'rgba(0,0,0,0.03)';
            chartSection.style.borderRadius = '8px';
            
            const bomTimelineDiv = document.createElement('div');
            bomTimelineDiv.style.height = '400px';
            bomTimelineDiv.style.marginBottom = '20px';
            
            const bomTimelineCanvas = document.createElement('canvas');
            bomTimelineCanvas.id = 'bomTimelineChart';
            bomTimelineDiv.appendChild(bomTimelineCanvas);
            chartSection.appendChild(bomTimelineDiv);
            
            // Tambahkan ke body atau elemen lain
            const mainContent = document.querySelector('main') || document.body;
            mainContent.appendChild(chartSection);
            
            container = bomTimelineCanvas;
            console.log("[INFO] Container BOM Timeline Chart dibuat secara dinamis");
        }
    }
    
    // Jika container masih tidak tersedia, batalkan pembuatan chart
    if (!container) {
        console.error("[ERROR] Tidak dapat membuat atau menemukan container untuk BOM Timeline Chart");
        return null;
    }
    
    // Periksa apakah Chart.js tersedia
    if (typeof Chart === 'undefined') {
        console.error("[ERROR] Chart.js tidak tersedia! Pastikan library Chart.js dimuat dengan benar.");
        return null;
    }
    
    // Periksa ketersediaan adapter tanggal untuk Chart.js
    if (typeof moment === 'undefined') {
        console.error("[ERROR] Moment.js tidak tersedia! Timeline chart tidak akan berfungsi.");
        return null;
    }
    
    // Verifikasi moment adapter untuk Chart.js
    let adapterAvailable = false;
    try {
        // Uji adapter dengan mencoba membuat objek skala waktu
        if (Chart._adapters && Chart._adapters._date) {
            adapterAvailable = true;
            console.log("[INFO] Chart.js menggunakan adapter tanggal bawaan");
        } else if (Chart.adapters && Chart.adapters._date) {
            adapterAvailable = true;
            console.log("[INFO] Chart.js menggunakan adapter tanggal kustom");
        } else {
            // Register adapter secara manual jika belum terdaftar
            console.warn("[WARNING] Adapter tanggal tidak terdeteksi, mencoba mendaftarkan secara manual");
            // Semua versi Chart.js 3.x seharusnya memiliki adapters API
            if (typeof Chart.register === 'function' && typeof window['chartjs-adapter-moment'] !== 'undefined') {
                Chart.register(window['chartjs-adapter-moment']);
                adapterAvailable = true;
                console.log("[INFO] Adapter tanggal berhasil didaftarkan secara manual");
            }
        }
    } catch (e) {
        console.error("[ERROR] Gagal memverifikasi adapter tanggal:", e);
    }
    
    if (!adapterAvailable) {
        console.error("[ERROR] Adapter tanggal untuk Chart.js tidak tersedia!");
        console.log("[INFO] Pastikan chartjs-adapter-moment dimuat SEBELUM Chart.js");
        
        // Tampilkan pesan di chart container
        if (container instanceof HTMLElement) {
            const ctx = container.getContext('2d');
            if (ctx) {
                ctx.font = '14px Arial';
                ctx.fillStyle = 'red';
                ctx.textAlign = 'center';
                ctx.fillText('Error: Adapter tanggal tidak tersedia', container.width / 2, container.height / 2);
            }
        }
        return null;
    }
    
    // Hapus chart lama jika ada dengan pengecekan null dan properti destroy
    try {
        if (window.bomTimelineChart) {
            if (typeof window.bomTimelineChart.destroy === 'function') {
                console.log("[INFO] Menghapus BOM Timeline Chart lama");
                window.bomTimelineChart.destroy();
            } else {
                console.warn("[WARNING] Chart tidak memiliki metode destroy, menggunakan cara alternatif");
                // Alternatif untuk destroy chart
                if (container instanceof HTMLCanvasElement) {
                    // Reset canvas
                    const width = container.width;
                    const height = container.height;
                    container.width = width;
                    container.height = height;
                }
            }
            // Hapus referensi chart lama
            window.bomTimelineChart = null;
        }
    } catch (error) {
        console.warn("[WARNING] Error saat menghapus BOM timeline chart lama:", error);
        window.bomTimelineChart = null;
    }
    
    // Periksa data
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error("[ERROR] Data untuk BOM Timeline Chart tidak valid:", data);
        return null;
    }
    
    // Persiapkan dataset dan opsi dengan try-catch untuk menangkap error
    try {
        // Gunakan opsi dasar untuk chart dulu
        const chartOptions = {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month',
                        tooltipFormat: 'DD MMM YYYY'
                    }
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    mode: 'nearest',
                    intersect: false
                },
                legend: {
                    display: false
                }
            }
        };
        
        // Buat chart kosong dulu
        window.bomTimelineChart = new Chart(container, {
            type: 'bar',
            data: {
                labels: ["Memuat data..."],
                datasets: [{
                    data: [0],
                    backgroundColor: 'rgba(200, 200, 200, 0.2)'
                }]
            },
            options: chartOptions
        });
        
        console.log("[DEBUG] BOM Timeline Chart berhasil dibuat");
        return window.bomTimelineChart;
        
    } catch (error) {
        console.error("[ERROR] Error saat membuat BOM Timeline chart:", error);
        console.log(error.stack); // Tampilkan stack trace untuk debugging
        return null;
    }
}

/**
 * Memfilter BomTimeline Chart berdasarkan MainSKU yang dipilih
 * @param {string} mainSku - MainSKU yang dipilih untuk difilter (kosong = tampilkan semua)
 */
function filterBomTimelineChart(mainSku) {
    console.log("[DEBUG] filterBomTimelineChart dipanggil dengan mainSku:", mainSku);
    
    // Periksa apakah chart ada
    if (!window.bomTimelineChart) {
        console.error("[ERROR] BOM Timeline Chart tidak tersedia untuk filtering");
        return;
    }
    
    try {
        // Perbarui judul chart untuk menunjukkan filter yang aktif
        const chartTitle = document.getElementById('bomChartTitle');
        if (chartTitle) {
            if (mainSku) {
                chartTitle.textContent = `BOM Timeline: ${mainSku}`;
            } else {
                chartTitle.textContent = 'BOM Timeline Chart';
            }
        }
        
        console.log("[INFO] Filter berhasil diterapkan ke BOM Timeline Chart");
    } catch (error) {
        console.error("[ERROR] Gagal menerapkan filter:", error);
    }
}

/**
 * Test function untuk Status Timeline Chart (Development Only)
 * Fungsi ini hanya digunakan untuk testing dan development
 */
/* 
function testStatusTimelineChart() {
    // Buat data dummy untuk timeline chart
    const chartData = {
        status: "success",
        summary: {
            total_records: 150,
            valid_records: 130,
            invalid_records: 20
        },
        validation_details: [
            {
                field: "SKU Bundle",
                valid_count: 147,
                invalid_count: 3,
                most_common_error: "Format SKU tidak valid"
            },
            {
                field: "SKU Product",
                valid_count: 144,
                invalid_count: 6,
                most_common_error: "SKU tidak ditemukan"
            },
            {
                field: "Client",
                valid_count: 150,
                invalid_count: 0,
                most_common_error: ""
            },
            {
                field: "Marketplace",
                valid_count: 145,
                invalid_count: 5,
                most_common_error: "Marketplace tidak didukung"
            },
            {
                field: "Start_Date",
                valid_count: 142,
                invalid_count: 8,
                most_common_error: "Format tanggal salah"
            },
            {
                field: "End_Date",
                valid_count: 140,
                invalid_count: 10,
                most_common_error: "Format tanggal salah"
            },
            {
                field: "Qty",
                valid_count: 149,
                invalid_count: 1,
                most_common_error: "Nilai Qty tidak valid"
            }
        ]
    };
    
    // Proses data chart
    showValidationBarChart(chartData);
}

/**
 * Test function untuk BOM Timeline Chart (Development Only)
 * Fungsi ini hanya digunakan untuk testing dan development
 */
/* 
function testBomTimelineChart() {
    // Buat data dummy untuk timeline chart
    const chartData = {
        status: "success",
        dates: {
            min_start_date: "01/01/2023",
            max_end_date: "30/12/2023"
        },
        items: [
            {
                bom_sku: "SKU-A-123",
                main_sku: "MAIN-SKU-1",
                start_date: "01/01/2023",
                end_date: "14/02/2023",
                marketplace: "Tokopedia",
                client: "ABC"
            },
            {
                bom_sku: "SKU-B-456",
                main_sku: "MAIN-SKU-1",
                start_date: "11/01/2023",
                end_date: "28/02/2023",
                marketplace: "Shopee",
                client: "ABC"
            },
            {
                bom_sku: "SKU-C-789", 
                main_sku: "MAIN-SKU-2",
                start_date: "15/03/2023",
                end_date: "30/05/2023",
                marketplace: "Tokopedia",
                client: "XYZ"
            },
            {
                bom_sku: "SKU-D-012",
                main_sku: "MAIN-SKU-3", 
                start_date: "20/05/2023",
                end_date: "30/12/2023",
                marketplace: "Lazada",
                client: "XYZ"
            },
            {
                bom_sku: "SKU-E-345",
                main_sku: "MAIN-SKU-3",
                start_date: "01/07/2023",
                end_date: "30/09/2023",
                marketplace: "Shopee",
                client: "DEF"
            }
        ]
    };
    
    // Proses data chart
    showBomTimelineChart(chartData);
}

/**
 * Tampilkan Validation Status Bar Chart
 * @param {Object} data - Data untuk chart
 */
/* 
function showValidationBarChart(data) {
    if (!data || data.status !== "success") {
        console.error("Data chart tidak valid!");
        return;
    }
    
    const clientContainer = document.querySelector('.container main');
    if (!clientContainer) {
        console.error("Container untuk chart tidak ditemukan!");
        return;
    }
    
    // Buat container untuk chart
    const chartContainer = document.createElement('div');
    chartContainer.id = 'chartContainer';
    chartContainer.className = 'card my-4 animate-on-scroll';
    chartContainer.innerHTML = `
        <div class="card-header bg-primary text-white">
            <h3 class="m-0"><i class="fas fa-chart-bar mr-2"></i> Hasil Validasi</h3>
        </div>
        <div class="card-body">
            <div class="summary-stats d-flex flex-wrap justify-content-around mb-4">
                <div class="stat-item text-center p-3">
                    <h2 class="stat-value">${data.summary.total_records}</h2>
                    <p class="stat-label">Total Records</p>
                </div>
                <div class="stat-item text-center p-3">
                    <h2 class="stat-value text-success">${data.summary.valid_records}</h2>
                    <p class="stat-label">Valid</p>
                </div>
                <div class="stat-item text-center p-3">
                    <h2 class="stat-value text-danger">${data.summary.invalid_records}</h2>
                    <p class="stat-label">Invalid</p>
                </div>
                <div class="stat-item text-center p-3">
                    <h2 class="stat-value">${Math.round((data.summary.valid_records / data.summary.total_records) * 100)}%</h2>
                    <p class="stat-label">Akurasi</p>
                </div>
            </div>
            
            <div class="chart-container">
                <canvas id="validationChart" height="300"></canvas>
            </div>
            
            <div class="validation-details mt-4">
                <h4 class="mb-3">Detail Validasi per Kolom</h4>
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead class="bg-light">
                            <tr>
                                <th>Kolom</th>
                                <th>Valid</th>
                                <th>Invalid</th>
                                <th>Kesalahan Umum</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.validation_details.map(field => `
                                <tr>
                                    <td>${field.field}</td>
                                    <td class="text-success">${field.valid_count}</td>
                                    <td class="text-danger">${field.invalid_count}</td>
                                    <td>${field.most_common_error || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Tambahkan chart ke DOM
    clientContainer.prepend(chartContainer);
    
    // Render chart dengan Chart.js
    const ctx = document.getElementById('validationChart').getContext('2d');
    
    // Prepare chart data
    const labels = data.validation_details.map(item => item.field);
    const validData = data.validation_details.map(item => item.valid_count);
    const invalidData = data.validation_details.map(item => item.invalid_count);
    
    // Create gradient for valid data
    const validGradient = ctx.createLinearGradient(0, 0, 0, 400);
    validGradient.addColorStop(0, 'rgba(46, 204, 113, 0.8)');
    validGradient.addColorStop(1, 'rgba(46, 204, 113, 0.2)');
    
    // Create gradient for invalid data
    const invalidGradient = ctx.createLinearGradient(0, 0, 0, 400);
    invalidGradient.addColorStop(0, 'rgba(231, 76, 60, 0.8)');
    invalidGradient.addColorStop(1, 'rgba(231, 76, 60, 0.2)');
    
    // Create chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Valid',
                    data: validData,
                    backgroundColor: validGradient,
                    borderColor: 'rgba(46, 204, 113, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Invalid',
                    data: invalidData,
                    backgroundColor: invalidGradient,
                    borderColor: 'rgba(231, 76, 60, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(50, 50, 50, 0.95)',
                    padding: 10,
                    cornerRadius: 4,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        title: function(tooltipItems) {
                            return tooltipItems[0].label;
                        },
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y;
                            return label;
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

/**
 * Tampilkan BOM Timeline Chart
 * @param {Object} data - Data untuk chart
 */
/* 
function showBomTimelineChart(data) {
    if (!data || data.status !== "success") {
        console.error("Data chart tidak valid!");
        return;
    }
    
    const clientContainer = document.querySelector('.container main');
    if (!clientContainer) {
        console.error("Container untuk chart tidak ditemukan!");
        return;
    }
    
    // Buat container untuk chart
    const chartContainer = document.createElement('div');
    chartContainer.id = 'bomChartContainer';
    chartContainer.className = 'card my-4 animate-on-scroll';
    chartContainer.innerHTML = `
        <div class="card-header bg-accent">
            <h3 class="m-0 text-white"><i class="fas fa-calendar-alt mr-2"></i> Timeline Aktivasi</h3>
        </div>
        <div class="card-body">
            <div class="chart-container" style="position: relative; height: 400px;">
                <canvas id="bomTimelineChart"></canvas>
            </div>
            
            <div class="bom-details mt-4">
                <h4 class="mb-3">Detail Schedule</h4>
                <div class="filter-controls mb-3 d-flex flex-wrap">
                    <div class="form-group mr-3">
                        <label for="marketplaceFilter">Marketplace:</label>
                        <select id="marketplaceFilter" class="form-control custom-select">
                            <option value="all">Semua</option>
                            ${[...new Set(data.items.map(item => item.marketplace))].map(mp => 
                                `<option value="${mp}">${mp}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="clientFilter">Client:</label>
                        <select id="clientFilter" class="form-control custom-select">
                            <option value="all">Semua</option>
                            ${[...new Set(data.items.map(item => item.client))].map(client => 
                                `<option value="${client}">${client}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="table-responsive">
                    <table class="table table-hover" id="bomScheduleTable">
                        <thead class="bg-light">
                            <tr>
                                <th>Main SKU</th>
                                <th>BOM SKU</th>
                                <th>Marketplace</th>
                                <th>Client</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Durasi (Hari)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.items.map(item => {
                                const startDate = new Date(item.start_date);
                                const endDate = new Date(item.end_date);
                                const diffTime = Math.abs(endDate - startDate);
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                
                                return `
                                    <tr data-marketplace="${item.marketplace}" data-client="${item.client}">
                                        <td>${item.main_sku}</td>
                                        <td>${item.bom_sku}</td>
                                        <td>${item.marketplace}</td>
                                        <td>${item.client}</td>
                                        <td>${item.start_date}</td>
                                        <td>${item.end_date}</td>
                                        <td>${diffDays}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Tambahkan chart ke DOM
    clientContainer.append(chartContainer);
    
    // Initialize filters
    const marketplaceFilter = document.getElementById('marketplaceFilter');
    const clientFilter = document.getElementById('clientFilter');
    const tableRows = document.querySelectorAll('#bomScheduleTable tbody tr');
    
    function applyFilters() {
        const selectedMarketplace = marketplaceFilter.value;
        const selectedClient = clientFilter.value;
        
        tableRows.forEach(row => {
            const marketplaceMatch = selectedMarketplace === 'all' || row.dataset.marketplace === selectedMarketplace;
            const clientMatch = selectedClient === 'all' || row.dataset.client === selectedClient;
            
            if (marketplaceMatch && clientMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    marketplaceFilter.addEventListener('change', applyFilters);
    clientFilter.addEventListener('change', applyFilters);
    
    // Render timeline chart
    const ctx = document.getElementById('bomTimelineChart').getContext('2d');
    
    // Parse dates
    const minDate = new Date(data.dates.min_start_date);
    const maxDate = new Date(data.dates.max_end_date);
    
    // Prepare data for timeline chart
    const datasets = data.items.map((item, index) => {
        // Generate distinct color based on index
        const hue = (index * 47) % 360; // Use a prime number to get good distribution
        const color = `hsla(${hue}, 70%, 50%, 0.7)`;
        const borderColor = `hsla(${hue}, 70%, 40%, 1)`;
        
        return {
            label: item.bom_sku,
            data: [{
                x: [new Date(item.start_date), new Date(item.end_date)],
                y: `${item.main_sku} (${item.marketplace})`
            }],
            backgroundColor: color,
            borderColor: borderColor,
            borderWidth: 1,
            borderRadius: 4
        };
    });
    
    // Create chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: {
                    position: 'top',
                    type: 'time',
                    time: {
                        unit: 'month',
                        parser: 'MM/DD/YYYY',
                        tooltipFormat: 'DD MMM YYYY',
                        displayFormats: {
                            month: 'MMM YYYY'
                        }
                    },
                    min: minDate,
                    max: maxDate
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return tooltipItems[0].dataset.label;
                        },
                        label: function(context) {
                            const data = context.raw;
                            const startDate = new Date(data.x[0]);
                            const endDate = new Date(data.x[1]);
                            
                            // Format dates
                            const formatDate = date => {
                                return date.toLocaleDateString('id-ID', { 
                                    day: '2-digit', 
                                    month: 'short', 
                                    year: 'numeric'
                                });
                            };
                            
                            const diffTime = Math.abs(endDate - startDate);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            
                            return [
                                `Main SKU: ${data.y.split(' ')[0]}`,
                                `Marketplace: ${data.y.split('(')[1].replace(')', '')}`,
                                `Start: ${formatDate(startDate)}`,
                                `End: ${formatDate(endDate)}`,
                                `Durasi: ${diffDays} hari`
                            ];
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
} */ 