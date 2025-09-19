import { getUriFromKey } from "../actions/photo-actions";

export interface GalleryPhotoProps {
  uriKey: string;
  thumbnailView?: boolean;
}

export default function GalleryPhoto(props: GalleryPhotoProps) {
  const isThumbnailView = props.thumbnailView ?? true;
  return (
    <div
      class={
        isThumbnailView
          ? "w-full 2xl:h-72 md:h-54 rounded-sm bg-black"
          : // spacing: 24 (bottom nav) + (5 (layout padding) * 2) + (5 (shadow padding) * 2) + 4 Layout GAP | xl:h-24 lg:h-20 md:h-16
            "h-[calc(100vh---spacing(48))]"
      }
    >
      <a href={`/gallery/photo/${props.uriKey}`}>
        <img
          class={`w-full h-full rounded-sm transition-opacity duration-300 ${isThumbnailView ? "object-cover opacity-80 hover:opacity-100 " : "object-contain"}`}
          src={getUriFromKey(props.uriKey)}
        ></img>
      </a>
    </div>
  );
}
