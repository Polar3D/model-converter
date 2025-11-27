# Setup Guide

## For Development

### 1. Install Dependencies

```bash
cd 3d-model-converter
npm install
```

### 2. Build the Package

```bash
npm run build
```

This will create the `dist/` directory with:

- `index.mjs` - ES Module build
- `index.cjs` - CommonJS build
- `index.d.ts` - TypeScript type definitions

### 3. Run Tests

First, add test files to `../test_files/` directory (see `test_files/README.md` for details).

Then run:

```bash
npm test
```

Or watch mode:

```bash
npm run test:watch
```

### 4. Development Mode

Watch for changes and rebuild automatically:

```bash
npm run dev
```

## For Publishing to npm

### 1. Update Version

```bash
npm version patch  # or minor, or major
```

### 2. Build

```bash
npm run build
```

### 3. Test Locally

Link the package locally to test in another project:

```bash
npm link

# In another project
npm link @polar3d/model-converter
```

### 4. Publish

```bash
npm publish --access public
```

## Using in Your Angular App

### 1. Install the Package

```bash
# In mbele-pro root
npm install ./3d-model-converter
```

Or after publishing:

```bash
npm install @polar3d/model-converter
```

### 2. Update the AI Model Processing Service

Replace the current implementation in `ai-model-processing.service.ts`:

```typescript
// OLD
import { ThreeJSHelperService } from "../threejs/threejs-helper/threejs-helper.service";

const stlBlob = await this.threeJSHelperService.convertGLBtoSTL(objectData.modelUrl, this.buildPlateService);

// NEW
import { glbToStl } from "@polar3d/model-converter";

const stlBlob = await glbToStl(objectData.modelUrl, {
  binary: true,
  center: false,
});
```

### 3. Keep Backward Compatibility (Optional)

Update `threejs-helper.service.ts` to use the package internally:

```typescript
import { glbToStl } from '@polar3d/model-converter';

async convertGLBtoSTL(glbUrl: string, buildPlateService: any): Promise<Blob> {
  return glbToStl(glbUrl, { binary: true });
}
```

## Project Structure

```
3d-model-converter/
├── src/
│   ├── core/
│   │   ├── Converter.ts      # Main converter class
│   │   └── types.ts          # TypeScript interfaces
│   ├── loaders/              # Input format loaders
│   │   ├── GLBLoader.ts
│   │   ├── GLTFLoader.ts
│   │   ├── OBJLoader.ts
│   │   ├── STLLoader.ts
│   │   └── ThreeMFLoader.ts
│   ├── exporters/            # Output format exporters
│   │   ├── STLExporter.ts
│   │   ├── OBJExporter.ts
│   │   └── GLTFExporter.ts
│   ├── utils/
│   │   └── helpers.ts        # Utility functions
│   └── index.ts              # Main entry point
├── tests/
│   └── converter.test.ts     # Test suite
├── examples/                 # Usage examples
├── dist/                     # Build output (generated)
├── package.json
├── tsconfig.json
├── rollup.config.js
├── jest.config.js
├── README.md
├── CHANGELOG.md
└── LICENSE
```

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Run `npm run build`

### TypeScript Errors

Make sure you have TypeScript 5.0+ installed:

```bash
npm install -D typescript@latest
```

### Three.js Version Issues

The package requires Three.js >= 0.150.0. If you have an older version:

```bash
npm install three@latest
```

### Test Failures

Make sure you have added test files to `../test_files/` directory. See `test_files/README.md` for required files.

## Next Steps

1. **Add Test Files**: Copy some 3D model files to `../test_files/` to enable testing
2. **Run Tests**: `npm test` to ensure everything works
3. **Try Examples**: Check out the `examples/` directory for usage patterns
4. **Integrate**: Update your Angular app to use the package
5. **Publish**: Publish to npm when ready

## Questions?

See the main README.md for detailed API documentation and usage examples.
