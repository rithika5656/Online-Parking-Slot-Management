/**
 * Database Module for Parking Slot Management
 * Uses localStorage as a simple database solution
 */

const ParkingDB = {
    // Database keys
    KEYS: {
        SLOTS: 'parkingSlots',
        HISTORY: 'parkingHistory',
        SETTINGS: 'parkingSettings'
    },

    // Initialize database with default settings
    init: function(totalSlots = 20) {
        if (!this.get(this.KEYS.SETTINGS)) {
            this.set(this.KEYS.SETTINGS, {
                totalSlots: totalSlots,
                createdAt: new Date().toISOString(),
                version: '1.0.0'
            });
        }

        if (!this.get(this.KEYS.HISTORY)) {
            this.set(this.KEYS.HISTORY, []);
        }

        console.log('🗄️ Parking Database initialized');
        return this;
    },

    // Get data from localStorage
    get: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from database:', error);
            return null;
        }
    },

    // Set data to localStorage
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to database:', error);
            return false;
        }
    },

    // Add entry to booking history
    addToHistory: function(entry) {
        const history = this.get(this.KEYS.HISTORY) || [];
        history.push({
            ...entry,
            timestamp: new Date().toISOString()
        });
        // Keep only last 100 entries
        if (history.length > 100) {
            history.shift();
        }
        this.set(this.KEYS.HISTORY, history);
    },

    // Get booking history
    getHistory: function() {
        return this.get(this.KEYS.HISTORY) || [];
    },

    // Get database statistics
    getStats: function() {
        const slots = this.get(this.KEYS.SLOTS) || [];
        const history = this.get(this.KEYS.HISTORY) || [];
        const settings = this.get(this.KEYS.SETTINGS) || {};

        return {
            totalSlots: slots.length,
            availableSlots: slots.filter(s => !s.isOccupied).length,
            occupiedSlots: slots.filter(s => s.isOccupied).length,
            totalBookings: history.length,
            databaseVersion: settings.version || 'unknown'
        };
    },

    // Clear all data (reset database)
    clearAll: function() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        console.log('🗑️ Database cleared');
    },

    // Export data as JSON
    exportData: function() {
        const data = {};
        Object.entries(this.KEYS).forEach(([name, key]) => {
            data[name] = this.get(key);
        });
        return JSON.stringify(data, null, 2);
    },

    // Import data from JSON
    importData: function(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            Object.entries(this.KEYS).forEach(([name, key]) => {
                if (data[name]) {
                    this.set(key, data[name]);
                }
            });
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
};

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParkingDB;
}
