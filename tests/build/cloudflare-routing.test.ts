import { describe, expect, it } from "vitest";

import viteConfig from "../../vite.config";

describe("Cloudflare Pages routing", () => {
  it("keeps every hashed build asset out of the SSR fallback", () => {
    const config = viteConfig as {
      nitro?: { cloudflare?: { pages?: { routes?: { exclude?: string[] } } } };
    };

    expect(config.nitro?.cloudflare?.pages?.routes?.exclude).toContain("/_build/*");
  });
});
