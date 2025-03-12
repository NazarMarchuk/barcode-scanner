const codeReader = new ZXing.BrowserMultiFormatReader(); // Use default camera directly
const videoElement = document.getElementById('video');
const resultElement = document.getElementById('result');
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');

let scanning = false;

async function startScanner() {
  if (scanning) return; // Prevent double start

  try {
    resultElement.textContent = 'Scanning...';
    videoElement.style.display = 'block';
    startButton.style.display = 'none';
    stopButton.style.display = 'inline-block';
    scanning = true;

    // **Directly start scanning from default camera (no need to enumerate)**
    await codeReader.decodeFromVideoDevice(null, videoElement, (result, err) => {
      if (result) {
        console.log('Detected:', result.text);
        resultElement.textContent = 'Detected: ' + result.text;
        stopScanner(); // Optional: Stop after first detection
      }
      if (err && !(err instanceof ZXing.NotFoundException)) {
        console.error('Scan error:', err);
        resultElement.textContent = 'Scan error: ' + err;
      }
    });
  } catch (error) {
    console.error('Camera access error:', error);
    resultElement.textContent = 'Camera access error: ' + error;
  }
}

function stopScanner() {
  if (scanning) {
    codeReader.reset(); // Properly stop scanning
    videoElement.style.display = 'none';
    startButton.style.display = 'inline-block';
    stopButton.style.display = 'none';
    resultElement.textContent = 'Scanning stopped. Press button to scan again.';
    scanning = false;
  }
}

// Button event listeners
startButton.addEventListener('click', startScanner);
stopButton.addEventListener('click', stopScanner);

// Register service worker (optional but recommended for PWA)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker Registered'))
    .catch((err) => console.error('Service Worker Error:', err));
}
