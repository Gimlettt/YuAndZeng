# 🎬 YouTube Intelligence Hub

> **Your YouTube viewing history + AI-powered insights = Never forget what you watched**

A Chrome extension that not only tracks your YouTube viewing history but lets you **chat with AI** about both **video content** and your **viewing patterns**. Built for the hackathon with ❤️ by memories.ai

---

## 🚀 The Problem We Solve

Ever had these moments?

- 😩 "I watched a great video about Python last week... what was it called?"
- 🤔 "How much time do I spend on tech videos vs entertainment?"
- 📊 "I want to analyze my viewing habits but YouTube's UI is terrible"
- 💬 "Can someone explain this video to me?"

**We solved all of these with AI.**

---

## ✨ What Makes This Special

### 🤖 **Dual AI Chat System**

#### 1️⃣ **Video Chat** - Talk to AI About Current Video
- Open any YouTube video
- Ask: *"Summarize this video"* or *"What are the key points?"*
- Get **real-time streaming responses** powered by video analysis API
- Perfect for: Learning, note-taking, quick reviews

#### 2️⃣ **History Chat** - Talk to AI About Your Viewing Patterns
- Powered by **Google Gemini AI**
- Ask: *"When did I watch that Xiaomi car video?"*
- Get: **Instant answer with exact timestamps**
- Ask: *"Generate a weekly report"*
- Get: **Professional analysis** with themes, patterns, and insights

### 📊 **Beautiful Dashboard**
- Real-time stats tracking
- History chat integrated right into the dashboard
- Quick question buttons for common queries
- Modern gradient UI with smooth animations

### 🎯 **Smart Tracking**
- Auto-detects YouTube videos as you watch
- Stores everything locally (your data stays yours)
- Configurable history window (last 7 days, 30 days, etc.)
- One-click pause/resume

---

## 🎥 Demo Use Cases

### Use Case 1: Finding Lost Videos 🔍
```
You: "When did I watch the Xiaomi car video?"

AI: You watched "Driving Xiaomi's Electric Car: Are we Cooked?":
    • Dec 25, 2025 at 1:47:20 PM
    • Dec 26, 2025 at 11:06:50 AM (watched multiple times)
    URL: youtube.com/watch?v=...
```

### Use Case 2: Weekly Report Generation 📈
```
You: "Generate a weekly report"

AI: 📊 Based on your viewing history...

    Executive Summary:
    Your viewing habits show strong interest in:
    • Tech Reviews & Innovation (35%)
    • Table Tennis & Sports (28%)
    • Political Commentary (22%)

    🏆 Top Themes:
    1. Chinese political analysis (Wang Ju)
    2. Tech product reviews (Xiaomi EV, AI)
    3. Elite sports (Zhang Jike, Fan Zhendong)

    💡 Viewing Habits:
    • "Binge Watching" Pattern: You watch 4-5 videos
      on the same topic in succession
    • Peak hours: Daytime (10 AM - 2 PM)
    • Research mode: You often compare multiple
      perspectives on the same event
```

### Use Case 3: Video Content Chat 💬
```
You: *Opens a Python tutorial video*
    "What are the main concepts covered?"

AI: This video covers:
    1. List comprehensions and generators
    2. Decorators and context managers
    3. Async/await patterns
    Key takeaway: Focus on the decorator
    examples at 12:30 for production use.
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Chrome Extension (Manifest V3) |
| **UI** | Custom CSS with Glassmorphism |
| **Storage** | Chrome Storage API (Local + Sync) |
| **AI - Video Chat** | Custom Video Analysis API (Streaming) |
| **AI - History Chat** | Google Gemini 3 Pro (Preview) |
| **Architecture** | Service Workers + Content Scripts |

---

## ⚡ Quick Start (2 Minutes)

### 1. Load Extension
```bash
1. Open Chrome → chrome://extensions/
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select the chrome-extension/ folder
5. Done! 🎉
```

### 2. Configure (Optional)
- Click extension icon
- Click ⚙️ settings
- Add your Chat API Key (for video chat)
- All set! History chat works out of the box.

### 3. Start Using
**Video Chat:**
- Open any YouTube video
- Click extension → "Video Chat" tab
- Start asking questions!

**History Chat:**
- Click extension → "Dashboard" tab
- See your stats
- Click quick buttons or type your own questions!

---

## 🎨 UI Highlights

### Dashboard
```
┌─────────────────────────────────────┐
│  📊 Dashboard              ⚙️       │  ← Settings icon
├─────────────────────────────────────┤
│  Stats: 156 videos | Today: 12     │  ← Real-time stats
├─────────────────────────────────────┤
│  [▶️ Pause]  [🔄]                   │  ← Quick controls
├─────────────────────────────────────┤
│  📚 Ask About Your History          │
│  [📈 Report] [🔍 Find] [📅 Today]  │  ← Quick questions
│  [⏱️ Patterns]                      │
│                                     │
│  💬 Chat with Gemini AI             │  ← History chat
│  ┌───────────────────────────────┐ │
│  │ 👤 When did I watch...        │ │
│  │ 🤖 You watched on Dec 25...   │ │
│  └───────────────────────────────┘ │
│  [Ask about your history...] 📤    │
└─────────────────────────────────────┘
```

### Video Chat Tab
```
┌─────────────────────────────────────┐
│  💬 Video Chat                      │
├─────────────────────────────────────┤
│  🎥 Current: "Xiaomi EV Review"    │  ← Auto-detected
│     youtube.com/watch?v=...        │
├─────────────────────────────────────┤
│  💬 Chat Messages                   │
│  ┌───────────────────────────────┐ │
│  │ 👤 Summarize this video       │ │
│  │ 🤖 This video reviews...      │ │
│  └───────────────────────────────┘ │
│  [Ask about this video...] 📤      │
└─────────────────────────────────────┘
```

---

## 🌟 Key Features Breakdown

### 📊 Smart Analytics
- **Pattern Detection**: Identifies binge-watching, repeated views
- **Theme Clustering**: Groups videos by topic automatically
- **Time Analysis**: Peak viewing hours, day-of-week patterns
- **Trend Tracking**: See how your interests evolve over time

### 🤖 AI-Powered Insights
- **Gemini Integration**: Latest Google AI for history analysis
- **Streaming Responses**: Real-time video content analysis
- **Context-Aware**: AI understands follow-up questions
- **Flexible Queries**: Works with any question format

### 🎨 Beautiful UX
- **Modern Design**: Gradient backgrounds, smooth animations
- **Responsive Layout**: Adapts to your data size
- **Quick Actions**: Pre-configured questions for common tasks
- **Visual Feedback**: Loading states, success animations

### 🔒 Privacy First
- **Local Storage**: All data stored on your device
- **No Tracking**: We don't see your history
- **Optional Sync**: Choose when/if to share data
- **Full Control**: Export, delete, pause anytime

---

## 📦 What's Included

```
chrome-extension/
├── 🎨 Beautiful UI
│   ├── Dashboard with integrated history chat
│   ├── Video chat tab for current video
│   └── Settings page
│
├── 🤖 AI Features
│   ├── Gemini history chat (history-chat.js)
│   ├── Video content chat (chat.js)
│   └── Streaming response handling
│
├── 📊 Core Tracking
│   ├── Real-time video detection
│   ├── Browser history import
│   └── Stats & analytics
│
└── ⚙️ Configuration
    ├── API key management
    ├── History window settings
    └── Export/import tools
```

---

## 🎯 Hackathon Highlights

### Why This Project Stands Out

✅ **Dual AI System** - Two different AI models for different purposes
✅ **Real Value** - Solves actual user pain points
✅ **Beautiful UI** - Professional, modern design
✅ **Smart Integration** - Works seamlessly with YouTube
✅ **Privacy Focused** - User data stays local
✅ **Production Ready** - Fully functional, no mockups

### Technical Achievements

🔧 **Chrome Extension MV3** - Latest manifest version
🔧 **Streaming AI Responses** - Server-Sent Events (SSE)
🔧 **Efficient Data Management** - Smart storage & filtering
🔧 **Content Script Injection** - Real-time page monitoring
🔧 **Service Workers** - Background processing

---

## 💡 Example Conversations

### Finding Specific Videos
```
👤 "Find videos about cooking"

🤖 I found 8 cooking-related videos:

1. "Easy Pasta Recipe" (Dec 24, 3:42 PM)
   youtube.com/watch?v=abc123

2. "Gordon Ramsay Masterclass" (Dec 22, 7:15 PM)
   youtube.com/watch?v=def456

3. "Baking Basics" (Dec 21, 9:30 AM)
   youtube.com/watch?v=ghi789
```

### Pattern Analysis
```
👤 "What are my viewing patterns?"

🤖 💡 Your Viewing Habits:

Binge-Watching Behavior:
• You watch 4-5 videos on the same topic consecutively
• Example: Dec 26 - watched 5 Table Tennis videos in 30 mins

Peak Times:
• Weekday mornings (7-9 AM): News & Commentary
• Weekday afternoons (1-3 PM): Tech & Business
• Evenings (8-11 PM): Entertainment & Sports

Research Mode:
• You cross-reference multiple sources on same events
• Often compare different perspectives
```

### Video Understanding
```
👤 "What's the main argument in this video?"

🤖 The speaker argues that:

1. Traditional manufacturing is being disrupted by AI
2. Case study: Xiaomi's EV uses AI for materials
3. This creates both opportunities and risks

Key timestamp: 12:45 - Shows the actual AI system
Worth watching: The conclusion at 28:30
```

---

## 🎬 Demo Script (For Presentation)

### Act 1: The Problem (30 seconds)
> "Raise your hand if you've ever tried to find a YouTube video you watched but forgot the title..."
>
> "YouTube's history is just a messy list. No search, no insights, no AI."

### Act 2: The Solution (60 seconds)
> "We built YouTube Intelligence Hub. Watch this:"
>
> *[Open YouTube, watch a video]*
>
> *[Open extension popup]*
>
> "See? It tracked it automatically. Now here's the magic:"
>
> *[Type: "Generate a weekly report"]*
>
> "Our AI analyzes my entire viewing history and tells me I watch mostly tech reviews and table tennis. It even knows I binge-watch topics!"

### Act 3: The Wow Factor (45 seconds)
> *[Switch to Video Chat tab]*
>
> "But it gets better. I can chat with AI about the video I'm watching:"
>
> *[Ask: "Summarize this video"]*
>
> "Instant summary. But the real power is history search:"
>
> *[Type: "When did I watch that Xiaomi car video?"]*
>
> "Boom. Exact timestamp, URL, everything."

### Act 4: The Tech (30 seconds)
> "Built with Chrome Extension MV3, integrated with Google Gemini AI for history analysis and custom video API for content chat. All data stored locally for privacy."

### Act 5: The Close (15 seconds)
> "YouTube Intelligence Hub - Your viewing history, supercharged with AI. Thank you!"

---

## 🚧 Troubleshooting

### Extension Won't Load
✅ Make sure icon files exist in `icons/` folder
✅ Check `chrome://extensions/` for error messages
✅ Try reloading the extension

### AI Not Responding
✅ Check internet connection
✅ Verify API key in settings (for video chat)
✅ Check console (F12) for error messages
✅ Try asking a simpler question

### Videos Not Being Tracked
✅ Make sure tracking is enabled (status: "Active")
✅ URL must be `youtube.com/watch?v=...` or `/shorts/...`
✅ Reload YouTube page after installing

---

## 📈 Future Roadmap

- 📊 Visual analytics dashboard with charts
- 🎯 Smart recommendations based on patterns
- 🏷️ Auto-tagging and categorization
- 📱 Mobile companion app
- 🌐 Multi-platform support (Vimeo, Twitch)
- 🔔 Smart notifications for interesting content
- 📤 Share insights with friends

---

## 🤝 Team

Built with passion by the memories.ai team for the hackathon.

**Tech Stack Expertise:**
- Chrome Extensions & Web APIs
- AI Integration (Gemini, Custom APIs)
- Modern UI/UX Design
- Real-time Data Processing

---

## 📄 License

MIT License - Free for personal and educational use!

---

<div align="center">

### ⭐ If you like this project, give it a star!

**Built for [Hackathon Name]** | **December 2025**

Made with 💜 and ☕ by memories.ai

</div>

---

## 🎯 One-Liner Pitch

**"YouTube History meets AI - Track what you watch, chat with your history, never lose a video again."**
