import type { Object3D } from 'three';
import {
    ConversionInput,
    ConversionOptions,
    ConversionResult,
    InputFormat,
    OutputFormat,
    UnsupportedFormatError,
    ConversionError,
    BatchConversionInput,
    BatchConversionOptions,
    BatchConversionResult,
} from './types.js';
import { loadGLB } from '../loaders/GLBLoader.js';
import { loadGLTF } from '../loaders/GLTFLoader.js';
import { loadOBJ } from '../loaders/OBJLoader.js';
import { loadSTL } from '../loaders/STLLoader.js';
import { load3MF } from '../loaders/ThreeMFLoader.js';
import { exportSTL } from '../exporters/STLExporter.js';
import { exportOBJ } from '../exporters/OBJExporter.js';
import { exportGLTF } from '../exporters/GLTFExporter.js';
import {
    detectFormat,
    arrayBufferToBlob,
    arrayBufferToBase64,
    calculateMetadata,
    applyTransformations,
    getMimeType,
} from '../utils/helpers.js';

/**
 * Main converter class for 3D model format conversion
 */
export class ModelConverter {
    /**
     * Load a 3D model from input based on format
     */
    private static async loadModel(input: ConversionInput, format: InputFormat): Promise<Object3D> {
        switch (format) {
            case 'glb':
                return await loadGLB(input);
            case 'gltf':
                return await loadGLTF(input);
            case 'obj':
                return await loadOBJ(input);
            case 'stl':
                return await loadSTL(input);
            case '3mf':
                return await load3MF(input);
            default:
                throw new UnsupportedFormatError(format);
        }
    }

    /**
     * Export a 3D model to the specified format
     */
    private static async exportModel(
        object: Object3D,
        format: OutputFormat,
        options: ConversionOptions
    ): Promise<ArrayBuffer> {
        switch (format) {
            case 'stl':
                return await exportSTL(object, options);
            case 'obj':
                return await exportOBJ(object, options);
            case 'gltf':
            case 'glb':
                return await exportGLTF(object, { ...options, binary: format === 'glb' });
            default:
                throw new UnsupportedFormatError(format);
        }
    }

    /**
     * Convert a 3D model from one format to another
     * @param input - Input source (URL, Blob, ArrayBuffer, or File)
     * @param inputFormat - Input format
     * @param outputFormat - Output format
     * @param options - Conversion options
     * @returns Conversion result with blob and metadata
     */
    static async convert(
        input: ConversionInput,
        inputFormat: InputFormat,
        outputFormat: OutputFormat,
        options: ConversionOptions = {}
    ): Promise<ConversionResult> {
        try {
            // Set default options
            const opts: ConversionOptions = {
                binary: true,
                includeNormals: true,
                mergeMeshes: false,
                scale: 1.0,
                center: false,
                flipYZ: false,
                outputFormat: 'blob',
                ...options,
            };

            // Load the model
            const object = await this.loadModel(input, inputFormat);

            // Apply transformations
            await applyTransformations(object, {
                scale: opts.scale,
                center: opts.center,
                flipYZ: opts.flipYZ,
            });

            // Export to target format
            const arrayBuffer = await this.exportModel(object, outputFormat, opts);

            // Create blob
            const mimeType = getMimeType(outputFormat);
            const blob = arrayBufferToBlob(arrayBuffer, mimeType);

            // Calculate metadata
            const metadata = await calculateMetadata(object, outputFormat, arrayBuffer.byteLength);

            // Prepare result
            const result: ConversionResult = {
                blob,
                metadata,
            };

            // Add additional output formats if requested
            if (opts.outputFormat === 'arraybuffer' || opts.outputFormat === 'base64') {
                result.arrayBuffer = arrayBuffer;
            }

            if (opts.outputFormat === 'base64') {
                result.base64 = arrayBufferToBase64(arrayBuffer);
            }

            return result;
        } catch (error) {
            if (error instanceof Error) {
                throw new ConversionError(`Conversion failed: ${error.message}`, error);
            }
            throw new ConversionError('Conversion failed with unknown error');
        }
    }

    /**
     * Convert from URL
     */
    static async convertFromURL(
        url: string,
        inputFormat: InputFormat,
        outputFormat: OutputFormat,
        options?: ConversionOptions
    ): Promise<ConversionResult> {
        return this.convert(url, inputFormat, outputFormat, options);
    }

    /**
     * Convert from Blob
     */
    static async convertFromBlob(
        blob: Blob,
        inputFormat: InputFormat,
        outputFormat: OutputFormat,
        options?: ConversionOptions
    ): Promise<ConversionResult> {
        return this.convert(blob, inputFormat, outputFormat, options);
    }

    /**
     * Convert from ArrayBuffer
     */
    static async convertFromBuffer(
        buffer: ArrayBuffer,
        inputFormat: InputFormat,
        outputFormat: OutputFormat,
        options?: ConversionOptions
    ): Promise<ConversionResult> {
        return this.convert(buffer, inputFormat, outputFormat, options);
    }

    /**
     * Auto-detect input format and convert
     */
    static async convertAuto(
        input: ConversionInput,
        outputFormat: OutputFormat,
        options?: ConversionOptions
    ): Promise<ConversionResult> {
        const detectedFormat = detectFormat(input);
        if (!detectedFormat) {
            throw new ConversionError('Could not detect input format. Please specify explicitly.');
        }
        return this.convert(input, detectedFormat, outputFormat, options);
    }

    /**
     * Batch conversion with concurrency control
     */
    static async convertBatch(
        inputs: BatchConversionInput[],
        outputFormat: OutputFormat,
        options: BatchConversionOptions = {}
    ): Promise<BatchConversionResult[]> {
        const concurrency = options.concurrency || 4;
        const results: BatchConversionResult[] = [];

        // Process in batches
        for (let i = 0; i < inputs.length; i += concurrency) {
            const batch = inputs.slice(i, i + concurrency);

            const batchResults = await Promise.allSettled(
                batch.map(async (item) => {
                    try {
                        const result = await this.convert(item.input, item.inputFormat, outputFormat, options);
                        return {
                            input: item,
                            result,
                            success: true,
                        };
                    } catch (error) {
                        return {
                            input: item,
                            error: error instanceof Error ? error : new Error('Unknown error'),
                            success: false,
                        };
                    }
                })
            );

            // Add to results
            for (const promiseResult of batchResults) {
                if (promiseResult.status === 'fulfilled') {
                    results.push(promiseResult.value);
                } else {
                    // This shouldn't happen since we catch errors above, but handle it anyway
                    results.push({
                        input: batch[results.length % batch.length],
                        error: promiseResult.reason,
                        success: false,
                    });
                }
            }
        }

        return results;
    }
}
