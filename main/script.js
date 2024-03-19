document.getElementById('image-input').addEventListener('change', function (e) {
  let file = e.target.files[0];
  let reader = new FileReader();

  reader.onloadend = function () {
    let imageDataUrl = reader.result;

    // Create an img element and set its src to the image data
    let img = new Image();
    img.src = imageDataUrl;

    img.onload = function () {
      // Create a canvas and draw the image to it
      let canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Get the ImageData from the canvas
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Dump all image enhancement functions here
      let equalizedImageData = histogramEqualization(imageData);
      let gammaCorrectedImageData = applyGammaCorrection(
        equalizedImageData,
        2.2
      );

      // draw the equalizedImageData back to the canvas
      ctx.putImageData(gammaCorrectedImageData, 0, 0);

      // Convert the canvas to a data URL
      let processedImageUrl = canvas.toDataURL();

      // Create a new img element and set its src to the processed image data
      let processedImg = document.createElement('img');
      processedImg.src = processedImageUrl;
      processedImg.style.width = img.width;
      processedImg.style.height = img.height;

      // append the processedImg to image-input-container
      let container = document.querySelector('.upload-box');
      container.innerHTML = '';
      container.appendChild(processedImg);
    };
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

function histogramEqualization(imageData) {
  const pixels = imageData.data;
  const numPixels = pixels.length / 4; // RGBA channels

  for (let channel = 0; channel < 3; channel++) {
    // Compute histogram
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < numPixels; i++) {
      const intensity = pixels[i * 4 + channel];
      histogram[intensity]++;
    }

    // Compute cumulative distribution function (CDF)
    const cdf = [];
    let sum = 0;
    for (let i = 0; i < 256; i++) {
      sum += histogram[i];
      cdf.push(sum);
    }

    // Normalize CDF
    const minCdf = cdf.find((val) => val > 0);
    const maxCdf = cdf[cdf.length - 1];
    const scale = 255 / (maxCdf - minCdf);

    // Apply equalization
    for (let i = 0; i < numPixels; i++) {
      const intensity = pixels[i * 4 + channel];
      const equalizedIntensity = Math.round((cdf[intensity] - minCdf) * scale);
      pixels[i * 4 + channel] = equalizedIntensity;
    }
  }

  return imageData;
}

function applyGammaCorrection(imageData, gamma) {
  const pixels = imageData.data;
  const numPixels = pixels.length / 4; // RGBA channels

  // Apply gamma correction
  for (let i = 0; i < numPixels; i++) {
    for (let channel = 0; channel < 3; channel++) {
      const intensity = pixels[i * 4 + channel];
      const correctedIntensity = Math.pow(intensity / 255, gamma) * 255;
      pixels[i * 4 + channel] = correctedIntensity;
    }
  }

  return imageData;
}
