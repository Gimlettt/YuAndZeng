// Options page script

// DOM Elements
const configForm = document.getElementById('configForm');
const enabledInput = document.getElementById('enabled');
const backendEndpointInput = document.getElementById('backendEndpoint');
const apiKeyInput = document.getElementById('apiKey');
const syncIntervalInput = document.getElementById('syncInterval');
const syncIntervalValue = document.getElementById('syncIntervalValue');
const historyDaysInput = document.getElementById('historyDays');
const historyDaysValue = document.getElementById('historyDaysValue');
const historyMaxItemsInput = document.getElementById('historyMaxItems');
const historyMaxItemsValue = document.getElementById('historyMaxItemsValue');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');
const syncBtn = document.getElementById('syncBtn');
const fetchHistoryBtn = document.getElementById('fetchHistoryBtn');
const messageDiv = document.getElementById('message');

// Status elements
const totalVideosEl = document.getElementById('totalVideos');
const todayCountEl = document.getElementById('todayCount');
const lastSyncEl = document.getElementById('lastSync');
const statusBadgeEl = document.getElementById('statusBadge');

// Load configuration and stats
async function loadData() {
  try {
    const config = await StorageManager.getConfig();
    const stats = await StorageManager.getStats();

    // Populate form
    enabledInput.checked = config.enabled;
    backendEndpointInput.value = config.backendEndpoint;
    apiKeyInput.value = config.apiKey;
    syncIntervalInput.value = config.syncInterval;
    syncIntervalValue.textContent = config.syncInterval;
    historyDaysInput.value = config.historyDays;
    historyDaysValue.textContent = config.historyDays;
    historyMaxItemsInput.value = config.historyMaxItems;
    historyMaxItemsValue.textContent = config.historyMaxItems;

    // Update status
    updateStatus(stats);
  } catch (error) {
    showMessage('Error loading configuration', 'error');
    console.error(error);
  }
}

// Update status display
function updateStatus(stats) {
  totalVideosEl.textContent = stats.totalVideos;
  todayCountEl.textContent = stats.todayCount;

  if (stats.lastSync) {
    const date = new Date(stats.lastSync);
    lastSyncEl.textContent = date.toLocaleString();
  } else {
    lastSyncEl.textContent = 'Never';
  }

  statusBadgeEl.textContent = stats.enabled ? 'Enabled' : 'Disabled';
  statusBadgeEl.classList.toggle('disabled', !stats.enabled);
}

// Save configuration
configForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    const config = {
      enabled: enabledInput.checked,
      backendEndpoint: backendEndpointInput.value.trim(),
      apiKey: apiKeyInput.value.trim(),
      syncInterval: parseInt(syncIntervalInput.value),
      historyDays: parseInt(historyDaysInput.value),
      historyMaxItems: parseInt(historyMaxItemsInput.value)
    };

    await StorageManager.saveConfig(config);
    showMessage('✅ Settings saved successfully!', 'success');

    // Refresh stats
    const stats = await StorageManager.getStats();
    updateStatus(stats);
  } catch (error) {
    showMessage('❌ Error saving settings', 'error');
    console.error(error);
  }
});

// Reset to default
resetBtn.addEventListener('click', async () => {
  if (confirm('Are you sure you want to reset all settings to default?')) {
    try {
      await StorageManager.saveConfig(StorageManager.defaultConfig);
      await loadData();
      showMessage('✅ Settings reset to default', 'success');
    } catch (error) {
      showMessage('❌ Error resetting settings', 'error');
      console.error(error);
    }
  }
});

// Export JSON
exportBtn.addEventListener('click', async () => {
  try {
    const data = await StorageManager.exportJSON();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showMessage('✅ Data exported successfully!', 'success');
  } catch (error) {
    showMessage('❌ Error exporting data', 'error');
    console.error(error);
  }
});

// Clear all data
clearBtn.addEventListener('click', async () => {
  if (confirm('⚠️ This will delete all captured videos. Are you sure?')) {
    try {
      await StorageManager.clearVideos();
      const stats = await StorageManager.getStats();
      updateStatus(stats);
      showMessage('✅ All data cleared', 'success');
    } catch (error) {
      showMessage('❌ Error clearing data', 'error');
      console.error(error);
    }
  }
});

// Sync now
syncBtn.addEventListener('click', async () => {
  try {
    syncBtn.disabled = true;
    syncBtn.textContent = '⏳ Syncing...';

    const response = await chrome.runtime.sendMessage({ type: 'SYNC_NOW' });

    if (response && response.success) {
      const stats = await StorageManager.getStats();
      updateStatus(stats);
      showMessage('✅ Data synced successfully!', 'success');
    } else {
      showMessage('❌ Sync failed - check backend configuration', 'error');
    }
  } catch (error) {
    showMessage('❌ Error syncing data: ' + error.message, 'error');
    console.error('Sync error:', error);
  } finally {
    syncBtn.disabled = false;
    syncBtn.textContent = '🔄 Sync Now';
  }
});

// Fetch history
fetchHistoryBtn.addEventListener('click', async () => {
  try {
    fetchHistoryBtn.disabled = true;
    fetchHistoryBtn.textContent = '⏳ Fetching...';

    const response = await chrome.runtime.sendMessage({ type: 'FETCH_HISTORY' });

    if (response && response.success) {
      // Wait a bit for the fetch to complete
      setTimeout(async () => {
        const stats = await StorageManager.getStats();
        updateStatus(stats);
        showMessage('✅ History fetched successfully!', 'success');
        fetchHistoryBtn.disabled = false;
        fetchHistoryBtn.textContent = '📚 Fetch History';
      }, 2000);
    } else {
      showMessage('❌ Fetch failed - make sure extension has history permission', 'error');
      fetchHistoryBtn.disabled = false;
      fetchHistoryBtn.textContent = '📚 Fetch History';
    }
  } catch (error) {
    showMessage('❌ Error fetching history: ' + error.message, 'error');
    console.error('Fetch history error:', error);
    fetchHistoryBtn.disabled = false;
    fetchHistoryBtn.textContent = '📚 Fetch History';
  }
});

// Update range value displays
syncIntervalInput.addEventListener('input', (e) => {
  syncIntervalValue.textContent = e.target.value;
});

historyDaysInput.addEventListener('input', (e) => {
  historyDaysValue.textContent = e.target.value;
});

historyMaxItemsInput.addEventListener('input', (e) => {
  historyMaxItemsValue.textContent = e.target.value;
});

// Show message
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.classList.remove('hidden');

  setTimeout(() => {
    messageDiv.classList.add('hidden');
  }, 5000);
}

// Initialize
loadData();
