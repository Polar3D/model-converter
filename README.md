# @polar3d/model-converter

Universal 3D model format converter supporting GLB, GLTF, OBJ, STL, and 3MF formats. Built on Three.js with TypeScript support.

## Features

- ✅ **Multiple Format Support**: Convert between GLB, GLTF, OBJ, STL, and 3MF
- ✅ **TypeScript**: Full type safety and IDE autocomplete
- ✅ **Zero Config**: Works out of the box with sensible defaults
- ✅ **Browser & Node.js**: Universal compatibility
- ✅ **Batch Processing**: Convert multiple files with concurrency control
- ✅ **Sliced File Detection**: Automatically detects and rejects sliced 3MF files
- ✅ **Model Transformations**: Scale, center, and coordinate system conversion
- ✅ **Detailed Metadata**: Get vertex count, face count, bounding box, and more
- ✅ **Progress Tracking**: Monitor conversion progress for large files

## Installation

```bash
npm install @polar3d/model-converter three
```

or

```bash
yarn add @polar3d/model-converter three
```

Note: `three` is a peer dependency and must be installed separately.

## Quick Start

### Simple Conversion

```typescript
import { glbToStl } from "@polar3d/model-converter";

// Convert a GLB file to STL
const glbUrl = "https://example.com/model.glb";
const stlBlob = await glbToStl(glbUrl);

// Download the result
const url = URL.createObjectURL(stlBlob);
const a = document.createElement("a");
a.href = url;
a.download = "model.stl";
a.click();
```

### With Options

```typescript
import { glbToStl } from "@polar3d/model-converter";

const stlBlob = await glbToStl("model.glb", {
  binary: true, // Export as binary STL (default)
  scale: 2.0, // Scale model by 2x
  center: true, // Center at origin
  includeNormals: true, // Include vertex normals
});
```

### Using the Main Converter Class

```typescript
import { ModelConverter } from "@polar3d/model-converter";

const result = await ModelConverter.convert(
  "model.glb", // Input (URL, Blob, ArrayBuffer, or File)
  "glb", // Input format
  "stl", // Output format
  {
    binary: true,
    scale: 1.5,
    center: true,
  },
);

console.log("Converted!", result.metadata);
// { vertices: 1234, faces: 456, fileSize: 98765, format: 'stl', boundingBox: {...} }
```

## Supported Conversions

### Input Formats

- **GLB** - Binary GLTF (`.glb`)
- **GLTF** - JSON GLTF (`.gltf`)
- **OBJ** - Wavefront (`.obj`)
- **STL** - STereoLithography (`.stl`)
- **3MF** - 3D Manufacturing Format (`.3mf`) - Unsliced only

### Output Formats

- **STL** - Binary or ASCII (`.stl`)
- **OBJ** - Wavefront (`.obj`)
- **GLTF** - JSON GLTF (`.gltf`)
- **GLB** - Binary GLTF (`.glb`)

## Convenience Functions

```typescript
import {
  glbToStl,
  gltfToStl,
  objToStl,
  stlToObj,
  stlToGlb,
  glbToObj,
  objToGlb,
  threemfToStl,
  anyToStl,
  autoToStl,
} from "@polar3d/model-converter";

// GLB → STL
const stl1 = await glbToStl("model.glb");

// OBJ → STL
const stl2 = await objToStl("model.obj");

// STL → OBJ
const obj = await stlToObj("model.stl");

// Auto-detect format and convert to STL
const stl3 = await autoToStl("model.glb"); // Auto-detects GLB

// Any format to STL
const stl4 = await anyToStl("model.3mf", "3mf");
```

## API Reference

### ModelConverter Class

#### `convert(input, inputFormat, outputFormat, options?)`

Main conversion method.

**Parameters:**

- `input`: URL string, Blob, ArrayBuffer, or File
- `inputFormat`: `'glb' | 'gltf' | 'obj' | 'stl' | '3mf'`
- `outputFormat`: `'stl' | 'obj' | 'gltf' | 'glb'`
- `options?`: ConversionOptions (see below)

**Returns:** `Promise<ConversionResult>`

#### `convertBatch(inputs, outputFormat, options?)`

Convert multiple files in parallel.

```typescript
const results = await ModelConverter.convertBatch(
  [
    { input: "model1.glb", inputFormat: "glb", name: "Model 1" },
    { input: "model2.obj", inputFormat: "obj", name: "Model 2" },
  ],
  "stl",
  { concurrency: 4 },
);
```

### ConversionOptions

```typescript
interface ConversionOptions {
  binary?: boolean; // Binary vs ASCII output (default: true)
  includeNormals?: boolean; // Include normal vectors (default: true)
  mergeMeshes?: boolean; // Merge multiple meshes (default: false)
  scale?: number; // Scale factor (default: 1.0)
  center?: boolean; // Center at origin (default: false)
  flipYZ?: boolean; // Flip Y/Z axes (default: false)
  outputFormat?: "blob" | "arraybuffer" | "base64"; // Output type (default: 'blob')
  onProgress?: (progress: number) => void; // Progress callback
}
```

### ConversionResult

```typescript
interface ConversionResult {
  blob: Blob; // Converted file as Blob
  arrayBuffer?: ArrayBuffer; // ArrayBuffer (if requested)
  base64?: string; // Base64 string (if requested)
  metadata: ModelMetadata; // Model information
}
```

### ModelMetadata

```typescript
interface ModelMetadata {
  vertices: number; // Vertex count
  faces: number; // Triangle/face count
  fileSize: number; // Output file size in bytes
  format: string; // Output format
  boundingBox?: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
    size: { x: number; y: number; z: number };
  };
}
```

## Advanced Usage

### Attribution

By default, all converted files include "Created using Polar3d.com" attribution:

- **STL (Binary)**: Added to the 80-byte header
- **STL (ASCII)**: Added to the solid name line
- **OBJ**: Added as comment lines at the top
- **GLTF/GLB**: Added to asset metadata (generator and copyright fields)

To disable attribution:

```typescript
const result = await glbToStl("model.glb", {
  addAttribution: false, // Disable attribution
});
```

### Batch Conversion with Progress

```typescript
import { ModelConverter } from "@polar3d/model-converter";

const inputs = [
  { input: "model1.glb", inputFormat: "glb" as const },
  { input: "model2.obj", inputFormat: "obj" as const },
  { input: "model3.3mf", inputFormat: "3mf" as const },
];

const results = await ModelConverter.convertBatch(inputs, "stl", {
  concurrency: 2, // Process 2 at a time
  binary: true,
  scale: 1.0,
});

results.forEach((result, index) => {
  if (result.success) {
    console.log(`✓ Converted ${inputs[index].input}`);
    console.log(`  Vertices: ${result.result!.metadata.vertices}`);
    console.log(`  Size: ${result.result!.metadata.fileSize} bytes`);
  } else {
    console.error(`✗ Failed ${inputs[index].input}:`, result.error);
  }
});
```

### Coordinate System Conversion

```typescript
// Convert from Z-up to Y-up coordinate system
const result = await ModelConverter.convert("model.stl", "stl", "obj", {
  flipYZ: true, // Swap Y and Z axes
});
```

### Get Detailed Metadata

```typescript
import { convertWithMetadata } from "@polar3d/model-converter";

const result = await convertWithMetadata("model.glb", "glb", "stl");

console.log("Metadata:", result.metadata);
// {
//   vertices: 8462,
//   faces: 4231,
//   fileSize: 123456,
//   format: 'stl',
//   boundingBox: {
//     min: { x: -50, y: -50, z: 0 },
//     max: { x: 50, y: 50, z: 100 },
//     size: { x: 100, y: 100, z: 100 }
//   }
// }
```

### Handling Sliced 3MF Files

```typescript
import { ModelConverter, SlicedFileError } from "@polar3d/model-converter";

try {
  const result = await ModelConverter.convert("sliced.3mf", "3mf", "stl");
} catch (error) {
  if (error instanceof SlicedFileError) {
    console.error("This is a sliced 3MF file. Please use an unsliced model.");
  }
}
```

### Format Detection

```typescript
import { detectFormat } from "@polar3d/model-converter";

const format = detectFormat("model.glb");
console.log(format); // 'glb'

const file = new File([blob], "model.stl");
const fileFormat = detectFormat(file);
console.log(fileFormat); // 'stl'
```

## Error Handling

```typescript
import {
  ModelConverter,
  UnsupportedFormatError,
  SlicedFileError,
  ConversionError,
} from "@polar3d/model-converter";

try {
  const result = await ModelConverter.convert("model.glb", "glb", "stl");
} catch (error) {
  if (error instanceof UnsupportedFormatError) {
    console.error("Format not supported:", error.message);
  } else if (error instanceof SlicedFileError) {
    console.error("Sliced files not supported:", error.message);
  } else if (error instanceof ConversionError) {
    console.error("Conversion failed:", error.message, error.cause);
  } else {
    console.error("Unknown error:", error);
  }
}
```

## Use Cases

### AI Model Processing Pipeline

```typescript
import { glbToStl } from "@polar3d/model-converter";

// Convert AI-generated GLB model to printable STL
async function processAIModel(glbUrl: string) {
  const stlBlob = await glbToStl(glbUrl, {
    binary: true,
    center: true, // Center for 3D printing
    scale: 1.0,
  });

  // Upload to server, send to slicer, etc.
  return stlBlob;
}
```

### 3D Model Library

```typescript
import { ModelConverter } from "@polar3d/model-converter";

// Convert user uploads to standard format
async function standardizeModel(file: File) {
  const format = detectFormat(file);

  if (format && format !== "stl") {
    const result = await ModelConverter.convert(file, format, "stl", {
      binary: true,
    });

    return new File([result.blob], file.name.replace(/\.\w+$/, ".stl"));
  }

  return file;
}
```

## Browser vs Node.js

### Browser

```typescript
import { glbToStl } from "@polar3d/model-converter";

// From URL
const blob = await glbToStl("https://example.com/model.glb");

// From File input
const input = document.querySelector<HTMLInputElement>('input[type="file"]');
const file = input.files[0];
const stlBlob = await glbToStl(file);
```

### Node.js

```typescript
import { ModelConverter } from "@polar3d/model-converter";
import { readFileSync, writeFileSync } from "fs";

// Read file
const buffer = readFileSync("model.glb").buffer;

// Convert
const result = await ModelConverter.convert(buffer, "glb", "stl");

// Write result
const arrayBuffer = await result.blob.arrayBuffer();
writeFileSync("model.stl", Buffer.from(arrayBuffer));
```

## Performance Tips

1. **Use batch conversion** for multiple files with controlled concurrency
2. **Binary formats** are faster and smaller than ASCII
3. **Disable center/scale** if not needed to improve performance
4. **Stream large files** instead of loading entirely into memory when possible

## Limitations

- Sliced 3MF files (containing gcode) are not supported
- FBX and PLY formats are not currently supported
- Texture information may be lost in some conversions
- Some advanced GLTF features (animations, morph targets) may not convert perfectly

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or pull request on GitHub.

## Support

For issues and questions, please visit: https://github.com/Polar3D/model-converter/issues

## Credits

Built with ❤️ by [Polar3D](https://polar3d.com) for the 3D printing community.
