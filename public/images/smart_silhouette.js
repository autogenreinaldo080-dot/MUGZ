const sharp = require('sharp');
const fs = require('fs');

async function processLogo(inputFile, outputFile) {
    if (!fs.existsSync(inputFile)) {
        console.log(`Skipping ${inputFile}, not found.`);
        return;
    }

    try {
        const { data, info } = await sharp(inputFile)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const pixels = new Uint8ClampedArray(data);
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];

            // Calculate perceived brightness (luma)
            const luma = 0.299 * r + 0.587 * g + 0.114 * b;

            // If the pixel is already transparent, keep it transparent
            if (a < 50) {
                pixels[i + 3] = 0;
            }
            // If the pixel is bright (white/light grey background), make it transparent
            else if (luma > 180) {
                pixels[i + 3] = 0;
            }
            // If the pixel is dark (the actual logo content), make it pure white and fully opaque
            else {
                pixels[i] = 255;
                pixels[i + 1] = 255;
                pixels[i + 2] = 255;

                // Preserve original anti-aliasing to some extent for smooth edges
                // If it was semi-transparent, keep it semi-transparent
                // Otherwise make it solid
                pixels[i + 3] = a > 50 ? a : 255;
            }
        }

        await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } })
            .png()
            .toFile(outputFile);

        console.log(`Successfully created smart silhouette: ${outputFile}`);
    } catch (e) {
        console.error(`Error processing ${inputFile}:`, e);
    }
}

async function run() {
    await processLogo('logo_gorecolor.png', 'logo_gore_smart_white.png');
    await processLogo('logo_afsi_color.png', 'logo_afsi_smart_white.png');
}

run();
