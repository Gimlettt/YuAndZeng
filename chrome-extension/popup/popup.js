// Popup script

// DOM Elements
const statusIndicator = document.getElementById('statusIndicator');
const totalVideosEl = document.getElementById('totalVideos');
const todayCountEl = document.getElementById('todayCount');
const lastSyncEl = document.getElementById('lastSync');
const toggleBtn = document.getElementById('toggleBtn');
const syncBtn = document.getElementById('syncBtn');
const settingsBtn = document.getElementById('settingsBtn');

let isEnabled = true;

// Load current status
async function loadStatus() {
  try {
    console.log('Popup: Reading status directly from storage...');

    // Read directly from storage (more reliable than messaging background)
    const response = await StorageManager.getStats();
    console.log('Popup: Status loaded:', response);

    totalVideosEl.textContent = response.totalVideos || 0;
    todayCountEl.textContent = response.todayCount || 0;

    isEnabled = response.enabled;
    updateUI();
  } catch (error) {
    console.error('Error loading status:', error);
    // Show 0 on error but don't crash
    totalVideosEl.textContent = 0;
    todayCountEl.textContent = 0;
  }
}

// Update UI based on enabled state
function updateUI() {
  if (isEnabled) {
    statusIndicator.classList.remove('inactive');
    statusIndicator.querySelector('.status-text').textContent = 'Active';
    toggleBtn.classList.remove('inactive');
    toggleBtn.querySelector('.btn-icon').textContent = '⏸️';
    toggleBtn.querySelector('.btn-text').textContent = 'Pause Tracking';
  } else {
    statusIndicator.classList.add('inactive');
    statusIndicator.querySelector('.status-text').textContent = 'Paused';
    toggleBtn.classList.add('inactive');
    toggleBtn.querySelector('.btn-icon').textContent = '▶️';
    toggleBtn.querySelector('.btn-text').textContent = 'Resume Tracking';
  }
}

// Toggle enabled state
toggleBtn.addEventListener('click', async () => {
  try {
    // Prevent double clicks
    if (toggleBtn.disabled) return;

    toggleBtn.disabled = true;
    toggleBtn.classList.add('loading');

    // Read current config from storage
    const config = await StorageManager.getConfig();

    // Toggle the enabled state
    config.enabled = !config.enabled;

    // Save back to storage
    await StorageManager.saveConfig(config);

    // Update local state
    isEnabled = config.enabled;

    // Update UI
    updateUI();

    // Show feedback
    toggleBtn.querySelector('.btn-text').textContent = isEnabled ? '✅ Enabled' : '⏸️ Paused';

    setTimeout(() => {
      updateUI();
      toggleBtn.disabled = false;
    }, 1500);

    // Notify background script (don't wait for response)
    chrome.runtime.sendMessage({
      type: 'TOGGLE_ENABLED',
      enabled: config.enabled
    }).catch(err => {
      // Background might be sleeping, that's ok
      console.log('Background not available, but config saved to storage');
    });

  } catch (error) {
    console.error('Error toggling:', error);
    alert('Failed to toggle tracking. Please try again.');
    toggleBtn.disabled = false;
  } finally {
    toggleBtn.classList.remove('loading');
  }
});

// Sync functionality removed - not used in this version
// (Sync button is hidden in HTML)

// Open settings
settingsBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// Auto-refresh stats every 10 seconds
setInterval(loadStatus, 10000);

// Initialize
loadStatus();
