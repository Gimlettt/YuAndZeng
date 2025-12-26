# 🧪 Testing Guide

## Recent Fixes

### Fixed Issues:
1. ✅ **YouTube URL matching** - Now only tracks actual video pages (watch/shorts), not ads
2. ✅ **Duplicate prevention** - Videos captured within 2 minutes are considered duplicates
3. ✅ **Better logging** - Added debug logs to track data flow
4. ✅ **Branding** - Updated to memories.ai

## How to Reload Extension After Updates

After making changes to the code:

1. Go to `chrome://extensions/`
2. Find "YouTube History Tracker"
3. Click the **🔄 Reload** button
4. This will reload the extension with the new code

## Step-by-Step Testing

### Test 1: Check Extension Installation

1. Open `chrome://extensions/`
2. Verify "YouTube History Tracker" is loaded and enabled
3. Check for any error messages (red text)

**Expected:** No errors, extension shows as enabled

---

### Test 2: Check Service Worker

1. Go to `chrome://extensions/`
2. Find "YouTube History Tracker"
3. Click on **"service worker"** link (in blue text)
4. This opens the console for the background script

**Expected logs:**
```
Background service worker loaded
Extension installed: ...
```

Keep this console open during testing to see logs!

---

### Test 3: Visit YouTube Video

1. **Keep the service worker console open** (from Test 2)
2. Open a new tab
3. Go to https://youtube.com
4. Search for any video (e.g., "cat videos")
5. Click on a video to open it
6. Wait for the video page to fully load

**Expected logs in service worker console:**
```
YouTube video detected: https://www.youtube.com/watch?v=...
Video detected from content script: {title: "...", url: "..."}
Video saved to storage: {id: ..., title: "...", url: "...", timestamp: ...}
Video added, checking stats...
Current stats: {totalVideos: 1, enabled: true, ...}
```

---

### Test 4: Check Popup

1. Click the extension icon in Chrome toolbar
2. Check the numbers displayed

**Expected:**
- Status: "Active" (green dot)
- Total Videos: **1** or more
- Today: **1** or more
- Last Sync: "Never" (no backend configured)

---

### Test 5: Open Content Script Console

To see logs from the YouTube page:

1. While on a YouTube video page, press **F12**
2. Go to **Console** tab
3. Reload the YouTube page (Ctrl+R or Cmd+R)

**Expected logs:**
```
YouTube History Tracker: Content script loaded
Video captured: {title: "...", url: "...", timestamp: ...}
```

---

## Debugging Checklist

If videos are not being captured (count stays at 0):

### ✅ Check 1: Is the extension enabled?
- Open popup → Status should be "Active"
- If "Paused", click the button to resume

### ✅ Check 2: Is the service worker running?
- Go to `chrome://extensions/`
- Look for "service worker" link
- If it says "Inactive", click it to start
- After clicking a video, check for logs

### ✅ Check 3: Is content script loading?
- On YouTube video page, press F12
- Check Console for "Content script loaded"
- If not there, the content script isn't running

### ✅ Check 4: Check storage directly

Open the service worker console and run:

```javascript
// Check config
chrome.storage.sync.get('config', (result) => {
  console.log('Config:', result);
});

// Check videos
chrome.storage.local.get('videos', (result) => {
  console.log('Videos in storage:', result.videos);
});
```

### ✅ Check 5: URL pattern test

In service worker console, test the URL matcher:

```javascript
function isYouTubeVideoUrl(url) {
  if (!url) return false;
  const patterns = [
    /youtube\.com\/watch\?v=[\w-]+/,
    /youtube\.com\/shorts\/[\w-]+/
  ];
  return patterns.some(pattern => pattern.test(url));
}

// Test URLs
console.log('Watch URL:', isYouTubeVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')); // should be true
console.log('Ad URL:', isYouTubeVideoUrl('https://www.youtube.com/watch?v=abc&ad=1')); // should be true (has watch?v=)
console.log('Home page:', isYouTubeVideoUrl('https://www.youtube.com/')); // should be false
```

---

## Manual Testing Commands

### Clear all data
Open service worker console:
```javascript
chrome.storage.local.clear(() => {
  console.log('Storage cleared');
});
```

### Add a test video manually
```javascript
chrome.storage.local.get('videos', (result) => {
  const videos = result.videos || [];
  videos.push({
    id: Date.now(),
    title: 'Test Video',
    url: 'https://www.youtube.com/watch?v=test123',
    timestamp: Date.now(),
    source: 'manual_test'
  });
  chrome.storage.local.set({ videos }, () => {
    console.log('Test video added, total:', videos.length);
  });
});
```

### Check current stats
```javascript
// In service worker console
(async () => {
  const videos = await chrome.storage.local.get('videos');
  const config = await chrome.storage.sync.get('config');
  console.log('Videos:', videos.videos?.length || 0);
  console.log('Enabled:', config.config?.enabled ?? true);
})();
```

---

## Common Issues & Solutions

### Issue: Extension won't load
**Solution:**
- Check for syntax errors in console
- Ensure all icon files exist (icon16.png, icon48.png, icon128.png)
- Try removing and re-adding the extension

### Issue: Service worker is "Inactive"
**Solution:**
- Click the "service worker" link to wake it up
- Or visit a YouTube page to trigger it

### Issue: Videos are captured 3 times
**Solution:**
- This was fixed! The new code only captures within 2-minute windows
- Make sure you reloaded the extension after the update

### Issue: Content script not loading
**Solution:**
- Check manifest.json has correct content_scripts configuration
- Reload extension
- Hard refresh YouTube page (Ctrl+Shift+R)

### Issue: Popup shows 0 videos but storage has data
**Solution:**
- Check service worker console for errors
- Test the GET_STATUS message manually:
```javascript
chrome.runtime.sendMessage({type: 'GET_STATUS'}, (response) => {
  console.log('Status:', response);
});
```

---

## Expected Behavior

### When you visit a YouTube video:
1. Content script detects the page
2. Waits for title to load (1-3 seconds)
3. Sends VIDEO_DETECTED message to background
4. Background checks if enabled
5. Background saves to storage (if not duplicate)
6. Popup shows updated count

### When you open the popup:
1. Popup sends GET_STATUS message
2. Background reads storage
3. Background calculates stats
4. Returns to popup
5. Popup displays numbers

### Duplicate Prevention:
- Same URL within 2 minutes = duplicate (skipped)
- Same URL after 2 minutes = new visit (saved)
- This prevents multiple captures from different sources

---

## Success Criteria

✅ Service worker loads without errors
✅ Content script loads on YouTube pages
✅ Videos are captured when you visit them
✅ Popup shows correct counts
✅ Export JSON works and contains data
✅ Settings page can save configuration
✅ Only real video pages are tracked (not ads)

---

## Need More Help?

1. Share the logs from service worker console
2. Share the logs from YouTube page console (F12)
3. Run the storage check commands above
4. Check if videos array has data

Good luck testing! 🚀
