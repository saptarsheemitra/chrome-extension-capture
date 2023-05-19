chrome.commands.onCommand.addListener((command) => {
    if (command === 'capture_element') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.debugger.attach({ tabId: tabs[0].id }, '1.0', () => {
          chrome.tabs.executeScript(tabs[0].id, { file: 'content.js' }, () => {
            chrome.debugger.detach({ tabId: tabs[0].id });
            chrome.tabs.sendMessage(tabs[0].id, { action: 'capture_element' });
          });
        });
      });
    }
  });
  
  