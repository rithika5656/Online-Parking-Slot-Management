# 🅿️ SmartPark - Intelligent Parking Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-green.svg)](CHANGELOG.md)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.javascript.com/)

A modern, feature-rich parking slot management system with real-time tracking, analytics, and intelligent automation.

## ✨ Features

### Core Functionality
- 🚗 **Multi-Vehicle Support**: Car, Bike, Truck, SUV with dynamic pricing
- 📊 **Real-time Dashboard**: Live slot availability and statistics
- 💰 **Smart Pricing**: Vehicle type-based pricing system
- 📱 **Responsive Design**: Works on all devices
- 🎨 **Theme Customization**: 5 color themes to choose from

### Booking Management
- ✅ **Easy Booking**: Simple form with validation
- 📞 **Contact Info**: Phone number and email tracking
- 📝 **Booking Notes**: Add special requirements
- ⏱️ **Duration Tracking**: Flexible 1-24 hour bookings
- 💵 **Real-time Pricing**: Instant price calculation

### Data & Analytics
- 📈 **Analytics Dashboard**: Revenue, occupancy, and trends
- 📊 **Vehicle Distribution**: Visual charts and statistics
- 📜 **Booking History**: Complete activity log
- 💾 **Export to CSV**: Download bookings data
- 🔄 **Backup & Restore**: Full database management

### User Experience
- ⌨️ **Keyboard Shortcuts**: Quick navigation (Ctrl+D/B/A/S)
- 🔄 **Auto-Refresh**: Real-time updates every 30 seconds
- 🖨️ **Print Receipts**: Professional booking receipts
- 🎤 **Voice Commands**: Hands-free operation
- 🔊 **Sound Effects**: Interactive audio feedback
- 🎯 **HUD Search**: Quick slot finder

### Email & Notifications
- 📧 **Email Integration**: EmailJS support
- 📨 **Booking Confirmations**: Automatic email notifications
- 🎫 **QR Codes**: Digital booking tokens
- 📥 **Download Tokens**: Text file receipts

### Visual Effects
- 🎨 **3D Animations**: Parking simulation
- ✨ **Particle Effects**: Dynamic backgrounds
- 🖱️ **Custom Cursor**: Futuristic UI
- 🌊 **Smooth Transitions**: Polished interactions
- 🎭 **Glassmorphism**: Modern design aesthetic

## 🚀 Quick Start

### Installation
1. Download or clone the repository
2. Open `index.html` in your browser
3. Start managing parking slots!

For detailed setup instructions, see [INSTALLATION.md](INSTALLATION.md)

### Using a Local Server (Recommended)
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

Then visit: `http://localhost:8000`

## 📖 Documentation

- **[Installation Guide](INSTALLATION.md)** - Complete setup instructions
- **[API Documentation](API_DOCUMENTATION.md)** - Function reference
- **[Changelog](CHANGELOG.md)** - Version history
- **[EmailJS Setup](HOW_TO_GET_EMAIL_KEYS.md)** - Email configuration

## 💻 Usage

### Booking a Slot
1. Select vehicle type
2. Enter vehicle details and contact info
3. Choose duration
4. Select available slot
5. Add optional notes
6. Click "Book Slot"

### Managing Bookings
- View all bookings on the Bookings page
- Release slots when vehicles leave
- Print receipts for customers
- Export data to CSV

### Analytics
- Track total revenue
- Monitor occupancy rates
- View vehicle type distribution
- Export analytics reports

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + D` | Dashboard |
| `Ctrl/Cmd + B` | Bookings |
| `Ctrl/Cmd + A` | Analytics |
| `Ctrl/Cmd + S` | Settings |
| `Esc` | Close Modals |

## 🎨 Customization

### Pricing
Edit `app.js` to modify pricing:
```javascript
const PRICING = {
    car: 50,    // ₹50/hour
    bike: 20,   // ₹20/hour
    truck: 100, // ₹100/hour
    suv: 75     // ₹75/hour
};
```

### Total Slots
```javascript
const TOTAL_SLOTS = 20; // Change to your needs
```

### Theme Colors
Click ⚙️ Settings → Select theme color

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with Glassmorphism
- **Fonts**: Google Fonts (Orbitron, Outfit)
- **Icons**: Font Awesome 6
- **Email**: EmailJS API
- **Storage**: LocalStorage
- **Animation**: Canvas API, CSS Animations

## 📦 Project Structure

```
smartpark/
├── index.html              # Main dashboard
├── bookings.html           # Bookings page
├── analytics.html          # Analytics page
├── app.js                  # Main application logic
├── analytics.js            # Analytics functionality
├── database.js             # Database wrapper
├── styles.css              # Main stylesheet
├── analytics-styles.css    # Analytics styles
├── README.md               # This file
├── INSTALLATION.md         # Setup guide
├── API_DOCUMENTATION.md    # API reference
├── CHANGELOG.md            # Version history
├── HOW_TO_GET_EMAIL_KEYS.md # Email setup
└── LICENSE                 # MIT License
```

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full Support |
| Firefox | 88+     | ✅ Full Support |
| Edge    | 90+     | ✅ Full Support |
| Safari  | 14+     | ✅ Full Support |
| Opera   | 76+     | ✅ Full Support |

## 🔒 Privacy & Security

- All data stored locally in browser
- No server-side storage
- Email credentials in localStorage
- Clear data on public computers
- No external tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- EmailJS for email service
- Open source community

## 📞 Support

For issues or questions:
- Check documentation files
- Open browser console (F12) for errors
- Review API documentation
- Check changelog for updates

## 🎉 Enjoy SmartPark!

Transform your parking management with intelligence and style! 🚗🏍️🚚

---

**Made with ❤️ for efficient parking management**

**Version**: 2.0.0 | **Last Updated**: 2024
