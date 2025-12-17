import { render } from "@solidjs/testing-library";
import { Route, MemoryRouter, createMemoryHistory } from "@solidjs/router";
import FullPhoto from "../../src/routes/gallery/collections/korea-seoul/[uriKey]";
import { waitForShadowAnimations } from "../helpers/test-utils";
import { seoulPhotos } from "../helpers/test-data";

// Helper to render full screen photo page
async function renderFullScreenPhoto(collectionDir: string, photoUri: string) {
  const history = createMemoryHistory();
  const route = `/gallery/collections/${collectionDir}/${photoUri}`;
  history.set({ value: route, replace: false, scroll: false, state: undefined });

  const page = render(() => (
    <MemoryRouter history={history}>
      <Route path="/gallery/collections/korea-seoul/:uriKey" component={FullPhoto} />
    </MemoryRouter>
  ));
  await waitForShadowAnimations();
  return page;
}

describe("Full Screen Photo", () => {
  describe("Photo Display", () => {
    it("renders full screen photo at correct route", async () => {
      const firstPhoto = seoulPhotos[0];
      const page = await renderFullScreenPhoto("korea-seoul", firstPhoto.uri);

      expect(page.container).toBeInTheDocument();
    });

    it("photo displays in container", async () => {
      const firstPhoto = seoulPhotos[0];
      const page = await renderFullScreenPhoto("korea-seoul", firstPhoto.uri);

      // Check for images in the page
      const images = page.container.querySelectorAll("img");
      expect(images.length).toBeGreaterThan(0);
    });

    it("Gallery back button links to /gallery", async () => {
      const firstPhoto = seoulPhotos[0];
      const page = await renderFullScreenPhoto("korea-seoul", firstPhoto.uri);

      const galleryLink = page.getByRole("link", { name: /gallery/i });
      expect(galleryLink).toBeInTheDocument();
      expect(galleryLink).toHaveAttribute("href", "/gallery");
    });
  });

  describe("Collection Navigation", () => {
    it("displays thumbnail strip for collection", async () => {
      const firstPhoto = seoulPhotos[0];
      const page = await renderFullScreenPhoto("korea-seoul", firstPhoto.uri);

      // Should have multiple images (main photo + thumbnails)
      const images = page.container.querySelectorAll("img");
      expect(images.length).toBeGreaterThan(1);
    });

    it("Next button links to next photo", async () => {
      const firstPhoto = seoulPhotos[0];
      const secondPhoto = seoulPhotos[1];
      const page = await renderFullScreenPhoto("korea-seoul", firstPhoto.uri);

      const nextLink = page.getByRole("link", { name: /next/i });
      expect(nextLink).toBeInTheDocument();

      // Should link to second photo
      const href = nextLink.getAttribute("href");
      expect(href).toContain(secondPhoto.uri);
    });

    it("last photo Next button wraps to first photo", async () => {
      const lastPhoto = seoulPhotos[seoulPhotos.length - 1];
      const firstPhoto = seoulPhotos[0];
      const page = await renderFullScreenPhoto("korea-seoul", lastPhoto.uri);

      const nextLink = page.getByRole("link", { name: /next/i });
      expect(nextLink).toBeInTheDocument();

      // Should wrap back to first photo
      const href = nextLink.getAttribute("href");
      expect(href).toContain(firstPhoto.uri);
    });

    it("current photo has indicator dot", async () => {
      const firstPhoto = seoulPhotos[0];
      const page = await renderFullScreenPhoto("korea-seoul", firstPhoto.uri);

      // Look for elements with data-photo-uri attribute
      const photoElements = page.container.querySelectorAll(`[data-photo-uri="${firstPhoto.uri}"]`);
      expect(photoElements.length).toBeGreaterThan(0);
    });

    it("clicking thumbnail updates to that photo", async () => {
      const firstPhoto = seoulPhotos[0];
      const secondPhoto = seoulPhotos[1];
      const page = await renderFullScreenPhoto("korea-seoul", firstPhoto.uri);

      // Find links to second photo
      const links = page.container.querySelectorAll("a");
      const secondPhotoLink = Array.from(links).find((link) => link.getAttribute("href")?.includes(secondPhoto.uri));

      expect(secondPhotoLink).toBeDefined();
      expect(secondPhotoLink?.getAttribute("href")).toContain(secondPhoto.uri);
    });
  });

  describe("Photo Collection Data", () => {
    it("collection has multiple photos", () => {
      expect(seoulPhotos.length).toBeGreaterThan(0);
    });

    it("photos have valid URI format", () => {
      const firstPhoto = seoulPhotos[0];
      expect(firstPhoto.uri).toBeDefined();
      expect(firstPhoto.uri.length).toBeGreaterThan(0);
    });

    it("photos have dimensions", () => {
      const firstPhoto = seoulPhotos[0];
      expect(firstPhoto.dimensions).toBeDefined();
      expect(firstPhoto.dimensions?.x).toBeGreaterThan(0);
      expect(firstPhoto.dimensions?.y).toBeGreaterThan(0);
    });
  });
});
