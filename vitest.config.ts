import { defineConfig } from "vitest/config";
import glsl from "vite-plugin-glsl";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid(), glsl()],
});
