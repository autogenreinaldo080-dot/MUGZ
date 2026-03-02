const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgPath = 'c:/Users/USUARIO/Desktop/IMPACTA/PROYECTOS/MUG/mug Z/public/images/logo_sesp.png';
const backupPath = 'c:/Users/USUARIO/Desktop/IMPACTA/PROYECTOS/MUG/mug Z/public/images/logo_sesp_original.png';

async function aggressiveClean() {
    if (!fs.existsSync(imgPath)) return;

    // Backup if not already backed up
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(imgPath, backupPath);
    }

    try {
        const { data, info } = await sharp(backupPath)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const pixels = new Uint8ClampedArray(data);
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];

            // A typical checkerboard has white and very light grey
            // Or sometimes it's actually transparent but shows as checkerboard in some apps
            // But if user sees it, it's baked in pixels.

            const luma = 0.299 * r + 0.587 * g + 0.114 * b;
            const isNeutral = Math.abs(r - g) < 10 && Math.abs(g - b) < 10;

            // If it's very bright and neutral, it's likely part of the grid
            // EXCEPT if it's pure white (which might be the text)
            // HOWEVER, if the user says "letras blancas", pure white is text.
            // Light grey grid squares are usually around 190-210.

            const isGreyGrid = isNeutral && luma > 150 && luma < 220;
            const isWhiteGrid = isNeutral && luma > 245; // If the text is white, we must be careful.

            // Often the text has slight anti-aliasing or is just slightly different.
            // Let's assume the grid is the background.
            if (isGreyGrid || isWhiteGrid) {
                pixels[i + 3] = 0;
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
            .toFile(imgPath); // Overwrite with clean version

        console.log("logo_sesp.png cleaned forcefully.");
    } catch (err) {
        console.error(err);
    }
}

aggressiveClean();
