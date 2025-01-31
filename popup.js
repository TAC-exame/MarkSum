document.addEventListener('DOMContentLoaded', () => {
    const convertBtn = document.getElementById('convertBtn');
    const copyBtn = document.getElementById('copyBtn');
    const previewDiv = document.getElementById('preview');
  
    convertBtn.addEventListener('click', () => {
      // Consulta a aba ativa atual
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        // Envia mensagem para converter seleção
        chrome.tabs.sendMessage(tabs[0].id, {action: 'convertToMarkdown'}, (response) => {
          if (response && response.markdown) {
            // Atualiza preview
            previewDiv.textContent = response.markdown;
            
            // Habilita botão de cópia
            copyBtn.disabled = false;
          } else if (response && response.error) {
            // Exibe erro
            previewDiv.textContent = `Erro: ${response.error}`;
            copyBtn.disabled = true;
          }
        });
      });
    });
  
    copyBtn.addEventListener('click', () => {
      if (previewDiv.textContent) {
        navigator.clipboard.writeText(previewDiv.textContent).then(() => {
          alert('Markdown copiado!');
        }).catch(err => {
          alert(`Erro ao copiar: ${err}`);
        });
      }
    });
  });