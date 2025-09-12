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
          ? "lg:w-42 lg:h-42 md:w-36 md:h-36 w-32 h-32 overflow-hidden"
          : ""
      }
    >
      <img class="w-full h-full rounded-sm object-cover" src={props.uri}></img>
    </div>
  );
}
