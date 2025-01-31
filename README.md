# MarkSum: On-Device AI Summarizer Chrome Extension

## 1. Identificação do Projeto
- **Título do Projeto:** MarkSum - On-Device AI Summarizer Chrome Extension  
- **Nome do Aluno:** [João Sá]  
- **Data de Entrega:** [31/01/2025]  

## 2. Objetivos e Contexto
O objetivo deste projeto é desenvolver uma extensão para o navegador Chrome que permita resumir conteúdo de páginas da web diretamente no dispositivo, sem depender de serviços na nuvem. Utilizando um modelo de IA local, a extensão converte páginas ou trechos selecionados em Markdown e gera sumários personalizados de forma rápida e eficiente.

Esta solução se destaca pela privacidade, uma vez que todo o processamento ocorre localmente, e pela flexibilidade, permitindo a customização de prompts para diferentes estilos de sumário.

## 3. Atividades Desenvolvidas
- **Tecnologias e Ferramentas Utilizadas:**  
  - Desenvolvimento de extensão Chrome utilizando Content Scripts e Background Scripts.  
  - Implementação de um modelo de IA local para geração de sumários via web-llm.  
  - Conversão de HTML para Markdown para preservação da estrutura do texto.  
  - Interface interativa para seleção de texto e geração de sumários.  
  - Armazenamento local de configurações e prompts do usuário.  

- **Descrição Sintética das Tarefas:**  
  - Configuração do ambiente e estrutura base da extensão.  
  - Implementação da conversão de HTML para Markdown.  
  - Integração do modelo de IA para sumarização.  
  - Desenvolvimento da interface de configuração de prompts.  
  - Testes e otimizações para garantir desempenho adequado.  

## 4. Organização e Metodologia de Trabalho
O trabalho foi realizado de forma individual, seguindo um cronograma estruturado de desenvolvimento. Para gestão das atividades, foram utilizadas ferramentas como Trello para acompanhamento de tarefas e GitHub para versionamento do código.

O processo foi iterativo, envolvendo testes constantes para validação das funcionalidades implementadas. A documentação e estruturação do código foram priorizadas para garantir manutenção futura.

## 5. Principais Dificuldades e Aprendizagens
- **Dificuldades Encontradas:**  
  - Ajuste de desempenho do modelo de IA local.  
  - Conversão eficiente de HTML para Markdown mantendo a estrutura do conteúdo.  
  - Integração do modelo de sumarização com a interface da extensão.  

- **Aprendizagens:**  
  - Desenvolvimento de extensões para Chrome e manipulação do DOM.  
  - Integração de modelos de IA em aplicações web locais.  
  - Melhores práticas de armazenamento e configuração de extensões de navegador.  

## 6. Conclusão e Próximos Passos
Atualmente, a extensão está funcional e permite resumir textos selecionados diretamente no navegador, sem a necessidade de conexão com serviços externos.

Possíveis melhorias incluem:
- Implementação de novos estilos de sumário e modelos de IA alternativos.
- Otimização do carregamento do modelo para reduzir latência.
- Expansão para outros navegadores além do Chrome.

## 7. Referências (Opcional)
- Documentação oficial do web-llm: [https://web-llm.org](https://web-llm.org)  
- Guia de desenvolvimento de extensões para Chrome: [https://developer.chrome.com/docs/extensions](https://developer.chrome.com/docs/extensions)
