// Filter and Search Functions

let currentFilter = 'all';

function filterSlots(type) {
    currentFilter = type;

    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === type) {
            btn.classList.add('active');
        }
    });

    // Re-render grid with filter
    renderParkingGrid(type);
    soundManager.play('click');
}

function searchVehicle(query) {
    const slots = document.querySelectorAll('.slot');
    const searchQuery = query.toLowerCase().trim();

    // Remove previous highlights
    slots.forEach(slot => slot.classList.remove('search-highlight'));

    if (!searchQuery) {
        return;
    }

    let found = false;
    slots.forEach(slot => {
        const vehicleNumber = slot.dataset.vehicleNumber?.toLowerCase() || '';
        if (vehicleNumber.includes(searchQuery)) {
            slot.classList.add('search-highlight');
            if (!found) {
                // Scroll to first match
                slot.scrollIntoView({ behavior: 'smooth', block: 'center' });
                soundManager.play('success');
                found = true;
            }
        }
    });

    if (!found && searchQuery.length > 2) {
        showNotification('Vehicle not found', 'error');
    }
}

// Quick Stats Functions
function calculateOccupancyRate() {
    const slots = getSlots();
    const occupied = slots.filter(s => s.isOccupied).length;
    return ((occupied / slots.length) * 100).toFixed(1);
}

function getAverageBookingDuration() {
    const slots = getSlots();
    const occupied = slots.filter(s => s.isOccupied && s.duration);
    if (occupied.length === 0) return 0;

    const totalDuration = occupied.reduce((sum, s) => sum + s.duration, 0);
    return (totalDuration / occupied.length).toFixed(1);
}

function getMostPopularVehicleType() {
    const history = ParkingDB.getHistory();
    const counts = {};

    history.forEach(entry => {
        const type = entry.vehicleType || 'car';
        counts[type] = (counts[type] || 0) + 1;
    });

    let maxType = 'car';
    let maxCount = 0;

    Object.entries(counts).forEach(([type, count]) => {
        if (count > maxCount) {
            maxCount = count;
            maxType = type;
        }
    });

    return maxType;
}

// Notification Enhancement
const originalShowNotification = window.showNotification;
window.showNotification = function (message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    notification.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 250px;
        background: ${getNotificationColor(type)};
    `;

    document.body.appendChild(notification);

    // Play sound
    if (type === 'success') soundManager.play('success');
    else if (type === 'error') soundManager.play('error');

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
};

function getNotificationColor(type) {
    const colors = {
        success: 'linear-gradient(135deg, #10b981, #059669)',
        error: 'linear-gradient(135deg, #ef4444, #dc2626)',
        warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
        info: 'linear-gradient(135deg, #3b82f6, #2563eb)'
    };
    return colors[type] || colors.info;
}

// Auto-expire bookings
function checkAndExpireBookings() {
    const slots = getSlots();
    let expired = false;

    slots.forEach(slot => {
        if (slot.isOccupied && slot.expiresAt) {
            const now = new Date();
            const expiry = new Date(slot.expiresAt);

            if (now > expiry) {
                // Auto-release expired slot
                slot.isOccupied = false;
                slot.vehicleNumber = null;
                slot.ownerName = null;
                slot.ownerEmail = null;
                slot.ownerPhone = null;
                slot.bookedAt = null;
                slot.expiresAt = null;
                expired = true;

                // Log to history
                ParkingDB.addToHistory({
                    action: 'AUTO_EXPIRED',
                    slotNumber: slot.slotNumber,
                    timestamp: new Date().toISOString()
                });
            }
        }
    });

    if (expired) {
        saveSlots(slots);
        refreshUI();
        showNotification('Some bookings have expired and been released', 'info');
    }
}

// Run expiry check every minute
setInterval(checkAndExpireBookings, 60000);

// Quick Actions
function releaseAllExpired() {
    checkAndExpireBookings();
}

function getSlotUtilization() {
    const slots = getSlots();
    const history = ParkingDB.getHistory();

    return {
        currentOccupancy: calculateOccupancyRate(),
        totalBookings: history.length,
        averageDuration: getAverageBookingDuration(),
        popularVehicle: getMostPopularVehicleType()
    };
}
