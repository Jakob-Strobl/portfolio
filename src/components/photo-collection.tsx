import GalleryPhoto from "~/components/gallery-photo";
import { GalleryCollection, getPhotoDisplayName } from "~/data/gallery/catalog";
import { PhotoResource } from "~/types/photo-resource";

interface PhotoCollectionProps {
  collection: GalleryCollection;
  photos: PhotoResource[];
}

export default function PhotoCollection(props: PhotoCollectionProps) {
  return (
    <div class="flex flex-col gap-4">
      <h2 class="text-4xl text-white">{props.collection.title}</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 gap-4">
        {props.photos.map((photo) => (
          <GalleryPhoto
            collectionDirName={props.collection.key}
            photoId={photo.id}
            r2Key={photo.r2Key}
            dimensions={photo.dimensions}
            alt={`${getPhotoDisplayName(photo)} — ${props.collection.title}`}
            variant="grid"
          />
        ))}
      </div>
    </div>
  );
}
