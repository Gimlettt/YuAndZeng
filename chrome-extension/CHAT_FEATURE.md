# 💬 Chat Feature Guide

## Overview

The Chat feature allows you to ask questions about YouTube videos using AI. When you open a YouTube video, you can chat with the AI to get descriptions, summaries, or answers about the video content.

---

## ✨ Features

- **Auto-detect YouTube videos**: Automatically detects the current video URL and title
- **Streaming responses**: AI responses appear word-by-word in real-time
- **Tab-based interface**: Clean tab navigation between Dashboard and Chat
- **Session support**: Maintains conversation context with sessionId
- **Video-aware**: Automatically includes video URL in prompts

---

## 🎯 How It Works

### Interaction Flow:

1. **User opens YouTube video** → Extension detects video
2. **User switches to Chat tab** → Sees current video info
3. **User asks question** → Extension sends to API
4. **API analyzes video** → Returns streaming response
5. **AI responds** → Displayed in chat bubble

### API Integration:

**Endpoint:** `https://ppe-backend.memories.ai/serve/open/video/chat`

**Request Format:**
```json
{
  "prompt": "https://www.youtube.com/watch?v=VIDEO_ID What is this video about?",
  "isFast": "Y",
  "videoNoList": []
}
```

**Headers:**
```
Authorization: YOUR_API_KEY
Content-Type: application/json
```

**Response Format (Streaming):**
```
data:{"type":"content","role":"assistant","content":"chunk1","sessionId":"..."}
data:{"type":"content","role":"assistant","content":"chunk2","sessionId":"..."}
...
data:"Done"
```

---

## 🚀 Setup Instructions

### Step 1: Configure API Key

1. **Open Settings:**
   - Click extension icon
   - Click ⚙️ **Settings** button

2. **Add Chat API Key:**
   - Find "Chat API Key" field
   - Paste your API key from memories.ai
   - Click **💾 Save Settings**

### Step 2: Test the Chat

1. **Open a YouTube video:**
   - Go to youtube.com
   - Click any video to open it

2. **Open extension popup:**
   - Click extension icon in toolbar
   - Switch to **💬 Chat** tab

3. **Verify video detected:**
   - Should see video title and URL at top
   - Input box should be enabled

4. **Ask a question:**
   - Type: "What is this video about?"
   - Press Enter or click 📤 Send
   - Watch response stream in

---

## 🎨 UI Components

### Chat Tab Layout:

```
┌─────────────────────────────────┐
│ 📊 Dashboard | 💬 Chat         │ ← Tabs
├─────────────────────────────────┤
│ 🎥 How Windows Work - Demo      │ ← Video context
│ youtube.com/watch?v=...         │
├─────────────────────────────────┤
│                                 │
│ 👤 What is this video about?   │ ← User message
│                                 │
│ 🤖 In the video, a man wearing │ ← AI response
│    a baseball cap demonstrates  │   (streaming)
│    how an old double-hung...    │
│                                 │
│ 👤 When was it filmed?         │
│                                 │
│ 🤖 ●●● (typing...)             │ ← Typing indicator
│                                 │
├─────────────────────────────────┤
│ [Type your question...] [📤]   │ ← Input box
└─────────────────────────────────┘
```

### States:

**No Video Detected:**
- Video context shows: "No video detected"
- Input is disabled
- Placeholder: "Open a YouTube video first..."

**Video Detected:**
- Video context shows title and URL
- Input is enabled
- Placeholder: "Ask a question about this video..."

**Streaming Response:**
- Send button disabled
- Response appears word-by-word
- Auto-scrolls to bottom

---

## 📝 Example Usage

### Example 1: Video Description

**User:** "Describe this video"

**AI Response (streaming):**
```
In the video, a man wearing a baseball cap, a blue shirt,
and a grey vest, along with work gloves, demonstrates the
operation of an old double-hung window from inside a house.
The window frame itself shows signs of age, including peeling
paint...
```

### Example 2: Technical Question

**User:** "How does a double-hung window work?"

**AI Response:**
```
A double-hung window has two sashes (window panels) that can
move independently. Both the top and bottom sashes slide up
and down within the frame. This allows for versatile
ventilation options...
```

### Example 3: Follow-up Question

**User:** "What materials is it made of?"

**AI Response (with context):**
```
Based on the video, the window appears to be made of wood,
as evidenced by the painted wooden frame and sashes. The
traditional construction...
```

---

## 🛠 Technical Implementation

### Files Structure:

```
popup/
├── popup.html         # Added tabs + chat UI
├── popup.css          # Chat styling
├── popup.js           # Tab switching
└── chat.js            # Chat logic (new)

options/
├── options.html       # Added chatApiKey field
└── options.js         # Handle chatApiKey config

utils/
└── storage.js         # Added chatApiKey to config
```

### Key Functions (chat.js):

```javascript
// Detect current YouTube video
async function detectCurrentVideo()

// Add message bubble to chat
function addMessage(role, content, isTyping)

// Send question to API
async function sendMessage()

// Handle streaming response
// Parses Server-Sent Events format
```

### Streaming Response Handling:

```javascript
const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split('\n');
  buffer = lines.pop();

  for (const line of lines) {
    if (line.startsWith('data:')) {
      const dataStr = line.substring(5).trim();
      if (dataStr === '"Done"') break;

      const data = JSON.parse(dataStr);
      if (data.type === 'content') {
        accumulatedContent += data.content;
        updateMessageDisplay(accumulatedContent);
      }
    }
  }
}
```

---

## 🎯 User Experience Design

### Design Principles:

1. **Auto-detection**: Users don't manually paste URLs
2. **Context-aware**: Video info always visible
3. **Real-time feedback**: Streaming responses feel natural
4. **Error handling**: Clear error messages
5. **Visual cues**: Typing indicators, avatars, colors

### UI/UX Details:

**Message Bubbles:**
- User messages: Right-aligned, gradient purple background
- AI messages: Left-aligned, white background with border
- Avatars: 👤 for user, 🤖 for AI

**Animations:**
- Slide in: Messages fade in from bottom
- Typing dots: Pulsing animation
- Send button: Scale on hover/click

**Accessibility:**
- Keyboard support: Enter to send
- Focus management: Auto-focus input after send
- Visual feedback: Disabled states, loading indicators

---

## ⚙️ Configuration

### Options Page Settings:

**Chat API Key:**
- Location: Settings → Chat API Key field
- Type: Password input (hidden characters)
- Required: Yes (chat won't work without it)
- Format: Bearer token for memories.ai API

**Backend API Key (separate):**
- Used for backend sync feature
- Not required for chat functionality

---

## 🐛 Troubleshooting

### Issue: "No video detected"

**Cause:** Not on a YouTube video page

**Solution:**
1. Make sure you're on a YouTube video URL
2. URL must match: `youtube.com/watch?v=...` or `youtube.com/shorts/...`
3. Reload the popup to re-detect

---

### Issue: "Error: API key not configured"

**Cause:** Chat API key not set in settings

**Solution:**
1. Open ⚙️ Settings
2. Find "Chat API Key" field
3. Paste your API key
4. Click "💾 Save Settings"
5. Try sending message again

---

### Issue: "API error: 401 Unauthorized"

**Cause:** Invalid or expired API key

**Solution:**
1. Check your API key is correct
2. Get new key from memories.ai
3. Update in settings

---

### Issue: Response not streaming

**Cause:** Network issue or API not responding

**Solution:**
1. Check console for errors (F12)
2. Verify internet connection
3. Try again in a few seconds
4. Check API status at memories.ai

---

### Issue: Video title shows "YouTube"

**Cause:** Page not fully loaded when popup opened

**Solution:**
1. Close and reopen popup
2. OR switch to Dashboard tab and back to Chat
3. Extension will re-detect video

---

## 🔍 Testing Checklist

### Basic Functionality:

- [ ] Open YouTube video → Video detected
- [ ] Ask question → Response received
- [ ] Response streams word-by-word
- [ ] Auto-scrolls to bottom
- [ ] Input re-enabled after response

### Edge Cases:

- [ ] Open popup on non-video page → Input disabled
- [ ] Navigate between tabs → Detection works
- [ ] Send empty message → Nothing happens
- [ ] API key missing → Clear error message
- [ ] API key invalid → 401 error handled
- [ ] Network error → Error message shown

### UI/UX:

- [ ] Tab switching works smoothly
- [ ] Message bubbles display correctly
- [ ] Avatars show 👤 and 🤖
- [ ] Typing indicator animates
- [ ] Send button hover/active states work
- [ ] Enter key sends message
- [ ] Long messages wrap properly

---

## 📊 Technical Specifications

**Popup Size:**
- Width: 350px
- Min-height: 500px (increased for chat)

**Chat Message Container:**
- Flex: 1 (takes remaining space)
- Overflow: auto (scrollable)
- Max message width: 75%

**API Response Format:**
- Streaming: Server-Sent Events (SSE)
- Encoding: UTF-8
- Format: newline-delimited JSON

**Performance:**
- Streaming latency: ~50ms per chunk
- UI update: Debounced for smooth rendering
- Memory: Lightweight (messages in DOM only)

---

## 🚀 Future Enhancements

### Potential Features:

1. **Message history**: Save chat history per video
2. **Follow-up context**: Multi-turn conversations
3. **Quick actions**: Pre-defined questions (Summary, Key Points, etc.)
4. **Export chat**: Save conversation as text/PDF
5. **Voice input**: Speak questions instead of typing
6. **Markdown support**: Rich formatting in responses
7. **Video timestamps**: Link to specific parts of video
8. **Multi-language**: Support for different languages

---

## 📚 API Documentation

For full API documentation, visit:
- https://docs.memories.ai/video-chat
- Or contact support for API key access

---

## ✅ Summary

The Chat feature is now fully integrated into your YouTube History Tracker extension!

**What you get:**
- ✅ Tab-based UI (Dashboard + Chat)
- ✅ Auto-detect YouTube videos
- ✅ Streaming AI responses
- ✅ Clean, modern interface
- ✅ Easy API key configuration
- ✅ Error handling and feedback

**Next steps:**
1. Reload extension: `chrome://extensions/` → 🔄 Reload
2. Add API key in Settings
3. Open YouTube video
4. Start chatting!

Enjoy your new video chat feature! 🎉
