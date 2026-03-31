import { A, useParams } from "@solidjs/router";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";
import FullPhotoLayout from "~/layouts/full-photo-layout";
import { getAllPhotos } from "~/data/gallery/catalog";

export default function FullPhoto() {
  const params = useParams();
  const allPhotos = getAllPhotos();
  const fallbackPhoto = allPhotos[0];
  const photoResource = allPhotos.find((photo) => photo.id === params.uriKey) ?? fallbackPhoto;

  if (photoResource == null) {
    return null;
  }

  return (
    <FullPhotoLayout
      resource={photoResource}
      navBack={
        <A href="/gallery">
          <ArrowBigLeft size={20} />
          <span class="hidden sm:inline">Gallery</span>
        </A>
      }
      photoCollection={allPhotos}
    ></FullPhotoLayout>
  );
}
