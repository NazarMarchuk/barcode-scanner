const codeReader = new ZXing.BrowserMultiFormatContinuousReader();
const resultElement = document.getElementById('result');
const videoElement = document.getElementById('video');

async function startScanner() {
  try {
    const devices = await ZXing.BrowserCodeReader.listVideoInputDevices();
    const selectedDeviceId = devices.length > 1 ? devices[1].deviceId : devices[0].deviceId;

    console.log('Using camera: ', selectedDeviceId);

    codeReader.decodeFromVideoDevice(selectedDeviceId, videoElement, (result, err) => {
      if (result) {
        console.log('Detected:', result.text);
        resultElement.textContent = 'Detected: ' + result.text;

        // Optionally stop scanning after first detection:
        codeReader.reset();
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

// Auto start scanner on page load
window.onload = startScanner;

// Register service worker for offline/PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker Registered'))
    .catch((err) => console.error('Service Worker Error:', err));
}
