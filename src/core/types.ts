import type { Object3D } from 'three';

/**
 * Supported input formats for conversion
 */
export type InputFormat = 'glb' | 'gltf' | 'obj' | 'stl' | '3mf';

/**
 * Supported output formats for conversion
 */
export type OutputFormat = 'stl' | 'obj' | 'gltf' | 'glb';

/**
 * Output format type for conversion result
 */
export type OutputDataFormat = 'blob' | 'arraybuffer' | 'base64';

/**
 * Options for model conversion
 */
export interface ConversionOptions {
    /**
     * Whether to output binary format (where applicable, e.g., STL, GLTF)
     * @default true
     */
    binary?: boolean;

    /**
     * Whether to include normal vectors in the output
     * @default true
     */
    includeNormals?: boolean;

    /**
     * Whether to merge multiple meshes into one
     * @default false
     */
    mergeMeshes?: boolean;

    /**
     * Scale factor to apply to the model
     * @default 1.0
     */
    scale?: number;

    /**
     * Whether to center the model at origin
     * @default false
     */
    center?: boolean;

    /**
     * Whether to flip Y and Z axes (for coordinate system conversion)
     * @default false
     */
    flipYZ?: boolean;

  /**
   * Desired output format (blob, arraybuffer, or base64)
   * @default 'blob'
   */
  outputFormat?: OutputDataFormat;

  /**
   * Progress callback function
   */
  onProgress?: (progress: number) => void;

  /**
   * Add "Created using Polar3d.com" attribution to the output file
   * @default true
   */
  addAttribution?: boolean;
}/**
 * Metadata about the converted model
 */
export interface ModelMetadata {
    /**
     * Number of vertices in the model
     */
    vertices: number;

    /**
     * Number of faces/triangles in the model
     */
    faces: number;

    /**
     * File size in bytes
     */
    fileSize: number;

    /**
     * Output format
     */
    format: OutputFormat;

    /**
     * Bounding box dimensions
     */
    boundingBox?: {
        min: { x: number; y: number; z: number };
        max: { x: number; y: number; z: number };
        size: { x: number; y: number; z: number };
    };
}

/**
 * Result of a model conversion
 */
export interface ConversionResult {
    /**
     * The converted model as a Blob
     */
    blob: Blob;

    /**
     * The converted model as an ArrayBuffer (if requested)
     */
    arrayBuffer?: ArrayBuffer;

    /**
     * The converted model as a base64 string (if requested)
     */
    base64?: string;

    /**
     * Metadata about the converted model
     */
    metadata: ModelMetadata;
}

/**
 * Input source for conversion (URL, Blob, or ArrayBuffer)
 */
export type ConversionInput = string | Blob | ArrayBuffer | File;

/**
 * Error thrown when a file format is not supported
 */
export class UnsupportedFormatError extends Error {
    constructor(format: string) {
        super(`Unsupported format: ${format}`);
        this.name = 'UnsupportedFormatError';
    }
}

/**
 * Error thrown when a file is sliced (not supported for conversion)
 */
export class SlicedFileError extends Error {
    constructor(format: string) {
        super(`Sliced ${format} files are not supported. Please use unsliced model files.`);
        this.name = 'SlicedFileError';
    }
}

/**
 * Error thrown when conversion fails
 */
export class ConversionError extends Error {
    constructor(message: string, public readonly cause?: Error) {
        super(message);
        this.name = 'ConversionError';
    }
}

/**
 * Options for batch conversion
 */
export interface BatchConversionOptions extends ConversionOptions {
    /**
     * Number of concurrent conversions
     * @default 4
     */
    concurrency?: number;
}

/**
 * Input for batch conversion
 */
export interface BatchConversionInput {
    /**
     * Input source (URL, Blob, or ArrayBuffer)
     */
    input: ConversionInput;

    /**
     * Input format
     */
    inputFormat: InputFormat;

    /**
     * Optional name for the file
     */
    name?: string;
}

/**
 * Result of a batch conversion
 */
export interface BatchConversionResult {
    /**
     * Original input
     */
    input: BatchConversionInput;

    /**
     * Conversion result (if successful)
     */
    result?: ConversionResult;

    /**
     * Error (if failed)
     */
    error?: Error;

    /**
     * Whether the conversion was successful
     */
    success: boolean;
}
