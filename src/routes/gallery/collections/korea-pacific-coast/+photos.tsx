import GalleryPhoto from "~/components/gallery-photo";
import { getPhotosByCollection } from "~/data/gallery/catalog";
import { PhotoResource } from "~/types/photo-resource";

export const photoCollection: PhotoResource[] = getPhotosByCollection("korea-pacific-coast");

export interface PhotoCollectionProps {
  photos?: PhotoResource[];
}

export const PhotoCollection = (props: PhotoCollectionProps) => {
  const photos = () => props.photos ?? photoCollection;

  return (
    <div class="flex flex-col gap-4">
      <h1 class="text-4xl text-white">Korea - Around Gangneung (강릉시)</h1>
      <div class="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 gap-4">
        {photos().map((photo) => (
          <GalleryPhoto
            collectionDirName="korea-pacific-coast"
            photoId={photo.id}
            r2Key={photo.r2Key}
            dimensions={photo.dimensions}
            variant="grid"
          />
        ))}
      </div>
    </div>
  );
};
