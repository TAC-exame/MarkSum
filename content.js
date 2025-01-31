(function() {
    // Função de conversão para Markdown
    function convertToMarkdown(html) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
  
      function convertElement(element) {
        if (!element) return '';
  
        switch(element.nodeType) {
          case Node.TEXT_NODE:
            return element.textContent.replace(/\n/g, ' ').trim();
          
          case Node.ELEMENT_NODE:
            switch(element.tagName.toLowerCase()) {
              case 'h1': return `# ${element.textContent}\n\n`;
              case 'h2': return `## ${element.textContent}\n\n`;
              case 'h3': return `### ${element.textContent}\n\n`;
              case 'p': return `${element.textContent}\n\n`;
              case 'strong': return `**${element.textContent}**`;
              case 'em': return `*${element.textContent}*`;
              case 'a': return `[${element.textContent}](${element.href})`;
              case 'ul': 
                return Array.from(element.children)
                  .map(li => `- ${li.textContent}\n`)
                  .join('') + '\n';
              case 'ol':
                return Array.from(element.children)
                  .map((li, index) => `${index + 1}. ${li.textContent}\n`)
                  .join('') + '\n';
              default: 
                return Array.from(element.childNodes)
                  .map(convertElement)
                  .join('');
            }
        }
        return '';
      }
  
      return convertElement(tempDiv).trim();
    }
  
    // Listener de mensagens
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'convertToMarkdown') {
        try {
          // Obtém a seleção atual
          const selection = window.getSelection();
          if (!selection.rangeCount) {
            throw new Error('Nenhum texto selecionado');
          }
  
          // Cria um container com o conteúdo selecionado
          const range = selection.getRangeAt(0);
          const container = document.createElement('div');
          container.appendChild(range.cloneContents());
  
          // Converte para Markdown
          const markdown = convertToMarkdown(container.innerHTML);
  
          // Responde com o Markdown
          sendResponse({ 
            markdown: markdown,
            text: container.textContent 
          });
        } catch (error) {
          sendResponse({ 
            error: error.message 
          });
        }
        return true;
      }
    });
  })();