import type { Object3D, BufferGeometry, Mesh } from 'three';
import { ConversionInput } from '../core/types.js';
import { loadFromURL, blobToArrayBuffer } from '../utils/helpers.js';

/**
 * Load STL model from various input sources
 */
export async function loadSTL(input: ConversionInput): Promise<Object3D> {
    const { STLLoader } = await import('three/examples/jsm/loaders/STLLoader.js');
    const THREE = await import('three');
    const loader = new STLLoader();

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

            const geometry = loader.parse(arrayBuffer) as BufferGeometry;
            geometry.computeVertexNormals();

            // Create a mesh from the geometry
            const material = new THREE.MeshStandardMaterial({ color: 0x808080 });
            const mesh = new THREE.Mesh(geometry, material) as Mesh;

            mesh.updateMatrixWorld(true);
            resolve(mesh);
        } catch (error) {
            reject(new Error(`Failed to load STL: ${error}`));
        }
    });
}
