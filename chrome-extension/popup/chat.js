// Chat functionality for YouTube video chat

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const currentVideoTitle = document.getElementById('currentVideoTitle');
const currentVideoUrl = document.getElementById('currentVideoUrl');

let currentVideo = null;
let isStreaming = false;
let currentSessionId = null;

// Helper to check if URL is YouTube video
function isYouTubeVideoUrl(url) {
  if (!url) return false;
  const patterns = [
    /youtube\.com\/watch\?v=[\w-]+/,
    /youtube\.com\/shorts\/[\w-]+/
  ];
  return patterns.some(pattern => pattern.test(url));
}

// Detect current YouTube video
async function detectCurrentVideo() {
  try {
    // Query the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab && isYouTubeVideoUrl(tab.url)) {
      currentVideo = {
        url: tab.url,
        title: tab.title.replace(' - YouTube', '').trim()
      };

      // Update UI
      currentVideoTitle.textContent = currentVideo.title;
      currentVideoUrl.textContent = currentVideo.url;

      // Enable input
      chatInput.disabled = false;
      chatInput.placeholder = 'Ask a question about this video...';
      chatSendBtn.disabled = false;
    } else {
      currentVideo = null;

      // Update UI
      currentVideoTitle.textContent = 'No video detected';
      currentVideoUrl.textContent = 'Open a YouTube video to chat';

      // Disable input
      chatInput.disabled = true;
      chatInput.placeholder = 'Open a YouTube video first...';
      chatSendBtn.disabled = true;
    }
  } catch (error) {
    console.error('Error detecting video:', error);
  }
}

// Add message to chat
function addMessage(role, content, isTyping = false) {
  // Remove welcome message if it exists
  const welcome = chatMessages.querySelector('.chat-welcome');
  if (welcome) {
    welcome.remove();
  }

  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = role === 'user' ? '👤' : '🤖';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';

  if (isTyping) {
    contentDiv.innerHTML = '<div class="message-typing"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
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

// Update last assistant message
function updateLastMessage(content) {
  const messages = chatMessages.querySelectorAll('.message-assistant');
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    const contentDiv = lastMessage.querySelector('.message-content');
    contentDiv.textContent = content;

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// Send chat message
async function sendMessage() {
  console.log('sendMessage called');
  console.log('currentVideo:', currentVideo);
  console.log('isStreaming:', isStreaming);

  if (!currentVideo) {
    console.error('No video detected');
    addMessage('assistant', '❌ Please open a YouTube video first');
    return;
  }

  if (isStreaming) {
    console.warn('Already streaming, ignoring request');
    return;
  }

  const question = chatInput.value.trim();
  console.log('Question:', question);

  if (!question) {
    console.warn('Empty question');
    return;
  }

  // Disable input
  chatInput.disabled = true;
  chatSendBtn.disabled = true;
  isStreaming = true;

  console.log('Sending message...');

  // Add user message
  addMessage('user', question);

  // Clear input
  chatInput.value = '';

  // Add typing indicator
  const typingContent = addMessage('assistant', '', true);

  try {
    // Get API key from config
    const config = await StorageManager.getConfig();
    const apiKey = config.chatApiKey || '';

    if (!apiKey) {
      // Remove typing indicator
      typingContent.parentElement.remove();

      // Show error message
      addMessage('assistant', '❌ Error: API key not configured. Please add your API key in Settings.');
      throw new Error('API key not configured');
    }

    // Prepare message: {youtube_url} {question}
    const msg = `${currentVideo.url} ${question}`;

    console.log('Sending chat request:', { msg, apiKey: apiKey.substring(0, 10) + '...' });

    // Call streaming API (updated endpoint)
    const response = await fetch('https://ppe-backend.memories.ai/serve/video/chat', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        msg: msg,
        videoNoList: []
      })
    });

    console.log('Response received:', response.status, response.statusText);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    console.log('Starting to read stream...');

    // Handle streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedContent = '';
    let buffer = '';
    let chunkCount = 0;

    // Remove typing indicator
    typingContent.parentElement.remove();

    // Create assistant message
    const assistantContent = addMessage('assistant', '');

    console.log('Reading chunks...');

    while (true) {
      const { done, value } = await reader.read();
      chunkCount++;
      console.log(`Chunk ${chunkCount}:`, done ? 'DONE' : `${value?.length} bytes`);

      if (done) break;

      // Decode chunk
      buffer += decoder.decode(value, { stream: true });

      // Split by newlines
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep incomplete line in buffer

      for (const line of lines) {
        if (!line.trim()) continue;

        console.log('Processing line:', line.substring(0, 100) + (line.length > 100 ? '...' : ''));

        // Parse data: prefix
        if (line.startsWith('data:')) {
          const dataStr = line.substring(5).trim();

          // Check for "Done" signal
          if (dataStr === '"Done"') {
            console.log('Streaming complete - Done signal received');
            continue;
          }

          try {
            const data = JSON.parse(dataStr);
            console.log('Parsed data:', data);

            // Check if it's an error code (string instead of object)
            if (typeof data === 'string') {
              console.error('API returned error code:', data);
              assistantContent.textContent = `❌ API Error: ${data}\n\nThis might mean:\n- Invalid API key\n- Video not accessible\n- Rate limit reached\n- API endpoint changed\n\nPlease check your API key in Settings.`;
              break;
            }

            if (data.type === 'content' && data.role === 'assistant') {
              accumulatedContent += data.content;
              assistantContent.textContent = accumulatedContent;
              console.log('Content updated, total length:', accumulatedContent.length);

              // Store session ID
              if (data.sessionId) {
                currentSessionId = data.sessionId;
                console.log('Session ID:', data.sessionId);
              }

              // Scroll to bottom
              chatMessages.scrollTop = chatMessages.scrollHeight;
            } else if (data.error) {
              // Handle error response
              console.error('API returned error:', data);
              assistantContent.textContent = `❌ API Error: ${data.error}\n\n${data.message || 'Please check your API key or try again.'}`;
              break;
            }
          } catch (e) {
            console.warn('Failed to parse chunk:', dataStr, e);
          }
        }
      }
    }

    // Ensure final content is displayed
    if (accumulatedContent) {
      assistantContent.textContent = accumulatedContent;
    } else {
      assistantContent.textContent = 'No response received.';
    }

  } catch (error) {
    console.error('Chat error:', error);

    // Remove typing indicator if still there
    if (typingContent && typingContent.parentElement) {
      try {
        typingContent.parentElement.remove();
      } catch (e) {
        console.warn('Failed to remove typing indicator:', e);
      }
    }

    // Show error message
    const errorMsg = error.message || 'Failed to get response. Please try again.';
    addMessage('assistant', `❌ ${errorMsg}`);
  } finally {
    // Re-enable input
    chatInput.disabled = false;
    chatSendBtn.disabled = false;
    isStreaming = false;
    chatInput.focus();
  }
}

// Event listeners
chatSendBtn.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Detect video when chat tab is opened
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.tab === 'chat') {
      detectCurrentVideo();
    }
  });
});

// Initial detection
detectCurrentVideo();
