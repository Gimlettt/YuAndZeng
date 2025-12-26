// Content Panel - Embedded chat interface for YouTube
console.log('YouTube Chat Panel: Initializing...');

// Check if we're on a YouTube page
if (window.location.hostname.includes('youtube.com')) {
  initializeChatPanel();
}

function initializeChatPanel() {
  // Wait for page to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatPanel);
  } else {
    createChatPanel();
  }
}

let currentVideo = null;
let isStreaming = false;
let currentSessionId = null;
let chatMessages = null;
let chatInput = null;
let chatSendBtn = null;

function createChatPanel() {
  // Check if panel already exists
  if (document.getElementById('ytb-chat-panel')) {
    console.log('Chat panel already exists');
    return;
  }

  // Create panel HTML
  const panel = document.createElement('div');
  panel.id = 'ytb-chat-panel';
  panel.innerHTML = `
    <!-- Panel Header -->
    <div class="ytb-panel-header">
      <div class="ytb-panel-logo">
        <span class="ytb-panel-logo-icon">💬</span>
        <span>Video Chat</span>
      </div>
      <div class="ytb-panel-controls">
        <button class="ytb-btn-icon" id="ytb-settings-btn" title="Settings">
          ⚙️
        </button>
        <button class="ytb-btn-icon" id="ytb-collapse-btn" title="Collapse">
          ✕
        </button>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="ytb-stats-section">
      <div class="ytb-stats-grid">
        <div class="ytb-stat-card">
          <div class="ytb-stat-value" id="ytb-total-videos">0</div>
          <div class="ytb-stat-label">Total Videos</div>
        </div>
        <div class="ytb-stat-card">
          <div class="ytb-stat-value" id="ytb-today-count">0</div>
          <div class="ytb-stat-label">Today</div>
        </div>
      </div>
    </div>

    <!-- Video Context -->
    <div class="ytb-video-context" id="ytb-video-context">
      <div class="ytb-video-context-label">CURRENT VIDEO</div>
      <div class="ytb-video-context-title" id="ytb-video-title">Detecting video...</div>
      <div class="ytb-video-context-url" id="ytb-video-url"></div>
    </div>

    <!-- Chat Messages -->
    <div class="ytb-chat-messages" id="ytb-chat-messages">
      <div class="ytb-chat-welcome">
        <div class="ytb-chat-welcome-icon">💬</div>
        <div class="ytb-chat-welcome-text">Ask me anything about this video!</div>
        <div class="ytb-chat-welcome-hint">I can describe, summarize, or answer questions about the video content.</div>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="ytb-chat-input-container">
      <div class="ytb-chat-input-wrapper">
        <input
          type="text"
          id="ytb-chat-input"
          class="ytb-chat-input"
          placeholder="Ask about this video..."
          disabled
        />
        <button id="ytb-chat-send-btn" class="ytb-chat-send-btn" disabled>
          📤
        </button>
      </div>
    </div>
  `;

  // Create toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'ytb-toggle-btn';
  toggleBtn.id = 'ytb-toggle-btn';
  toggleBtn.textContent = '💬';
  toggleBtn.title = 'Toggle Chat Panel';

  // Create settings modal
  const settingsModal = document.createElement('div');
  settingsModal.id = 'ytb-settings-modal';
  settingsModal.innerHTML = `
    <div class="ytb-modal-content">
      <div class="ytb-modal-header">
        <h2 class="ytb-modal-title">⚙️ Settings</h2>
        <button class="ytb-modal-close" id="ytb-modal-close">✕</button>
      </div>

      <form id="ytb-settings-form">
        <div class="ytb-form-group">
          <label class="ytb-form-label">Chat API Key</label>
          <input
            type="password"
            id="ytb-api-key-input"
            class="ytb-form-input"
            placeholder="Enter your API key"
          />
          <p class="ytb-form-help">API key for video chat (memories.ai)</p>
        </div>

        <div class="ytb-form-group">
          <label class="ytb-form-label">History Days</label>
          <input
            type="number"
            id="ytb-history-days-input"
            class="ytb-form-input"
            min="1"
            max="365"
            value="7"
          />
          <p class="ytb-form-help">Number of days to track video history</p>
        </div>

        <button type="submit" class="ytb-btn-primary">💾 Save Settings</button>
      </form>
    </div>
  `;

  // Append to body
  document.body.appendChild(panel);
  document.body.appendChild(toggleBtn);
  document.body.appendChild(settingsModal);

  // Initialize
  setupEventListeners();
  loadStats();
  detectVideo();

  console.log('Chat panel created successfully');
}

function setupEventListeners() {
  chatMessages = document.getElementById('ytb-chat-messages');
  chatInput = document.getElementById('ytb-chat-input');
  chatSendBtn = document.getElementById('ytb-chat-send-btn');

  // Collapse button
  document.getElementById('ytb-collapse-btn').addEventListener('click', () => {
    const panel = document.getElementById('ytb-chat-panel');
    panel.classList.toggle('collapsed');
  });

  // Toggle button
  document.getElementById('ytb-toggle-btn').addEventListener('click', () => {
    const panel = document.getElementById('ytb-chat-panel');
    panel.classList.toggle('collapsed');
  });

  // Settings button
  document.getElementById('ytb-settings-btn').addEventListener('click', () => {
    openSettings();
  });

  // Settings modal close
  document.getElementById('ytb-modal-close').addEventListener('click', () => {
    closeSettings();
  });

  // Close modal on background click
  document.getElementById('ytb-settings-modal').addEventListener('click', (e) => {
    if (e.target.id === 'ytb-settings-modal') {
      closeSettings();
    }
  });

  // Settings form submit
  document.getElementById('ytb-settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveSettings();
  });

  // Chat send button
  chatSendBtn.addEventListener('click', sendMessage);

  // Chat input enter key
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Detect video changes
  setInterval(detectVideo, 2000);

  // Update stats periodically
  setInterval(loadStats, 10000);
}

async function loadStats() {
  try {
    const stats = await StorageManager.getStats();
    document.getElementById('ytb-total-videos').textContent = stats.totalVideos || 0;
    document.getElementById('ytb-today-count').textContent = stats.todayCount || 0;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

function isYouTubeVideoUrl(url) {
  if (!url) return false;
  const patterns = [
    /youtube\.com\/watch\?v=[\w-]+/,
    /youtube\.com\/shorts\/[\w-]+/
  ];
  return patterns.some(pattern => pattern.test(url));
}

function detectVideo() {
  const url = window.location.href;

  if (isYouTubeVideoUrl(url)) {
    // Get title from YouTube's page
    const titleElement = document.querySelector('h1.ytd-watch-metadata yt-formatted-string') ||
                        document.querySelector('h1.title') ||
                        document.querySelector('#title h1');

    const title = titleElement ? titleElement.textContent.trim() : document.title.replace(' - YouTube', '').trim();

    currentVideo = { url, title };

    // Update UI
    document.getElementById('ytb-video-title').textContent = title;
    document.getElementById('ytb-video-url').textContent = url;
    document.getElementById('ytb-video-context').classList.remove('no-video');

    // Enable input
    chatInput.disabled = false;
    chatInput.placeholder = 'Ask a question about this video...';
    chatSendBtn.disabled = false;
  } else {
    currentVideo = null;

    // Update UI
    document.getElementById('ytb-video-title').textContent = 'No video detected';
    document.getElementById('ytb-video-url').textContent = 'Navigate to a YouTube video to start chatting';
    document.getElementById('ytb-video-context').classList.add('no-video');

    // Disable input
    chatInput.disabled = true;
    chatInput.placeholder = 'Open a YouTube video first...';
    chatSendBtn.disabled = true;
  }
}

function addMessage(role, content, isTyping = false) {
  // Remove welcome message
  const welcome = chatMessages.querySelector('.ytb-chat-welcome');
  if (welcome) {
    welcome.remove();
  }

  const messageDiv = document.createElement('div');
  messageDiv.className = `ytb-message ytb-message-${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'ytb-message-avatar';
  avatar.textContent = role === 'user' ? '👤' : '🤖';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'ytb-message-content';

  if (isTyping) {
    contentDiv.innerHTML = '<div class="ytb-message-typing"><div class="ytb-typing-dot"></div><div class="ytb-typing-dot"></div><div class="ytb-typing-dot"></div></div>';
  } else {
    contentDiv.textContent = content;
  }

  messageDiv.appendChild(avatar);
  messageDiv.appendChild(contentDiv);
  chatMessages.appendChild(messageDiv);

  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return contentDiv;
}

async function sendMessage() {
  if (!currentVideo || isStreaming) return;

  const question = chatInput.value.trim();
  if (!question) return;

  // Disable input
  chatInput.disabled = true;
  chatSendBtn.disabled = true;
  isStreaming = true;

  // Add user message
  addMessage('user', question);

  // Clear input
  chatInput.value = '';

  // Add typing indicator
  const typingContent = addMessage('assistant', '', true);

  try {
    // Get API key
    const config = await StorageManager.getConfig();
    const apiKey = config.chatApiKey || '';

    if (!apiKey) {
      typingContent.parentElement.remove();
      addMessage('assistant', '❌ Error: API key not configured. Click ⚙️ to add your API key.');
      throw new Error('API key not configured');
    }

    // Prepare prompt
    const prompt = `${currentVideo.url} ${question}`;

    // Call API
    const response = await fetch('https://ppe-backend.memories.ai/serve/open/video/chat', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        isFast: 'Y',
        videoNoList: []
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    // Handle streaming
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedContent = '';
    let buffer = '';

    // Remove typing indicator
    typingContent.parentElement.remove();

    // Create assistant message
    const assistantContent = addMessage('assistant', '');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;

        if (line.startsWith('data:')) {
          const dataStr = line.substring(5).trim();

          if (dataStr === '"Done"') {
            console.log('Streaming complete');
            continue;
          }

          try {
            const data = JSON.parse(dataStr);

            if (data.type === 'content' && data.role === 'assistant') {
              accumulatedContent += data.content;
              assistantContent.textContent = accumulatedContent;

              if (data.sessionId) {
                currentSessionId = data.sessionId;
              }

              chatMessages.scrollTop = chatMessages.scrollHeight;
            }
          } catch (e) {
            console.warn('Failed to parse chunk:', dataStr, e);
          }
        }
      }
    }

    if (accumulatedContent) {
      assistantContent.textContent = accumulatedContent;
    } else {
      assistantContent.textContent = 'No response received.';
    }

  } catch (error) {
    console.error('Chat error:', error);
    const errorMsg = error.message || 'Failed to get response.';

    // Remove typing if still there
    if (typingContent.parentElement) {
      typingContent.parentElement.remove();
    }

    addMessage('assistant', `❌ ${errorMsg}`);
  } finally {
    // Re-enable input
    chatInput.disabled = false;
    chatSendBtn.disabled = false;
    isStreaming = false;
    chatInput.focus();
  }
}

async function openSettings() {
  const modal = document.getElementById('ytb-settings-modal');
  modal.classList.add('show');

  // Load current settings
  try {
    const config = await StorageManager.getConfig();
    document.getElementById('ytb-api-key-input').value = config.chatApiKey || '';
    document.getElementById('ytb-history-days-input').value = config.historyDays || 7;
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

function closeSettings() {
  const modal = document.getElementById('ytb-settings-modal');
  modal.classList.remove('show');
}

async function saveSettings() {
  try {
    const apiKey = document.getElementById('ytb-api-key-input').value.trim();
    const historyDays = parseInt(document.getElementById('ytb-history-days-input').value);

    // Get current config
    const config = await StorageManager.getConfig();

    // Update values
    config.chatApiKey = apiKey;
    config.historyDays = historyDays;

    // Save
    await StorageManager.saveConfig(config);

    // Show success feedback
    const submitBtn = document.querySelector('#ytb-settings-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '✅ Saved!';

    setTimeout(() => {
      submitBtn.textContent = originalText;
      closeSettings();
    }, 1500);

  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Failed to save settings. Please try again.');
  }
}

console.log('YouTube Chat Panel: Loaded successfully');
