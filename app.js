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
const ownerEmail = document.getElementById('owner-email');
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
        slotDiv.dataset.id = slot.id; // Added for animation targeting
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

    // Simple count animation
    animateValue(availableCount, parseInt(availableCount.textContent), available, 500);
    animateValue(occupiedCount, parseInt(occupiedCount.textContent), occupied, 500);
    totalCount.textContent = TOTAL_SLOTS;
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
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

// Rate per hour
const HOURLY_RATE = 50;

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

    bookingsBody.innerHTML = occupiedSlots.map((slot, index) => `
        <tr style="animation: slideDown 0.3s ease backwards ${index * 0.1}s">
            <td>${slot.slotNumber}</td>
            <td>${slot.vehicleNumber}</td>
            <td>${slot.ownerName}</td>
            <td>${new Date(slot.bookedAt).toLocaleString()}</td>
            <td>${slot.duration}h</td>
            <td>₹${slot.amount}</td>
            <td>
                <button class="btn-release" onclick="releaseSlot(${slot.id})">
                    Release
                </button>
            </td>
        </tr>
    `).join('');
}

// Book a slot
function bookSlot(slotId, vehicleNum, owner, email, duration) {
    const slots = getSlots();
    const slotIndex = slots.findIndex(s => s.id === parseInt(slotId));

    if (slotIndex !== -1 && !slots[slotIndex].isOccupied) {
        slots[slotIndex].isOccupied = true;
        slots[slotIndex].vehicleNumber = vehicleNum.toUpperCase();
        slots[slotIndex].ownerName = owner;
        slots[slotIndex].ownerEmail = email;
        slots[slotIndex].duration = duration;
        slots[slotIndex].amount = duration * HOURLY_RATE;
        slots[slotIndex].bookedAt = new Date().toISOString();
        saveSlots(slots);

        // Trigger Email Sending
        sendConfirmationEmail({
            slot: slots[slotIndex].slotNumber,
            name: owner,
            vehicle: vehicleNum.toUpperCase(),
            email: email,
            time: new Date().toLocaleString(),
            duration: duration,
            amount: slots[slotIndex].amount
        });

        soundManager.play('success'); // Play Success Sound

        // --- TRIGGER 3D PARKING SIMULATION ---
        simulateParking(slots[slotIndex].id);

        return true;
    }
    soundManager.play('error'); // Play Error Sound
    return false;
}

/* --- 3D PARKING SIMULATION --- */
function simulateParking(slotId) {
    // Check Lite Mode (disable animations for performance/recording)
    const settings = JSON.parse(localStorage.getItem('emailSettings')) || {};
    if (settings.liteMode) return;

    const slotEl = document.querySelector(`.slot[data-id="${slotId}"]`);
    if (!slotEl) return;

    // Create Car Element
    const car = document.createElement('div');
    car.className = 'moving-car';
    car.innerHTML = `
        <div class="car-body">
            <div class="car-lights-front">
                <div class="car-light"></div>
                <div class="car-light"></div>
            </div>
            <div class="car-lights-back">
                <div class="car-light-red"></div>
                <div class="car-light-red"></div>
            </div>
        </div>
    `;
    document.body.appendChild(car);

    // Initial Position (Bottom Center of Screen)
    const startX = window.innerWidth / 2 - 30; // Half car width
    const startY = window.innerHeight + 100; // Below screen

    car.style.left = `${startX}px`;
    car.style.top = `${startY}px`;
    car.style.transform = `scale(2) rotate(0deg)`; // Start Big

    // Get Target Slot Position
    const rect = slotEl.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2 - 30;
    const targetY = rect.top + rect.height / 2 - 50;

    // SOUND: Revving Engine
    soundManager.play('hover'); // Re-use hover sound (high pitch) as rev

    // Step 1: Drive In
    requestAnimationFrame(() => {
        car.style.transition = 'top 1s ease-out, transform 1s ease-out';
        car.style.top = `${window.innerHeight - 200}px`; // Drive to 'entry' point
        car.style.transform = `scale(1.5)`;

        // Step 2: Drive to Slot
        setTimeout(() => {
            car.style.transition = 'all 1s cubic-bezier(0.25, 1, 0.5, 1)';
            car.style.left = `${targetX}px`;
            car.style.top = `${targetY}px`;
            car.style.transform = `scale(1) rotate(0deg)`; // Adjust rotation if needed based on slot direction

            // Step 3: Parked Effect
            setTimeout(() => {
                slotEl.classList.add('just-parked');
                car.style.opacity = '0'; // Fade out car (it 'enters' the slot data)

                // Cleanup
                setTimeout(() => {
                    car.remove();
                    slotEl.classList.remove('just-parked');
                }, 1000);
            }, 1000);
        }, 800);
    });
}


// Mock Email Sending Function
function sendConfirmationEmail(details) {
    const consoleElement = document.getElementById('system-console');

    // Simulate Satellite Transmission Logic (Visual effect)
    if (consoleElement) {
        consoleElement.innerHTML = `<span style="color: var(--primary)">ENCRYPTING DATA...</span>`;
        setTimeout(() => {
            consoleElement.innerHTML = `<span style="color: var(--primary)">CONNECTING TO RELAY...</span>`;
        }, 800);
    }

    // 1. Get Keys from LocalStorage
    const settings = JSON.parse(localStorage.getItem('emailSettings')) || {};
    const { serviceID, templateID, publicKey } = settings;

    // 2. Check Configuration
    if (serviceID && templateID && publicKey && typeof emailjs !== 'undefined') {

        if (consoleElement) consoleElement.innerHTML = `<span style="color: var(--primary)">CONNECTING TO SECURE EMAIL SERVER...</span>`;

        // Re-init with user key if needed
        emailjs.init(publicKey);

        const templateParams = {
            to_name: details.name,
            to_email: details.email,
            slot_number: details.slot,
            vehicle_number: details.vehicle,
            booking_time: details.time,
            message: `Your booking for vehicle ${details.vehicle} at slot ${details.slot} is confirmed. Duration: ${details.duration}h. Amount: ₹${details.amount}.`
        };

        emailjs.send(serviceID, templateID, templateParams)
            .then(() => {
                console.log('SUCCESS!');
                if (consoleElement) consoleElement.innerHTML = `<span style="color: var(--success)">REAL EMAIL SENT SUCCESSFULLY!</span>`;
                showNotification(`Email sent to ${details.email}`, 'success');
            }, (error) => {
                console.log('FAILED...', error);
                if (consoleElement) consoleElement.innerHTML = `<span style="color: var(--danger)">EMAIL FAILED. CHECK SETTINGS.</span>`;
                // If fail, show modal
                setTimeout(() => showVirtualEmailModal(details), 1000);
            });

    } else {
        // Fallback: Show Virtual Email Modal + Prompt to Configure
        if (consoleElement) consoleElement.innerHTML = `<span style="color: var(--text-muted)">SIMULATING TRANSMISSION (NO KEYS)...</span>`;
        setTimeout(() => {
            showVirtualEmailModal(details);
            showNotification('Tip: Use Settings ⚙️ to enable real emails!', 'info');
        }, 1500);
    }
}

// Open Settings Modal
function openSettings() {
    const existing = document.querySelector('.email-modal-overlay');
    if (existing) existing.remove();

    const settings = JSON.parse(localStorage.getItem('emailSettings')) || {};

    const modalHTML = `
        <div class="email-modal-overlay">
            <div class="config-modal">
                <h3>⚙️ System Configuration</h3>
                
                <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:8px; margin-bottom:20px;">
                    <label style="display:flex; align-items:center; cursor:pointer;">
                        <input type="checkbox" id="cfg-lite" ${settings.liteMode ? 'checked' : ''} style="width:20px; height:20px; margin-right:10px;">
                        <span>
                            <strong style="display:block; color:var(--primary)">Lite Mode (Fix Recording Issues)</strong>
                            <span style="font-size:0.8rem; color:#aaa">Disables 3D animations to prevent screen recorder crashes.</span>
                        </span>
                    </label>
                </div>

                <div class="config-group">
                    <label>Public Key</label>
                    <input type="text" id="cfg-public" value="${settings.publicKey || ''}" placeholder="e.g. User_K12345...">
                </div>
                <div class="config-group">
                    <label>Service ID</label>
                    <input type="text" id="cfg-service" value="${settings.serviceID || ''}" placeholder="e.g. service_xyz...">
                </div>
                <div class="config-group">
                    <label>Template ID</label>
                    <input type="text" id="cfg-template" value="${settings.templateID || ''}" placeholder="e.g. template_abc...">
                </div>
                <button class="btn-save-config" onclick="saveSettings()">Save & Connect</button>
                <a href="https://dashboard.emailjs.com/admin" target="_blank" class="help-link">Where do I find these?</a>
                <button class="btn-close-email" style="background:transparent; color:#888; margin-top:10px; width:100%" onclick="this.closest('.email-modal-overlay').remove()">Cancel</button>
            </div>
        </div>
    `;

    const range = document.createRange();
    const fragment = range.createContextualFragment(modalHTML);
    document.body.appendChild(fragment);
}

function saveSettings() {
    const publicKey = document.getElementById('cfg-public').value.trim();
    const serviceID = document.getElementById('cfg-service').value.trim();
    const templateID = document.getElementById('cfg-template').value.trim();
    const liteMode = document.getElementById('cfg-lite').checked;

    // Use empty string to clear settings if user wants, or keep existing logic
    // We save whatever is there
    const settings = { publicKey, serviceID, templateID, liteMode };
    localStorage.setItem('emailSettings', JSON.stringify(settings));

    showNotification('Settings saved successfully!', 'success');
    document.querySelector('.email-modal-overlay').remove();

    // Init immediately if key exists
    if (publicKey && typeof emailjs !== 'undefined') emailjs.init(publicKey);
}

function showVirtualEmailModal(details) {
    // Remove existing modal if any
    const existing = document.querySelector('.email-modal-overlay');
    if (existing) existing.remove();

    const modalHTML = `
        <div class="email-modal-overlay">
            <div class="email-modal">
                <div class="email-header">
                    <h3>Booking Confirmation - Slot ${details.slot}</h3>
                    <span class="email-close" onclick="this.closest('.email-modal-overlay').remove()">&times;</span>
                </div>
                <div class="email-body">
                    <div class="email-logo">SmartPark</div>
                    <div class="email-meta">
                        <div class="email-row">
                            <span class="email-label">From:</span>
                            <span class="email-value">notifications@smartpark.system</span>
                        </div>
                        <div class="email-row">
                            <span class="email-label">To:</span>
                            <span class="email-value">${details.email}</span>
                        </div>
                        <div class="email-row">
                            <span class="email-label">Date:</span>
                            <span class="email-value">${details.time}</span>
                        </div>
                    </div>
                    <div class="email-content">
                        <p>Hello <strong>${details.name}</strong>,</p>
                        <p>Your parking slot has been successfully booked!</p>
                        <div style="background:#f5f5f5; padding:15px; border-radius:4px; margin:15px 0;">
                            <strong>Vehicle:</strong> ${details.vehicle}<br>
                            <strong>Slot:</strong> <span style="color:#1a73e8; font-weight:bold">${details.slot}</span><br>
                            <strong>Status:</strong> Confirmed
                        </div>
                        
                        <a href="#" class="btn-download-token" onclick="downloadToken('${details.slot}', '${details.vehicle}', '${details.name}', '${details.time}')">
                            <i class="fas fa-download"></i> Download Token
                        </a>

                        <p style="margin-top:15px">Thank you for choosing SmartPark.</p>
                    </div>
                </div>
                <div class="email-footer">
                    <button class="btn-close-email" onclick="this.closest('.email-modal-overlay').remove()">Close</button>
                </div>
            </div>
        </div>
    `;

    const range = document.createRange();
    const fragment = range.createContextualFragment(modalHTML);
    document.body.appendChild(fragment);

    // Also try to open mailto as a backup for "real" feeling
    // setTimeout(() => {
    //     window.location.href = `mailto:${details.email}?subject=Booking%20Confirmation&body=Your%20slot%20${details.slot}%20is%20booked.`;
    // }, 1000);
}

// Function to download booking token
function downloadToken(slot, vehicle, name, time) {
    const tokenContent = `
========================================
       SMARTPARK - PARKING TOKEN
========================================

Booking Reference: #SP-${Date.now().toString().slice(-6)}
Date: ${time}

----------------------------------------
User Details:
  Name:    ${name}
  Vehicle: ${vehicle}

Slot Details:
  Slot No: ${slot}
  Status:  CONFIRMED
----------------------------------------

Please show this token at the entry gate.
    
========================================
    Powering Smart Campuses
========================================
    `;

    const blob = new Blob([tokenContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartPark_Token_${slot}_${vehicle}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification('Token downloaded successfully!', 'success');
}

function openMailClient(details) {
    // Deprecated in favor of Modal for clearer demo
}

// Release a slot
function releaseSlot(slotId) {
    // Add confirmation
    if (!confirm('Are you sure you want to release this slot?')) {
        return;
    }

    const slots = getSlots();
    const slotIndex = slots.findIndex(s => s.id === parseInt(slotId));

    if (slotIndex !== -1 && slots[slotIndex].isOccupied) {
        const releasedEmail = slots[slotIndex].ownerEmail;

        slots[slotIndex].isOccupied = false;
        slots[slotIndex].vehicleNumber = null;
        slots[slotIndex].ownerName = null;
        slots[slotIndex].ownerEmail = null;
        slots[slotIndex].bookedAt = null;
        saveSlots(slots);

        // Immediate UI Update
        if (document.getElementById('bookings-body')) {
            renderBookings(); // Force re-render of table
        }
        refreshUI(); // Update other stats

        soundManager.play('success'); // Play Success Sound
        showNotification('Slot released successfully!', 'success');

        // Optional: Notify release
        if (releasedEmail) {
            console.log(`📧 SENDING EXIT NOTIFICATION TO: ${releasedEmail}`);
        }
    }
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Inline styles for positioning, but visual styles are in CSS
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s forwards';
        setTimeout(() => {
            notification.remove();
        }, 500);
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
if (bookForm) {
    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const slotId = slotSelect.value;
        const vehicle = vehicleNumber.value.trim();
        const owner = ownerName.value.trim();
        const email = ownerEmail.value.trim();
        const duration = parseInt(document.getElementById('duration').value) || 1;

        if (!slotId || !vehicle || !owner || !email) {
            showNotification('Please fill all fields!', 'error');
            return;
        }

        if (bookSlot(slotId, vehicle, owner, email, duration)) {
            // Success notification handled in sendConfirmationEmail for better flow
            // showNotification('Slot booked successfully!', 'success'); // Duplicate
            bookForm.reset();
            refreshUI();
        } else {
            showNotification('Failed to book slot. Please try again.', 'error');
        }
    });
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initializeSlots();

    // Core visual effects
    initParticles();
    initSystemConsole();
    initTiltEffect();

    // Page Specific Logic
    if (document.getElementById('slots-container')) {
        // Dashboard Page
        populateSlotDropdown();
        renderParkingGrid();
        updateStats();

        // Settings Button only for dashboard primarily, but let's keep it global if needed. 
        // Actually user wants exactly "old version". In "old version" settings might be everywhere?
        // Let's attach settings button to body regardless.
    }

    if (document.getElementById('bookings-body')) {
        // Bookings Page
        renderBookings();
    }

    // Add Settings Button
    const settingsBtn = document.createElement('div');
    settingsBtn.className = 'settings-btn';
    settingsBtn.innerHTML = '⚙️';
    settingsBtn.title = 'Configure Real Email';
    settingsBtn.onclick = openSettings;
    document.body.appendChild(settingsBtn);

    // Initialize Intro and Cursor
    initCursor();

    // Initialize Clock and Sound
    initClock();
    soundManager.init();
    voiceManager.init(); // Init Voice Assistant
});

/* --- TRIGGER 3D PARKING SIMULATION --- */
// ... (code remains)

/* --- VOICE ASSISTANT MANAGER --- */
const voiceManager = {
    recognition: null,
    isListening: false,

    init() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.log("Voice API not supported");
            return;
        }

        // Create UI Elements
        const btn = document.createElement('button');
        btn.className = 'voice-btn';
        btn.innerHTML = '<i class="fas fa-microphone"></i>';
        btn.title = 'Voice Assistant';
        btn.onclick = () => this.toggle();
        document.body.appendChild(btn);
        this.btn = btn;

        const feedback = document.createElement('div');
        feedback.className = 'voice-feedback';
        feedback.innerHTML = `
            <div class="voice-wave">
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
                <div class="voice-bar"></div>
            </div>
            <span id="voice-text">Listening...</span>
        `;
        document.body.appendChild(feedback);
        this.feedback = feedback;
        this.feedbackText = feedback.querySelector('#voice-text');

        // Setup API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.btn.classList.add('listening');
            this.feedback.style.display = 'flex';
            this.feedbackText.textContent = "Listening...";
            soundManager.play('hover');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.btn.classList.remove('listening');
            this.feedback.style.display = 'none';
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            this.feedbackText.textContent = `"${transcript}"`;
            this.processCommand(transcript);
        };

        this.recognition.onerror = (event) => {
            this.feedbackText.textContent = "Error";
            setTimeout(() => this.recognition.stop(), 1000);
        };
    },

    toggle() {
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    },

    processCommand(cmd) {
        console.log("Voice Command:", cmd);

        // Command: "Release Slot [Number]"
        if (cmd.includes('release slot')) {
            const match = cmd.match(/\d+/);
            if (match) {
                const slotNum = match[0];
                // Find slot ID by number (simulated logic since id usually matches number in this demo but might differ)
                // In our mock data, P01 -> id 1, etc.
                const slots = getSlots();
                const target = slots.find(s => s.slotNumber === `P0${slotNum}` || s.slotNumber === `P${slotNum}`);

                if (target) {
                    if (target.isOccupied) {
                        releaseSlot(target.id);
                        this.speak(`Released slot ${target.slotNumber}`);
                    } else {
                        this.speak(`Slot ${target.slotNumber} is already free`);
                        showNotification(`Slot ${target.slotNumber} is already free`, 'info');
                    }
                } else {
                    this.speak("Slot not found");
                }
            }
        }
        // Command: "Scroll to [Section]"
        else if (cmd.includes('go to bookings') || cmd.includes('show bookings')) {
            const section = document.querySelector('.bookings-list');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                this.speak("Showing bookings");
            } else {
                // If separate page (old version), redirect
                window.location.href = 'bookings.html';
            }
        }
        else if (cmd.includes('go to dashboard')) {
            window.location.href = 'index.html';
        }
        else {
            this.speak("Command not recognized");
            // showNotification(`Unknown command: "${cmd}"`, 'error');
        }
    },

    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
};

/* --- LIVE CLOCK --- */
function initClock() {
    const clockDiv = document.createElement('div');
    clockDiv.className = 'live-clock';
    clockDiv.innerHTML = '<span id="time-display">00:00:00</span><span class="date" id="date-display">LOADING...</span>';

    // Insert into header
    const header = document.querySelector('header');
    if (header) {
        header.appendChild(clockDiv);
        // Make header relative for positioning if not already
        if (getComputedStyle(header).position === 'static') {
            header.style.position = 'relative';
        }
    }

    function updateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
        const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase();

        const timeEl = document.getElementById('time-display');
        const dateEl = document.getElementById('date-display');

        if (timeEl) timeEl.textContent = timeStr;
        if (dateEl) dateEl.textContent = dateStr;
    }

    setInterval(updateTime, 1000);
    updateTime();
}

/* --- SOUND FX MANAGER --- */
const soundManager = {
    audioCtx: null,
    enabled: false,

    init() {
        // Create Toggle Button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sound-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        toggleBtn.title = 'Enable Sound Effects';
        toggleBtn.onclick = () => this.toggle(toggleBtn);
        document.body.appendChild(toggleBtn);

        // Setup shared AudioContext interaction listener
        const resumeAudio = () => {
            if (this.enabled && this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
            window.removeEventListener('click', resumeAudio);
        };
        window.addEventListener('click', resumeAudio);
    },

    toggle(btn) {
        this.enabled = !this.enabled;

        if (this.enabled) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-volume-up"></i>';
            if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.play('success'); // Feedback
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    },

    play(type) {
        if (!this.enabled || !this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        const now = this.audioCtx.currentTime;

        if (type === 'hover') {
            // High tech blip
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'click') {
            // Low mechanical click
            osc.type = 'square';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'success') {
            // Major chord
            this.playNote(523.25, 0); // C5
            this.playNote(659.25, 0.1); // E5
            this.playNote(783.99, 0.2); // G5
        } else if (type === 'error') {
            // Error buzz
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(50, now + 0.3);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    },

    playNote(freq, delay) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        const now = this.audioCtx.currentTime + delay;
        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.start(now);
        osc.stop(now + 0.5);
    }
};

// Hook up Hover Sounds Global
document.addEventListener('mouseover', (e) => {
    if (e.target.matches('button, a, .slot, input, select, .settings-btn')) {
        soundManager.play('hover');
    }
});
document.addEventListener('click', (e) => {
    if (e.target.matches('button, a, .slot, input, select, .settings-btn')) {
        soundManager.play('click');
    }
});

/* --- CUSTOM CURSOR --- */
function initCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (!cursorDot || !cursorOutline) return;

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay (animation is handled by CSS transition usually, 
        // but let's do direct assignment for smoothness with CSS transition property already set)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

/* --- SYSTEM CONSOLE TYPING EFFECT --- */
function initSystemConsole() {
    const consoleElement = document.getElementById('system-console');
    if (!consoleElement) return;

    const messages = [
        "INITIALIZING CORE SYSTEMS...",
        "CONNECTING TO SATELLITE NETWORK...",
        "CALIBRATING SENSORS...",
        "OPTIMIZING NEURAL GRID...",
        "SYSTEM ONLINE. WAITING FOR INPUT._"
    ];
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 50;

    function type() {
        const currentMessage = messages[messageIndex];

        if (isDeleting) {
            consoleElement.textContent = currentMessage.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 30; // Deleting speed
        } else {
            consoleElement.textContent = currentMessage.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 50 + Math.random() * 50; // Human-like typing variance
        }

        if (!isDeleting && charIndex === currentMessage.length) {
            // Finished typing
            if (messageIndex === messages.length - 1) {
                // Last message, keep it blinking
                consoleElement.innerHTML = currentMessage.replace('_', '') + '<span class="cursor-blink">_</span>';
                return;
            }
            isDeleting = true;
            typeSpeed = 1000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            messageIndex++;
            typeSpeed = 500; // Pause before next message
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/* --- 3D PARALLAX TILT EFFECT --- */
function initTiltEffect() {
    const container = document.querySelector('.app-container');
    if (!container) return;

    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 1024) return; // Disable on mobile

        const x = (window.innerWidth / 2 - e.clientX) / 100; // Divide by 100 for subtle effect
        const y = (window.innerHeight / 2 - e.clientY) / 100;

        // requestAnimationFrame for performance
        window.requestAnimationFrame(() => {
            container.style.transition = 'transform 0.1s ease-out'; // Smooth follow
            container.style.transform = `perspective(2000px) rotateY(${x}deg) rotateX(${y}deg)`;
        });
    });

    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
        container.style.transition = 'transform 0.5s ease';
        container.style.transform = 'perspective(2000px) rotateY(0deg) rotateX(0deg)';
    });
}

/* --- PARTICLE SYSTEM --- */
let particlesOverlay;
let ctx;
let particles = [];
let animationFrameId;

function initParticles() {
    particlesOverlay = document.getElementById('particles-canvas');
    if (!particlesOverlay) return;

    ctx = particlesOverlay.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create initial ambient particles
    createAmbientParticles();
    animateParticles();
}

function resizeCanvas() {
    particlesOverlay.width = window.innerWidth;
    particlesOverlay.height = window.innerHeight;
}

class Particle {
    constructor(x, y, type = 'ambient') {
        this.x = x;
        this.y = y;
        this.type = type; // 'ambient' or 'explosion'

        if (type === 'ambient') {
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = `rgba(${Math.random() > 0.5 ? '0, 243, 255' : '188, 19, 254'}, ${Math.random() * 0.5})`;
            this.life = Infinity;
        } else {
            this.size = Math.random() * 4 + 2;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 10 + 2;
            this.speedX = Math.cos(angle) * speed;
            this.speedY = Math.sin(angle) * speed;
            this.color = `hsl(${Math.random() * 60 + 120}, 100%, 50%)`; // Greens/Blues
            this.life = 100;
            this.decay = Math.random() * 0.05 + 0.02;
        }
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.type === 'explosion') {
            this.life -= 2;
            this.size -= 0.1;
            this.speedX *= 0.95; // friction
            this.speedY *= 0.95;
        } else {
            // Wrap around screen for ambient
            if (this.x < 0) this.x = particlesOverlay.width;
            if (this.x > particlesOverlay.width) this.x = 0;
            if (this.y < 0) this.y = particlesOverlay.height;
            if (this.y > particlesOverlay.height) this.y = 0;
        }
    }

    draw() {
        if (this.size <= 0) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createAmbientParticles() {
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle(
            Math.random() * particlesOverlay.width,
            Math.random() * particlesOverlay.height
        ));
    }
}

function explodeParticles(x, y) {
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle(x, y, 'explosion'));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, particlesOverlay.width, particlesOverlay.height);

    particles = particles.filter(p => p.life > 0 && p.size > 0);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animateParticles);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(120%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(120%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Override notification to trigger explosion center screen on success
const originalShowNotification = showNotification;
showNotification = function (message, type) {
    if (type === 'success') {
        explodeParticles(window.innerWidth / 2, window.innerHeight / 2);
    }
    originalShowNotification(message, type);
};
