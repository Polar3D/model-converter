import { glbToStl } from '@polar3d/model-converter';

/**
 * Basic example: Convert GLB to STL
 */
async function basicConversion() {
    const glbUrl = 'https://example.com/model.glb';

    try {
        const stlBlob = await glbToStl(glbUrl, {
            binary: true,
            center: true
        });

        console.log('Conversion successful!');
        console.log('File size:', stlBlob.size, 'bytes');

        // Download the file
        const url = URL.createObjectURL(stlBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted-model.stl';
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Conversion failed:', error);
    }
}

basicConversion();
