import { defineConfig } from "vite";
import { solidStart } from "@solidjs/start/config";
import { nitro } from "nitro/vite";
import glsl from "vite-plugin-glsl";
import Package from "./package.json" with { type: "json" };
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), glsl(), solidStart({ solid: { ssr: true } }), nitro()],
  resolve: { conditions: ["development", "browser"] },
  define: {
    "process.env.PROJECT_VERSION": JSON.stringify(Package.version),
  },
  nitro: {
    preset: "cloudflare_pages",
    cloudflare: { nodeCompat: true, deployConfig: false },
  },
});
