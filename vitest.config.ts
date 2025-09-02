import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // or 'istanbul'
      reporter: ["text", "html"], // text = CLI output, html = nice report
      reportsDirectory: "./coverage", // default
      include: ["src/**/*.{ts,tsx}"], // what to measure
      exclude: ["src/**/*.test.ts", "src/**/*.spec.ts"], // ignore test files
      all: true, // include files even if they have no tests
    },
  },
});
