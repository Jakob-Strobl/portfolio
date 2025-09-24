import GalleryPhoto from "~/components/gallery-photo";
import { PhotoResource } from "~/types/photo-resource";

export const photoCollection: PhotoResource[] = [
  {
    name: "Seoul - Alley.jpg",
    uri: "fASTqmqQqXI1ureUEJXM1GkiXHOmz5ZwLf9dEK3y6ahqDxFQ",
  },
  {
    name: "Seoul - City Mountain Scape.jpg",
    uri: "fASTqmqQqXI12ZxGYAHlfs3MI57OCnEp90jguhb2A81iSRBq",
  },
  {
    name: "Seoul - Cityscape.jpg",
    uri: "fASTqmqQqXI1ybTmcnZeuGYkLVfhHI1QWA4Jxrc2zv7s6Unj",
  },
  {
    name: "Seoul - Cool Bg.jpg",
    uri: "fASTqmqQqXI13FCxNON2esL2wNqiX9l7HJYE8Mxu5vdn1Pgh",
  },

  {
    name: "Seoul - River .jpg",
    uri: "fASTqmqQqXI1nqRTnQGubPvhLdUxA9eRrt1IEVNyXwfDq0Jm",
  },
  {
    name: "Seoul - City Wide.jpg",
    uri: "fASTqmqQqXI1AtMR3BtPDOe8HmqL257cXNzFSpYW9Cyri3Bj",
  },
];

export const PhotoCollection = () => (
  <div class="flex flex-col gap-4">
    <h1 class="text-4xl text-white">Korea - Seoul</h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
      {photoCollection.map((photo) => (
        <GalleryPhoto collectionDirName="korea-seoul" uriKey={photo.uri} />
      ))}
    </div>
  </div>
);
