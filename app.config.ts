import { defineConfig } from "@solidjs/start/config";
import glsl from "vite-plugin-glsl";
import solid from "vite-plugin-solid";

export default defineConfig({
  vite: {
    plugins: [glsl(), solid({ ssr: true })],
    resolve: {
      conditions: ["development", "browser"],
    },
  },
  server: {
    preset: "cloudflare-pages",
    rollupConfig: {
      external: ["node:async_hooks"]
    }
  }
});
