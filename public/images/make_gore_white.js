const sharp = require('sharp');

async function makeWhite() {
    try {
        const inputPath = 'logo_gorecolor.png';
        const outputPath = 'logo_gorecolor_white.png';
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

            if (a > 50) { // If it's not mostly transparent, make it white
                pixels[i] = 255;
                pixels[i + 1] = 255;
                pixels[i + 2] = 255;
            }
        }

        await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } })
            .png()
            .toFile(outputPath);
        console.log("Success: logo_gorecolor_white.png created");
    } catch (e) {
        console.error(e);
    }
}
makeWhite();
