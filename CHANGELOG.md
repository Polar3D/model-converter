# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-11-28

### Added
- **Attribution feature**: Automatically adds "Created using Polar3d.com" to all converted files
  - Binary STL: Added to 80-byte header
  - ASCII STL: Added to solid name line
  - OBJ: Added as comment lines at top of file
  - GLTF/GLB: Added to asset metadata (generator and copyright fields)
- `addAttribution` option in ConversionOptions (default: true)
- Can be disabled by setting `addAttribution: false`

## [1.0.0] - 2025-11-28

### Added

- Initial release
- Support for GLB, GLTF, OBJ, STL, and 3MF input formats
- Support for STL, OBJ, GLTF, and GLB output formats
- Sliced 3MF file detection and rejection
- Model transformations (scale, center, coordinate system flip)
- Batch conversion with concurrency control
- Detailed model metadata (vertices, faces, bounding box, file size)
- TypeScript support with full type definitions
- Browser and Node.js compatibility
- Comprehensive error handling with custom error types
- Progress callback support
- Multiple output formats (Blob, ArrayBuffer, Base64)
- Convenience functions for common conversions
- Auto-detection of input format
- Binary and ASCII STL export options
- Jest test suite
- Complete documentation and examples

### Features

- Zero configuration required
- Tree-shakable ESM and CJS builds
- Peer dependency on Three.js (v0.150.0+)
- MIT License

### Supported Conversions

- GLB → STL, OBJ, GLTF
- GLTF → STL, OBJ, GLB
- OBJ → STL, GLTF, GLB
- STL → OBJ, GLTF, GLB
- 3MF → STL, OBJ, GLTF, GLB (unsliced only)

### Not Supported

- FBX format (planned for future release)
- PLY format (planned for future release)
- Sliced 3MF files (contains gcode)
- Texture preservation in all conversions
- Animation data conversion
