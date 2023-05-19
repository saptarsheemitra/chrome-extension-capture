chrome.commands.onCommand.addListener((command) => {
    if (command === 'capture_element') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.executeScript(tabs[0].id, { file: 'content.js' }, () => {;
            chrome.tabs.sendMessage(tabs[0].id, { action: 'capture_element' });
          });
      });
    }
  });
  
  