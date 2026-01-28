// Theme Manager

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.applyTheme(this.currentTheme);
        this.createToggleButton();
    }

    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.innerHTML = '<i class="fas fa-moon"></i>';
        button.onclick = () => this.toggleTheme();
        button.title = 'Toggle Theme';
        document.body.appendChild(button);
        this.updateButtonIcon(button);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);

        const button = document.querySelector('.theme-toggle');
        this.updateButtonIcon(button);

        soundManager.play('click');
        showNotification(`Switched to ${this.currentTheme} mode`, 'success');
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    updateButtonIcon(button) {
        button.innerHTML = this.currentTheme === 'dark' ?
            '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Slot Reservation System
class ReservationManager {
    constructor() {
        this.reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    }

    createReservation(slotId, vehicleNumber, ownerName, phone, email, startTime, duration) {
        const reservation = {
            id: Date.now(),
            slotId,
            vehicleNumber,
            ownerName,
            phone,
            email,
            startTime,
            duration,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        this.reservations.push(reservation);
        this.save();
        return reservation;
    }

    getReservations() {
        return this.reservations;
    }

    cancelReservation(id) {
        this.reservations = this.reservations.filter(r => r.id !== id);
        this.save();
    }

    save() {
        localStorage.setItem('reservations', JSON.stringify(this.reservations));
    }

    checkAndActivate() {
        const now = new Date();
        this.reservations.forEach(res => {
            const startTime = new Date(res.startTime);
            if (res.status === 'pending' && now >= startTime) {
                // Auto-activate reservation
                res.status = 'active';
                // You could auto-book the slot here
            }
        });
        this.save();
    }
}

const reservationManager = new ReservationManager();

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoadTime: 0,
            apiCalls: 0,
            errors: 0
        };
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            this.metrics.pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page loaded in ${this.metrics.pageLoadTime}ms`);
        });

        window.addEventListener('error', () => {
            this.metrics.errors++;
        });
    }

    logAPICall() {
        this.metrics.apiCalls++;
    }

    getMetrics() {
        return this.metrics;
    }
}

const perfMonitor = new PerformanceMonitor();

// Accessibility Helper
class AccessibilityHelper {
    constructor() {
        this.init();
    }

    init() {
        // Add skip to content link
        this.addSkipLink();

        // Announce page changes to screen readers
        this.setupAriaLive();

        // Keyboard navigation improvements
        this.improveKeyboardNav();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--primary);
            color: #000;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
        `;
        skipLink.onfocus = () => skipLink.style.top = '0';
        skipLink.onblur = () => skipLink.style.top = '-40px';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupAriaLive() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'aria-live-region';
        document.body.appendChild(liveRegion);
    }

    announce(message) {
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }

    improveKeyboardNav() {
        // Add visible focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }
}

const a11yHelper = new AccessibilityHelper();

// Local Storage Manager with Quota Check
class StorageManager {
    static getQuota() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return {
            used: (total / 1024).toFixed(2) + ' KB',
            percentage: ((total / (5 * 1024 * 1024)) * 100).toFixed(2) + '%'
        };
    }

    static checkQuota() {
        const quota = this.getQuota();
        console.log(`Storage used: ${quota.used} (${quota.percentage})`);
        return quota;
    }

    static clearOldData(daysOld = 30) {
        const history = ParkingDB.getHistory();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const filtered = history.filter(entry => {
            return new Date(entry.timestamp) > cutoffDate;
        });

        localStorage.setItem('parkingHistory', JSON.stringify(filtered));
        return history.length - filtered.length;
    }
}

// Auto-save functionality
let autoSaveInterval;

function enableAutoSave() {
    autoSaveInterval = setInterval(() => {
        const quota = StorageManager.checkQuota();
        if (parseFloat(quota.percentage) > 80) {
            const removed = StorageManager.clearOldData(30);
            console.log(`Auto-cleanup: Removed ${removed} old entries`);
        }
    }, 300000); // Every 5 minutes
}

enableAutoSave();

// Hero Section Utilities
function scrollToBooking() {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Add a subtle flash animation
        bookingForm.style.animation = 'highlight-pulse 1s ease-in-out';
        setTimeout(() => {
            bookingForm.style.animation = '';
        }, 1000);
    }
}

function scrollToSlots() {
    const slotsContainer = document.getElementById('slots-container');
    if (slotsContainer) {
        slotsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Update hero stats in sync with main stats
function updateHeroStats() {
    const heroTotal = document.getElementById('hero-total');
    const heroAvailable = document.getElementById('hero-available');
    const heroOccupied = document.getElementById('hero-occupied');

    const mainTotal = document.getElementById('total-count');
    const mainAvailable = document.getElementById('available-count');
    const mainOccupied = document.getElementById('occupied-count');

    if (heroTotal && mainTotal) {
        animateNumber(heroTotal, parseInt(mainTotal.textContent) || 0);
    }
    if (heroAvailable && mainAvailable) {
        animateNumber(heroAvailable, parseInt(mainAvailable.textContent) || 0);
    }
    if (heroOccupied && mainOccupied) {
        animateNumber(heroOccupied, parseInt(mainOccupied.textContent) || 0);
    }
}

// Animate numbers with counting effect
function animateNumber(element, targetValue) {
    const currentValue = parseInt(element.textContent) || 0;
    const duration = 1000; // 1 second
    const steps = 30;
    const increment = (targetValue - currentValue) / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
        currentStep++;
        const newValue = Math.round(currentValue + (increment * currentStep));
        element.textContent = newValue;

        if (currentStep >= steps) {
            element.textContent = targetValue;
            clearInterval(interval);
        }
    }, stepDuration);
}

// Initialize hero section when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHeroSection);
} else {
    initializeHeroSection();
}

function initializeHeroSection() {
    // Wait a bit for main stats to load
    setTimeout(() => {
        updateHeroStats();
    }, 500);

    // Set up observer to watch for changes in main stats
    const mainStatsObserver = new MutationObserver(() => {
        updateHeroStats();
    });

    const statsElements = [
        document.getElementById('total-count'),
        document.getElementById('available-count'),
        document.getElementById('occupied-count')
    ].filter(Boolean);

    statsElements.forEach(element => {
        mainStatsObserver.observe(element, {
            childList: true,
            characterData: true,
            subtree: true
        });
    });
}

// Export all utilities
window.ThemeManager = ThemeManager;
window.ReservationManager = ReservationManager;
window.PerformanceMonitor = PerformanceMonitor;
window.AccessibilityHelper = AccessibilityHelper;
window.StorageManager = StorageManager;
window.scrollToBooking = scrollToBooking;
window.scrollToSlots = scrollToSlots;
window.updateHeroStats = updateHeroStats;
