// Analytics Module for SmartPark

function loadAnalytics() {
    const slots = getSlots();
    const history = ParkingDB.getHistory();

    // Calculate total revenue
    const totalRevenue = history.reduce((sum, entry) => {
        return sum + (entry.amount || 0);
    }, 0);

    // Calculate average duration
    const totalDuration = history.reduce((sum, entry) => {
        return sum + (entry.duration || 0);
    }, 0);
    const avgDuration = history.length > 0 ? (totalDuration / history.length).toFixed(1) : 0;

    // Calculate occupancy rate
    const occupiedSlots = slots.filter(s => s.isOccupied).length;
    const occupancyRate = ((occupiedSlots / slots.length) * 100).toFixed(1);

    // Update UI
    document.getElementById('total-revenue').textContent = `₹${totalRevenue}`;
    document.getElementById('total-bookings').textContent = history.length;
    document.getElementById('avg-duration').textContent = `${avgDuration}h`;
    document.getElementById('occupancy-rate').textContent = `${occupancyRate}%`;

    // Vehicle distribution
    renderVehicleDistribution(history);

    // Recent activity
    renderRecentActivity(history);
}

function renderVehicleDistribution(history) {
    const distribution = {};

    history.forEach(entry => {
        const type = entry.vehicleType || 'car';
        distribution[type] = (distribution[type] || 0) + 1;
    });

    const container = document.getElementById('vehicle-distribution');
    container.innerHTML = '';

    const icons = {
        car: '🚗',
        bike: '🏍️',
        truck: '🚚',
        suv: '🚙'
    };

    Object.entries(distribution).forEach(([type, count]) => {
        const bar = document.createElement('div');
        bar.className = 'distribution-bar';
        const percentage = history.length > 0 ? (count / history.length * 100).toFixed(1) : 0;
        bar.innerHTML = `
            <div class="dist-label">${icons[type] || '🚗'} ${type.toUpperCase()}</div>
            <div class="dist-bar-container">
                <div class="dist-bar-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="dist-value">${count} (${percentage}%)</div>
        `;
        container.appendChild(bar);
    });

    if (Object.keys(distribution).length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No data available</p>';
    }
}

function renderRecentActivity(history) {
    const container = document.getElementById('recent-activity');
    container.innerHTML = '';

    const recent = history.slice(-10).reverse();

    recent.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        const time = new Date(entry.timestamp).toLocaleString();
        item.innerHTML = `
            <div class="activity-icon ${entry.action === 'BOOKED' ? 'success' : 'danger'}">
                <i class="fas fa-${entry.action === 'BOOKED' ? 'check' : 'times'}"></i>
            </div>
            <div class="activity-details">
                <strong>${entry.action}</strong> - Slot ${entry.slotNumber}
                <br><small>${entry.vehicleNumber} | ${time}</small>
            </div>
            <div class="activity-amount">₹${entry.amount || 0}</div>
        `;
        container.appendChild(item);
    });

    if (recent.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No recent activity</p>';
    }
}

function exportAnalytics() {
    const history = ParkingDB.getHistory();
    const slots = getSlots();

    const report = {
        generatedAt: new Date().toISOString(),
        summary: {
            totalSlots: slots.length,
            occupiedSlots: slots.filter(s => s.isOccupied).length,
            totalBookings: history.length,
            totalRevenue: history.reduce((sum, e) => sum + (e.amount || 0), 0)
        },
        bookings: history,
        currentSlots: slots
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartPark_Analytics_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Analytics report exported successfully!', 'success');
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all booking history? This cannot be undone.')) {
        localStorage.setItem('parkingHistory', JSON.stringify([]));
        showNotification('History cleared successfully!', 'success');
        loadAnalytics();
    }
}

// Load analytics on page load
if (document.getElementById('total-revenue')) {
    document.addEventListener('DOMContentLoaded', loadAnalytics);
}
