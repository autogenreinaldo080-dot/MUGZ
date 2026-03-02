const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/USUARIO/Desktop/IMPACTA/PROYECTOS/MUG/mug Z/public/images';

const logosToProcess = [
    'logo_sesp_cleaned.png',
    'logo_impacta_trans.png',
    'logo_gore.png',
    'logo_cdi.png',
    'logo_collahuasi_trans.png',
    'logo_afi_trans.png'
];

async function generateWhiteSilhouette(filename) {
    const inputPath = path.join(baseDir, filename);
    const outputPath = path.join(baseDir, filename.replace('.png', '_white.png'));

    if (!fs.existsSync(inputPath)) return;

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

            // Threshold: Anything bright or neutral-light is background
            // Most of the logos have dark/intense colors
            const isBright = r > 180 && g > 180 && b > 180;
            const isTransparent = a < 50;

            if (isBright || isTransparent) {
                pixels[i + 3] = 0; // Transparent
            } else {
                // Content! Make it PURE WHITE
                pixels[i] = 255;
                pixels[i + 1] = 255;
                pixels[i + 2] = 255;
                pixels[i + 3] = 255;
            }
        }

        await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } })
            .png()
            .toFile(outputPath);

        console.log(`Generated white silhouette: ${outputPath}`);
    } catch (err) {
        console.error(`Error processing ${filename}:`, err);
    }
}

async function run() {
    for (const logo of logosToProcess) {
        await generateWhiteSilhouette(logo);
    }
}

run();
