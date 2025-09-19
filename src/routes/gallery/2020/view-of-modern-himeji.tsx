import GalleryPhoto from "../../../components/gallery-photo";

export interface GalleryPhotoProps {
  thumbnailView?: boolean;
}

export default function PhotoViewOfModernHimeji(props: GalleryPhotoProps) {
  const uri = "fASTqmqQqXI16uEgpeEl8OsCSwmiuexDdh2pIbKR5cg4UvH1";
  return <GalleryPhoto uriKey={uri} thumbnailView={props.thumbnailView}></GalleryPhoto>;
}
