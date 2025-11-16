import { A } from "@solidjs/router";
import { getUriFromKey } from "../actions/photo-actions";
import { Vec2 } from "~/types/vector2";
import { aspectRatio } from "~/actions/vector-actions";

export interface GalleryPhotoProps {
  uriKey: string;
  thumbnailView?: boolean;
  collectionDirName?: string;
  dimensions?: Vec2;
}

export default function GalleryPhoto(props: GalleryPhotoProps) {
  const isThumbnailView = props.thumbnailView ?? true;
  const fullScreenLink = `/gallery/collections/${props.collectionDirName ? props.collectionDirName + "/" : ""}${props.uriKey}`;
  return (
    <div
      class={
        isThumbnailView
          // lg:+ is 2 columns, < lg: is 1 column so that's why md has bigger height
          ? "w-full 2xl:h-72 xl:h-64 lg:h-56 md:h-64 sm:h-48 h-40 rounded-sm bg-black"
          : // spacing: 24 (bottom nav) + (5 (layout padding) * 2) + (5 (shadow padding) * 2) + 4 Layout GAP | xl:h-24 lg:h-20 md:h-16
            "h-full"
      }
    >
      {isThumbnailView ? (
        <A href={fullScreenLink}>
          <img
            class={`w-full h-full rounded-sm transition-opacity duration-300 ${isThumbnailView ? "object-cover opacity-80 hover:opacity-100 " : "object-contain"}`}
            src={getUriFromKey(props.uriKey)}
            aspect-ratio={aspectRatio(props.dimensions)}
            width={props.dimensions?.x}
            height={props.dimensions?.y}
          ></img>
        </A>
      ) : (
        <img
          class={`w-full h-full rounded-sm transition-opacity duration-300 ${isThumbnailView ? "object-cover opacity-80 hover:opacity-100 " : "object-contain"}`}
          src={getUriFromKey(props.uriKey)}
        ></img>
      )}
    </div>
  );
}
