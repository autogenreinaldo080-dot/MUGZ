const sharp = require('sharp');
const fs = require('fs');

const images = [
    'logo_sesp.png',
    'logo_sesp_original.png',
    'logo_cdi.png',
    'EscudoCDI.png',
    'logo_gore.png',
    'logo_gorecolor.png'
];

async function diagnose() {
    const dir = 'c:/Users/USUARIO/Desktop/IMPACTA/PROYECTOS/MUG/mug Z/public/images/';
    for (const name of images) {
        const p = dir + name;
        if (!fs.existsSync(p)) {
            console.log(`${name}: Not found`);
            continue;
        }
        const metadata = await sharp(p).metadata();
        console.log(`${name}: ${metadata.width}x${metadata.height}, ${metadata.channels} channels, size: ${fs.statSync(p).size}`);

        // Sample a pixel from the corner (likely background)
        const { data } = await sharp(p).raw().toBuffer({ resolveWithObject: true });
        console.log(`  Corner pixel (0,0): RGB(${data[0]}, ${data[1]}, ${data[2]}) Alpha(${data[3]})`);
        console.log(`  Pixel (10,10): RGB(${data[40]}, ${data[41]}, ${data[42]}) Alpha(${data[43]})`);
    }
}

diagnose();
