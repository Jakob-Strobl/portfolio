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
  const [fullPhotoIdx, setFullPhotoIdx] = createSignal<number>(
    props.photoCollection?.findIndex((photo) => photo.uri === fullPhotoUri()) ?? 0,
  );

  const getNextPhoto = () => {
    if (!props.photoCollection || props.photoCollection.length <= 1) {
      return props.resource;
    }

    const currentIdx = fullPhotoIdx();
    const nextIdx = (currentIdx + 1) % props.photoCollection.length;
    return props.photoCollection[nextIdx];
  };

  const navigateToPhoto = (photoUri: string) => {
    setFullPhotoUri(photoUri);
    setFullPhotoIdx(props.photoCollection?.findIndex((p) => p.uri === photoUri) ?? 0);
  };

  return (
    <>
      <div class="flex flex-col justify-around gap-3 w-full h-full p-2 md:p-3 lg:p-4 xl:p-5">
        {/* spacing: 24 (bottom nav) + (5 (shadow padding) * 2 (py)) + (5 (layout padding) * 2) + 4 (Flex GAP)*/}
        {/* TODO(Investigate): Some interesting pre-defined width/heights via aspect-ratio */}
        {/* Top Row - Full Photo */}
        <div class="h-[calc(100vh---spacing(38))]">
          <Shadow warmupDelayMs={0}>
            <GalleryPhoto uriKey={fullPhotoUri()} thumbnailView={false}></GalleryPhoto>
          </Shadow>
        </div>
        {/* Bottom Row  - Collection Navigation */}
        <div class="grid grid-rows-1 grid-cols-[auto_1fr_auto] gap-2 lg:px-16 md:px-12 sm:px-8 px-6 items-center">
          <div class="w-fit">
            <Shadow warmupDelayMs={500} origin="self">
              <div class="hover:text-shadow-lg duration-300 transition-text *:flex *:gap-1 *:items-center">
                {props.navBack ?? navBackFallback()}
              </div>
            </Shadow>
          </div>
          <div class="overflow-clip">
            <Shadow warmupDelayMs={250} origin="self" paddingOverride="p-2">
              <div class="h-20 flex gap-4 overflow-x-scroll">
                <For each={props.photoCollection}>
                  {(photo) => {
                    const isFullPhoto = () => photo.uri === fullPhotoUri();
                    return (
                      <div class="min-w-12 max-w-24 grid grid-rows-[1fr, 8px] gap-1.5 items-center justify-between  justify-items-center self-center">
                        <A href={`${relativeBasePath}/${photo.uri}`} onClick={() => navigateToPhoto(photo.uri)}>
                          <img class="rounded-sm max-h-14 min-h-10" src={getUriFromKey(photo.uri)}></img>
                        </A>
                        {isFullPhoto() ? <div class="w-1.5 h-1.5 bg-night-600 rounded-4xl"></div> : <></>}
                      </div>
                    );
                  }}
                </For>
              </div>
            </Shadow>
          </div>
          <div class="w-fit">
            <Shadow warmupDelayMs={500} origin="self">
              <div class="hover:text-shadow-lg duration-300 transition-text *:flex *:gap-1 *:items-center">
                <A
                  href={`${relativeBasePath}/${getNextPhoto().uri}`}
                  onClick={() => navigateToPhoto(getNextPhoto().uri)}
                >
                  Next <ArrowBigRight size={20} />
                </A>
              </div>
            </Shadow>
          </div>
        </div>
      </div>
    </>
  );
}
