import GalleryPhoto from "~/components/gallery-photo";
import { PhotoResource } from "~/types/photo-resource";

export const photoCollection: PhotoResource[] = [
  { uri: "fASTqmqQqXI1sZyUvqV9vPXZ6p0bHc3QqiN2RsAoaWTrhzx1", name: "" },
  { uri: "fASTqmqQqXI1LB5kaBjc9teUpfVYjgsAJXGlDFdzZQby5nPh", name: "" },
];

export const PhotoCollection = () => (
  <div class="flex flex-col gap-4">
    <h1 class="text-4xl text-white">Korea - Around Gangneung (강릉시)</h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
      {photoCollection.map((photo) => (
        <GalleryPhoto collectionDirName="korea-pacific-coast" uriKey={photo.uri} />
      ))}
    </div>
  </div>
);
