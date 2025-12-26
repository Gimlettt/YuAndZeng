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

    // Check if the same URL was captured in the last 2 minutes (avoid duplicates from different sources)
    const twoMinutesAgo = Date.now() - (2 * 60 * 1000);
    const recentDuplicate = videos.some(v =>
      v.url === video.url && v.timestamp > twoMinutesAgo
    );

    if (recentDuplicate) {
      console.log('Video already captured recently, skipping:', video.url);
      return;
    }

    const newVideo = {
      ...video,
      id: Date.now() + Math.random(),
      timestamp: video.timestamp || Date.now()
    };

    videos.push(newVideo);
    await chrome.storage.local.set({ videos });
    console.log('Video saved to storage:', newVideo);
  },

  // Clear all videos
  async clearVideos() {
    await chrome.storage.local.set({ videos: [] });
  },

  // Get statistics
  async getStats() {
    const videos = await this.getVideos();
    const config = await this.getConfig();

    // Filter videos based on historyDays setting
    const cutoffTime = Date.now() - (config.historyDays * 24 * 60 * 60 * 1000);
    const recentVideos = videos.filter(v => v.timestamp >= cutoffTime);

    // Count today's videos (from filtered set)
    const today = new Date().setHours(0, 0, 0, 0);
    const todayCount = recentVideos.filter(v => v.timestamp >= today).length;

    return {
      totalVideos: recentVideos.length,
      enabled: config.enabled,
      lastSync: await this.getLastSync(),
      todayCount: todayCount
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

    // Filter videos based on historyDays setting (same as getStats)
    const cutoffTime = Date.now() - (config.historyDays * 24 * 60 * 60 * 1000);
    const recentVideos = videos.filter(v => v.timestamp >= cutoffTime);

    return {
      exportDate: new Date().toISOString(),
      config,
      stats,
      videos: recentVideos,
      totalCount: recentVideos.length,
      note: `Exported videos from last ${config.historyDays} days`
    };
  }
};

// Make it available globally for service worker and other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
}
