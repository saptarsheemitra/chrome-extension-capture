function createCaptureElement(capture) {
    const captureElement = document.createElement('div');
    captureElement.classList.add('capture');
  
    const contentElement = document.createElement('p');
    contentElement.textContent = capture.content;
    captureElement.appendChild(contentElement);
  
    const metadataElement = document.createElement('div');
    metadataElement.classList.add('metadata');
  
    const timestampElement = document.createElement('span');
    timestampElement.textContent = `Captured at: ${capture.timestamp}`;
    metadataElement.appendChild(timestampElement);
  
    const sourceUrlElement = document.createElement('a');
    sourceUrlElement.href = capture.sourceUrl;
    sourceUrlElement.textContent = 'Source URL';
    sourceUrlElement.target = '_blank';
    metadataElement.appendChild(sourceUrlElement);
  
    captureElement.appendChild(metadataElement);
  
    return captureElement;
  }
  
  function displayCaptures(captures) {
    const capturesContainer = document.getElementById('captures-container');
    capturesContainer.innerHTML = '';
  
    captures.forEach((capture) => {
      const captureElement = createCaptureElement(capture);
      capturesContainer.appendChild(captureElement);
    });
  }
  
  function toggleCaptures() {
    const toggleButton = document.getElementById('toggle-button');
    const currentUrl = toggleButton.dataset.currentUrl;
  
    chrome.storage.local.get('captures', (result) => {
      const captures = result.captures || [];
  
      if (currentUrl) {
        const filteredCaptures = captures.filter((capture) => capture.sourceUrl === currentUrl);
        displayCaptures(filteredCaptures);
        toggleButton.textContent = 'Show All Captures';
        toggleButton.dataset.currentUrl = '';
      } else {
        displayCaptures(captures);
        toggleButton.textContent = 'Show Captures for Current Site';
        toggleButton.dataset.currentUrl = tabs[0].url;
      }
      

    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-button');
    toggleButton.addEventListener('click', toggleCaptures);
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0].url;
      toggleButton.dataset.currentUrl = currentUrl;
  
      chrome.storage.local.get('captures', (result) => {
        const captures = result.captures || [];
        const filteredCaptures = captures.filter((capture) => capture.sourceUrl === currentUrl);
        displayCaptures(captures);
      });
    });
  });
  

