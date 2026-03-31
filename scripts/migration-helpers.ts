import { PhotoResource } from "~/types/photo-resource";
import { Vec2 } from "~/types/vector2";

export type LegacyUploadThingPhoto = {
  collection: string;
  name: string;
  uploadThingKey: string;
  dimensions: Vec2;
};

export type MigrationResult = {
  collection: string;
  name: string;
  uploadThingKey: string;
  sourceUrl: string;
  r2Key: string;
  success: boolean;
  error?: string;
};

export function getUploadThingSourceUrl(uploadThingKey: string): string {
  return `https://od73or139i.ufs.sh/f/${uploadThingKey}`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildStableSlug(collection: string, name: string): string {
  const collectionPrefix = collection.replace(/^korea-/, "").replace(/-+/g, "-");
  return `${collectionPrefix}-${slugify(name)}`;
}

export function buildR2Key(collection: string, slug: string): string {
  return `gallery/${collection}/${slug}.jpg`;
}

export function buildPhotoResourceFromImport(
  sourcePhoto: LegacyUploadThingPhoto,
  r2Key: string,
): PhotoResource {
  return {
    id: buildStableSlug(sourcePhoto.collection, sourcePhoto.name),
    name: sourcePhoto.name,
    collection: sourcePhoto.collection,
    dimensions: sourcePhoto.dimensions,
    r2Key,
  };
}

export function buildManifest(
  photos: LegacyUploadThingPhoto[],
  results: MigrationResult[],
): PhotoResource[] {
  const r2KeyByUploadThingKey = new Map(
    results.filter((result) => result.success).map((result) => [result.uploadThingKey, result.r2Key]),
  );

  return photos
    .map((photo) => {
      const r2Key = r2KeyByUploadThingKey.get(photo.uploadThingKey);
      if (r2Key == null) {
        return undefined;
      }

      return buildPhotoResourceFromImport(photo, r2Key);
    })
    .filter((photo): photo is PhotoResource => photo != null);
}
