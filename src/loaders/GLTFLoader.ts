import type { Object3D } from 'three';
import { ConversionInput } from '../core/types.js';
import { loadFromURL, blobToArrayBuffer } from '../utils/helpers.js';

/**
 * Load GLTF model from various input sources
 */
export async function loadGLTF(input: ConversionInput): Promise<Object3D> {
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const loader = new GLTFLoader();

    return new Promise(async (resolve, reject) => {
        try {
            if (typeof input === 'string') {
                // URL - use load method
                loader.load(
                    input,
                    (gltf) => {
                        gltf.scene.updateMatrixWorld(true);
                        resolve(gltf.scene);
                    },
                    undefined,
                    (error) => {
                        reject(new Error(`Failed to load GLTF: ${error}`));
                    }
                );
            } else {
                // Blob/ArrayBuffer - use parse method
                let arrayBuffer: ArrayBuffer;
                if (input instanceof Blob) {
                    arrayBuffer = await blobToArrayBuffer(input);
                } else {
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
                        reject(new Error(`Failed to parse GLTF: ${error}`));
                    }
                );
            }
        } catch (error) {
            reject(error);
        }
    });
}
