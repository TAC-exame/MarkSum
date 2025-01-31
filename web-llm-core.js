(function() {
    function loadScript(url) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
  
    async function initWebLLM() {
      try {
        // Carrega o script do WebLLM
        await loadScript('https://esm.run/@mlc-ai/web-llm/dist/web-llm.js');
        
        // Verifica se foi carregado corretamente
        if (typeof webllm === 'undefined') {
          throw new Error('WebLLM não carregado');
        }
  
        console.log('WebLLM carregado com sucesso');
      } catch (error) {
        console.error('Erro ao carregar WebLLM:', error);
      }
    }
  
    // Inicializa ao carregar
    initWebLLM();
  })();