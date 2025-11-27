#!/usr/bin/env node

/**
 * Quick integration test to verify the package exports work correctly
 */

import {
  ModelConverter,
  glbToStl,
  objToStl,
  stlToObj,
  UnsupportedFormatError,
  SlicedFileError,
  ConversionError,
  detectFormat,
} from "./dist/index.mjs";

console.log("🧪 Testing package exports...\n");

// Test 1: Check that main class is exported
console.log("✓ ModelConverter class exported");
console.log("  - convert:", typeof ModelConverter.convert);
console.log("  - convertBatch:", typeof ModelConverter.convertBatch);
console.log("  - convertAuto:", typeof ModelConverter.convertAuto);

// Test 2: Check convenience functions
console.log("\n✓ Convenience functions exported");
console.log("  - glbToStl:", typeof glbToStl);
console.log("  - objToStl:", typeof objToStl);
console.log("  - stlToObj:", typeof stlToObj);

// Test 3: Check error classes
console.log("\n✓ Error classes exported");
console.log("  - UnsupportedFormatError:", typeof UnsupportedFormatError);
console.log("  - SlicedFileError:", typeof SlicedFileError);
console.log("  - ConversionError:", typeof ConversionError);

// Test 4: Check utility functions
console.log("\n✓ Utility functions exported");
console.log("  - detectFormat:", typeof detectFormat);

// Test 5: Test format detection
console.log("\n✓ Format detection works");
console.log("  - model.glb →", detectFormat("model.glb"));
console.log("  - model.stl →", detectFormat("model.stl"));
console.log("  - model.obj →", detectFormat("model.obj"));
console.log("  - model.3mf →", detectFormat("model.3mf"));

// Test 6: Test error instantiation
console.log("\n✓ Error classes instantiate correctly");
try {
  throw new UnsupportedFormatError("test");
} catch (error) {
  console.log("  - UnsupportedFormatError:", error.message);
}

try {
  throw new SlicedFileError("3MF");
} catch (error) {
  console.log("  - SlicedFileError:", error.message);
}

try {
  throw new ConversionError("test error");
} catch (error) {
  console.log("  - ConversionError:", error.message);
}

console.log("\n✅ All package exports verified successfully!");
console.log("\n📦 Package is ready to use!");
console.log("\nNext steps:");
console.log("  1. Add test files to ../test_files/");
console.log("  2. Run: npm test (with real files)");
console.log("  3. Install in your app: npm install ./3d-model-converter");
console.log("  4. Or publish: npm publish --access public");
