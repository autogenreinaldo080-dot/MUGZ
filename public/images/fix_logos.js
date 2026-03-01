const sharp = require('sharp');

async function processLogos() {
    try {
        // 1. Regenerate Gore White Logo
        const goreData = await sharp('logo_gore_hd.png')
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        let pixels = new Uint8ClampedArray(goreData.data);
        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] > 50) {
                pixels[i] = 255;
                pixels[i + 1] = 255;
                pixels[i + 2] = 255;
            }
        }
        await sharp(pixels, { raw: { width: goreData.info.width, height: goreData.info.height, channels: 4 } })
            .png()
            .toFile('logo_gore_hd_white.png');
        console.log('logo_gore_hd_white.png generated successfully.');

        // 2. Process AFSI logo cleanly
        // If logo_afsi.png is colored on white, we can use sharp's trim or just make pure white transparent
        // and leave the colored parts as they are, but the user wants them WHITE silhouettes.
        // Wait, if we want a white silhouette, any non-white background color becomes white.
        // BUT if the logo has white *inside* it, making the background transparent and non-white white 
        // will just result in a solid shape of the crest. That's likely what happened.
        // A crest silhouette is normally just the outer shape. The user said it "doesn't look clear".
        // Let me just make the white background transparent and leave the logo in its ORIGINAL COLOR.
        // When we apply `brightness-0 invert` in CSS later (if we want it white) it might work better,
        // or we just leave it colored since they also uploaded `logo_afsi_color.png`.

        // Let's use logo_afsi_color.png and just remove the white background, keeping colors.
        const afsiData = await sharp('logo_afsi_color.png')
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        pixels = new Uint8ClampedArray(afsiData.data);
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            // If it's a white pixel (background), make it transparent
            if (r > 240 && g > 240 && b > 240) {
                pixels[i + 3] = 0;
            }
            // We KEEP the original colors of the AFSI logo, not turning it pure white.
            // This preserves internal details.
        }

        await sharp(pixels, { raw: { width: afsiData.info.width, height: afsiData.info.height, channels: 4 } })
            .png()
            .toFile('logo_afsi_clean.png');
        console.log('logo_afsi_clean.png generated successfully.');

    } catch (e) {
        console.error(e);
    }
}
processLogos();
