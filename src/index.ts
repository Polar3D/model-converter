// Export types
export type {
    InputFormat,
    OutputFormat,
    OutputDataFormat,
    ConversionOptions,
    ModelMetadata,
    ConversionResult,
    ConversionInput,
    BatchConversionOptions,
    BatchConversionInput,
    BatchConversionResult,
} from './core/types.js';

// Export errors
export { UnsupportedFormatError, SlicedFileError, ConversionError } from './core/types.js';

// Export main converter
export { ModelConverter } from './core/Converter.js';

// Export utilities
export { detectFormat, isSliced3MF } from './utils/helpers.js';

// Import for convenience functions
import { ModelConverter } from './core/Converter.js';
import type { ConversionOptions, ConversionResult, ConversionInput } from './core/types.js';

/**
 * Convenience Functions for Common Conversions
 */

/**
 * Convert GLB to STL
 */
export async function glbToStl(
    input: ConversionInput,
    options?: ConversionOptions
): Promise<Blob> {
    const result = await ModelConverter.convert(input, 'glb', 'stl', options);
    return result.blob;
}

/**
 * Convert GLTF to STL
 */
export async function gltfToStl(
    input: ConversionInput,
    options?: ConversionOptions
): Promise<Blob> {
    const result = await ModelConverter.convert(input, 'gltf', 'stl', options);
    return result.blob;
}

/**
 * Convert OBJ to STL
 */
export async function objToStl(
    input: ConversionInput,
    options?: ConversionOptions
): Promise<Blob> {
    const result = await ModelConverter.convert(input, 'obj', 'stl', options);
    return result.blob;
}

/**
 * Convert STL to OBJ
 */
export async function stlToObj(
    input: ConversionInput,
    options?: ConversionOptions
): Promise<Blob> {
    const result = await ModelConverter.convert(input, 'stl', 'obj', options);
    return result.blob;
}

/**
 * Convert STL to GLB
 */
export async function stlToGlb(
    input: ConversionInput,
    options?: ConversionOptions
): Promise<Blob> {
    const result = await ModelConverter.convert(input, 'stl', 'glb', options);
    return result.blob;
}

/**
 * Convert STL to GLTF
 */
export async function stlToGltf(
    input: ConversionInput,
    options?: ConversionOptions
): Promise<Blob> {
    const result = await ModelConverter.convert(input, 'stl', 'gltf', { ...options, binary: false });
    return result.blob;
}

/**
 * Convert GLB to OBJ
 */
export async function glbToObj(
    input: ConversionInput,
    options?: ConversionOptions
): Promise<Blob> {
    const result = await ModelConverter.convert(input, 'glb', 'obj', options);
    return result.blob;
}

/**
 * Convert OBJ to GLB
 */
export async function objToGlb(
    input: ConversionInput,
    options?: ConversionOptions
): Promise<Blob> {
    const result = await ModelConverter.convert(input, 'obj', 'glb', options);
    return result.blob;
}

/**
 * Convert 3MF to STL
 */
export async function threemfToStl(
    input: ConversionInput,
    options?: ConversionOptions
): Promise<Blob> {
    const result = await ModelConverter.convert(input, '3mf', 'stl', options);
    return result.blob;
}

/**
 * Convert 3MF to OBJ
 */
export async function threemfToObj(
    input: ConversionInput,
    options?: ConversionOptions
): Promise<Blob> {
    const result = await ModelConverter.convert(input, '3mf', 'obj', options);
    return result.blob;
}

/**
 * Convert any supported format to STL
 */
export async function anyToStl(
    input: ConversionInput,
    inputFormat: 'glb' | 'gltf' | 'obj' | 'stl' | '3mf',
    options?: ConversionOptions
): Promise<Blob> {
    const result = await ModelConverter.convert(input, inputFormat, 'stl', options);
    return result.blob;
}

/**
 * Auto-detect format and convert to STL
 */
export async function autoToStl(
    input: ConversionInput,
    options?: ConversionOptions
): Promise<Blob> {
    const result = await ModelConverter.convertAuto(input, 'stl', options);
    return result.blob;
}

/**
 * Get full conversion result with metadata
 */
export async function convertWithMetadata(
    input: ConversionInput,
    inputFormat: 'glb' | 'gltf' | 'obj' | 'stl' | '3mf',
    outputFormat: 'stl' | 'obj' | 'gltf' | 'glb',
    options?: ConversionOptions
): Promise<ConversionResult> {
    return await ModelConverter.convert(input, inputFormat, outputFormat, options);
}
