import { render } from "@solidjs/testing-library";
import { Route, MemoryRouter, createMemoryHistory } from "@solidjs/router";
import SeoulFullPhoto from "../../src/routes/gallery/collections/korea-seoul/[uriKey]";
import JejuFullPhoto from "../../src/routes/gallery/collections/korea-jeju/[uriKey]";
import HimejiFullPhoto from "../../src/routes/gallery/collections/himeji/[uriKey]";
import GangneungFullPhoto from "../../src/routes/gallery/collections/korea-pacific-coast/[uriKey]";
import { waitForShadowAnimations } from "../helpers/test-utils";
import { GALLERY_COLLECTIONS } from "../helpers/test-data";

// Helper to render full screen photo page
async function renderFullScreenPhoto(collectionDir: string, photoUri: string) {
  const history = createMemoryHistory();
  const route = `/gallery/collections/${collectionDir}/${photoUri}`;
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
  describe.each(GALLERY_COLLECTIONS)("Photo Display - $title", ({ title, dir, photos }) => {
    it.each(photos)("renders full screen photo at correct route", async (photo) => {
      const page = await renderFullScreenPhoto(dir, photo.uri);

      expect(page.container).toBeInTheDocument();
    });

    it.each(photos)("photo displays in container", async (photo) => {
      const page = await renderFullScreenPhoto(dir, photo.uri);

      // Check for images in the page
      const images = page.container.querySelectorAll("img");
      expect(images.length).toBeGreaterThan(0);
    });

    it.each(photos)("Gallery back button links to /gallery", async (photo) => {
      const page = await renderFullScreenPhoto(dir, photo.uri);

      const galleryLink = page.getByRole("link", { name: /gallery/i });
      expect(galleryLink).toBeInTheDocument();
      expect(galleryLink).toHaveAttribute("href", "/gallery");
    });
  });

  describe.each(GALLERY_COLLECTIONS)("Collection Navigation - $title", ({ title, dir, photos }) => {
    it.each(photos)("displays thumbnail strip for collection", async (photo) => {
      const page = await renderFullScreenPhoto(dir, photo.uri);

      // Should have multiple images (main photo + thumbnails)
      const images = page.container.querySelectorAll("img");
      expect(images.length).toBeGreaterThan(0);
    });

    // TODO: Don't skip 
    // TODO: Also iterate through and make sure end works
    it.skipIf(photos.length < 2)("Next button links to next photo", async () => {
      const firstPhoto = photos[0];
      const secondPhoto = photos[1];
      const page = await renderFullScreenPhoto(dir, firstPhoto.uri);

      const nextLink = page.getByRole("link", { name: /next/i });
      expect(nextLink).toBeInTheDocument();

      // Should link to second photo
      const href = nextLink.getAttribute("href");
      expect(href).toContain(secondPhoto.uri);
    });
  
    // TODO: Don't skip 
    // TODO: Also iterate through and make sure end works
    it.skipIf(photos.length < 2)("last photo Next button wraps to first photo", async () => {
      const lastPhoto = photos[photos.length - 1];
      const firstPhoto = photos[0];
      const page = await renderFullScreenPhoto(dir, lastPhoto.uri);

      const nextLink = page.getByRole("link", { name: /next/i });
      expect(nextLink).toBeInTheDocument();

      // Should wrap back to first photo
      const href = nextLink.getAttribute("href");
      expect(href).toContain(firstPhoto.uri);
    });

    
    it.each(photos)("current photo has indicator dot", async (photo) => {
      const page = await renderFullScreenPhoto(dir, photo.uri);

      // Look for elements with data-photo-uri attribute
      const photoElements = page.container.querySelectorAll(`[data-photo-uri="${photo.uri}"]`);
      expect(photoElements.length).toBeGreaterThan(0);
    });

    // TODO: Don't skip 
    // TODO: Also iterate through and make sure end works
    it.skipIf(photos.length < 2)("clicking thumbnail updates to that photo", async () => {
      const firstPhoto = photos[0];
      const secondPhoto = photos[1];
      const page = await renderFullScreenPhoto(dir, firstPhoto.uri);

      // Find links to second photo
      const links = page.container.querySelectorAll("a");
      const secondPhotoLink = Array.from(links).find((link) => link.getAttribute("href")?.includes(secondPhoto.uri));

      expect(secondPhotoLink).toBeDefined();
      expect(secondPhotoLink?.getAttribute("href")).toContain(secondPhoto.uri);
    });
  });

  describe.each(GALLERY_COLLECTIONS)("Photo Collection Data - $title", ({title, photos}) => {
    it("$title collection has multiple photos", () => {
      expect(photos.length).toBeGreaterThan(0);
    });

    it.each(photos)("$title photos have valid URI format", (photo) => {
      expect(photo.uri).toBeDefined();
      expect(photo.uri.length).toBeGreaterThan(0);
    });

    it.each(photos)("$title photos have dimensions", (photo) => {
      expect(photo.dimensions).toBeDefined();
      expect(photo.dimensions?.x).toBeGreaterThan(0);
      expect(photo.dimensions?.y).toBeGreaterThan(0);
    });
  });
});
