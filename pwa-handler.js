// PWA Installation Handler

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}

// Install prompt
let deferredPrompt;
const installButton = document.createElement('button');
installButton.className = 'install-button';
installButton.innerHTML = '<i class="fas fa-download"></i> Install App';
installButton.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'block';
});

installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response: ${outcome}`);
        deferredPrompt = null;
        installButton.style.display = 'none';
    }
});

document.body.appendChild(installButton);

// Add install button styles
const style = document.createElement('style');
style.textContent = `
    .install-button {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        background: var(--success);
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Outfit', sans-serif;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 5px 20px var(--success-glow);
        transition: 0.3s;
    }
    
    .install-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px var(--success-glow);
    }
`;
document.head.appendChild(style);

// Offline/Online status indicator
window.addEventListener('online', () => {
    showNotification('You are back online!', 'success');
});

window.addEventListener('offline', () => {
    showNotification('You are offline. Some features may be limited.', 'warning');
});

// Check if running as PWA
function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
}

if (isPWA()) {
    console.log('Running as PWA');
    document.body.classList.add('pwa-mode');
}
