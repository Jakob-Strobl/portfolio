// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import {
  buildManifest,
  buildPhotoResourceFromImport,
  buildR2Key,
  buildStableSlug,
  getUploadThingSourceUrl,
  slugify,
} from "../../scripts/migration-helpers";

describe("UploadThing -> R2 migration helpers", () => {
  it("builds uploadthing source URL from key", () => {
    expect(getUploadThingSourceUrl("abc123")).toBe("https://od73or139i.ufs.sh/f/abc123");
  });

  it("slugify is stable for mixed punctuation", () => {
    expect(slugify("Seoul - City Mountain Scape.jpg")).toBe("seoul-city-mountain-scape");
    expect(slugify("Boat off the coast of Jeju")).toBe("boat-off-the-coast-of-jeju");
  });

  it("builds stable collection-prefixed slug", () => {
    expect(buildStableSlug("korea-seoul", "Seoul - Alley.jpg")).toBe("seoul-seoul-alley");
  });

  it("builds R2 key from collection and slug", () => {
    expect(buildR2Key("korea-seoul", "seoul-alley")).toBe("gallery/korea-seoul/seoul-alley.jpg");
  });

  it("builds manifest only from successful imports", () => {
    const legacyPhotos = [
      {
        collection: "korea-seoul",
        name: "Seoul - Alley.jpg",
        uploadThingKey: "key-1",
        dimensions: { x: 3200, y: 2096 },
      },
      {
        collection: "korea-jeju",
        name: "Jeju - Red Rock Ocean.jpg",
        uploadThingKey: "key-2",
        dimensions: { x: 3000, y: 1988 },
      },
    ];

    const r2Key = "gallery/korea-seoul/seoul-seoul-alley.jpg";

    const results = [
      {
        collection: "korea-seoul",
        name: "Seoul - Alley.jpg",
        uploadThingKey: "key-1",
        sourceUrl: getUploadThingSourceUrl("key-1"),
        r2Key,
        success: true,
      },
      {
        collection: "korea-jeju",
        name: "Jeju - Red Rock Ocean.jpg",
        uploadThingKey: "key-2",
        sourceUrl: getUploadThingSourceUrl("key-2"),
        r2Key: "gallery/korea-jeju/jeju-jeju-red-rock-ocean.jpg",
        success: false,
        error: "network",
      },
    ];

    const manifest = buildManifest(legacyPhotos, results);
    expect(manifest).toHaveLength(1);
    expect(manifest[0]).toEqual(buildPhotoResourceFromImport(legacyPhotos[0], r2Key));
  });
});
