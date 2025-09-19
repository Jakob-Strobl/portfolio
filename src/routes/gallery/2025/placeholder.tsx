import GalleryPhoto from "../../../components/gallery-photo";

export interface GalleryPhotoProps {
  thumbnailView?: boolean;
}

export default function PhotoTemp(props: GalleryPhotoProps) {
  const uri = "https://picsum.photos/2560/1440/?blur";
  return (
    <div class={"w-full 2xl:h-72 md:h-54 rounded-sm bg-black"}>
      <img
        class={`w-full h-full opacity-80 hover:opacity-100 rounded-sm transition-opacity duration-300 object-cover`}
        src={uri}
      ></img>
    </div>
  );
}
