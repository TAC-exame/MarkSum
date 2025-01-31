let modelLoaded = false;

async function loadModel() {
  if (!modelLoaded) {
    try {
      // Placeholder for actual model loading code
      // You would need to implement this using web-llm
      modelLoaded = true;
    } catch (error) {
      console.error('Error loading model:', error);
      throw error;
    }
  }
}

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  // Start loading the model
  loadModel().catch(console.error);
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'modelStatus') {
    sendResponse({ loaded: modelLoaded });
  }
  return true;
});