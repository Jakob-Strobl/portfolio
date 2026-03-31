import { A } from "@solidjs/router";
import { aspectRatio } from "~/actions/vector-actions";
import { getImageUrl } from "~/actions/photo-actions";
import { PhotoVariantKey } from "~/types/photo-resource";
import { Vec2 } from "~/types/vector2";

export interface GalleryPhotoProps {
  photoId: string;
  r2Key: string;
  thumbnailView?: boolean;
  collectionDirName?: string;
  dimensions?: Vec2;
  variant?: PhotoVariantKey;
  loading?: "eager" | "lazy";
}

export default function GalleryPhoto(props: GalleryPhotoProps) {
  const isThumbnailView = props.thumbnailView ?? true;
  const variant = props.variant ?? (isThumbnailView ? "grid" : "full");
  const fullScreenLink = `/gallery/collections/${props.collectionDirName ? props.collectionDirName + "/" : ""}${props.photoId}`;

  return (
    <div
      class={
        isThumbnailView
          ? "w-screen max-w-full 2xl:h-72 xl:h-64 lg:h-56 md:h-64 sm:h-48 h-40 rounded-sm bg-black"
          : "h-full"
      }
    >
      {isThumbnailView ? (
        <A href={fullScreenLink}>
          <img
            class={`w-full h-full rounded-sm transition-opacity duration-300 ${isThumbnailView ? "object-cover opacity-80 hover:opacity-100 " : "object-contain"}`}
            src={getImageUrl(props.r2Key, variant)}
            aspect-ratio={aspectRatio(props.dimensions)}
            width={props.dimensions?.x}
            height={props.dimensions?.y}
            loading={props.loading ?? "lazy"}
            decoding="async"
          ></img>
        </A>
      ) : (
        <img
          class={`w-full h-full rounded-sm transition-opacity duration-300 ${isThumbnailView ? "object-cover opacity-80 hover:opacity-100 " : "object-contain"}`}
          src={getImageUrl(props.r2Key, variant)}
          loading={props.loading ?? "eager"}
          decoding="async"
        ></img>
      )}
    </div>
  );
}
