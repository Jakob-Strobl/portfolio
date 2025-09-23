import { createSignal, For, JSX } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import GalleryPhoto from "../components/gallery-photo";
import Shadow from "../components/shadow/shadow";
import { PhotoResource } from "../types/photo-resource";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";
import ArrowBigRight from "lucide-solid/icons/arrow-big-right";
import { getUriFromKey } from "../actions/photo-actions";
// import Home from "lucide-solid/icons/home"

export interface FullPhotoLayoutProps {
  navBack?: JSX.Element;
  resource: PhotoResource;
  photoCollection?: PhotoResource[];
}

const navBackFallback = () => (
  <A href="/">
    <ArrowBigLeft size={20} /> Home
  </A>
);

export default function FullPhotoLayout(props: FullPhotoLayoutProps) {
  const location = useLocation();
  const relativeBasePath = location.pathname.slice(0, location.pathname.lastIndexOf("/"));
  const [fullPhotoUri, setFullPhotoUri] = createSignal<string>(props.resource.uri);
  return (
    <>
      <div class="flex flex-col justify-between gap-3 w-full h-full p-2 md:p-3 lg:p-4 xl:p-5">
        {/* spacing: 24 (bottom nav) + (5 (shadow padding) * 2 (py)) + (5 (layout padding) * 2) + 4 (Flex GAP)*/}
        {/* TODO(Investigate): Some interesting pre-defined width/heights via aspect-ratio */}
        {/* Top Row - Full Photo */}
        <div class="h-[calc(100vh---spacing(38))]">
          <Shadow warmupDelayMs={0}>
            <GalleryPhoto uriKey={fullPhotoUri()} thumbnailView={false}></GalleryPhoto>
          </Shadow>
        </div>
        {/* Bottom Row  - Collection Navigation */}
        <div class="flex gap-2 xl:h-24 lg:h-20 md:h-16 px-16 items-center">
          <div class="">
            <Shadow warmupDelayMs={500} origin="self">
              <div class="hover:text-shadow-lg duration-300 transition-text *:flex *:gap-1 *:items-center">
                {props.navBack ?? navBackFallback()}
              </div>
            </Shadow>
          </div>
          <div class="h-24 w-full">
            <Shadow warmupDelayMs={250} origin="self">
              {/* Shadow padding is 5 top and bottom, so calc(h-24 - 5 (spacing) * 2) = h-20 - 10 = h-14 */}
              <div class="h-14 flex gap-4">
                <For each={props.photoCollection}>
                  {(photo) => {
                    const isFullPhoto = () => photo.uri === fullPhotoUri();
                    return (
                      <div class="min-w-9 max-w-30 grid grid-rows-[1fr, 8px] flex flex-col gap-2 items-center justify-center justify-items-center self-center">
                        <A href={`${relativeBasePath}/${photo.uri}`} onClick={() => setFullPhotoUri(photo.uri)}>
                          <img class="rounded-sm max-h-14" src={getUriFromKey(photo.uri)}></img>
                        </A>
                        {isFullPhoto() ? <div class="w-1.5 h-1.5 bg-night-600 rounded-4xl"></div> : <></>}
                      </div>
                    );
                  }}
                </For>
              </div>
            </Shadow>
          </div>
          <div class="">
            <Shadow warmupDelayMs={500} origin="self">
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
