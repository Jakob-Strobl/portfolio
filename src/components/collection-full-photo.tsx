import { A, useParams } from "@solidjs/router";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";
import FullPhotoLayout from "~/layouts/full-photo-layout";
import { getPhotoBySlug, getPhotosByCollection } from "~/data/gallery/catalog";

interface CollectionFullPhotoProps {
  collection: string;
}

export default function CollectionFullPhoto(props: CollectionFullPhotoProps) {
  const params = useParams();
  const photoCollection = getPhotosByCollection(props.collection);
  const photoResource = () =>
    params.uriKey == null
      ? photoCollection[0]
      : (getPhotoBySlug(props.collection, params.uriKey) ?? photoCollection[0]);

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
