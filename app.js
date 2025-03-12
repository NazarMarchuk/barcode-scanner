let selectedDeviceId;
const codeReader = new ZXing.BrowserBarcodeReader();
const resultElement = document.getElementById('result');
const videoElement = document.getElementById('video');

async function startScanner() {
  try {
    const devices = await codeReader.getVideoInputDevices();
    selectedDeviceId = devices[0].deviceId; // Select the first available camera

    codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video').then((result) => {
      console.log(result);
      resultElement.textContent = 'Barcode: ' + result.text;
      codeReader.reset(); // Reset scanner after one scan
    }).catch((err) => {
      console.error(err);
      resultElement.textContent = 'Error scanning: ' + err;
    });
  } catch (error) {
    console.error(error);
    resultElement.textContent = 'Camera access denied or no camera found';
  }
}

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker Registered'))
    .catch((err) => console.error('Service Worker Error:', err));
}
