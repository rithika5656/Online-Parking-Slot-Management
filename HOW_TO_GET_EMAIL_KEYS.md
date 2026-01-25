# 📧 How to Get Real Emails Working

Since this application runs on your local computer, it needs a standardized way to send emails. We use a free service called **EmailJS**.

### Step 1: Get Your Free Keys
1. Go to **[https://www.emailjs.com/](https://www.emailjs.com/)** and sign up for a **Free Account**.
2. **Add a Service**:
   - Click "Email Services" -> "Add New Service".
   - Select "Gmail".
   - Click "Connect Account" and login with your Gmail (`rithika0164@gmail.com`).
   - Click "Create Service".
   - **Copy the Service ID** (e.g., `service_xyz123`).

3. **Create a Template**:
   - Click "Email Templates" -> "Create New Template".
   - In the Subject line, write: `Booking Confirmation - Slot {{slot_number}}`
   - In the Content, write:
     ```
     Hello {{to_name}},
     
     Your booking is confirmed!
     Vehicle: {{vehicle_number}}
     Slot: {{slot_number}}
     Time: {{booking_time}}
     ```
   - Click "Save".
   - **Copy the Template ID** (e.g., `template_abc456`).

4. **Get Your Public Key**:
   - Click on your name/avatar in the top-right -> "Account".
   - **Copy the Public Key** (e.g., `User_K12345...`).

### Step 2: Configure the App
1. Go to the SmartPark Dashboard in your browser.
2. Click the new **"⚙️ Email Settings"** button (I just added it!).
3. Paste your **Service ID**, **Template ID**, and **Public Key**.
4. Click **"Save & Connect"**.

Now, when you book a slot, a REAL email will be sent to your Gmail inbox! 🚀
