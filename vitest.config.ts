import { defineConfig } from "vitest/config";
import glsl from "vite-plugin-glsl";
import solid from "vite-plugin-solid";
import Package from "./package.json";

export default defineConfig({
  plugins: [solid(), glsl()],
  define: {
    "process.env.PROJECT_VERSION": JSON.stringify(Package.version),
  },
  // TODO: can I avoid this file?
  // I was having rendering issues on the normal test runs until I made this
});
