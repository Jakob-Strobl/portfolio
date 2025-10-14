import GalleryPhoto from "~/components/gallery-photo";
import { PhotoResource } from "~/types/photo-resource";

export const photoCollection: PhotoResource[] = [
  {
    name: "Jeju - Lighthouse viewpoint.jpg",
    uri: "fASTqmqQqXI1DrvY7fdLsW13jeYEvI0TCPkwi8gGxU6zrV5b",
    dimensions: { x: 3000, y: 2000 },
  },
  {
    name: "Jeju - Red Rock Ocean.jpg",
    uri: "fASTqmqQqXI1TsR3jSocnENl4meBXTq5CuD6QsRoUYSgViOh",
    dimensions: { x: 3000, y: 1988 },
  },
  { uri: "fASTqmqQqXI1VXwz1tbBgydWPSpiM6fRcA1EVqIv7wrQHoYe", name: "Boat off the coast of Jeju", dimensions: { x: 2560, y: 1716 } },
];

export const PhotoCollection = () => (
  <div class="flex flex-col gap-4">
    <h1 class="text-4xl text-white">Korea - Jeju</h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
      {photoCollection.map((photo) => (
        <GalleryPhoto collectionDirName="korea-jeju" uriKey={photo.uri} dimensions={photo.dimensions} />
      ))}
    </div>
  </div>
);
