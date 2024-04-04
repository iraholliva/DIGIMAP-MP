// Add your image processing code here

// BS functions, just stuff i got from google
export function histogramEqualization(imageData, sigma) {
  // Apply Gaussian Low Pass Filter
  imageData = applyGaussianLowPass(imageData, sigma);

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

// Gaussian Low Pass Filter
function applyGaussianLowPass(imageData, sigma) {
  const pixels = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const newData = new Uint8ClampedArray(pixels.length);

  const kernelSize = Math.ceil(sigma * 3) * 2 + 1;
  const halfKernel = Math.floor(kernelSize / 2);
  const kernel = new Array(kernelSize).fill(0).map(() => new Array(kernelSize).fill(0));

  // Generate Gaussian kernel
  let sum = 0;
  for (let x = -halfKernel; x <= halfKernel; x++) {
    for (let y = -halfKernel; y <= halfKernel; y++) {
      const exponent = -(x * x + y * y) / (2 * sigma * sigma);
      const weight = Math.exp(exponent) / (2 * Math.PI * sigma * sigma);
      kernel[x + halfKernel][y + halfKernel] = weight;
      sum += weight;
    }
  }

  // Normalize kernel
  for (let i = 0; i < kernelSize; i++) {
    for (let j = 0; j < kernelSize; j++) {
      kernel[i][j] /= sum;
    }
  }

  // Convolution
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let i = -halfKernel; i <= halfKernel; i++) {
        for (let j = -halfKernel; j <= halfKernel; j++) {
          const pixelX = Math.min(Math.max(x + i, 0), width - 1);
          const pixelY = Math.min(Math.max(y + j, 0), height - 1);
          const index = (pixelY * width + pixelX) * 4;
          const weight = kernel[i + halfKernel][j + halfKernel];
          r += pixels[index] * weight;
          g += pixels[index + 1] * weight;
          b += pixels[index + 2] * weight;
          a += pixels[index + 3] * weight;
        }
      }
      const index = (y * width + x) * 4;
      newData[index] = r;
      newData[index + 1] = g;
      newData[index + 2] = b;
      newData[index + 3] = a;
    }
  }

  // Update image data
  for (let i = 0; i < pixels.length; i++) {
    pixels[i] = newData[i];
  }

  return imageData;
}


// Color Correction
export function colorCorrection(imageData, redScale, greenScale, blueScale) {
  const pixels = imageData.data;
  const numPixels = pixels.length / 4; // RGBA channels

  // Apply color correction
  for (let i = 0; i < numPixels; i++) {
      pixels[i * 4] *= redScale; // Red channel
      pixels[i * 4 + 1] *= greenScale; // Green channel
      pixels[i * 4 + 2] *= blueScale; // Blue channel
  }

  return imageData;
}

