// content.js
// Import turndown for HTML to Markdown conversion
const turndownService = new TurndownService();

let webLLM = null;

// Initialize web-llm
async function initializeWebLLM() {
  if (!webLLM) {
    // Note: This is a placeholder for actual web-llm initialization
    // You would need to include the actual web-llm library and initialization code
    webLLM = {
      generate: async (prompt, text) => {
        // Placeholder for actual AI processing
        return `Summary of: ${text.substring(0, 100)}...`;
      }
    };
  }
  return webLLM;
}

// Convert HTML to Markdown
function convertToMarkdown(html) {
  const turndownService = new TurndownService();
  return turndownService.turndown(html);
}

// Get selected text with HTML formatting
function getSelection() {
  const selection = window.getSelection();
  if (!selection.rangeCount) {
    return { text: '', html: '' };
  }

  const range = selection.getRangeAt(0);
  const container = document.createElement('div');
  container.appendChild(range.cloneContents());
  
  return {
    text: container.textContent,
    html: container.innerHTML
  };
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'summarize') {
    try {
      const selection = getSelection();
      if (!selection.text) {
        throw new Error('No text selected');
      }

      // Convert to Markdown
      const markdown = convertToMarkdown(selection.html);

      // Initialize web-llm and generate summary
      const llm = await initializeWebLLM();
      const summary = await llm.generate(request.prompt, selection.text);

      sendResponse({ markdown, summary });
    } catch (error) {
      sendResponse({ error: error.message });
    }
  }
  return true; // Required for async response
});