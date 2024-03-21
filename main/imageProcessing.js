// Add your image processing code here

// BS functions, just stuff i got from google
export function histogramEqualization(imageData) {
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

// BS funcitons, just stuff i got from google
export function applyGammaCorrection(imageData, gamma) {
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

