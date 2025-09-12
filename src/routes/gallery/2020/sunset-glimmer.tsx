import GalleryPhoto from "../../../components/gallery-photo";

export interface GalleryPhotoProps {
  thumbnailView?: boolean;
}

export default function PhotoSunsetGlimmer(props: GalleryPhotoProps) {
  const uri =
    "https://od73or139i.ufs.sh/f/fASTqmqQqXI1sZyUvqV9vPXZ6p0bHc3QqiN2RsAoaWTrhzx1";
  return (
    <GalleryPhoto uri={uri} thumbnailView={props.thumbnailView}></GalleryPhoto>
  );
}
