function createCaptureElement(capture) {
  const captureElement = document.createElement("div");
  captureElement.classList.add("capture");

  const contentElement = document.createElement("p");
  contentElement.textContent = capture.content;
  captureElement.appendChild(contentElement);
  captureElement.dataset.id = capture.id;
  captureElement.dataset.sourceUrl = capture.sourceUrl;

  const metadataElement = document.createElement("div");
  metadataElement.classList.add("metadata");

  const timestampElement = document.createElement("span");
  timestampElement.textContent = `Captured at: ${capture.timestamp}`;
  metadataElement.appendChild(timestampElement);

  const sourceUrlElement = document.createElement("a");
  sourceUrlElement.href = capture.sourceUrl;
  sourceUrlElement.textContent = "Source URL";
  sourceUrlElement.target = "_blank";
  metadataElement.appendChild(sourceUrlElement);

  captureElement.appendChild(metadataElement);

  const inputElement = document.createElement("div");
  inputElement.classList.add("actions");
  inputElement.innerHTML = `
        <input type="text" id="custom-prompt" placeholder="Enter your prompt + above text">
          <button class="generate-button">Generate</button>
      `;
  captureElement.appendChild(inputElement);

  // const outputElement = document.createElement('div');
  // outputElement.dataset.id = "output";
  // captureElement.appendChild(outputElement);

  captureElement
    .querySelector(".generate-button")
    .addEventListener("click", () => {
      generateText(capture.content);
    });
  return captureElement;
}

function displayCaptures(captures) {
  const capturesContainer = document.getElementById("captures-container");
  capturesContainer.innerHTML = "";
  if (captures == []) {
    const emptyElement = document.createElement("div");
    emptyElement.classList.add("actions");
    emptyElement.innerHTML = `
       <h2> No captures found! </h2>
      `;
    capturesContainer.appendChild(emptyElement);
  } else {
    captures.forEach((capture) => {
      const captureElement = createCaptureElement(capture);
      capturesContainer.appendChild(captureElement);
    });
  }
}

function toggleCaptures() {
  const toggleButton = document.getElementById("toggle-button");
  const currentUrl = toggleButton.dataset.currentUrl;

  chrome.storage.local.get("captures", (result) => {
    const captures = result.captures || [];

    if (currentUrl) {
      const filteredCaptures = captures.filter(
        (capture) => capture.sourceUrl === currentUrl
      );
      displayCaptures(filteredCaptures);
      toggleButton.textContent = "Show All Captures";
      toggleButton.dataset.currentUrl = "";
    } else {
      displayCaptures(captures);
      toggleButton.textContent = "Show Current Site Captures";
      toggleButton.dataset.currentUrl = tabs[0].url;
    }
  });
}

function generateText(content) {
  const inputElement = document.getElementById("custom-prompt");
  const text = inputElement.value;
  const selectedCapture = text + "\n \n" + content;
  if (selectedCapture) {
    // alert(selectedCapture);
    const prompt = selectedCapture;
    const apiKey = ""; //OpenAI api key
    const apiUrl = "https://api.openai.com/v1/completions";
    console.log("Sending request to OpenAI...");
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 7,
        temperature: 0,
        top_p: 1,
        n: 1,
        stream: false,
        logprobs: null,
        stop: "\n",
      }),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })

      .then((data) => {
        console.log(data);
        // console.log("Data:", data.choices[0].text);
        const result = data.choices[0].text.trim();
        console.log(result);
        if (result == "") {
          alert(
            "Seems like OpenAI is not responding..\nPlease try again after sometime!"
          );
        } else {
          alert(`ChatGPT result: \n${result} \n \nResult has been saved`);

          chrome.storage.local.set({ result }, () => {
            console.log("Result has been saved:", result);
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggle-button");
  toggleButton.addEventListener("click", toggleCaptures);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0].url;
    toggleButton.dataset.currentUrl = currentUrl;

    chrome.storage.local.get("captures", (result) => {
      const captures = result.captures || [];
      displayCaptures(captures);
    });
  });
});
