import { defineConfig } from "@solidjs/start/config";
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  vite: {
    plugins: [glsl()]
  }
});
