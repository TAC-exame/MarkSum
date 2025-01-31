chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSelection') {
      const selectedText = window.getSelection().toString();
      sendResponse({ text: selectedText });
    }
    return true;
  });
  
  // Optional: Add a right-click context menu when text is selected
  document.addEventListener('mouseup', () => {
      const selectedText = window.getSelection().toString();
      if (selectedText) {
          chrome.runtime.sendMessage({
              action: 'textSelected',
              text: selectedText
          });
      }
  });