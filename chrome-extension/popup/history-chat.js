// History Chat - Gemini integration for viewing history analysis
console.log('History Chat: Initializing...');

// Gemini API configuration
const GEMINI_API_KEY = 'AIzaSyD1TXg8nFSWW2y8rZfqJ9ykqfuz0U9451o';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent';

// DOM Elements
let historyMessages = null;
let historyInput = null;
let historySendBtn = null;
let historyRangeEl = null;
let isHistoryChatStreaming = false;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeHistoryChat);
} else {
  initializeHistoryChat();
}

function initializeHistoryChat() {
  historyMessages = document.getElementById('historyMessages');
  historyInput = document.getElementById('historyInput');
  historySendBtn = document.getElementById('historySendBtn');
  historyRangeEl = document.getElementById('historyRange');

  if (!historyMessages || !historyInput || !historySendBtn) {
    console.error('History Chat: DOM elements not found');
    return;
  }

  setupHistoryChatListeners();
  updateHistoryRange();

  console.log('History Chat: Initialized successfully');
}

function setupHistoryChatListeners() {
  // Send button
  historySendBtn.addEventListener('click', sendHistoryMessage);

  // Enter key
  historyInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendHistoryMessage();
    }
  });

  // Quick question buttons
  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.dataset.prompt;
      historyInput.value = prompt;
      sendHistoryMessage();
    });
  });

  // Refresh button updates history range
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      await loadStatus();
      updateHistoryRange();
    });
  }
}

async function updateHistoryRange() {
  try {
    const config = await StorageManager.getConfig();
    const days = config.historyDays || 7;
    historyRangeEl.textContent = `Last ${days} day${days > 1 ? 's' : ''}`;
  } catch (error) {
    console.error('Error updating history range:', error);
  }
}

function addHistoryMessage(role, content, isTyping = false) {
  // Remove welcome message
  const welcome = historyMessages.querySelector('.chat-welcome');
  if (welcome) {
    welcome.remove();
  }

  const messageDiv = document.createElement('div');
  messageDiv.className = `history-message history-message-${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'history-message-avatar';
  avatar.textContent = role === 'user' ? '👤' : '🤖';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'history-message-content';

  if (isTyping) {
    contentDiv.innerHTML = '<div class="history-message-typing"><div class="history-typing-dot"></div><div class="history-typing-dot"></div><div class="history-typing-dot"></div></div>';
  } else {
    contentDiv.textContent = content;
  }

  messageDiv.appendChild(avatar);
  messageDiv.appendChild(contentDiv);
  historyMessages.appendChild(messageDiv);

  // Scroll to bottom
  historyMessages.scrollTop = historyMessages.scrollHeight;

  return contentDiv;
}

async function sendHistoryMessage() {
  console.log('Sending history chat message...');

  if (isHistoryChatStreaming) {
    console.warn('Already sending message, ignoring...');
    return;
  }

  const question = historyInput.value.trim();
  if (!question) {
    console.warn('Empty question');
    return;
  }

  // Disable input
  historyInput.disabled = true;
  historySendBtn.disabled = true;
  isHistoryChatStreaming = true;

  // Add user message
  addHistoryMessage('user', question);

  // Clear input
  historyInput.value = '';

  // Add typing indicator
  const typingContent = addHistoryMessage('assistant', '', true);

  try {
    // Get viewing history data
    console.log('Fetching viewing history...');
    const historyData = await StorageManager.exportJSON();

    // Create a simplified summary instead of full JSON
    const videoList = historyData.videos.map((v, idx) => {
      const date = new Date(v.timestamp);
      return `${idx + 1}. "${v.title}" by ${v.channel || 'Unknown'} (${date.toLocaleDateString()} ${date.toLocaleTimeString()}) - ${v.url}`;
    }).join('\n');

    const summary = `Total videos: ${historyData.totalCount}
Time range: ${historyData.note || 'Last 7 days'}
Export date: ${historyData.exportDate}

Videos watched:
${videoList}`;

    // Prepare prompt for Gemini
    const systemPrompt = `You are a helpful AI assistant analyzing a user's YouTube viewing history.
Answer questions about their viewing patterns, help them find specific videos, and generate reports.
Be concise and friendly. Format your response clearly with bullet points or numbered lists when appropriate.`;

    const userPrompt = `Here is the user's YouTube viewing history:

${summary}

User question: ${question}

Please provide a helpful, clear answer based on this viewing history.`;

    console.log('Calling Gemini API...');
    console.log('Prompt size:', userPrompt.length, 'characters');
    console.log('Videos included:', historyData.totalCount);

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt + '\n\n' + userPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    });

    console.log('Gemini response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      console.error('Status:', response.status, response.statusText);
      console.error('Request URL:', `${GEMINI_API_URL}?key=${GEMINI_API_KEY.substring(0, 10)}...`);

      let errorMsg = `Gemini API error: ${response.status} ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error && errorJson.error.message) {
          errorMsg += `\n${errorJson.error.message}`;
        }
      } catch (e) {
        errorMsg += `\n${errorText}`;
      }

      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log('Gemini response:', data);
    console.log('Response structure:', JSON.stringify(data, null, 2));

    // Remove typing indicator
    typingContent.parentElement.remove();

    // Extract response text
    let responseText = 'No response received.';

    // Check for different response formats
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      console.log('Candidate:', candidate);
      console.log('Content object:', candidate.content);
      console.log('Content keys:', Object.keys(candidate.content || {}));

      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        responseText = candidate.content.parts[0].text;
        console.log('Extracted text:', responseText);
      } else {
        console.warn('No content.parts found in candidate:', candidate);
        // Check for safety ratings or finish reason
        if (candidate.finishReason) {
          console.log('Finish reason:', candidate.finishReason);
          if (candidate.finishReason === 'SAFETY') {
            responseText = '⚠️ Response blocked by safety filters. Try rephrasing your question.';
          } else if (candidate.finishReason === 'MAX_TOKENS') {
            responseText = '⚠️ Response was cut off due to length limits. Try asking a more specific question (e.g., "What videos did I watch today?" instead of "Generate a full report").';
          } else {
            responseText = `⚠️ Response ended with reason: ${candidate.finishReason}`;
          }
        }

        // Check if there's text directly in content
        if (!responseText || responseText.startsWith('⚠️')) {
          if (candidate.content && candidate.content.text) {
            responseText = candidate.content.text;
            console.log('Found text directly in content:', responseText);
          }
        }
      }
    } else {
      console.warn('No candidates in response:', data);
      // Check if there's an error field
      if (data.error) {
        responseText = `❌ Error: ${data.error.message || JSON.stringify(data.error)}`;
      }
    }

    // Add assistant message
    addHistoryMessage('assistant', responseText);

  } catch (error) {
    console.error('History chat error:', error);

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
    addHistoryMessage('assistant', `❌ Error: ${errorMsg}`);
  } finally {
    // Re-enable input
    historyInput.disabled = false;
    historySendBtn.disabled = false;
    isHistoryChatStreaming = false;
    historyInput.focus();
  }
}

console.log('History Chat: Loaded successfully');
