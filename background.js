let transformer = null;
let tokenizer = null;

async function loadModel(modelName) {
  try {
    const { pipeline } = await import('@xenova/transformers');
    transformer = await pipeline('summarization', modelName);
    return { success: true };
  } catch (error) {
    console.error('Error loading model:', error);
    return { success: false, error: error.message };
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'loadModel') {
    loadModel(request.modelName).then(sendResponse);
    return true;  // Will respond asynchronously
  }
  
  if (request.action === 'summarize') {
    if (!transformer) {
      sendResponse({ success: false, error: 'Model not loaded' });
      return;
    }

    summarizeText(request.text, request.length).then(sendResponse);
    return true;  // Will respond asynchronously
  }
});

async function summarizeText(text, length) {
  try {
    const maxLength = length === 'short' ? 130 : length === 'medium' ? 250 : 450;
    const minLength = length === 'short' ? 30 : length === 'medium' ? 100 : 200;

    const summary = await transformer(text, {
      max_length: maxLength,
      min_length: minLength,
      do_sample: false
    });

    return {
      success: true,
      summary: summary[0].summary_text
    };
  } catch (error) {
    console.error('Summarization error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}