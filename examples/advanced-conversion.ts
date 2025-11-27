import { ModelConverter, convertWithMetadata } from '@polar3d/model-converter';

/**
 * Advanced conversion with detailed metadata and transformations
 */
async function advancedConversion() {
    const input = 'complex-model.glb';

    console.log('Converting with advanced options...');

    const result = await convertWithMetadata(
        input,
        'glb',
        'stl',
        {
            binary: true,
            scale: 2.5,           // Scale up by 2.5x
            center: true,         // Center at origin
            flipYZ: false,        // Keep coordinate system
            includeNormals: true,
            outputFormat: 'blob'
        }
    );

    console.log('Conversion complete!');
    console.log('\nMetadata:');
    console.log('  Vertices:', result.metadata.vertices);
    console.log('  Faces:', result.metadata.faces);
    console.log('  File Size:', result.metadata.fileSize, 'bytes');
    console.log('  Format:', result.metadata.format);

    if (result.metadata.boundingBox) {
        const bb = result.metadata.boundingBox;
        console.log('\nBounding Box:');
        console.log('  Min:', bb.min);
        console.log('  Max:', bb.max);
        console.log('  Size:', bb.size);
        console.log('  Dimensions:', `${bb.size.x.toFixed(2)} x ${bb.size.y.toFixed(2)} x ${bb.size.z.toFixed(2)}`);
    }

    // Download the result
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'advanced-model.stl';
    a.click();
    URL.revokeObjectURL(url);
}

advancedConversion();
