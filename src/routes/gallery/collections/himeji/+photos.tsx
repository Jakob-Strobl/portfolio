import GalleryPhoto from "~/components/gallery-photo";

export const photoCollection = ["fASTqmqQqXI16uEgpeEl8OsCSwmiuexDdh2pIbKR5cg4UvH1"];

export const PhotoCollection = (
  <div class="flex flex-col gap-4">
    <h1 class="text-4xl text-white">Japan - Himeji</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
      <GalleryPhoto uriKey={photoCollection[0]}></GalleryPhoto>
    </div>
  </div>
);
