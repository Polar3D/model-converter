import type { Object3D } from 'three';
import { ConversionInput } from '../core/types.js';
import { loadFromURL, blobToArrayBuffer } from '../utils/helpers.js';

/**
 * Load OBJ model from various input sources
 */
export async function loadOBJ(input: ConversionInput): Promise<Object3D> {
    const { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader.js');
    const loader = new OBJLoader();

    return new Promise(async (resolve, reject) => {
        try {
            if (typeof input === 'string') {
                // URL - use load method
                loader.load(
                    input,
                    (object) => {
                        object.updateMatrixWorld(true);
                        resolve(object);
                    },
                    undefined,
                    (error) => {
                        reject(new Error(`Failed to load OBJ: ${error}`));
                    }
                );
            } else {
                // Blob/ArrayBuffer - use parse method
                let text: string;

                if (input instanceof Blob) {
                    const arrayBuffer = await blobToArrayBuffer(input);
                    const decoder = new TextDecoder('utf-8');
                    text = decoder.decode(arrayBuffer);
                } else {
                    const decoder = new TextDecoder('utf-8');
                    text = decoder.decode(input);
                }

                const object = loader.parse(text);
                object.updateMatrixWorld(true);
                resolve(object);
            }
        } catch (error) {
            reject(error);
        }
    });
}
