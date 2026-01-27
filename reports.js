// Reports Module

document.getElementById('report-type')?.addEventListener('change', function () {
    const dateRange = document.getElementById('date-range');
    if (this.value === 'custom') {
        dateRange.style.display = 'flex';
        dateRange.style.gap = '1rem';
    } else {
        dateRange.style.display = 'none';
    }
});

function generateReport() {
    const reportType = document.getElementById('report-type').value;
    const output = document.getElementById('report-output');

    let startDate, endDate;
    const now = new Date();

    switch (reportType) {
        case 'daily':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            endDate = new Date(now.setHours(23, 59, 59, 999));
            break;
        case 'weekly':
            startDate = new Date(now.setDate(now.getDate() - 7));
            endDate = new Date();
            break;
        case 'monthly':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            endDate = new Date();
            break;
        case 'custom':
            startDate = new Date(document.getElementById('date-from').value);
            endDate = new Date(document.getElementById('date-to').value);
            break;
    }

    const history = ParkingDB.getHistory();
    const filteredHistory = history.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= startDate && entryDate <= endDate;
    });

    const report = generateReportData(filteredHistory, startDate, endDate);
    displayReport(report, output);
}

function generateReportData(history, startDate, endDate) {
    const totalBookings = history.filter(h => h.action === 'BOOKED').length;
    const totalRevenue = history.reduce((sum, h) => sum + (h.amount || 0), 0);

    const vehicleTypes = {};
    history.forEach(h => {
        if (h.vehicleType) {
            vehicleTypes[h.vehicleType] = (vehicleTypes[h.vehicleType] || 0) + 1;
        }
    });

    const avgDuration = history.length > 0 ?
        (history.reduce((sum, h) => sum + (h.duration || 0), 0) / history.length).toFixed(1) : 0;

    return {
        period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        totalBookings,
        totalRevenue,
        avgDuration,
        vehicleTypes,
        history
    };
}

function displayReport(report, container) {
    container.innerHTML = `
        <div class="report-summary">
            <h3>Report Summary</h3>
            <p><strong>Period:</strong> ${report.period}</p>
            <div class="report-stats">
                <div class="report-stat">
                    <span class="stat-label">Total Bookings</span>
                    <span class="stat-value">${report.totalBookings}</span>
                </div>
                <div class="report-stat">
                    <span class="stat-label">Total Revenue</span>
                    <span class="stat-value">₹${report.totalRevenue}</span>
                </div>
                <div class="report-stat">
                    <span class="stat-label">Avg Duration</span>
                    <span class="stat-value">${report.avgDuration}h</span>
                </div>
            </div>
            
            <h4>Vehicle Type Breakdown</h4>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Vehicle Type</th>
                        <th>Count</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(report.vehicleTypes).map(([type, count]) => `
                        <tr>
                            <td>${type.toUpperCase()}</td>
                            <td>${count}</td>
                            <td>${((count / report.totalBookings) * 100).toFixed(1)}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <h4>Detailed Transactions</h4>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Date/Time</th>
                        <th>Action</th>
                        <th>Slot</th>
                        <th>Vehicle</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.history.slice(-50).reverse().map(h => `
                        <tr>
                            <td>${new Date(h.timestamp).toLocaleString()}</td>
                            <td><span class="badge ${h.action === 'BOOKED' ? 'success' : 'info'}">${h.action}</span></td>
                            <td>${h.slotNumber}</td>
                            <td>${h.vehicleNumber || 'N/A'}</td>
                            <td>₹${h.amount || 0}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function exportReportPDF() {
    showNotification('PDF export feature coming soon!', 'info');
    // In a real implementation, use jsPDF library
}

function exportReportExcel() {
    const history = ParkingDB.getHistory();
    let csv = 'Timestamp,Action,Slot,Vehicle Type,Vehicle Number,Owner,Amount,Duration\\n';

    history.forEach(h => {
        csv += `${h.timestamp},${h.action},${h.slotNumber},${h.vehicleType || 'N/A'},${h.vehicleNumber || 'N/A'},${h.ownerName || 'N/A'},${h.amount || 0},${h.duration || 0}\\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartPark_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Report exported to CSV!', 'success');
}

function printReport() {
    window.print();
}
