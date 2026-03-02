const sharp = require('sharp');

async function processAfsi() {
    try {
        const inputPath = 'logo_afsi.png';
        const outputPath = 'logo_afsi_white.png';

        const { data, info } = await sharp(inputPath)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const pixels = new Uint8ClampedArray(data);
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];

            // If it's a white background pixel, make it transparent
            if (r > 240 && g > 240 && b > 240 && a > 50) {
                pixels[i + 3] = 0; // transparent
            }
            // Otherwise, if it's visible, make it pure white
            else if (a > 50) {
                pixels[i] = 255;
                pixels[i + 1] = 255;
                pixels[i + 2] = 255;
            }
        }

        await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } })
            .png()
            .toFile(outputPath);

        console.log('Successfully created clean AFSI white silhouette.');
    } catch (e) {
        console.error(e);
    }
}
processAfsi();
