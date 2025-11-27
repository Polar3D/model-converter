import type { Object3D } from 'three';
import { ConversionOptions } from '../core/types.js';

/**
 * Export Object3D to GLTF/GLB format
 */
export async function exportGLTF(object: Object3D, options: ConversionOptions = {}): Promise<ArrayBuffer> {
  const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');
  const exporter = new GLTFExporter();

  const binary = options.binary !== false; // Default to binary (GLB)
  const addAttribution = options.addAttribution !== false; // Default to true
  
  return new Promise((resolve, reject) => {
    exporter.parse(
      object,
      (result) => {
        try {
          if (result instanceof ArrayBuffer) {
            // Binary GLB format
            resolve(result);
          } else {
            // JSON GLTF format
            if (addAttribution) {
              // Add attribution to GLTF asset metadata
              if (!result.asset) {
                result.asset = {};
              }
              result.asset.generator = 'Polar3d.com Model Converter';
              result.asset.copyright = 'Created using Polar3d.com';
            }
            
            const json = JSON.stringify(result);
            const encoder = new TextEncoder();
            resolve(encoder.encode(json).buffer);
          }
        } catch (error) {
          reject(new Error(`Failed to process GLTF export: ${error}`));
        }
      },
      (error) => {
        reject(new Error(`Failed to export GLTF: ${error}`));
      },
      {
        binary,
        includeCustomExtensions: false,
      }
    );
  });
}