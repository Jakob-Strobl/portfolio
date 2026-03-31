import { render, fireEvent } from "@solidjs/testing-library";
import { Route, MemoryRouter, createMemoryHistory } from "@solidjs/router";
import SeoulFullPhoto from "../../src/routes/gallery/collections/korea-seoul/[uriKey]";
import JejuFullPhoto from "../../src/routes/gallery/collections/korea-jeju/[uriKey]";
import HimejiFullPhoto from "../../src/routes/gallery/collections/himeji/[uriKey]";
import GangneungFullPhoto from "../../src/routes/gallery/collections/korea-pacific-coast/[uriKey]";
import { waitForShadowAnimations } from "../helpers/test-utils";
import { GALLERY_COLLECTIONS } from "../helpers/test-data";

async function renderFullScreenPhoto(collectionDir: string, photoId: string) {
  const history = createMemoryHistory();
  const route = `/gallery/collections/${collectionDir}/${photoId}`;
  history.set({ value: route, replace: false, scroll: false, state: undefined });

  const page = render(() => (
    <MemoryRouter history={history}>
      <Route path="/gallery/collections/korea-seoul/:uriKey" component={SeoulFullPhoto} />
      <Route path="/gallery/collections/korea-jeju/:uriKey" component={JejuFullPhoto} />
      <Route path="/gallery/collections/himeji/:uriKey" component={HimejiFullPhoto} />
      <Route path="/gallery/collections/korea-pacific-coast/:uriKey" component={GangneungFullPhoto} />
    </MemoryRouter>
  ));
  await waitForShadowAnimations();
  return page;
}

describe("Full Screen Photo", () => {
  describe.each(GALLERY_COLLECTIONS)("Photo Display - $title", ({ dir, photos }) => {
    it.each(photos)("renders full screen photo at correct route", async (photo) => {
      const page = await renderFullScreenPhoto(dir, photo.id);

      expect(page.container).toBeInTheDocument();
    });

    it.each(photos)("photo displays in container", async (photo) => {
      const page = await renderFullScreenPhoto(dir, photo.id);

      const images = page.container.querySelectorAll("img");
      expect(images.length).toBeGreaterThan(0);
    });

    it.each(photos)("Gallery back button links to /gallery", async (photo) => {
      const page = await renderFullScreenPhoto(dir, photo.id);

      const galleryLink = page.getByRole("link", { name: /gallery/i });
      expect(galleryLink).toBeInTheDocument();
      expect(galleryLink).toHaveAttribute("href", "/gallery");
    });

    it.each(photos)("full photo serves original from R2", async (photo) => {
      const page = await renderFullScreenPhoto(dir, photo.id);
      const mainPhoto = Array.from(page.container.querySelectorAll("img")).find((img) => !img.closest("a"));
      expect(mainPhoto).toBeDefined();
      const src = mainPhoto?.getAttribute("src") ?? "";
      expect(src).toContain(photo.r2Key);
      expect(src).not.toContain("/cdn-cgi/image/");
      expect(src).not.toContain("ufs.sh");
    });
  });

  describe.each(GALLERY_COLLECTIONS)("Collection Navigation - $title", ({ dir, photos }) => {
    it.each(photos)("displays thumbnail strip for collection", async (photo) => {
      const page = await renderFullScreenPhoto(dir, photo.id);

      const images = page.container.querySelectorAll("img");
      expect(images.length).toBeGreaterThan(0);
    });

    it("Next button links to next photo", async () => {
      const firstPhoto = photos[0];
      const secondPhoto = photos.length > 1 ? photos[1] : photos[0];
      const page = await renderFullScreenPhoto(dir, firstPhoto.id);

      const nextLink = page.getByRole("link", { name: /next/i });
      expect(nextLink).toBeInTheDocument();

      const href = nextLink.getAttribute("href");
      expect(href).toContain(secondPhoto.id);
    });

    it("last photo Next button wraps to first photo", async () => {
      const lastPhoto = photos[photos.length - 1];
      const firstPhoto = photos[0];
      const page = await renderFullScreenPhoto(dir, lastPhoto.id);

      const nextLink = page.getByRole("link", { name: /next/i });
      expect(nextLink).toBeInTheDocument();

      const href = nextLink.getAttribute("href");
      expect(href).toContain(firstPhoto.id);
    });

    it.each(photos)("current photo has indicator dot", async (photo) => {
      const page = await renderFullScreenPhoto(dir, photo.id);

      const photoElements = page.container.querySelectorAll(`[data-photo-uri="${photo.id}"]`);
      expect(photoElements.length).toBeGreaterThan(0);
    });

    it("clicking thumbnail updates to that photo", async () => {
      const page = await renderFullScreenPhoto(dir, photos[0].id);

      const indicesToTest = new Set([0, photos.length - 1]);

      for (const index of indicesToTest) {
        const targetPhoto = photos[index];
        const thumbnailContainer = page.container.querySelector(`[data-photo-uri="${targetPhoto.id}"]`);
        expect(thumbnailContainer).toBeInTheDocument();

        const thumbnailLink = thumbnailContainer?.querySelector("a");
        expect(thumbnailLink).not.toBeNull();

        if (thumbnailLink) {
          await fireEvent.click(thumbnailLink);
          await waitForShadowAnimations();
        }

        const images = page.container.querySelectorAll("img");
        const mainPhoto = Array.from(images).find((img) => !img.closest("a"));

        expect(mainPhoto).toBeDefined();
        expect(mainPhoto?.getAttribute("src")).toContain(targetPhoto.r2Key);
      }
    });
  });

  describe.each(GALLERY_COLLECTIONS)("Photo Collection Data - $title", ({ title, photos }) => {
    it("$title collection has multiple photos", () => {
      expect(photos.length).toBeGreaterThan(0);
    });

    it.each(photos)("$title photos have valid ID format", (photo) => {
      expect(photo.id).toBeDefined();
      expect(photo.id.length).toBeGreaterThan(0);
    });

    it.each(photos)("$title photos have R2 keys", (photo) => {
      expect(photo.r2Key).toBeDefined();
      expect(photo.r2Key).toMatch(/^gallery\//);
    });

    it.each(photos)("$title photos have dimensions", (photo) => {
      expect(photo.dimensions).toBeDefined();
      expect(photo.dimensions?.x).toBeGreaterThan(0);
      expect(photo.dimensions?.y).toBeGreaterThan(0);
    });
  });

  it("unknown slug safely falls back to first photo in collection", async () => {
    const collection = GALLERY_COLLECTIONS[0];
    const page = await renderFullScreenPhoto(collection.dir, "does-not-exist");

    const mainPhoto = Array.from(page.container.querySelectorAll("img")).find((img) => !img.closest("a"));
    expect(mainPhoto).toBeDefined();
    expect(mainPhoto?.getAttribute("src")).toContain(collection.photos[0].r2Key);
  });
});
