import type { Object3D } from 'three';
import { ConversionInput, SlicedFileError } from '../core/types.js';
import { loadFromURL, blobToArrayBuffer, isSliced3MF } from '../utils/helpers.js';

/**
 * Load 3MF model from various input sources
 * Throws SlicedFileError if the file is a sliced 3MF (contains gcode)
 */
export async function load3MF(input: ConversionInput): Promise<Object3D> {
    const { ThreeMFLoader } = await import('three/examples/jsm/loaders/3MFLoader.js');
    const loader = new ThreeMFLoader();

    return new Promise(async (resolve, reject) => {
        try {
            let arrayBuffer: ArrayBuffer;

            if (typeof input === 'string') {
                arrayBuffer = await loadFromURL(input);
            } else if (input instanceof Blob) {
                arrayBuffer = await blobToArrayBuffer(input);
            } else {
                arrayBuffer = input;
            }

            // Check if this is a sliced 3MF file
            const isSliced = await isSliced3MF(arrayBuffer);
            if (isSliced) {
                throw new SlicedFileError('3MF');
            }

            const object = loader.parse(arrayBuffer);
            object.updateMatrixWorld(true);
            resolve(object);
        } catch (error) {
            if (error instanceof SlicedFileError) {
                reject(error);
            } else {
                reject(new Error(`Failed to load 3MF: ${error}`));
            }
        }
    });
}
