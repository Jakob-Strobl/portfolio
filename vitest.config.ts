import { defineConfig } from "vitest/config";
import glsl from "vite-plugin-glsl";
import solid from "vite-plugin-solid";
import Package from "./package.json";

export default defineConfig({
  plugins: [solid(), glsl()],
  define: {
    "process.env.PROJECT_VERSION": JSON.stringify(Package.version),
  },
  resolve: {
    conditions: ["default"],
    alias: {
      "~/": new URL("./src/", import.meta.url).pathname,
    },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    server: {
      deps: {
        inline: [/@solidjs/],
      },
    },
  },
});
