# Quick Reference - @polar3d/model-converter

## Installation

```bash
npm install @polar3d/model-converter three
```

## Basic Usage

### Simple Conversion

```typescript
import { glbToStl } from "@polar3d/model-converter";
const blob = await glbToStl("model.glb");
```

### All Conversions

```typescript
import { glbToStl, gltfToStl, objToStl, stlToObj, stlToGlb, glbToObj, objToGlb, threemfToStl } from "@polar3d/model-converter";
```

### Main Converter

```typescript
import { ModelConverter } from "@polar3d/model-converter";

const result = await ModelConverter.convert(
  "model.glb", // input
  "glb", // input format
  "stl", // output format
  { options }, // optional
);
```

## Options

```typescript
{
  binary: true,          // Binary output (vs ASCII)
  scale: 1.0,            // Scale factor
  center: false,         // Center at origin
  flipYZ: false,         // Flip Y/Z axes
  includeNormals: true,  // Include normals
  outputFormat: 'blob'   // 'blob' | 'arraybuffer' | 'base64'
}
```

## Supported Formats

**Input**: glb, gltf, obj, stl, 3mf  
**Output**: stl, obj, gltf, glb

## Batch Conversion

```typescript
const results = await ModelConverter.convertBatch(
  [
    { input: "model1.glb", inputFormat: "glb" },
    { input: "model2.obj", inputFormat: "obj" },
  ],
  "stl",
  { concurrency: 4 },
);
```

## Error Handling

```typescript
import { SlicedFileError, UnsupportedFormatError, ConversionError } from "@polar3d/model-converter";

try {
  await glbToStl("model.glb");
} catch (error) {
  if (error instanceof SlicedFileError) {
    // Sliced 3MF file detected
  } else if (error instanceof UnsupportedFormatError) {
    // Unsupported format
  } else if (error instanceof ConversionError) {
    // Conversion failed
  }
}
```

## Metadata

```typescript
const result = await ModelConverter.convert(...);
console.log(result.metadata);
// {
//   vertices: 1234,
//   faces: 567,
//   fileSize: 98765,
//   format: 'stl',
//   boundingBox: { min, max, size }
// }
```

## Common Patterns

### Download Result

```typescript
const blob = await glbToStl("model.glb");
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "model.stl";
a.click();
URL.revokeObjectURL(url);
```

### File Input

```typescript
const input = document.querySelector('input[type="file"]');
const file = input.files[0];
const stl = await glbToStl(file);
```

### Node.js

```typescript
import { readFileSync, writeFileSync } from "fs";
const buffer = readFileSync("model.glb").buffer;
const result = await ModelConverter.convert(buffer, "glb", "stl");
const arrayBuffer = await result.blob.arrayBuffer();
writeFileSync("model.stl", Buffer.from(arrayBuffer));
```

## Important Notes

- ✅ Detects and rejects sliced 3MF files
- ✅ Binary STL is default (smaller, faster)
- ✅ Scale 1.0 = no scaling
- ✅ Works in browser and Node.js
- ❌ FBX and PLY not supported
- ❌ Sliced files not supported
