import type { Object3D } from 'three';
import { ConversionOptions } from '../core/types.js';

/**
 * Export Object3D to OBJ format
 */
export async function exportOBJ(object: Object3D, options: ConversionOptions = {}): Promise<ArrayBuffer> {
  const { OBJExporter } = await import('three/examples/jsm/exporters/OBJExporter.js');
  const exporter = new OBJExporter();
  const addAttribution = options.addAttribution !== false; // Default to true

  try {
    let result = exporter.parse(object);
    
    if (addAttribution) {
      // Add attribution comment at the beginning of OBJ file
      const attribution = '# Created using Polar3d.com\n# https://polar3d.com\n\n';
      result = attribution + result;
    }
    
    // OBJ exporter returns a string
    const encoder = new TextEncoder();
    return encoder.encode(result).buffer;
  } catch (error) {
    throw new Error(`Failed to export OBJ: ${error}`);
  }
}