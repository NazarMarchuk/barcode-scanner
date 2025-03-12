const codeReader = new ZXing.BrowserMultiFormatContinuousReader();
const resultElement = document.getElementById('result');
const videoElement = document.getElementById('video');
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');

let isScanning = false;

async function startScanner() {
  if (isScanning) return; // Prevent double start

  try {
    const devices = await ZXing.BrowserCodeReader.listVideoInputDevices();
    const selectedDeviceId = devices.length > 1 ? devices[1].deviceId : devices[0].deviceId;

    console.log('Using camera:', selectedDeviceId);

    videoElement.style.display = 'block';
    startButton.style.display = 'none';
    stopButton.style.display = 'inline-block';
    resultElement.textContent = 'Scanning...';

    isScanning = true;

    codeReader.decodeFromVideoDevice(selectedDeviceId, videoElement, (result, err) => {
      if (result) {
        console.log('Detected:', result.text);
        resultElement.textContent = 'Detected: ' + result.text;
        // Optional: stop scanning after first successful read
        stopScanner();
      } else if (err && !(err instanceof ZXing.NotFoundException)) {
        console.error(err);
        resultElement.textContent = 'Scanning error: ' + err;
      }
    });

  } catch (error) {
    console.error('Camera error:', error);
    resultElement.textContent = 'Camera access error: ' + error;
  }
}

function stopScanner() {
  if (!isScanning) return;

  codeReader.reset(); // Stop scanning and release camera
  isScanning = false;

  videoElement.style.display = 'none';
  startButton.style.display = 'inline-block';
  stopButton.style.display = 'none';
  resultElement.textContent = 'Scanning stopped. Press the button to start again.';
}

// Attach event listeners
startButton.addEventListener('click', startScanner);
stopButton.addEventListener('click', stopScanner);

// Register service worker for offline/PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker Registered'))
    .catch((err) => console.error('Service Worker Error:', err));
}
