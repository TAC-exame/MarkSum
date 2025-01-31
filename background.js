async function loadModel(modelPath) {
    try {
      const { pipeline } = await import('@xenova/transformers');  // Import transformers
  
      // Load the model from the local directory in the extension
      const transformer = await pipeline('summarization', modelPath);
  
      return { success: true, transformer };
    } catch (error) {
      console.error('Error loading model:', error);
      return { success: false, error: error.message };
    }
  }