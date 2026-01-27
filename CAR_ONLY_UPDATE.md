# SmartPark - Car Parking Only Update

## Changes Made

### Simplified to Car Parking Only

The system has been updated to support **car parking only**, removing bikes, trucks, and SUVs.

### Changes:

1. **Removed Vehicle Type Selector**
   - No more dropdown to select vehicle type
   - System automatically uses "car" for all bookings

2. **Simplified Filter Buttons**
   - Removed: Bikes, Trucks, SUVs filter buttons
   - Kept: "All Cars" button only

3. **Fixed Pricing**
   - Single rate: ₹50/hour for all cars
   - Removed variable pricing

4. **Updated Branding**
   - Title: "SmartPark - Car Parking Management"
   - Subtitle: "Intelligent Car Parking Management System"

### Pricing:
- **Car**: ₹50 per hour (fixed rate)

### To Customize:
Edit `app.js` line 5:
```javascript
const HOURLY_RATE = 50; // Change this value
```

---

**Version**: 2.6.0 (Car Parking Only)
**Date**: January 27, 2026
