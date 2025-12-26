// Storage utility for managing extension data

const StorageManager = {
  // Default configuration
  defaultConfig: {
    enabled: true,
    backendEndpoint: '',
    apiKey: '',
    syncInterval: 30, // minutes
    historyDays: 7,
    historyMaxItems: 100
  },

  // Get configuration
  async getConfig() {
    const result = await chrome.storage.sync.get('config');
    return { ...this.defaultConfig, ...result.config };
  },

  // Save configuration
  async saveConfig(config) {
    await chrome.storage.sync.set({ config });
  },

  // Get all captured videos
  async getVideos() {
    const result = await chrome.storage.local.get('videos');
    return result.videos || [];
  },

  // Add a new video
  async addVideo(video) {
    const videos = await this.getVideos();
    const exists = videos.some(v => v.url === video.url && v.timestamp === video.timestamp);

    if (!exists) {
      videos.push({
        ...video,
        id: Date.now() + Math.random(),
        timestamp: video.timestamp || Date.now()
      });
      await chrome.storage.local.set({ videos });
    }
  },

  // Clear all videos
  async clearVideos() {
    await chrome.storage.local.set({ videos: [] });
  },

  // Get statistics
  async getStats() {
    const videos = await this.getVideos();
    const config = await this.getConfig();

    return {
      totalVideos: videos.length,
      enabled: config.enabled,
      lastSync: await this.getLastSync(),
      todayCount: videos.filter(v => {
        const today = new Date().setHours(0, 0, 0, 0);
        return v.timestamp >= today;
      }).length
    };
  },

  // Get last sync timestamp
  async getLastSync() {
    const result = await chrome.storage.local.get('lastSync');
    return result.lastSync || null;
  },

  // Set last sync timestamp
  async setLastSync(timestamp) {
    await chrome.storage.local.set({ lastSync: timestamp });
  },

  // Export data as JSON
  async exportJSON() {
    const videos = await this.getVideos();
    const config = await this.getConfig();
    const stats = await this.getStats();

    return {
      exportDate: new Date().toISOString(),
      config,
      stats,
      videos
    };
  }
};

// Make it available globally for service worker and other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
}
