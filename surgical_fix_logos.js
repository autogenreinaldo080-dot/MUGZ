const sharp = require('sharp');
const fs = require('fs');

const base = 'c:/Users/USUARIO/Desktop/IMPACTA/PROYECTOS/MUG/mug Z/public/images/';

async function fixAll() {
    // 1. CDI: Use the higher quality EscudoCDI
    if (fs.existsSync(base + 'EscudoCDI.png')) {
        fs.copyFileSync(base + 'EscudoCDI.png', base + 'logo_cdi.png');
        console.log("CDI updated to high-res version.");
    }

    // 2. SESP: Surgical removal of light grey/white checkerboard
    if (fs.existsSync(base + 'logo_sesp_original.png')) {
        const { data, info } = await sharp(base + 'logo_sesp_original.png')
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const pixels = new Uint8ClampedArray(data);
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            // Target the observed greyish colors (234-237) and near-whites
            // But KEEP pure white (255) or very high intensity (>250) if it's the text
            const isGridColor = (r >= 230 && r <= 245) && (g >= 230 && g <= 245) && (b >= 230 && b <= 245);

            if (isGridColor) {
                pixels[i + 3] = 0;
            }
        }

        await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } })
            .png()
            .toFile(base + 'logo_sesp.png');
        console.log("SESP cleaned surgically.");
    }

    // 3. GORE: Check if it's solid black and make it transparent
    if (fs.existsSync(base + 'logo_gore.png')) {
        const { data, info } = await sharp(base + 'logo_gore.png')
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const pixels = new Uint8ClampedArray(data);
        if (pixels[0] === 0 && pixels[1] === 0 && pixels[2] === 0 && pixels[3] === 255) {
            // Corner is solid black, likely means background is black
            for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i] === 0 && pixels[i + 1] === 0 && pixels[i + 2] === 0) {
                    pixels[i + 3] = 0;
                }
            }
            await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } })
                .png()
                .toFile(base + 'logo_gore.png');
            console.log("GORE black background removed.");
        }
    }
}

fixAll();
