import { defineConfig } from "@solidjs/start/config";
import glsl from "vite-plugin-glsl";
import solid from "vite-plugin-solid";
import Package from "./package.json";

export default defineConfig({
  vite: {
    plugins: [glsl(), solid({ ssr: true })],
    resolve: {
      conditions: ["development", "browser"],
    },
    esbuild: {
      define: {
        "process.env.PROJECT_VERSION": JSON.stringify(Package.version),
      },
    },
  },
  server: {
    preset: "cloudflare-pages",
    rollupConfig: {
      external: ["__STATIC_CONTENT_MANIFEST", "node:async_hooks"],
    },
  },
});
