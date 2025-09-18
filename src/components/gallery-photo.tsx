export interface GalleryPhotoProps {
  uri: string;
  thumbnailView?: boolean;
}

export default function GalleryPhoto(props: GalleryPhotoProps) {
  const isThumbnailView = props.thumbnailView ?? true;
  return (
    <div
      class={
        isThumbnailView
          ? "w-full 2xl:h-72 md:h-54 opacity-76 hover:opacity-100 transition-opacity duration-300"
          : // spacing: 24 (bottom nav) + (5 (layout padding) * 2) + (5 (shadow padding) * 2) + 4 Layout GAP | xl:h-24 lg:h-20 md:h-16
            "h-[calc(100vh---spacing(48))]"
      }
    >
      <img
        class={`w-full h-full rounded-sm ${isThumbnailView ? "object-cover" : "object-contain"}`}
        src={props.uri}
      ></img>
    </div>
  );
}
