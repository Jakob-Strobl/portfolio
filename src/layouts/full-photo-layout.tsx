import { createEffect, createSignal, For, JSX } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";
import ArrowBigRight from "lucide-solid/icons/arrow-big-right";
import { getImageUrl } from "~/actions/photo-actions";
import GalleryPhoto from "~/components/gallery-photo";
import Seo from "~/components/seo";
import Shadow from "~/components/shadow/shadow";
import { getCanonicalUrl, PERSON_ID } from "~/data/seo";
import { getCollectionByKey, getPhotoDisplayName, getPhotoPath } from "~/data/gallery/catalog";
import { PhotoResource } from "~/types/photo-resource";

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
  const [fullPhotoId, setFullPhotoId] = createSignal<string>(props.resource.id);
  const [fullPhotoIdx, setFullPhotoIdx] = createSignal<number>(
    props.photoCollection?.findIndex((photo) => photo.id === fullPhotoId()) ?? 0,
  );

  const fullPhotoResource = () => props.photoCollection?.find((photo) => photo.id === fullPhotoId()) ?? props.resource;
  const relativeBasePath = () => `/gallery/collections/${fullPhotoResource().collection}`;
  const photoPath = () => getPhotoPath(fullPhotoResource());
  const photoName = () => getPhotoDisplayName(fullPhotoResource());
  const collectionTitle = () => getCollectionByKey(fullPhotoResource().collection)?.title ?? "Travel photography";

  const getNextPhoto = () => {
    if (!props.photoCollection || props.photoCollection.length <= 1) {
      return props.resource;
    }

    const currentIdx = fullPhotoIdx();
    const nextIdx = (currentIdx + 1) % props.photoCollection.length;
    return props.photoCollection[nextIdx];
  };

  const navigateToPhoto = (photoId: string) => {
    setFullPhotoId(photoId);
    setFullPhotoIdx(props.photoCollection?.findIndex((p) => p.id === photoId) ?? 0);
  };

  createEffect(() => {
    const currentPath = location.pathname;
    const idFromPath = currentPath.substring(currentPath.lastIndexOf("/") + 1);

    if (idFromPath && idFromPath !== fullPhotoId()) {
      setFullPhotoId(idFromPath);
      setFullPhotoIdx(props.photoCollection?.findIndex((p) => p.id === idFromPath) ?? 0);
    }
  });

  let scrollContainerRef!: HTMLDivElement;
  createEffect(() => {
    const currentId = fullPhotoId();
    if (scrollContainerRef && currentId) {
      const selectedElement = scrollContainerRef.querySelector(`[data-photo-uri="${currentId}"]`);
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
      <Seo
        title={`${photoName()} | ${collectionTitle()} Photography | Jakob Strobl`}
        description={`${photoName()}, a travel photograph from ${collectionTitle()}, by Jakob Strobl.`}
        path={photoPath()}
        structuredData={[
          {
            "@type": "Photograph",
            "@id": `${getCanonicalUrl(photoPath())}#photo`,
            name: photoName(),
            caption: photoName(),
            contentUrl: getImageUrl(fullPhotoResource().r2Key, "full"),
            url: getCanonicalUrl(photoPath()),
            creator: { "@id": PERSON_ID },
            isPartOf: { "@id": `${getCanonicalUrl("/gallery")}#webpage` },
          },
        ]}
      />
      <div class="grid grid-rows-[minmax(0,1fr)_auto_auto] grid-cols-1 justify-around gap-3 w-full h-[100svh] p-2 md:p-3 lg:p-4 xl:p-5 pb-[env(safe-area-inset-bottom)]">
        <div class="h-full">
          <Shadow warmupDelayMs={0}>
            <GalleryPhoto
              photoId={fullPhotoResource().id}
              r2Key={fullPhotoResource().r2Key}
              thumbnailView={false}
              alt={photoName()}
              variant="full"
              loading="eager"
            ></GalleryPhoto>
          </Shadow>
        </div>
        <div class="text-center text-white/80">
          <h1 class="text-lg">{photoName()}</h1>
          <p class="text-xs text-white/60">{collectionTitle()}</p>
        </div>
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
                    const isFullPhoto = () => photo.id === fullPhotoId();
                    return (
                      <div
                        data-photo-uri={photo.id}
                        class="min-w-12 max-w-24 grid grid-rows-[1fr, 8px] gap-1.5 items-center justify-between justify-items-center"
                      >
                        <A
                          href={`${relativeBasePath()}/${photo.id}`}
                          class="min-w-[inherit]"
                          onClick={() => navigateToPhoto(photo.id)}
                        >
                          <img
                            class="rounded-sm max-h-14 min-h-10 min-w-full object-cover "
                            src={getImageUrl(photo.r2Key, "thumb")}
                            alt={getPhotoDisplayName(photo)}
                            loading="lazy"
                            decoding="async"
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
                <A href={`${relativeBasePath()}/${getNextPhoto().id}`}>
                  <span class="hidden sm:inline">Next</span>
                  <ArrowBigRight size={20} />
                </A>
              </div>
            </Shadow>
          </div>
        </div>
      </div>
    </>
  );
}
