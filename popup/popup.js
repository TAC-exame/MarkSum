const modelPath = modelSelect.value === 'distilbart' ? 'assets/model/distilbart' : 'assets/model/t5-small';

document.addEventListener('DOMContentLoaded', () => {
  const summarizeBtn = document.getElementById('summarizeBtn');
  const modelSelect = document.getElementById('model');
  const lengthSelect = document.getElementById('length');
  const styleSelect = document.getElementById('style');  // Novo elemento para escolher o estilo de resumo
  const customPrompt = document.getElementById('customPrompt');
  const modelStatus = document.getElementById('modelStatus');
  const output = document.getElementById('output');
  const summaryText = document.getElementById('summaryText');
  const copyBtn = document.getElementById('copyBtn');

  let transformer = null;

  // Verificar o status do modelo ao abrir a popup
  checkModelStatus();

  async function checkModelStatus() {
    try {
      modelStatus.className = 'status loading';
      modelStatus.textContent = 'Loading AI Model...';
      progressBar.style.display = 'block'; // Show the progress bar

      const modelPath = modelSelect.value === 'distilbart' ? 'assets/model/distilbart' : 'assets/model/t5-small';

      // Simulating model loading with progress updates (replace with actual model loading code)
      transformer = await loadModelWithProgress(modelPath);

      modelStatus.className = 'status ready';
      modelStatus.textContent = 'AI Model Ready';
      summarizeBtn.disabled = false;
    } catch (error) {
      modelStatus.className = 'status error';
      modelStatus.textContent = 'Error loading model: ' + error.message;
      summarizeBtn.disabled = true;
      console.error('Model loading error:', error);
    } finally {
      progressBar.style.display = 'none';
    }
  }
  async function loadModelWithProgress(modelPath) {
    // Simulate loading steps with a loop (for demonstration purposes)
    for (let i = 0; i <= 100; i++) {
      await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay (e.g., model loading)
      progressBar.value = i; // Update progress bar value
    }
    return {}; // Simulate returning a loaded model
  }
  async function loadModelWithProgress(modelPath) {
    const response = await fetch(modelPath);
    const total = parseInt(response.headers.get('Content-Length'), 10);
    
    const reader = response.body.getReader();
    let loaded = 0;
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
  
      loaded += value.length;
      const progress = (loaded / total) * 100;
      progressBar.value = progress; // Update progress bar
  
      await new Promise(resolve => setTimeout(resolve, 50)); // Simulate some delay
    }
  
    // After loading, you can return the model
    return {}; // Replace with actual model loading process
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

      // Pegar o texto selecionado da aba ativa
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

      // Adicionar prompt customizado baseado no estilo selecionado
      let stylePrefix = '';
      switch (styleSelect.value) {
        case 'academic':
          stylePrefix = 'Resuma o seguinte texto de forma acadêmica, clara e objetiva, com precisão e formalidade:';
          break;
        case 'business':
          stylePrefix = 'Resuma o seguinte texto com foco nos principais pontos de negócios e resultados:';
          break;
        case 'technical':
          stylePrefix = 'Resuma o seguinte texto com ênfase nos detalhes técnicos e informações funcionais:';
          break;
        case 'creative':
          stylePrefix = 'Resuma o seguinte texto de forma criativa, com uma linguagem fluida e emocional:';
          break;
        default:
          stylePrefix = 'Resuma o seguinte texto de maneira geral:';
      }

      const finalText = `${stylePrefix}\n\n${text}`;

      // Definir parâmetros de comprimento com base na seleção
      const maxLength = lengthSelect.value === 'short' ? 130 :
        lengthSelect.value === 'medium' ? 250 : 450;
      const minLength = lengthSelect.value === 'short' ? 30 :
        lengthSelect.value === 'medium' ? 100 : 200;

      // Gerar o resumo usando o modelo
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
