import GalleryPhoto from "~/components/gallery-photo";
import { PhotoResource } from "~/types/photo-resource";

export const photoCollection: PhotoResource[] = [
  { uri: "fASTqmqQqXI1sZyUvqV9vPXZ6p0bHc3QqiN2RsAoaWTrhzx1", name: "" },
  { uri: "fASTqmqQqXI16uEgpeEl8OsCSwmiuexDdh2pIbKR5cg4UvH1", name: "" },
  { uri: "fASTqmqQqXI1sZyUvqV9vPXZ6p0bHc3QqiN2RsAoaWTrhzx1", name: "" },
  { uri: "fASTqmqQqXI16uEgpeEl8OsCSwmiuexDdh2pIbKR5cg4UvH1", name: "" },
];

export const PhotoCollection = (
  <div class="flex flex-col gap-4">
    <h1 class="text-4xl text-white">Korea - Around Gangneung (강릉시)</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
      <GalleryPhoto collectionDirName="korea-pacific-coast" uriKey={photoCollection[0].uri}></GalleryPhoto>
    </div>
  </div>
);
