import photoCatalog from "./photo-catalog.json";
import { PhotoResource } from "~/types/photo-resource";

export type GalleryCollection = {
  key: string;
  title: string;
  timelineTitle: string;
};

export const GALLERY_COLLECTIONS: GalleryCollection[] = [
  { key: "korea-seoul", title: "Korea - Seoul", timelineTitle: "2018-2019" },
  { key: "korea-jeju", title: "Korea - Jeju", timelineTitle: "2019" },
  { key: "himeji", title: "Japan - Himeji", timelineTitle: "2019" },
  { key: "korea-pacific-coast", title: "Korea - Around Gangneung (강릉시)", timelineTitle: "2019" },
];

const typedCatalog = photoCatalog as PhotoResource[];

export function getCollections(): GalleryCollection[] {
  return GALLERY_COLLECTIONS;
}

export function getAllPhotos(): PhotoResource[] {
  return typedCatalog;
}

export function getPhotosByCollection(collection: string): PhotoResource[] {
  return typedCatalog.filter((photo) => photo.collection === collection);
}

export function getPhotoBySlug(collection: string, slug: string): PhotoResource | undefined {
  return typedCatalog.find((photo) => photo.collection === collection && photo.id === slug);
}

export function getPaginatedPhotos(page: number, pageSize: number): PhotoResource[] {
  if (page < 1 || pageSize < 1) {
    return [];
  }

  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  return typedCatalog.slice(startIdx, endIdx);
}
