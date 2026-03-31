import { A, useParams } from "@solidjs/router";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";
import FullPhotoLayout from "~/layouts/full-photo-layout";
import { getPhotoBySlug } from "~/data/gallery/catalog";
import { photoCollection } from "./+photos";

export default function FullPhoto() {
  const params = useParams();
  const photoResource = () => getPhotoBySlug("korea-pacific-coast", params.uriKey) ?? photoCollection[0];

  return (
    <FullPhotoLayout
      resource={photoResource()}
      navBack={
        <A href="/gallery">
          <ArrowBigLeft size={20} />
          <span class="hidden sm:inline">Gallery</span>
        </A>
      }
      photoCollection={photoCollection}
    ></FullPhotoLayout>
  );
}
