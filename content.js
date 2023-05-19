let hoveredElement = null;

function captureElement() {
  if (hoveredElement) {
    const content = hoveredElement.textContent;
    const elementId = hoveredElement.id;
    const sourceUrl = window.location.href;
    const timestamp = new Date().toISOString();

    const capture = {
      content,
      elementId,
      sourceUrl,
      timestamp,
    };

    chrome.storage.local.get('captures', (result) => {
      const captures = result.captures || [];
      captures.push(capture);
      chrome.storage.local.set({ captures }, () => {
        console.log('Content has been saved:', capture);
        alert('Content has been saved.');
        // alert(capture.elementId)
      });
    });
  }
}

function handleMouseOver(event) {
  if (hoveredElement) {
    hoveredElement.style.outline = '';
  }

  hoveredElement = event.target;
  hoveredElement.style.outline = '2px solid red';
}

function handleMouseOut(event) {
  if (hoveredElement) {
    hoveredElement.style.outline = '';
  }
  hoveredElement = null;
}

document.addEventListener('mouseover', handleMouseOver);
document.addEventListener('mouseout', handleMouseOut);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'capture_element') {
    console.log('Capturing element:', hoveredElement);
    captureElement();
  }
});
