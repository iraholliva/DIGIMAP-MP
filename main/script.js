import { imWTHeq } from './imageProcessing.js';

document.getElementById('image-input').addEventListener('change', (e) => {
  let file = e.target.files[0];
  let reader = new FileReader();
  let container = document.querySelector('.upload-box');

  setUpPageProcessingView();

  reader.onloadend = function () {
    let imageDataUrl = reader.result;
    let img = new Image();
    img.src = imageDataUrl;

    img.onload = function () {
      // Make img into canvas so we can work with it
      let canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Apply WTHE method
      let [processedImageData, Wout] = imWTHeq(imageData.data);

      // Flatten the processed image data
      let flatProcessedData = processedImageData.flat();

      // Create ImageData from the flattened data
      let processedImageDataObject = new ImageData(new Uint8ClampedArray(flatProcessedData), canvas.width, canvas.height);

      // Clear canvas and put the processed image data
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(processedImageDataObject, 0, 0);

      // Convert canvas to image
      let processedImageUrl = canvas.toDataURL();
      let processedImg = document.createElement('img');
      processedImg.src = processedImageUrl;

      // Place image into upload-box and update page
      container.innerHTML = '';
      container.appendChild(processedImg);
      setUpPageFinishedView();
    };
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});





document.getElementById('saveButton').addEventListener('click', () => {
  let processedImg = document.querySelector('.upload-box img');
  let link = document.createElement('a');

  link.href = processedImg.src;
  link.download = 'processed-image.png';
  link.click();
});

document.getElementById('reload-button').addEventListener('click', () => {
  location.reload();
});

function setUpPageProcessingView() {
  document.querySelector('.title').innerHTML = 'PROCESSING YOUR IMAGE';
  document.querySelector('.input-wrapper').style.display = 'none';
  document.getElementById('loader').style.display = 'block';
}

function setUpPageFinishedView() {
  document.querySelector('.title').innerHTML = 'DEVHANCED!';
  document.querySelector('.choices').style.display = 'block';
}