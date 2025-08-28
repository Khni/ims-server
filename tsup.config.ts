import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // your entry point
  format: ["esm", "cjs"], // output both ESModule and CommonJS
  dts: true, // generate .d.ts types
  sourcemap: true, // generate sourcemaps
  clean: true, // clean dist before build
  minify: false, // set true if you want minified output
  outDir: "dist",
});
