import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";

const external = [
  "three",
  "three/examples/jsm/loaders/GLTFLoader.js",
  "three/examples/jsm/loaders/OBJLoader.js",
  "three/examples/jsm/loaders/STLLoader.js",
  "three/examples/jsm/loaders/3MFLoader.js",
  "three/examples/jsm/exporters/STLExporter.js",
  "three/examples/jsm/exporters/OBJExporter.js",
  "three/examples/jsm/exporters/GLTFExporter.js",
  "jszip",
];

export default [
  // ESM and CJS builds
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.mjs",
        format: "es",
        sourcemap: true,
      },
      {
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: true,
      },
    ],
    external,
    plugins: [
      resolve(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
      }),
    ],
  },
  // Type definitions
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    external,
    plugins: [dts()],
  },
];
