import GalleryPhoto from "../../../components/gallery-photo";

export interface GalleryPhotoProps {
  thumbnailView?: boolean;
}

export default function PhotoViewOfModernHimeji(props: GalleryPhotoProps) {
  const uri =
    "https://od73or139i.ufs.sh/f/fASTqmqQqXI16uEgpeEl8OsCSwmiuexDdh2pIbKR5cg4UvH1";
  return (
    <GalleryPhoto uri={uri} thumbnailView={props.thumbnailView}></GalleryPhoto>
  );
}
