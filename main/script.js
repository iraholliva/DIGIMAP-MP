import {
  histogramEqualization,
  applyGammaCorrection,
  colorCorrection // Import the colorCorrection function
} from './imageProcessing.js';

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

      // Apply image enhancement functions
      let equalizedImageData = histogramEqualization(imageData);
      let gammaCorrectedImageData = applyGammaCorrection(equalizedImageData, 2.2);
      
      // Color Correction
      let redScale = 1.1; // Adjust the red scale factor as needed
      let greenScale = 1.0; // Adjust the green scale factor as needed
      let blueScale = 0.9; // Adjust the blue scale factor as needed
      let colorCorrectedImageData = colorCorrection(gammaCorrectedImageData, redScale, greenScale, blueScale);

      // Turn processed data back into image
      ctx.putImageData(colorCorrectedImageData, 0, 0);
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
