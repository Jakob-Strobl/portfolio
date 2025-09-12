import GalleryPhoto from "../../../components/gallery-photo";

export interface GalleryPhotoProps {
  thumbnailView?: boolean;
}

export default function PhotoTemp(props: GalleryPhotoProps) {
  const uri = "https://picsum.photos/2560/1440/?blur";
  return (
    <GalleryPhoto uri={uri} thumbnailView={props.thumbnailView}></GalleryPhoto>
  );
}
