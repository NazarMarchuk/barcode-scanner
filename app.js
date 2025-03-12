const codeReader = new ZXing.BrowserMultiFormatReader(); // Proper reader
const videoElement = document.getElementById('video');
const resultElement = document.getElementById('result');
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');

let selectedDeviceId = null;
let scanning = false;

async function getCameraDevices() {
  try {
    const devices = await ZXing.BrowserCodeReader.listVideoInputDevices();
    console.log('Available Devices:', devices);

    // Pick first available camera (you can implement a selector if needed)
    if (devices.length > 0) {
      selectedDeviceId = devices[0].deviceId;
    } else {
      resultElement.textContent = 'No camera devices found.';
    }
  } catch (error) {
    console.error('Error fetching devices:', error);
    resultElement.textContent = 'Error fetching camera devices.';
  }
}

async function startScanner() {
  if (!selectedDeviceId) {
    await getCameraDevices(); // Fetch device if not selected yet
    if (!selectedDeviceId) return; // Exit if still no device found
  }

  try {
    resultElement.textContent = 'Scanning...';
    videoElement.style.display = 'block';
    startButton.style.display = 'none';
    stopButton.style.display = 'inline-block';
    scanning = true;

    // Start scanning
    codeReader.decodeFromVideoDevice(selectedDeviceId, videoElement, (result, err) => {
      if (result) {
        console.log('Detected:', result.text);
        resultElement.textContent = 'Detected: ' + result.text;
        stopScanner(); // Stop scanner after successful read (optional)
      }
      if (err && !(err instanceof ZXing.NotFoundException)) {
        console.error('Scan error:', err);
        resultElement.textContent = 'Scan error: ' + err;
      }
    });
  } catch (error) {
    console.error('Camera error:', error);
    resultElement.textContent = 'Camera access error: ' + error;
  }
}

function stopScanner() {
  if (scanning) {
    codeReader.reset(); // Properly release camera
    videoElement.style.display = 'none';
    startButton.style.display = 'inline-block';
    stopButton.style.display = 'none';
    resultElement.textContent = 'Scanning stopped. Press button to scan again.';
    scanning = false;
  }
}

// Attach button events
startButton.addEventListener('click', startScanner);
stopButton.addEventListener('click', stopScanner);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker Registered'))
    .catch((err) => console.error('Service Worker Error:', err));
}

// Preload devices on load (optional, so ready to scan quickly)
window.addEventListener('load', getCameraDevices);
