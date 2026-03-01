const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/USUARIO/Desktop/IMPACTA/PROYECTOS/MUG/mug Z/public/images';

async function cleanCheckerboard(filename) {
    const inputPath = path.join(baseDir, filename);
    const outputPath = path.join(baseDir, filename);

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

            // Detect typical checkerboard colors (grey/light grey)
            // Near neutral greys between 100 and 240
            const isNeutral = Math.abs(r - g) < 5 && Math.abs(g - b) < 5;
            const isGrey = isNeutral && (r > 150 && r < 245);
            const isDarkGrey = isNeutral && (r > 80 && r < 130);

            if (isGrey || isDarkGrey) {
                pixels[i + 3] = 0; // Make transparent
            }
        }

        await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } })
            .png()
            .toFile(outputPath + '_tmp.png');

        fs.renameSync(outputPath + '_tmp.png', outputPath);
        console.log(`Cleaned checkerboard from: ${filename}`);
    } catch (err) {
        console.error(`Error cleaning ${filename}:`, err);
    }
}

async function run() {
    await cleanCheckerboard('logo_collahuasi_trans.png');
    await cleanCheckerboard('logo_afi_trans.png');
    await cleanCheckerboard('logo_gore.png');
    await cleanCheckerboard('logo_cdi.png');
    await cleanCheckerboard('logo_impacta_trans.png');
    await cleanCheckerboard('logo_sesp.png');
}

run();
