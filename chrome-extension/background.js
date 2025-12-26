// Background Service Worker
importScripts('utils/storage.js');

let syncIntervalId = null;

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Extension installed:', details.reason);

  if (details.reason === 'install') {
    // First time install - fetch initial history
    await fetchBrowserHistory();
  }

  // Start sync timer
  startSyncTimer();
});

// Start the extension when browser starts
chrome.runtime.onStartup.addListener(() => {
  console.log('Browser started, initializing extension');
  startSyncTimer();
});

// Fetch browser history
async function fetchBrowserHistory() {
  try {
    const config = await StorageManager.getConfig();

    if (!config.enabled) {
      console.log('Extension is disabled');
      return;
    }

    const endTime = Date.now();
    const startTime = endTime - (config.historyDays * 24 * 60 * 60 * 1000);

    const historyItems = await chrome.history.search({
      text: 'youtube.com/watch',
      startTime: startTime,
      endTime: endTime,
      maxResults: config.historyMaxItems
    });

    console.log(`Found ${historyItems.length} YouTube videos in history`);

    // Filter and save YouTube videos
    for (const item of historyItems) {
      if (item.url && item.url.includes('youtube.com/watch')) {
        await StorageManager.addVideo({
          title: item.title || 'Untitled',
          url: item.url,
          timestamp: item.lastVisitTime || Date.now(),
          source: 'history'
        });
      }
    }

    console.log('History fetch completed');
  } catch (error) {
    console.error('Error fetching history:', error);
  }
}

// Monitor tab updates for YouTube visits
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const config = await StorageManager.getConfig();

    if (!config.enabled) return;

    // Check if it's a YouTube video page
    if (tab.url.includes('youtube.com/watch')) {
      console.log('YouTube video detected:', tab.url);

      // The content script will handle capturing the title
      // This is just a fallback
      await StorageManager.addVideo({
        title: tab.title || 'YouTube Video',
        url: tab.url,
        timestamp: Date.now(),
        source: 'tab_monitor'
      });
    }
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'VIDEO_DETECTED') {
    console.log('Video detected from content script:', message.data);

    const config = await StorageManager.getConfig();
    if (config.enabled) {
      await StorageManager.addVideo({
        ...message.data,
        source: 'content_script'
      });
    }

    sendResponse({ success: true });
  } else if (message.type === 'GET_STATUS') {
    const stats = await StorageManager.getStats();
    sendResponse(stats);
  } else if (message.type === 'TOGGLE_ENABLED') {
    const config = await StorageManager.getConfig();
    config.enabled = !config.enabled;
    await StorageManager.saveConfig(config);

    if (config.enabled) {
      startSyncTimer();
    } else {
      stopSyncTimer();
    }

    sendResponse({ enabled: config.enabled });
  } else if (message.type === 'SYNC_NOW') {
    await syncToBackend();
    sendResponse({ success: true });
  } else if (message.type === 'FETCH_HISTORY') {
    await fetchBrowserHistory();
    sendResponse({ success: true });
  }

  return true; // Keep channel open for async response
});

// Sync data to backend
async function syncToBackend() {
  try {
    const config = await StorageManager.getConfig();

    if (!config.backendEndpoint || !config.enabled) {
      console.log('Backend sync skipped: no endpoint or disabled');
      return;
    }

    const data = await StorageManager.exportJSON();

    const response = await fetch(config.backendEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      await StorageManager.setLastSync(Date.now());
      console.log('Sync successful');
    } else {
      console.error('Sync failed:', response.status);
    }
  } catch (error) {
    console.error('Error syncing to backend:', error);
  }
}

// Start periodic sync timer
function startSyncTimer() {
  stopSyncTimer(); // Clear any existing timer

  StorageManager.getConfig().then(config => {
    if (config.enabled && config.syncInterval > 0) {
      const intervalMs = config.syncInterval * 60 * 1000;
      syncIntervalId = setInterval(syncToBackend, intervalMs);
      console.log(`Sync timer started: every ${config.syncInterval} minutes`);
    }
  });
}

// Stop sync timer
function stopSyncTimer() {
  if (syncIntervalId) {
    clearInterval(syncIntervalId);
    syncIntervalId = null;
    console.log('Sync timer stopped');
  }
}

console.log('Background service worker loaded');
