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
    const response = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });

    totalVideosEl.textContent = response.totalVideos || 0;
    todayCountEl.textContent = response.todayCount || 0;

    if (response.lastSync) {
      const date = new Date(response.lastSync);
      const now = new Date();
      const diffMinutes = Math.floor((now - date) / (1000 * 60));

      if (diffMinutes < 1) {
        lastSyncEl.textContent = 'Just now';
      } else if (diffMinutes < 60) {
        lastSyncEl.textContent = `${diffMinutes}m ago`;
      } else if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60);
        lastSyncEl.textContent = `${hours}h ago`;
      } else {
        lastSyncEl.textContent = date.toLocaleDateString();
      }
    } else {
      lastSyncEl.textContent = 'Never';
    }

    isEnabled = response.enabled;
    updateUI();
  } catch (error) {
    console.error('Error loading status:', error);
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
    toggleBtn.classList.add('loading');

    const response = await chrome.runtime.sendMessage({ type: 'TOGGLE_ENABLED' });
    isEnabled = response.enabled;
    updateUI();

    // Show feedback
    const originalText = toggleBtn.querySelector('.btn-text').textContent;
    toggleBtn.querySelector('.btn-text').textContent = isEnabled ? '✅ Enabled' : '⏸️ Paused';

    setTimeout(() => {
      updateUI();
    }, 1500);
  } catch (error) {
    console.error('Error toggling:', error);
  } finally {
    toggleBtn.classList.remove('loading');
  }
});

// Sync now
syncBtn.addEventListener('click', async () => {
  try {
    const originalText = syncBtn.querySelector('.btn-text').textContent;
    syncBtn.querySelector('.btn-text').textContent = 'Syncing...';
    syncBtn.disabled = true;

    await chrome.runtime.sendMessage({ type: 'SYNC_NOW' });

    syncBtn.querySelector('.btn-text').textContent = '✅ Synced';

    setTimeout(() => {
      syncBtn.querySelector('.btn-text').textContent = originalText;
      syncBtn.disabled = false;
      loadStatus(); // Refresh status
    }, 1500);
  } catch (error) {
    console.error('Error syncing:', error);
    syncBtn.querySelector('.btn-text').textContent = '❌ Failed';
    syncBtn.disabled = false;
  }
});

// Open settings
settingsBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// Auto-refresh stats every 10 seconds
setInterval(loadStatus, 10000);

// Initialize
loadStatus();
