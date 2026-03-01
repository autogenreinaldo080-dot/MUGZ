const sharp = require('sharp');
const path = require('path');

const imgPath = 'c:/Users/USUARIO/Desktop/IMPACTA/PROYECTOS/MUG/mug Z/public/images/logo_collahuasi_trans.png';

async function analyze() {
    const { data, info } = await sharp(imgPath)
        .raw()
        .toBuffer({ resolveWithObject: true });

    const samples = new Set();
    for (let i = 0; i < 400; i += 4) { // Sample top-left corner
        samples.add(`${data[i]},${data[i + 1]},${data[i + 2]}`);
    }
    console.log("Samples (R,G,B):", Array.from(samples));
}

analyze();
