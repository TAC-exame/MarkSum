document.addEventListener('DOMContentLoaded', function() {
    const controls = {
      summarize: document.getElementById('summarize'),
      managePrompts: document.getElementById('manage-prompts'),
      promptTemplate: document.getElementById('prompt-template'),
      promptManagement: document.getElementById('prompt-management'),
      mainControls: document.getElementById('main-controls'),
      promptEditor: document.getElementById('prompt-editor'),
      savePrompt: document.getElementById('save-prompt'),
      back: document.getElementById('back'),
      status: document.getElementById('status'),
      result: document.getElementById('result')
    };
  
  // Default prompts
  const defaultPrompts = {
    academic: "Provide an academic summary focusing on methodology and findings",
    business: "Create a concise business overview highlighting key points and implications",
    technical: "Generate a technical summary emphasizing implementation details and architecture",
    creative: "Create an engaging narrative summary of the main points"
  };

  // Load saved prompts or use defaults
  chrome.storage.local.get(['prompts'], function(result) {
    if (!result.prompts) {
      chrome.storage.local.set({ prompts: defaultPrompts });
    }
  });

  // Handle summarize button click
  controls.summarize.addEventListener('click', async () => {
    try {
      controls.status.textContent = 'Processing...';
      controls.status.className = 'status loading';

      // Get selected prompt
      const promptType = controls.promptTemplate.value;
      const prompts = await new Promise(resolve => {
        chrome.storage.local.get(['prompts'], result => resolve(result.prompts));
      });
      const selectedPrompt = prompts[promptType];

      // Request summarization
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const result = await chrome.tabs.sendMessage(tab.id, {
        action: 'summarize',
        prompt: selectedPrompt
      });

      if (result.error) {
        throw new Error(result.error);
      }

      controls.result.innerHTML = `
        <h4>Summary:</h4>
        <pre>${result.summary}</pre>
        <h4>Markdown:</h4>
        <pre>${result.markdown}</pre>
      `;
      controls.status.textContent = 'Summary generated successfully!';
      controls.status.className = 'status success';
    } catch (error) {
      controls.status.textContent = `Error: ${error.message}`;
      controls.status.className = 'status error';
    }
  });

  // Handle prompt management
  controls.managePrompts.addEventListener('click', async () => {
    const prompts = await new Promise(resolve => {
      chrome.storage.local.get(['prompts'], result => resolve(result.prompts));
    });
    controls.promptEditor.value = JSON.stringify(prompts, null, 2);
    controls.mainControls.classList.add('hidden');
    controls.promptManagement.classList.remove('hidden');
  });

  // Save prompts
  controls.savePrompt.addEventListener('click', async () => {
    try {
      const prompts = JSON.parse(controls.promptEditor.value);
      await chrome.storage.local.set({ prompts });
      controls.status.textContent = 'Prompts saved successfully!';
      controls.status.className = 'status success';
    } catch (error) {
      controls.status.textContent = `Error saving prompts: ${error.message}`;
      controls.status.className = 'status error';
    }
  });

  // Back button
  controls.back.addEventListener('click', () => {
    controls.mainControls.classList.remove('hidden');
    controls.promptManagement.classList.add('hidden');
  });
});
