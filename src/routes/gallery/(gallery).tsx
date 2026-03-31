import { A, useLocation } from "@solidjs/router";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";
import { createMemo, createSignal, For, Show } from "solid-js";
import Shadow from "~/components/shadow/shadow";
import { getCollections, getPaginatedPhotos } from "~/data/gallery/catalog";
import TimelineLayout, { timelineTitleDatasetKey } from "~/layouts/timeline-layout";
import { PhotoCollection as GangneungPhotoCollection } from "./collections/korea-pacific-coast/+photos";
import { PhotoCollection as HimejiPhotoCollection } from "./collections/himeji/+photos";
import { PhotoCollection as JejuPhotoCollection } from "./collections/korea-jeju/+photos";
import { PhotoCollection as SeoulPhotoCollection } from "./collections/korea-seoul/+photos";

export const PAGE_SIZE = 24;

const collectionComponentByKey = {
  "korea-seoul": SeoulPhotoCollection,
  "korea-jeju": JejuPhotoCollection,
  himeji: HimejiPhotoCollection,
  "korea-pacific-coast": GangneungPhotoCollection,
} as const;

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

  const visibleIds = createMemo(() => new Set(visiblePhotos().map((photo) => photo.id)));
  const collections = createMemo(() =>
    getCollections()
      .map((collection) => {
        const photos = visiblePhotos().filter(
          (photo) => photo.collection === collection.key && visibleIds().has(photo.id),
        );

        return { ...collection, photos };
      })
      .filter((collection) => collection.photos.length > 0),
  );

  const hasMorePhotos = createMemo(() => getPaginatedPhotos(currentPage() + 1, pageSize()).length > 0);

  return (
    <TimelineLayout
      defaultTitle="2025"
      navBack={() => (
        <A href="/">
          <ArrowBigLeft size={20} />
          <span class="hidden sm:inline">Home</span>
        </A>
      )}
      content={
        <>
          <For each={collections()}>
            {(collection, idx) => {
              const CollectionComponent =
                collectionComponentByKey[collection.key as keyof typeof collectionComponentByKey];
              return (
                <Shadow
                  warmupDelayMs={Math.min(125 + idx() * 125, 500)}
                  contentFadeInDelayMs={500}
                  dataset={{ [timelineTitleDatasetKey]: collection.timelineTitle }}
                >
                  <CollectionComponent photos={collection.photos} />
                </Shadow>
              );
            }}
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
  );
}
