import { ModelConverter, SlicedFileError, UnsupportedFormatError, ConversionError } from '@polar3d/model-converter';

/**
 * Comprehensive error handling example
 */
async function errorHandlingExample() {
    async function safeConvert(input: string, inputFormat: any, outputFormat: any) {
        try {
            console.log(`Converting ${input}...`);

            const result = await ModelConverter.convert(
                input,
                inputFormat,
                outputFormat,
                { binary: true }
            );

            console.log(`✓ Success: ${result.metadata.fileSize} bytes`);
            return result;

        } catch (error) {
            if (error instanceof SlicedFileError) {
                console.error('✗ Sliced File Error:', error.message);
                console.error('  → This file contains gcode and cannot be converted.');
                console.error('  → Please use an unsliced 3MF file instead.');

            } else if (error instanceof UnsupportedFormatError) {
                console.error('✗ Unsupported Format:', error.message);
                console.error('  → Supported input formats: glb, gltf, obj, stl, 3mf');
                console.error('  → Supported output formats: stl, obj, gltf, glb');

            } else if (error instanceof ConversionError) {
                console.error('✗ Conversion Error:', error.message);
                if (error.cause) {
                    console.error('  → Caused by:', error.cause.message);
                }
                console.error('  → The file may be corrupted or invalid.');

            } else {
                console.error('✗ Unknown Error:', error);
            }

            return null;
        }
    }

    // Test various error scenarios
    console.log('=== Testing Error Scenarios ===\n');

    // 1. Sliced 3MF file
    await safeConvert('sliced.3mf', '3mf', 'stl');
    console.log('');

    // 2. Unsupported input format
    await safeConvert('model.fbx', 'fbx', 'stl');
    console.log('');

    // 3. Unsupported output format
    await safeConvert('model.glb', 'glb', 'fbx');
    console.log('');

    // 4. Valid conversion
    await safeConvert('valid-model.glb', 'glb', 'stl');
    console.log('');

    console.log('=== Error Handling Tests Complete ===');
}

errorHandlingExample();
