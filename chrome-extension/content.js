// Content script for YouTube pages
console.log('YouTube History Tracker: Content script loaded');

let lastCapturedUrl = null;
let observerActive = false;

// Helper function to check if URL is a real YouTube video page
function isYouTubeVideoUrl(url) {
  if (!url) return false;

  // Match only watch pages and shorts
  // watch: youtube.com/watch?v=VIDEO_ID
  // shorts: youtube.com/shorts/VIDEO_ID
  const patterns = [
    /youtube\.com\/watch\?v=[\w-]+/,
    /youtube\.com\/shorts\/[\w-]+/
  ];

  return patterns.some(pattern => pattern.test(url));
}

// Capture video information
function captureVideoInfo() {
  const url = window.location.href;

  // Only process real YouTube video pages (watch or shorts)
  if (!isYouTubeVideoUrl(url)) {
    return;
  }

  // Avoid duplicate captures
  if (url === lastCapturedUrl) {
    return;
  }

  // Get video title - YouTube uses different selectors
  let title = null;

  // Try multiple selectors
  const titleSelectors = [
    'h1.ytd-watch-metadata yt-formatted-string',
    'h1.title.style-scope.ytd-video-primary-info-renderer',
    'h1.ytd-video-primary-info-renderer',
    '#container h1'
  ];

  for (const selector of titleSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim()) {
      title = element.textContent.trim();
      break;
    }
  }

  // Fallback to page title
  if (!title) {
    title = document.title.replace(' - YouTube', '').trim();
  }

  if (title && title !== 'YouTube') {
    lastCapturedUrl = url;

    const videoData = {
      title: title,
      url: url,
      timestamp: Date.now()
    };

    console.log('Video captured:', videoData);

    // Send to background script
    chrome.runtime.sendMessage({
      type: 'VIDEO_DETECTED',
      data: videoData
    }).catch(err => {
      console.error('Error sending message:', err);
    });
  }
}

// Observe DOM changes to detect when title loads
function startObserver() {
  if (observerActive) return;

  observerActive = true;

  const observer = new MutationObserver((mutations) => {
    captureVideoInfo();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Initial capture
  setTimeout(captureVideoInfo, 1000);
  setTimeout(captureVideoInfo, 2000);
  setTimeout(captureVideoInfo, 3000);
}

// Handle YouTube SPA navigation
function handleNavigation() {
  lastCapturedUrl = null;
  observerActive = false;
  startObserver();
}

// Listen for YouTube's custom navigation events
window.addEventListener('yt-navigate-finish', handleNavigation);

// Also listen for popstate (browser back/forward)
window.addEventListener('popstate', handleNavigation);

// Start observing on initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startObserver);
} else {
  startObserver();
}
