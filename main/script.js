import { computeALSM, performMSD } from './ALSM_MSD.js';

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

            // Compute Atmospheric Light and Transmittance using ALSM
            let { atmosphericLight, transmittance, similarityChannel } = computeALSM(imageData);

            // Subtract atmospheric light from each channel
            let adjustedImageData = imageData.data.map((pixel, index) => {
                if (index % 4 !== 3) { // Exclude alpha channel
                    return Math.max(0, pixel - atmosphericLight[index % 4]);
                } else {
                    return pixel; // Leave alpha channel unchanged
                }
            });

            // Perform Mean-Standard-Deviation mechanism for targeted adjustments
            let enhancedImageData = performMSD(adjustedImageData);

            // Turn processed data back into image
            ctx.putImageData(new ImageData(enhancedImageData, canvas.width, canvas.height), 0, 0);
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
