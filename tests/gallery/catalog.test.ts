// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { getPaginatedPhotos, getPhotoBySlug, getPhotosByCollection } from "../../src/data/gallery/catalog";

describe("Gallery catalog", () => {
  it("returns deterministic pages without overlap", () => {
    const page1 = getPaginatedPhotos(1, 4);
    const page2 = getPaginatedPhotos(2, 4);

    expect(page1).toHaveLength(4);
    expect(page2).toHaveLength(4);

    const ids = new Set([...page1, ...page2].map((photo) => photo.id));
    expect(ids.size).toBe(8);
  });

  it("resolves photo by collection and slug", () => {
    const seoulPhotos = getPhotosByCollection("korea-seoul");
    const first = seoulPhotos[0];

    const resolved = getPhotoBySlug("korea-seoul", first.id);
    expect(resolved?.id).toBe(first.id);
    expect(resolved?.collection).toBe("korea-seoul");
  });

  it("returns undefined for unknown collection slug pair", () => {
    const resolved = getPhotoBySlug("korea-seoul", "not-a-real-slug");
    expect(resolved).toBeUndefined();
  });
});
