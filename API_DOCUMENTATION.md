# SmartPark - API Documentation

## Overview
SmartPark uses localStorage as its database. All functions are globally accessible through the browser console or can be integrated into other scripts.

---

## Core Functions

### Slot Management

#### `initializeSlots()`
Initializes parking slots if they don't exist.

**Returns:** Array of slot objects

**Example:**
```javascript
const slots = initializeSlots();
```

#### `getSlots()`
Retrieves all parking slots from localStorage.

**Returns:** Array of slot objects

**Example:**
```javascript
const allSlots = getSlots();
console.log(allSlots);
```

#### `saveSlots(slots)`
Saves slots array to localStorage.

**Parameters:**
- `slots` (Array): Array of slot objects

**Example:**
```javascript
const slots = getSlots();
slots[0].isOccupied = true;
saveSlots(slots);
```

---

### Booking Functions

#### `bookSlot(slotId, vType, vehicleNum, owner, phone, email, duration, notes)`
Books a parking slot.

**Parameters:**
- `slotId` (Number): Slot ID (1-20)
- `vType` (String): Vehicle type ('car', 'bike', 'truck', 'suv')
- `vehicleNum` (String): Vehicle registration number
- `owner` (String): Owner name
- `phone` (String): Phone number (10 digits)
- `email` (String): Email address
- `duration` (Number): Duration in hours (1-24)
- `notes` (String): Optional notes

**Returns:** Boolean (success/failure)

**Example:**
```javascript
const success = bookSlot(
    5, 
    'car', 
    'KA-01-AB-1234', 
    'John Doe', 
    '9876543210',
    'john@example.com', 
    2, 
    'VIP parking'
);
```

#### `releaseSlot(slotId)`
Releases an occupied slot.

**Parameters:**
- `slotId` (Number): Slot ID to release

**Example:**
```javascript
releaseSlot(5);
```

---

### Pricing

#### `calculatePrice(vehicleType, duration)`
Calculates parking fee based on vehicle type and duration.

**Parameters:**
- `vehicleType` (String): 'car', 'bike', 'truck', or 'suv'
- `duration` (Number): Hours

**Returns:** Number (price in ₹)

**Pricing Table:**
| Vehicle Type | Rate (₹/hour) |
|--------------|---------------|
| Car          | 50            |
| Bike         | 20            |
| Truck        | 100           |
| SUV          | 75            |

**Example:**
```javascript
const price = calculatePrice('car', 3); // Returns 150
```

---

### Database Functions (ParkingDB)

#### `ParkingDB.init(totalSlots)`
Initializes the database with default settings.

**Parameters:**
- `totalSlots` (Number): Total number of slots (default: 20)

**Example:**
```javascript
ParkingDB.init(30);
```

#### `ParkingDB.get(key)`
Retrieves data from localStorage.

**Parameters:**
- `key` (String): Storage key

**Returns:** Object or null

**Example:**
```javascript
const settings = ParkingDB.get(ParkingDB.KEYS.SETTINGS);
```

#### `ParkingDB.set(key, value)`
Stores data in localStorage.

**Parameters:**
- `key` (String): Storage key
- `value` (Any): Data to store

**Example:**
```javascript
ParkingDB.set('customKey', { data: 'value' });
```

#### `ParkingDB.addToHistory(entry)`
Adds an entry to booking history.

**Parameters:**
- `entry` (Object): History entry object

**Example:**
```javascript
ParkingDB.addToHistory({
    action: 'BOOKED',
    slotNumber: 'P05',
    vehicleType: 'car',
    vehicleNumber: 'KA-01-AB-1234',
    amount: 100,
    duration: 2
});
```

#### `ParkingDB.getHistory()`
Retrieves booking history.

**Returns:** Array of history entries

**Example:**
```javascript
const history = ParkingDB.getHistory();
console.log(history);
```

#### `ParkingDB.getStats()`
Gets database statistics.

**Returns:** Object with statistics

**Example:**
```javascript
const stats = ParkingDB.getStats();
console.log(stats);
// {
//   totalSlots: 20,
//   availableSlots: 15,
//   occupiedSlots: 5,
//   totalBookings: 100,
//   databaseVersion: '1.0.0'
// }
```

#### `ParkingDB.exportData()`
Exports all data as JSON string.

**Returns:** String (JSON)

**Example:**
```javascript
const backup = ParkingDB.exportData();
console.log(backup);
```

#### `ParkingDB.importData(jsonString)`
Imports data from JSON string.

**Parameters:**
- `jsonString` (String): JSON data to import

**Returns:** Boolean (success/failure)

**Example:**
```javascript
const success = ParkingDB.importData(backupData);
```

#### `ParkingDB.clearAll()`
Clears all database data.

**Example:**
```javascript
ParkingDB.clearAll();
```

---

### Export Functions

#### `exportBookingsToCSV()`
Exports current bookings to CSV file.

**Example:**
```javascript
exportBookingsToCSV();
```

#### `backupDatabase()`
Downloads complete database backup as JSON.

**Example:**
```javascript
backupDatabase();
```

#### `restoreDatabase()`
Opens file picker to restore database from backup.

**Example:**
```javascript
restoreDatabase();
```

---

### Print Functions

#### `printReceipt(slotId)`
Opens print dialog for booking receipt.

**Parameters:**
- `slotId` (Number): Slot ID

**Example:**
```javascript
printReceipt(5);
```

---

### UI Functions

#### `refreshUI()`
Refreshes all UI components.

**Example:**
```javascript
refreshUI();
```

#### `renderParkingGrid()`
Renders the parking slots grid.

**Example:**
```javascript
renderParkingGrid();
```

#### `updateStats()`
Updates statistics display.

**Example:**
```javascript
updateStats();
```

#### `showNotification(message, type)`
Shows a notification toast.

**Parameters:**
- `message` (String): Notification message
- `type` (String): 'success', 'error', or 'info'

**Example:**
```javascript
showNotification('Booking successful!', 'success');
showNotification('Error occurred!', 'error');
```

---

### Settings Functions

#### `openSettings()`
Opens the settings modal.

**Example:**
```javascript
openSettings();
```

#### `saveSettings()`
Saves current settings from modal.

**Example:**
```javascript
saveSettings();
```

---

### Sound & Voice

#### `soundManager.play(type)`
Plays a sound effect.

**Parameters:**
- `type` (String): 'hover', 'click', 'success', or 'error'

**Example:**
```javascript
soundManager.play('success');
```

#### `voiceManager.toggle()`
Toggles voice recognition.

**Example:**
```javascript
voiceManager.toggle();
```

---

## Data Structures

### Slot Object
```javascript
{
    id: 1,
    slotNumber: "P01",
    isOccupied: false,
    vehicleType: "car",
    vehicleNumber: "KA-01-AB-1234",
    ownerName: "John Doe",
    ownerPhone: "9876543210",
    ownerEmail: "john@example.com",
    duration: 2,
    amount: 100,
    notes: "VIP parking",
    bookedAt: "2024-01-27T10:30:00.000Z",
    expiresAt: "2024-01-27T12:30:00.000Z"
}
```

### History Entry
```javascript
{
    action: "BOOKED",
    slotNumber: "P05",
    vehicleType: "car",
    vehicleNumber: "KA-01-AB-1234",
    ownerName: "John Doe",
    amount: 100,
    duration: 2,
    timestamp: "2024-01-27T10:30:00.000Z"
}
```

---

## LocalStorage Keys

```javascript
ParkingDB.KEYS = {
    SLOTS: 'parkingSlots',
    HISTORY: 'parkingHistory',
    SETTINGS: 'parkingSettings'
}
```

Additional keys:
- `emailSettings`: EmailJS configuration
- `themeColor`: Current theme color
- `themeGlow`: Theme glow color
- `themeDim`: Theme dim color

---

## Events

### Keyboard Shortcuts
- `Ctrl/Cmd + D`: Navigate to Dashboard
- `Ctrl/Cmd + B`: Navigate to Bookings
- `Ctrl/Cmd + A`: Navigate to Analytics
- `Ctrl/Cmd + S`: Open Settings
- `Esc`: Close modals

---

## Auto-Refresh

The dashboard auto-refreshes every 30 seconds.

**Stop auto-refresh:**
```javascript
stopAutoRefresh();
```

**Restart auto-refresh:**
```javascript
initAutoRefresh();
```

---

## Error Handling

All functions include error handling. Check browser console for detailed error messages.

**Example:**
```javascript
try {
    const success = bookSlot(/* params */);
    if (!success) {
        console.error('Booking failed');
    }
} catch (error) {
    console.error('Error:', error);
}
```

---

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+
- Opera 76+

---

## Security Notes

- All data stored locally in browser
- No server-side communication (except EmailJS)
- Clear localStorage on public computers
- Email credentials stored in plain text (use environment-specific keys)

---

## Support

For issues or questions, check:
- Browser console (F12) for errors
- `README.md` for general documentation
- `INSTALLATION.md` for setup guide
- `CHANGELOG.md` for version history

---

**Last Updated**: 2024
**Version**: 2.0.0
