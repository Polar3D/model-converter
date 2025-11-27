import type { Object3D } from 'three';
import { ConversionOptions } from '../core/types.js';

/**
 * Export Object3D to STL format
 */
export async function exportSTL(object: Object3D, options: ConversionOptions = {}): Promise<ArrayBuffer> {
  const { STLExporter } = await import('three/examples/jsm/exporters/STLExporter.js');
  const exporter = new STLExporter();

  const binary = options.binary !== false; // Default to binary
  const addAttribution = options.addAttribution !== false; // Default to true
  
  try {
    const result = exporter.parse(object, { binary });

    if (result instanceof DataView) {
      // Binary format returns DataView
      const buffer = result.buffer.slice(0);
      
      if (addAttribution) {
        // Add attribution to the 80-byte header of binary STL
        const headerView = new Uint8Array(buffer, 0, 80);
        const attributionText = 'Created using Polar3d.com';
        const encoder = new TextEncoder();
        const encodedText = encoder.encode(attributionText);
        
        // Write attribution to header (first bytes)
        headerView.set(encodedText.slice(0, Math.min(encodedText.length, 80)));
      }
      
      return buffer;
    } else if (typeof result === 'string') {
      // ASCII format returns string
      let stlText = result;
      
      if (addAttribution) {
        // Add attribution comment at the beginning of ASCII STL
        // Replace the first line (solid name) with our attribution
        const lines = stlText.split('\n');
        if (lines[0].startsWith('solid')) {
          lines[0] = 'solid Created using Polar3d.com';
          stlText = lines.join('\n');
        }
      }
      
      const encoder = new TextEncoder();
      return encoder.encode(stlText).buffer;
    } else {
      // Handle ArrayBuffer case
      return result as ArrayBuffer;
    }
  } catch (error) {
    throw new Error(`Failed to export STL: ${error}`);
  }
}