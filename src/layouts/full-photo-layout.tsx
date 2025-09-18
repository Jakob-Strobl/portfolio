import GalleryPhoto from "../components/gallery-photo";
import Shadow from "../components/shadow/shadow";
import { PhotoResource } from "../types/photo-resource";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";
import ArrowBigRight from "lucide-solid/icons/arrow-big-right";

export interface FullPhotoLayoutProps {
  resource: PhotoResource;
  photoCollection?: PhotoResource[];
}

export default function FullPhotoLayout(props: FullPhotoLayoutProps) {
  return (
    <>
      <div class="flex flex-col gap-3 w-full h-full p-2 md:p-3 lg:p-4 xl:p-5">
        {/* spacing: 24 (bottom nav) + (5 (shadow padding) * 2 (py)) + (5 (layout padding) * 2) + 4 (Flex GAP)*/}
        {/* TODO(Investigate): Some interesting pre-defined width/heights via aspect-ratio */}
        {/* Top Row - Full Photo */}
        <div class="h-[calc(100vh---spacing(38))]">
          <Shadow>
            <GalleryPhoto uri={props.resource.uri} thumbnailView={false}></GalleryPhoto>
          </Shadow>
        </div>
        {/* Bottom Row  - Collection Navigation */}
        <div class="flex gap-2 xl:h-24 lg:h-20 md:h-16 px-16 items-center">
          <div class="">
            <Shadow>
              <div class="hover:text-shadow-lg duration-300 transition-text *:flex *:gap-1 *:items-center">
                {/* TODO: Refactor into navback prop like other layouts */}
                <a href="/">
                  <ArrowBigLeft size={20} /> Home
                </a>
              </div>
            </Shadow>
          </div>
          <div class="h-24 w-full">
            <Shadow>
              {/* Shadow padding is 5 top and bottom, so calc(h-24 - 5 (spacing) * 2) = h-20 - 10 = h-14 */}
              <div class="h-14"></div>
            </Shadow>
          </div>
          <div class="">
            <Shadow>
              <div class="hover:text-shadow-lg duration-300 transition-text *:flex *:gap-1 *:items-center">
                <a href="/">
                  Next <ArrowBigRight size={20} />
                </a>
              </div>
            </Shadow>
          </div>
        </div>
      </div>
    </>
  );
}
