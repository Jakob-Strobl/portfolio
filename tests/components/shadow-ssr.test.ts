// @vitest-environment node

import { createServer, type ViteDevServer } from "vite";
import solid from "vite-plugin-solid";
import { fileURLToPath } from "node:url";

type ShadowSsrHarness = {
  renderShadow: () => { html: string; removedShadowCount: number; shadowCount: number };
  renderUmbraWithRemovedShadow: () => Promise<{ removedShadowPreserved: boolean }>;
};

describe("shadow server rendering", () => {
  let server: ViteDevServer;
  let harness: ShadowSsrHarness;

  beforeAll(async () => {
    server = await createServer({
      appType: "custom",
      configFile: false,
      logLevel: "silent",
      plugins: [solid({ ssr: true })],
      resolve: { alias: { "~": fileURLToPath(new URL("../../src", import.meta.url)) } },
      server: { middlewareMode: true },
      ssr: { noExternal: ["solid-js"] },
    });
    harness = (await server.ssrLoadModule("/tests/fixtures/shadow-ssr-harness.tsx")) as ShadowSsrHarness;
  });

  afterAll(async () => {
    await server.close();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("does not register or clean up a Shadow in the server-global store", () => {
    const logging = vi.spyOn(console, "log").mockImplementation(() => {});
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = harness.renderShadow();

    expect(result.html).toContain("Server content");
    expect(result.shadowCount).toBe(0);
    expect(result.removedShadowCount).toBe(0);
    expect(logging).not.toHaveBeenCalled();
    expect(warning).not.toHaveBeenCalled();
  });

  test("does not mutate removed shadows or log from the Umbra server effect", async () => {
    const logging = vi.spyOn(console, "log").mockImplementation(() => {});
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(await harness.renderUmbraWithRemovedShadow()).toEqual({ removedShadowPreserved: true });
    expect(logging).not.toHaveBeenCalled();
    expect(warning).not.toHaveBeenCalled();
  });
});
