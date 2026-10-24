import { A, useLocation } from "@solidjs/router";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";
import { createMemo, createSignal, For, Show } from "solid-js";
import { getImageUrl } from "~/actions/photo-actions";
import PhotoCollection from "~/components/photo-collection";
import Shadow from "~/components/shadow/shadow";
import Seo from "~/components/seo";
import {
  getCollections,
  getPaginatedPhotos,
  getPhotoDisplayName,
  getPhotoPath,
  getAllPhotos,
} from "~/data/gallery/catalog";
import { getCanonicalUrl, JsonLdNode, PERSON_ID } from "~/data/seo";
import TimelineLayout from "~/layouts/timeline-layout";

const PAGE_SIZE = 24;

const galleryPhotoList: JsonLdNode = {
  "@type": "ItemList",
  "@id": `${getCanonicalUrl("/gallery")}#photos`,
  name: "Jakob Strobl travel photography",
  numberOfItems: getAllPhotos().length,
  itemListElement: getAllPhotos().map((photo, index) => {
    const photoUrl = getCanonicalUrl(getPhotoPath(photo));

    return {
      "@type": "ListItem",
      position: index + 1,
      url: photoUrl,
      item: {
        "@type": "ImageObject",
        "@id": `${photoUrl}#image`,
        name: getPhotoDisplayName(photo),
        caption: getPhotoDisplayName(photo),
        contentUrl: getImageUrl(photo.r2Key, "full"),
        url: photoUrl,
        creator: { "@id": PERSON_ID },
      },
    };
  }),
};

export default function Gallery() {
  const location = useLocation();
  const pageSize = createMemo(() => {
    const queryPageSize = Number.parseInt(new URLSearchParams(location.search).get("pageSize") ?? "", 10);
    return Number.isFinite(queryPageSize) && queryPageSize > 0 ? queryPageSize : PAGE_SIZE;
  });

  const [currentPage, setCurrentPage] = createSignal(1);
  const visiblePhotos = createMemo(() => {
    const pages = currentPage();
    const paginated = [];

    for (let page = 1; page <= pages; page++) {
      paginated.push(...getPaginatedPhotos(page, pageSize()));
    }

    return paginated;
  });

  const collections = createMemo(() =>
    getCollections()
      .map((collection) => ({
        collection,
        photos: visiblePhotos().filter((photo) => photo.collection === collection.key),
      }))
      .filter(({ photos }) => photos.length > 0),
  );

  const hasMorePhotos = createMemo(() => getPaginatedPhotos(currentPage() + 1, pageSize()).length > 0);

  return (
    <>
      <Seo
        title="Travel Photography | Jakob Strobl"
        description="Travel photography by Jakob Strobl from Seoul, Jeju, Himeji, and Korea's Pacific coast."
        path="/gallery"
        pageType="CollectionPage"
        structuredData={galleryPhotoList}
      />
      <TimelineLayout
        navBack={() => (
          <A href="/">
            <ArrowBigLeft size={20} />
            <span class="hidden sm:inline">Home</span>
          </A>
        )}
        content={
          <>
            <h1 class="sr-only">Travel Photography</h1>
            <For each={collections()}>
              {(group, idx) => (
                <Shadow warmupDelayMs={Math.min(125 + idx() * 125, 500)} contentFadeInDelayMs={500}>
                  <PhotoCollection collection={group.collection} photos={group.photos} />
                </Shadow>
              )}
            </For>
            <Show when={hasMorePhotos()}>
              <div class="w-full flex justify-center">
                <button
                  type="button"
                  class="px-4 py-2 rounded-sm bg-night-700/70 hover:bg-night-700 transition-colors"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Load more photos
                </button>
              </div>
            </Show>
          </>
        }
      ></TimelineLayout>
    </>
  );
}
