import GalleryPhoto from "../../../components/gallery-photo";

export interface GalleryPhotoProps {
  thumbnailView?: boolean;
}

export default function PhotoSunsetGlimmer(props: GalleryPhotoProps) {
  const uri = "fASTqmqQqXI1sZyUvqV9vPXZ6p0bHc3QqiN2RsAoaWTrhzx1";
  return <GalleryPhoto uriKey={uri} thumbnailView={props.thumbnailView}></GalleryPhoto>;
}
