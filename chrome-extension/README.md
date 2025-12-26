# 🎥 YouTube History Tracker

A Chrome extension that tracks your YouTube viewing history in real-time, captures video titles and URLs, and syncs data to your backend.

Developed by memories.ai with a modern, beautiful UI! ✨

## 🌟 Features

- 📚 **Browser History Import** - Fetch YouTube videos from your browser history (last N days/items)
- 🎬 **Real-Time Monitoring** - Automatically detect and capture YouTube videos as you watch
- 💾 **Local Storage** - Save all data as JSON locally
- 🔄 **Backend Sync** - Automatically sync data to your backend API
- ⚙️ **Configurable Settings** - Backend endpoint, API key, sync intervals, and more
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- 📊 **Statistics Dashboard** - View total videos, today's count, and sync status
- 🔘 **One-Click Controls** - Easy pause/resume and manual sync

## 📁 Project Structure

```
chrome-extension/
├── manifest.json              # Extension configuration
├── background.js              # Service worker (history, monitoring)
├── content.js                 # YouTube page detection script
├── utils/
│   └── storage.js            # Storage management utilities
├── popup/
│   ├── popup.html            # Extension popup UI
│   ├── popup.js              # Popup logic
│   └── popup.css             # Popup styling
├── options/
│   ├── options.html          # Settings page UI
│   ├── options.js            # Settings logic
│   └── options.css           # Settings styling
├── icons/
│   ├── icon.svg              # Source icon
│   ├── generate-icons.html   # Icon generator
│   ├── icon16.png            # 16x16 icon
│   ├── icon48.png            # 48x48 icon
│   └── icon128.png           # 128x128 icon
└── README.md                 # This file
```

## 🚀 Installation & Testing

### Step 1: Generate Icons

Before loading the extension, you need to generate the PNG icons:

**Option A: Using the HTML Generator (Recommended)**

1. Open `icons/generate-icons.html` in Chrome
2. Download all three PNG files (icon16.png, icon48.png, icon128.png)
3. Save them in the `icons/` folder

**Option B: Using Online Tools**

1. Go to https://svg2png.com or similar
2. Upload `icons/icon.svg`
3. Generate PNG files at sizes: 16x16, 48x48, 128x128
4. Save as `icon16.png`, `icon48.png`, `icon128.png` in the `icons/` folder

**Option C: Use Placeholder Icons (Quick Test)**

For quick testing, you can create simple placeholder icons:
```bash
cd icons/
# Create simple colored squares as placeholders (requires ImageMagick)
convert -size 16x16 xc:#667eea icon16.png
convert -size 48x48 xc:#667eea icon48.png
convert -size 128x128 xc:#667eea icon128.png
```

### Step 2: Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `chrome-extension/` folder
5. The extension should now appear in your extensions list! 🎉

### Step 3: Configure Settings

1. Click the extension icon in your toolbar
2. Click the **Settings** button (⚙️)
3. Configure your preferences:
   - **Enable Tracking**: Turn on/off video tracking
   - **Backend Endpoint**: Your API endpoint URL (e.g., `https://api.example.com/videos`)
   - **API Key**: Your authentication key
   - **Sync Interval**: How often to sync (5-120 minutes)
   - **History Days**: Number of days to fetch from history (1-90)
   - **Max History Items**: Maximum items to fetch (10-1000)
4. Click **Save Settings** 💾

## 🧪 Testing the Extension

### Test 1: Check Initial Installation

1. After loading the extension, open the popup
2. You should see:
   - Status: "Active"
   - Total Videos: 0 (initially)
   - Today: 0
   - Last Sync: Never

### Test 2: Fetch Browser History

1. Open Settings page
2. Configure "History Days" (e.g., 7 days)
3. Click **Fetch History** button
4. Wait a few seconds
5. Check the "Total Videos" count increases
6. Open popup to verify the count

### Test 3: Real-Time YouTube Detection

1. Open YouTube (https://youtube.com)
2. Navigate to any video (e.g., search and click a video)
3. Wait for the video page to fully load
4. Open the extension popup
5. The "Total Videos" count should increase
6. The "Today" count should also increase

### Test 4: Toggle Tracking

1. Open the popup
2. Click **Pause Tracking**
3. Status should change to "Paused"
4. Visit a new YouTube video
5. The count should NOT increase
6. Click **Resume Tracking**
7. Status changes back to "Active"

### Test 5: Export Data

1. Open Settings page
2. Click **Export JSON**
3. A JSON file should download with all your data:
   ```json
   {
     "exportDate": "2024-01-01T00:00:00.000Z",
     "config": { ... },
     "stats": { ... },
     "videos": [ ... ]
   }
   ```

### Test 6: Backend Sync (Optional)

If you have a backend API:

1. Set up a simple endpoint that accepts POST requests:
   ```javascript
   // Example Express.js endpoint
   app.post('/videos', (req, res) => {
     console.log('Received data:', req.body);
     res.json({ success: true });
   });
   ```

2. Configure the endpoint in Settings
3. Add your API key
4. Click **Sync Now**
5. Check your backend logs for the received data

### Test 7: Verify Console Logs

1. Go to `chrome://extensions/`
2. Find "YouTube History Tracker"
3. Click "background.html" or "service worker"
4. Open the Console tab
5. You should see logs like:
   - "Background service worker loaded"
   - "YouTube video detected: ..."
   - "Sync successful"

## 🎯 Usage Guide

### For Demo Presentation

1. **Install** the extension in Chrome
2. **Configure** your backend endpoint in Settings
3. **Open YouTube** and watch a few videos
4. **Open Popup** to show real-time tracking
5. **Open Settings** to show the configuration UI
6. **Export JSON** to demonstrate data capture
7. **Sync to Backend** to show API integration

### Demo Script

> "Our extension tracks YouTube viewing history in real-time. Watch as I visit a video... *[open YouTube video]*
>
> See? The count updated automatically! *[show popup]*
>
> We have a beautiful settings page where users can configure everything... *[show settings]*
>
> And we can export all the data as JSON... *[click export]*
>
> The extension syncs automatically to our backend every X minutes, or we can sync manually... *[click sync now]*
>
> All with a modern, gradient UI design perfect for presentations!"

## 🎨 UI Showcase

### Popup Features
- ✨ Gradient purple background
- 📊 Real-time statistics cards
- 🔘 One-click pause/resume
- 🔄 Manual sync button
- ⚙️ Quick access to settings
- 💫 Smooth animations

### Settings Page Features
- 📈 Status dashboard with metrics
- 🎛️ Interactive range sliders
- 🎨 Modern card-based layout
- 💾 Save/Reset controls
- 📦 Data management tools
- ✅ Success/error notifications

## 🔧 API Integration

### Backend Endpoint Format

Your backend should accept POST requests with this structure:

```javascript
POST /videos
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_API_KEY

Body:
{
  "exportDate": "2024-01-01T00:00:00.000Z",
  "config": {
    "enabled": true,
    "backendEndpoint": "https://api.example.com/videos",
    "syncInterval": 30,
    "historyDays": 7,
    "historyMaxItems": 100
  },
  "stats": {
    "totalVideos": 42,
    "enabled": true,
    "lastSync": 1704067200000,
    "todayCount": 5
  },
  "videos": [
    {
      "id": 1704067200123.456,
      "title": "Amazing Video Title",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "timestamp": 1704067200000,
      "source": "content_script"
    }
  ]
}
```

### Example Backend (Node.js + Express)

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/videos', (req, res) => {
  // Verify API key
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  if (apiKey !== 'your-secret-key') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Process the data
  const { videos, stats } = req.body;
  console.log(`Received ${videos.length} videos`);

  // Save to database, etc.

  res.json({ success: true, received: videos.length });
});

app.listen(3000, () => {
  console.log('Backend running on port 3000');
});
```

## 🐛 Troubleshooting

### Extension doesn't load
- Make sure all icon files exist (icon16.png, icon48.png, icon128.png)
- Check for syntax errors in the console
- Try reloading the extension

### Videos not being captured
- Check if tracking is enabled (status should be "Active")
- Open DevTools Console on YouTube page to see content script logs
- Verify the URL matches `youtube.com/watch?v=*`

### Sync not working
- Check your backend endpoint is accessible
- Verify API key is correct
- Check CORS settings on your backend
- Look for errors in the service worker console

### History not fetching
- Grant history permission when prompted
- Check "History Days" and "Max Items" settings
- Look for errors in service worker console

## 📝 Development Notes

### Architecture

- **Service Worker (background.js)**: Handles history fetching, tab monitoring, and backend sync
- **Content Script (content.js)**: Runs on YouTube pages to detect video titles
- **Storage (storage.js)**: Manages chrome.storage API and data persistence
- **Popup**: Quick status view and controls
- **Options**: Full settings and data management

### Storage Structure

```javascript
// chrome.storage.sync (synced across devices)
{
  config: {
    enabled: true,
    backendEndpoint: "...",
    apiKey: "...",
    syncInterval: 30,
    historyDays: 7,
    historyMaxItems: 100
  }
}

// chrome.storage.local (local only)
{
  videos: [
    {
      id: 123456789.123,
      title: "Video Title",
      url: "https://youtube.com/watch?v=...",
      timestamp: 1704067200000,
      source: "history" | "tab_monitor" | "content_script"
    }
  ],
  lastSync: 1704067200000
}
```

## 🚀 Future Enhancements

- 📊 Analytics dashboard with charts
- 🏷️ Video categorization and tags
- 🔍 Search and filter captured videos
- 📱 Export to different formats (CSV, Excel)
- 🌐 Multi-platform support (YouTube, Vimeo, etc.)
- 🔔 Notifications for sync status
- 📈 Viewing time tracking
- 🎯 Watch goals and insights

## 📄 License

MIT License - Feel free to use for personal projects!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or PRs.

---

Developed by memories.ai

Good luck with your presentation! 🎉
