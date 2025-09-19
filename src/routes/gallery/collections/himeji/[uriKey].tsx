import { useParams } from "@solidjs/router";
import FullPhotoLayout from "../../../../layouts/full-photo-layout";
import { PhotoResource } from "../../../../types/photo-resource";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";
import { photoCollection } from "./+photos";

export default function FullPhoto() {
  const params = useParams();
  const photoResource: PhotoResource = {
    name: "",
    uri: params.uriKey,
  };
  return (
    <FullPhotoLayout
      resource={photoResource}
      navBack={
        <a href="/gallery">
          <ArrowBigLeft size={20} /> Home
        </a>
      }
      photoCollection={photoCollection}
    ></FullPhotoLayout>
  );
}
