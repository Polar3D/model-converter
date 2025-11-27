import { ModelConverter } from '@polar3d/model-converter';

/**
 * Batch conversion example
 */
async function batchConversion() {
    const models = [
        { input: 'model1.glb', inputFormat: 'glb' as const, name: 'Robot' },
        { input: 'model2.obj', inputFormat: 'obj' as const, name: 'House' },
        { input: 'model3.3mf', inputFormat: '3mf' as const, name: 'Vase' },
    ];

    console.log(`Converting ${models.length} models...`);

    const results = await ModelConverter.convertBatch(
        models,
        'stl',
        {
            concurrency: 2,  // Convert 2 at a time
            binary: true,
            center: true,
            scale: 1.0
        }
    );

    // Process results
    let successCount = 0;
    let failureCount = 0;

    results.forEach((result, index) => {
        const model = models[index];

        if (result.success && result.result) {
            successCount++;
            console.log(`✓ ${model.name}: ${result.result.metadata.vertices} vertices, ${result.result.metadata.fileSize} bytes`);

            // Download each converted file
            const url = URL.createObjectURL(result.result.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${model.name}.stl`;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            failureCount++;
            console.error(`✗ ${model.name}: ${result.error?.message}`);
        }
    });

    console.log(`\nCompleted: ${successCount} succeeded, ${failureCount} failed`);
}

batchConversion();
