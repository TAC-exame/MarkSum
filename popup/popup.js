document.addEventListener('DOMContentLoaded', () => {
  const summarizeBtn = document.getElementById('summarizeBtn');
  const modelSelect = document.getElementById('model');
  const lengthSelect = document.getElementById('length');
  const customPrompt = document.getElementById('customPrompt');
  const modelStatus = document.getElementById('modelStatus');
  const output = document.getElementById('output');
  const summaryText = document.getElementById('summaryText');
  const copyBtn = document.getElementById('copyBtn');

  // Initialize the transformer
  let transformer = null;

  // Check model status on popup open
  checkModelStatus();

  async function checkModelStatus() {
    try {
      modelStatus.className = 'status loading';
      modelStatus.textContent = 'Loading AI Model...';
      
      // Import the transformers library
      const { pipeline } = await import('@xenova/transformers');
      
      // Initialize the model
      transformer = await pipeline('summarization', modelSelect.value);
      
      modelStatus.className = 'status ready';
      modelStatus.textContent = 'AI Model Ready';
      summarizeBtn.disabled = false;
    } catch (error) {
      modelStatus.className = 'status error';
      modelStatus.textContent = 'Error loading model: ' + error.message;
      summarizeBtn.disabled = true;
      console.error('Model loading error:', error);
    }
  }

  modelSelect.addEventListener('change', () => {
    modelStatus.className = 'status loading';
    modelStatus.textContent = 'Loading new model...';
    summarizeBtn.disabled = true;
    checkModelStatus();
  });

  summarizeBtn.addEventListener('click', async () => {
    try {
      summarizeBtn.disabled = true;
      modelStatus.className = 'status loading';
      modelStatus.textContent = 'Generating summary...';
      output.style.display = 'none';

      // Get selected text from the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const [selection] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection().toString()
      });

      const text = selection.result;
      
      if (!text) {
        modelStatus.className = 'status error';
        modelStatus.textContent = 'Please select some text first!';
        summarizeBtn.disabled = false;
        return;
      }

      // Add custom prompt if provided
      const finalText = customPrompt.value ? 
        `${customPrompt.value}\n\n${text}` : text;

      // Set length parameters based on selection
      const maxLength = lengthSelect.value === 'short' ? 130 : 
                       lengthSelect.value === 'medium' ? 250 : 450;
      const minLength = lengthSelect.value === 'short' ? 30 : 
                       lengthSelect.value === 'medium' ? 100 : 200;

      // Generate summary using transformer
      const summary = await transformer(finalText, {
        max_length: maxLength,
        min_length: minLength,
        do_sample: false
      });

      summaryText.textContent = summary[0].summary_text;
      output.style.display = 'block';
      modelStatus.className = 'status ready';
      modelStatus.textContent = 'Summary generated!';
      
    } catch (error) {
      modelStatus.className = 'status error';
      modelStatus.textContent = 'Error: ' + error.message;
      console.error('Summarization error:', error);
    } finally {
      summarizeBtn.disabled = false;
    }
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(summaryText.textContent).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy to Clipboard';
      }, 2000);
    });
  });
});