import { createEffect, createSignal, For, JSX } from "solid-js";
import { A, useLocation, useParams } from "@solidjs/router";
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
  const params = useParams();
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

  // Sync signals with URL changes (browser nav)
  createEffect(() => {
    const currentPath = location.pathname;
    const uriFromPath = currentPath.substring(currentPath.lastIndexOf("/") + 1);

    if (uriFromPath && uriFromPath !== fullPhotoUri()) {
      setFullPhotoUri(uriFromPath);
      setFullPhotoIdx(props.photoCollection?.findIndex((p) => p.uri === uriFromPath) ?? 0);
    }
  });

  // Sync signals with URL changes (browser nav)
  // When naving back / fwd update the full photo being displayed
  createEffect(() => {
    const currentPath = location.pathname;
    const uriFromPath = currentPath.substring(currentPath.lastIndexOf("/") + 1);

    if (uriFromPath && uriFromPath !== fullPhotoUri()) {
      setFullPhotoUri(uriFromPath);
      setFullPhotoIdx(props.photoCollection?.findIndex((p) => p.uri === uriFromPath) ?? 0);
    }
  });

  // Scroll Effect
  let scrollContainerRef!: HTMLDivElement;
  createEffect(() => {
    const currentUri = fullPhotoUri(); // Track the signal
    if (scrollContainerRef && currentUri) {
      // Find the selected photo element by data attribute
      const selectedElement = scrollContainerRef.querySelector(`[data-photo-uri="${currentUri}"]`);

      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  });

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
        <div class="grid grid-rows-1 grid-cols-[auto_minmax(0,1fr)_auto] min-w-0 gap-2 lg:px-16 md:px-12 sm:px-8 px-6 items-center">
          <div class="w-fit">
            <Shadow warmupDelayMs={500} origin="self">
              <div class="hover:text-shadow-lg duration-300 transition-text *:flex *:gap-1 *:items-center">
                {props.navBack ?? navBackFallback()}
              </div>
            </Shadow>
          </div>
          <div class="overflow-clip">
            <Shadow warmupDelayMs={250} origin="self" paddingOverride="p-2">
              <div ref={scrollContainerRef} class="h-20 flex gap-4 overflow-x-scroll scrollbar-custom items-center">
                <For each={props.photoCollection}>
                  {(photo) => {
                    const isFullPhoto = () => photo.uri === fullPhotoUri();
                    return (
                      <div
                        data-photo-uri={photo.uri}
                        class="min-w-12 max-w-24 grid grid-rows-[1fr, 8px] gap-1.5 items-center justify-between justify-items-center"
                      >
                        <A
                          href={`${relativeBasePath}/${photo.uri}`}
                          class="min-w-[inherit]"
                          onClick={() => navigateToPhoto(photo.uri)}
                        >
                          <img
                            class="rounded-sm max-h-14 min-h-10 min-w-full object-cover "
                            src={getUriFromKey(photo.uri)}
                          ></img>
                        </A>
                        <div class={`w-1.5 h-1.5 rounded-4xl ${isFullPhoto() ? "bg-night-600" : ""}`}></div>
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
                <A href={`${relativeBasePath}/${getNextPhoto().uri}`}>
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
