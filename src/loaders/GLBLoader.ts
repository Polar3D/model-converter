import type { Object3D } from 'three';
import { ConversionInput, SlicedFileError } from '../core/types.js';
import { loadFromURL, blobToArrayBuffer, isSliced3MF } from '../utils/helpers.js';

/**
 * Load GLB model from various input sources
 */
export async function loadGLB(input: ConversionInput): Promise<Object3D> {
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const loader = new GLTFLoader();

    return new Promise(async (resolve, reject) => {
        try {
            let arrayBuffer: ArrayBuffer;

            if (typeof input === 'string') {
                // URL
                arrayBuffer = await loadFromURL(input);
            } else if (input instanceof Blob) {
                // Blob or File
                arrayBuffer = await blobToArrayBuffer(input);
            } else {
                // ArrayBuffer
                arrayBuffer = input;
            }

            loader.parse(
                arrayBuffer,
                '', // Base path
                (gltf) => {
                    gltf.scene.updateMatrixWorld(true);
                    resolve(gltf.scene);
                },
                (error) => {
                    reject(new Error(`Failed to load GLB: ${error}`));
                }
            );
        } catch (error) {
            reject(error);
        }
    });
}
