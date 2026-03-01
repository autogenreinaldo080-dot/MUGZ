const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/USUARIO/Desktop/IMPACTA/PROYECTOS/MUG/mug Z/public/images';

const configs = [
    { name: 'logo_fondo.png', invertText: true },
    { name: 'logo_impacta.png', invertText: false },
    { name: 'logo_gore.png', invertText: false },
    { name: 'logo_cdi.png', invertText: false },
    { name: 'logo_collahuasi.png', invertText: false },
    { name: 'logo_afi.png', invertText: false }
];

async function processPremiumLogo(config) {
    const inputPath = path.join(baseDir, config.name);
    const outputPath = path.join(baseDir, config.name.replace('.png', '_premium.png'));

    if (!fs.existsSync(inputPath)) {
        console.log(`File not found: ${inputPath}`);
        return;
    }

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

            // 1. Mono/Grayscale Conversion (Manual)
            let grey = Math.round((r + g + b) / 3);

            // 2. Background Removal (White & Checkerboard)
            const isWhite = r > 230 && g > 230 && b > 230;
            const isNeutral = Math.abs(r - g) < 10 && Math.abs(g - b) < 10;
            const isGreyGrid = isNeutral && ((r > 130 && r < 175) || (r > 80 && r < 125) || (r > 185 && r < 225));

            if (isWhite || isGreyGrid) {
                pixels[i + 3] = 0;
                continue;
            }

            // 3. Specific Logic: SESP White Text
            if (config.invertText) {
                // If it's a very dark pixel (original letters were black/dark)
                if (grey < 120) {
                    pixels[i] = 255;
                    pixels[i + 1] = 255;
                    pixels[i + 2] = 255;
                } else {
                    // Keep other details as grayscale
                    pixels[i] = grey;
                    pixels[i + 1] = grey;
                    pixels[i + 2] = grey;
                }
            } else {
                // General: High contrast monochrome
                let finalGrey = grey;
                if (grey < 60) finalGrey = 0;
                else if (grey > 200) finalGrey = 255;

                pixels[i] = finalGrey;
                pixels[i + 1] = finalGrey;
                pixels[i + 2] = finalGrey;
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

        console.log(`Premium processed: ${config.name} -> ${config.name.replace('.png', '_premium.png')}`);
    } catch (err) {
        console.error(`Error processing ${config.name}:`, err);
    }
}

async function run() {
    for (const config of configs) {
        await processPremiumLogo(config);
    }
}

run();
