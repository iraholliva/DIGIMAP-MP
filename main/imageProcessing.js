function imhist(image) {
  console.log(image);
  let hist = new Array(256).fill(0);
  for (let i = 0; i < image.length; i++) {
      hist[image[i]]++;
  }
  return hist;
}

export function imWTHeq(imageData, Wout_list = new Array(10).fill(0), r = 0.5, v = 0.5) {
  console.log(imageData); //debug

  const pixels = imageData;
  const numPixels = pixels.length / 4; // RGBA channels
  
  // Compute the histogram
  let hist = new Array(256).fill(0);
  for (let i = 0; i < numPixels; i++) {
    const intensity = pixels[i * 4]; // Assuming RGBA format, get the intensity value
    hist[intensity]++;
  }

  // Normalize the histogram to get PMF
  let PMF = hist.map(val => val / numPixels);

  // Calculate Pl and Pu
  let Pl = 1e-4;
  let Pu = v * Math.max(...PMF);

  // Compute the weighted thresholded PMF (Pwt)
  let Pwt = PMF.map(pmf => {
    if (pmf < Pl) {
      return 0;
    } else if (pmf > Pu) {
      return Pu;
    } else {
      return Math.pow((pmf - Pl) / (Pu - Pl), r) * Pu;
    }
  });

  // Compute the cumulative distribution function (Cwt)
  let Cwt = [];
  let sum = 0;
  for (let i = 0; i < Pwt.length; i++) {
    sum += Pwt[i];
    Cwt.push(sum);
  }

  // Normalize Cwt to get Cwtn
  let Cwtn = Cwt.map(val => val / Cwt[Cwt.length - 1]);

  // Calculate Win
  let Win = PMF.filter(val => val > 0).length;

  // Calculate Wout
  let Gmax = 1.5;
  let Wout = Math.min(255, Gmax * Win);
  if (Wout_list.every(val => val > 0)) {
    Wout = (Wout_list.reduce((acc, curr) => acc + curr, 0) + Wout) / (1 + Wout_list.length);
  }

  // Apply WTHE method to each pixel 
  let Ftilde = [];
  for (let i = 0; i < numPixels; i++) {
    const intensity = 0.2126 * pixels[i * 4] + 0.7152 * pixels[i * 4 + 1] + 0.0722 * pixels[i * 4 + 2]; // Luminance formula ????? eto yung galing sa chatgpt wala naman kwents
    Ftilde.push(Wout * Cwtn[Math.round(intensity)]); // Use intensity to index Cwtn
  }

  // Adjust pixel values by the mean adjustment
  let Madj = pixels.reduce((acc, curr) => acc + curr) / pixels.length - Ftilde.reduce((acc, curr) => acc + curr) / Ftilde.length;
  Ftilde = Ftilde.map(val => val + Madj);

  // Clamp pixel values to the range [0, 255] and round them
  Ftilde = Ftilde.map(val => Math.max(0, Math.min(255, val)));
  Ftilde = Ftilde.map(val => Math.round(val));
  
  // Construct the processed image data array
  let flatProcessedData = [];
  for (let i = 0; i < numPixels; i++) {
    flatProcessedData.push(Ftilde[i]); //red
    flatProcessedData.push(Ftilde[i]); //green
    flatProcessedData.push(Ftilde[i]); //blue
    flatProcessedData.push(255); // Set alpha channel to 255 (fully opaque)
  }


  return [flatProcessedData, Wout];
}
