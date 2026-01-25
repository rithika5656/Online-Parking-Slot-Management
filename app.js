// Parking Slot Management Application
const TOTAL_SLOTS = 20;

// DOM Elements
const slotsContainer = document.getElementById('slots-container');
const availableCount = document.getElementById('available-count');
const occupiedCount = document.getElementById('occupied-count');
const totalCount = document.getElementById('total-count');
const bookForm = document.getElementById('book-form');
const vehicleNumber = document.getElementById('vehicle-number');
const ownerName = document.getElementById('owner-name');
const slotSelect = document.getElementById('slot-select');
const bookingsBody = document.getElementById('bookings-body');
const noBookings = document.getElementById('no-bookings');

// Initialize parking slots
function initializeSlots() {
    const storedSlots = localStorage.getItem('parkingSlots');
    if (!storedSlots) {
        const slots = [];
        for (let i = 1; i <= TOTAL_SLOTS; i++) {
            slots.push({
                id: i,
                slotNumber: `P${i.toString().padStart(2, '0')}`,
                isOccupied: false,
                vehicleNumber: null,
                ownerName: null,
                bookedAt: null
            });
        }
        localStorage.setItem('parkingSlots', JSON.stringify(slots));
        return slots;
    }
    return JSON.parse(storedSlots);
}

// Get all slots
function getSlots() {
    return JSON.parse(localStorage.getItem('parkingSlots')) || [];
}

// Save slots to localStorage
function saveSlots(slots) {
    localStorage.setItem('parkingSlots', JSON.stringify(slots));
}

// Render parking grid
function renderParkingGrid() {
    const slots = getSlots();
    slotsContainer.innerHTML = '';

    slots.forEach(slot => {
        const slotDiv = document.createElement('div');
        slotDiv.className = `slot ${slot.isOccupied ? 'occupied' : 'available'}`;
        slotDiv.innerHTML = `
            <div class="slot-header">
                <span class="slot-id">${slot.slotNumber}</span>
                <span class="status-dot"></span>
            </div>
            <div class="slot-body">
                <i class="fas ${slot.isOccupied ? 'fa-car-side' : 'fa-parking'}"></i>
            </div>
            <div class="slot-footer">
                ${slot.isOccupied ? 'Occupied' : 'Allocated'}
            </div>
        `;
        
        if (!slot.isOccupied) {
            slotDiv.addEventListener('click', () => {
                slotSelect.value = slot.id;
                document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
            });
        }

        slotsContainer.appendChild(slotDiv);
    });
}

// Update statistics
function updateStats() {
    const slots = getSlots();
    const available = slots.filter(s => !s.isOccupied).length;
    const occupied = slots.filter(s => s.isOccupied).length;

    availableCount.textContent = available;
    occupiedCount.textContent = occupied;
    totalCount.textContent = TOTAL_SLOTS;
}

// Populate slot dropdown
function populateSlotDropdown() {
    const slots = getSlots();
    slotSelect.innerHTML = '<option value="">-- Select Available Slot --</option>';

    slots.filter(s => !s.isOccupied).forEach(slot => {
        const option = document.createElement('option');
        option.value = slot.id;
        option.textContent = slot.slotNumber;
        slotSelect.appendChild(option);
    });
}

// Render bookings table
function renderBookings() {
    const slots = getSlots();
    const occupiedSlots = slots.filter(s => s.isOccupied);

    if (occupiedSlots.length === 0) {
        bookingsBody.innerHTML = '';
        noBookings.style.display = 'block';
        document.getElementById('bookings-table').style.display = 'none';
        return;
    }

    noBookings.style.display = 'none';
    document.getElementById('bookings-table').style.display = 'table';

    bookingsBody.innerHTML = occupiedSlots.map(slot => `
        <tr>
            <td>${slot.slotNumber}</td>
            <td>${slot.vehicleNumber}</td>
            <td>${slot.ownerName}</td>
            <td>${new Date(slot.bookedAt).toLocaleString()}</td>
            <td>
                <button class="btn-release" onclick="releaseSlot(${slot.id})">
                    Release
                </button>
            </td>
        </tr>
    `).join('');
}

// Book a slot
function bookSlot(slotId, vehicleNum, owner) {
    const slots = getSlots();
    const slotIndex = slots.findIndex(s => s.id === parseInt(slotId));

    if (slotIndex !== -1 && !slots[slotIndex].isOccupied) {
        slots[slotIndex].isOccupied = true;
        slots[slotIndex].vehicleNumber = vehicleNum.toUpperCase();
        slots[slotIndex].ownerName = owner;
        slots[slotIndex].bookedAt = new Date().toISOString();
        saveSlots(slots);
        return true;
    }
    return false;
}

// Release a slot
function releaseSlot(slotId) {
    const slots = getSlots();
    const slotIndex = slots.findIndex(s => s.id === parseInt(slotId));

    if (slotIndex !== -1 && slots[slotIndex].isOccupied) {
        slots[slotIndex].isOccupied = false;
        slots[slotIndex].vehicleNumber = null;
        slots[slotIndex].ownerName = null;
        slots[slotIndex].bookedAt = null;
        saveSlots(slots);
        refreshUI();
        showNotification('Slot released successfully!', 'success');
    }
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Refresh UI
function refreshUI() {
    renderParkingGrid();
    updateStats();
    populateSlotDropdown();
    renderBookings();
}

// Form submission handler
bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const slotId = slotSelect.value;
    const vehicle = vehicleNumber.value.trim();
    const owner = ownerName.value.trim();

    if (!slotId || !vehicle || !owner) {
        showNotification('Please fill all fields!', 'error');
        return;
    }

    if (bookSlot(slotId, vehicle, owner)) {
        showNotification('Slot booked successfully!', 'success');
        bookForm.reset();
        refreshUI();
    } else {
        showNotification('Failed to book slot. Please try again.', 'error');
    }
});

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initializeSlots();
    refreshUI();
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
