import { PhotoResource } from "~/types/photo-resource";
import { aspectRatio } from "./vector-actions";

/**
 * Get the URI of the photo stored on Upload Thing via its key
 * @param uriKey
 * @returns Fully qualified URI to the photo
 */
export function getUriFromKey(uriKey: string): string {
  return `https://od73or139i.ufs.sh/f/${uriKey}`;
}

/**
 * Give me that ratio of the photo resource (if dimensions are defined)
 * @param photo the static resource to get the aspect ratio of
 * @returns Aspect ratio as a floating point number and defaults to 3:2 if dimensions are not known
 */
export function getAspectRatio(photo: PhotoResource): number {
  if (photo.dimensions == null) {
    return 1.5; // default to 3:2
  }
  return aspectRatio(photo.dimensions);
}
