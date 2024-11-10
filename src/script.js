const textarea = document.querySelector('.text-input');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const spaceToggle = document.getElementById('spaceToggle');

function calculateReadingTime(text) {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Base reading speed: 200 words per minute
  let readingSpeed = 200;
  
  // Adjust reading speed based on text complexity
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / wordCount;
  const punctuationCount = (text.match(/[.,!?;:]/g) || []).length;
  const punctuationDensity = punctuationCount / wordCount;
  
  // Reduce speed for complex text (longer words and more punctuation)
  if (avgWordLength > 6) readingSpeed *= 0.9;
  if (punctuationDensity > 0.15) readingSpeed *= 0.95;
  
  // Calculate minutes and round up to nearest 0.5
  const minutes = wordCount / readingSpeed;
  const roundedMinutes = Math.ceil(minutes * 2) / 2;
  
  return roundedMinutes <= 0.5 ? '< 1 min' : 
         roundedMinutes === 1 ? '1 min' :
         `${roundedMinutes} min`;
}

function updateStats() {
  const text = textarea.value;
  
  // Contagem de caracteres
  document.getElementById('charCount').textContent = text.length;
  document.getElementById('charNoSpaceCount').textContent = text.replace(/\s/g, '').length;
  
  // Contagem de palavras
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  document.getElementById('wordCount').textContent = words.length;
  
  // Contagem de parágrafos
  const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0);
  document.getElementById('paragraphCount').textContent = paragraphs.length;
  
  // Contagem de espaços
  const whiteSpaces = (text.match(/\s/g) || []).length;
  document.getElementById('whiteSpaceCount').textContent = whiteSpaces;
  
  // Contagem de pontuação
  const punctuation = (text.match(/[.,!?;:]/g) || []).length;
  document.getElementById('punctuationCount').textContent = punctuation;
  
  // Tempo de leitura aprimorado
  document.getElementById('readTime').textContent = calculateReadingTime(text);
}

textarea.addEventListener('input', updateStats);

clearBtn.addEventListener('click', () => {
  textarea.value = '';
  updateStats();
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(textarea.value);
    copyBtn.style.background = 'var(--success)';
    setTimeout(() => copyBtn.style.background = 'var(--accent)', 1000);
  } catch (err) {
    console.error('Failed to copy text:', err);
  }
});

spaceToggle.addEventListener('change', updateStats);

// Inicialização
updateStats();
