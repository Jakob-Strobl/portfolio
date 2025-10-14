import { getAspectRatio } from "~/actions/photo-actions";
import GalleryPhoto from "~/components/gallery-photo";
import { PhotoResource } from "~/types/photo-resource";

export const photoCollection: PhotoResource[] = [{ uri: "fASTqmqQqXI16uEgpeEl8OsCSwmiuexDdh2pIbKR5cg4UvH1", name: "", dimensions: { x: 2560, y: 1329 } },];

export const PhotoCollection = () => (
  <div class="flex flex-col gap-4">
    <h1 class="text-4xl text-white">Japan - Himeji</h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
      {photoCollection.map((photo) => (
        <GalleryPhoto collectionDirName="himeji" uriKey={photo.uri} dimensions={photo.dimensions} />
      ))}
    </div>
  </div>
);
