export interface GalleryPhotoProps {
  uri: string;
  thumbnailView?: boolean;
}

export default function GalleryPhoto(props: GalleryPhotoProps) {
  const isThumbnailView = props.thumbnailView ?? true;
  return (
    <div class={isThumbnailView ? "w-full 2xl:h-72 md:h-54" : ""}>
      <img class="w-full h-full rounded-sm object-cover" src={props.uri}></img>
    </div>
  );
}
