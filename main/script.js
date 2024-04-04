import { colorCorrection, histogramEqualization } from './imageProcessing.js';

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

      // Compute sigma based on the noise standard deviation
      const sigma = computeSigma(imageData);

      // Apply histogram equalization with Gaussian filter
      let equalizedImageData = histogramEqualization(imageData, sigma);

      // Apply color correction
      let redScale = 1.0;
      let greenScale = 1.0;
      let blueScale = 1.0;
      let colorCorrectedImageData = colorCorrection(equalizedImageData, redScale, greenScale, blueScale);

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

// Function to compute sigma based on the noise standard deviation
function computeSigma(imageData) {
// @TODO !!!!!!!!!!!!!!!!!!!
  const noiseStdDev = computeNoiseStdDev(imageData);

  // Adjust scaleFactor as needed
  const scaleFactor = 1; // Adjust this value based on experimentation
  return noiseStdDev * scaleFactor;
}

// Function to compute the noise standard deviation 
function computeNoiseStdDev(imageData) {
  
  return 0.5; //REPLACE WITH ACTUAL COMPUTATION
}
