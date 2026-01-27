# SmartPark Installation Guide

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Text editor (VS Code, Sublime Text, etc.)
- Basic understanding of HTML/CSS/JavaScript

### Installation Steps

#### 1. Download or Clone the Repository
```bash
git clone https://github.com/yourusername/smartpark.git
cd smartpark
```

Or simply download the ZIP file and extract it.

#### 2. Project Structure
```
smartpark/
├── index.html          # Main dashboard
├── bookings.html       # Bookings management page
├── analytics.html      # Analytics and statistics
├── app.js             # Main application logic
├── analytics.js       # Analytics functionality
├── database.js        # LocalStorage database wrapper
├── styles.css         # Main stylesheet
├── analytics-styles.css # Analytics page styles
├── README.md          # Project documentation
├── LICENSE            # License information
└── HOW_TO_GET_EMAIL_KEYS.md # EmailJS setup guide
```

#### 3. Open the Application
Simply open `index.html` in your web browser:
- Double-click `index.html`, OR
- Right-click → Open with → Your Browser, OR
- Use a local server (recommended for development)

#### 4. Using a Local Server (Optional but Recommended)

**Option A: Using Python**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then visit: `http://localhost:8000`

**Option B: Using Node.js (http-server)**
```bash
npm install -g http-server
http-server -p 8000
```

**Option C: Using VS Code Live Server**
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

---

## ⚙️ Configuration

### Email Notifications Setup (Optional)

To enable real email notifications:

1. **Create EmailJS Account**
   - Visit https://www.emailjs.com/
   - Sign up for a free account

2. **Get Your Credentials**
   - Follow instructions in `HOW_TO_GET_EMAIL_KEYS.md`
   - You'll need:
     - Public Key
     - Service ID
     - Template ID

3. **Configure in Application**
   - Click the ⚙️ Settings button (bottom right)
   - Enter your EmailJS credentials
   - Save settings

### Customization

#### Changing Theme Colors
1. Click ⚙️ Settings button
2. Select from available color themes:
   - Cyan (default)
   - Neon Green
   - Cyber Red
   - Purple
   - Yellow

#### Adjusting Total Slots
Edit `app.js` line 2:
```javascript
const TOTAL_SLOTS = 20; // Change to your desired number
```

#### Modifying Pricing
Edit `app.js` lines 5-10:
```javascript
const PRICING = {
    car: 50,    // ₹50 per hour
    bike: 20,   // ₹20 per hour
    truck: 100, // ₹100 per hour
    suv: 75     // ₹75 per hour
};
```

---

## 📱 Features Overview

### Dashboard (index.html)
- Real-time slot availability
- Interactive parking grid
- Booking form with validation
- Live statistics
- 3D parking animations
- Voice commands
- Sound effects

### Bookings Page (bookings.html)
- View all active bookings
- Release slots
- Search and filter
- Export bookings

### Analytics Page (analytics.html)
- Total revenue tracking
- Booking statistics
- Vehicle type distribution
- Recent activity log
- Export analytics reports

---

## 🎮 Usage Guide

### Booking a Slot
1. Navigate to Dashboard
2. Select vehicle type
3. Enter vehicle details
4. Choose duration
5. Select available slot (or click on grid)
6. Add optional notes
7. Click "Book Slot"

### Releasing a Slot
1. Go to Bookings page
2. Find the booking
3. Click "Release" button
4. Confirm action

### Voice Commands
1. Click microphone button
2. Say commands like:
   - "Release slot 5"
   - "Go to bookings"
   - "Go to dashboard"

### Keyboard Shortcuts
- `Ctrl + B` - Go to Bookings
- `Ctrl + D` - Go to Dashboard
- `Ctrl + A` - Go to Analytics
- `Ctrl + S` - Open Settings
- `Esc` - Close modals

---

## 🔧 Troubleshooting

### Slots Not Saving
- Check browser localStorage is enabled
- Clear browser cache and reload
- Try incognito/private mode

### Email Not Sending
- Verify EmailJS credentials
- Check browser console for errors
- Ensure internet connection
- Try virtual email mode first

### 3D Animations Laggy
- Enable "Lite Mode" in Settings
- Close other browser tabs
- Update graphics drivers
- Use a modern browser

### Sound Not Working
- Click sound toggle button (🔊)
- Check browser audio permissions
- Ensure volume is not muted

---

## 💾 Data Management

### Backup Data
1. Go to Analytics page
2. Click "Export Report"
3. Save JSON file

### Restore Data
1. Open browser console (F12)
2. Run: `ParkingDB.importData(jsonString)`

### Clear All Data
```javascript
// In browser console
ParkingDB.clearAll();
```

---

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full Support |
| Firefox | 88+     | ✅ Full Support |
| Edge    | 90+     | ✅ Full Support |
| Safari  | 14+     | ✅ Full Support |
| Opera   | 76+     | ✅ Full Support |

---

## 📊 Performance Tips

1. **Limit Total Slots**: Keep under 50 for best performance
2. **Enable Lite Mode**: For screen recording or slower devices
3. **Clear History**: Periodically clear old booking history
4. **Use Modern Browser**: Latest Chrome/Firefox recommended

---

## 🔒 Security Notes

- All data stored locally in browser
- No server-side storage
- Email credentials stored in localStorage
- Clear data when using public computers

---

## 📞 Support

For issues or questions:
- Check `README.md` for documentation
- Review `HOW_TO_GET_EMAIL_KEYS.md` for email setup
- Open browser console (F12) for error messages

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🎉 Enjoy SmartPark!

Your intelligent parking management system is ready to use. Happy parking! 🚗🏍️🚚
