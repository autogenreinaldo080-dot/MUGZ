const sharp = require('sharp');
const path = require('sharp');
const fs = require('fs');

const inputPath = 'c:/Users/USUARIO/Desktop/IMPACTA/PROYECTOS/MUG/mug Z/public/images/logo_sesp.png';
const outputPath = 'c:/Users/USUARIO/Desktop/IMPACTA/PROYECTOS/MUG/mug Z/public/images/logo_sesp_cleaned.png';

async function cleanSesp() {
    try {
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

            // Detect checkerboard (white or grey squares)
            const isWhite = r > 240 && g > 240 && b > 240;
            const isGrey = r > 180 && r < 220 && g > 180 && g < 220 && b > 180 && b < 220 && Math.abs(r - g) < 5 && Math.abs(g - b) < 5;

            if (isWhite || isGrey) {
                pixels[i + 3] = 0; // Make transparent
            }
        }

        await sharp(pixels, {
            raw: {
                width: info.width,
                height: info.height,
                channels: 4
            }
        })
            .png()
            .toFile(outputPath);

        console.log("Success: logo_sesp_cleaned.png created");
    } catch (err) {
        console.error(err);
    }
}

cleanSesp();
