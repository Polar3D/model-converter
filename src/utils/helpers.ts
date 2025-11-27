import type { Object3D, BufferGeometry, Mesh } from 'three';
import type { ConversionInput, InputFormat, ModelMetadata } from '../core/types.js';
import JSZip from 'jszip';

/**
 * Detect if a 3MF file is sliced by checking for gcode content
 */
export async function isSliced3MF(input: Blob | ArrayBuffer): Promise<boolean> {
    try {
        const arrayBuffer = input instanceof Blob ? await input.arrayBuffer() : input;
        const zip = await JSZip.loadAsync(arrayBuffer);

        // Check for gcode files in the zip
        const gcodeFiles = Object.keys(zip.files).filter((filename) => {
            const lower = filename.toLowerCase();
            return (
                !zip.files[filename].dir &&
                !filename.includes('__MACOSX') &&
                !filename.includes('.DS_Store') &&
                (lower.endsWith('.gcode') || lower.endsWith('.g') || lower.includes('gcode'))
            );
        });

        return gcodeFiles.length > 0;
    } catch (error) {
        console.warn('Failed to check if 3MF is sliced:', error);
        return false;
    }
}

/**
 * Detect input format from file extension or MIME type
 */
export function detectFormat(input: ConversionInput): InputFormat | null {
    if (typeof input === 'string') {
        // URL or file path
        const lower = input.toLowerCase();
        if (lower.endsWith('.glb')) return 'glb';
        if (lower.endsWith('.gltf')) return 'gltf';
        if (lower.endsWith('.obj')) return 'obj';
        if (lower.endsWith('.stl')) return 'stl';
        if (lower.endsWith('.3mf')) return '3mf';
    } else if (input instanceof Blob || input instanceof File) {
        // Blob or File
        const blob = input as Blob;
        if (blob.type) {
            if (blob.type === 'model/gltf-binary') return 'glb';
            if (blob.type === 'model/gltf+json') return 'gltf';
            if (blob.type === 'model/obj') return 'obj';
            if (blob.type === 'model/stl' || blob.type === 'application/sla') return 'stl';
            if (blob.type === 'model/3mf') return '3mf';
        }
        // Try to detect from file name if it's a File
        if (input instanceof File) {
            const lower = input.name.toLowerCase();
            if (lower.endsWith('.glb')) return 'glb';
            if (lower.endsWith('.gltf')) return 'gltf';
            if (lower.endsWith('.obj')) return 'obj';
            if (lower.endsWith('.stl')) return 'stl';
            if (lower.endsWith('.3mf')) return '3mf';
        }
    }
    return null;
}

/**
 * Convert ArrayBuffer to Blob
 */
export function arrayBufferToBlob(buffer: ArrayBuffer, mimeType: string): Blob {
    return new Blob([buffer], { type: mimeType });
}

/**
 * Convert Blob to ArrayBuffer
 */
export async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return await blob.arrayBuffer();
}

/**
 * Convert ArrayBuffer to base64 string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * Convert base64 string to ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Load data from URL
 */
export async function loadFromURL(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    return await response.arrayBuffer();
}

/**
 * Get MIME type for output format
 */
export function getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
        stl: 'model/stl',
        obj: 'model/obj',
        gltf: 'model/gltf+json',
        glb: 'model/gltf-binary',
        '3mf': 'model/3mf',
    };
    return mimeTypes[format] || 'application/octet-stream';
}

/**
 * Calculate model metadata from Three.js Object3D
 */
export async function calculateMetadata(object: Object3D, format: string, fileSize: number): Promise<ModelMetadata> {
    let vertices = 0;
    let faces = 0;

    // Traverse the object to count vertices and faces
    object.traverse((child) => {
        if ((child as Mesh).isMesh) {
            const mesh = child as Mesh;
            const geometry = mesh.geometry as BufferGeometry;
            if (geometry.attributes.position) {
                vertices += geometry.attributes.position.count;
            }
            if (geometry.index) {
                faces += geometry.index.count / 3;
            } else if (geometry.attributes.position) {
                faces += geometry.attributes.position.count / 3;
            }
        }
    });

    // Calculate bounding box
    object.updateMatrixWorld(true);
    const { Box3, Vector3 } = await import('three');
    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3());

    return {
        vertices,
        faces: Math.floor(faces),
        fileSize,
        format: format as any,
        boundingBox: {
            min: { x: box.min.x, y: box.min.y, z: box.min.z },
            max: { x: box.max.x, y: box.max.y, z: box.max.z },
            size: { x: size.x, y: size.y, z: size.z },
        },
    };
}

/**
 * Apply transformations to Object3D based on options
 */
export async function applyTransformations(
    object: Object3D,
    options: {
        scale?: number;
        center?: boolean;
        flipYZ?: boolean;
    }
): Promise<void> {
    const { Box3, Vector3 } = await import('three');

    // Apply scale
    if (options.scale && options.scale !== 1.0) {
        object.scale.multiplyScalar(options.scale);
    }

    // Flip Y and Z axes
    if (options.flipYZ) {
        object.traverse((child) => {
            if ((child as Mesh).isMesh) {
                const mesh = child as Mesh;
                const geometry = mesh.geometry as BufferGeometry;
                const position = geometry.attributes.position;
                for (let i = 0; i < position.count; i++) {
                    const y = position.getY(i);
                    const z = position.getZ(i);
                    position.setY(i, z);
                    position.setZ(i, y);
                }
                position.needsUpdate = true;
                geometry.computeVertexNormals();
            }
        });
    }

    // Center the model
    if (options.center) {
        const box = new Box3().setFromObject(object);
        const center = box.getCenter(new Vector3());
        object.position.sub(center);
    }

    object.updateMatrixWorld(true);
}
