import { render } from "@solidjs/testing-library";
import { Route, MemoryRouter, createMemoryHistory } from "@solidjs/router";
import Gallery from "../../src/routes/gallery/(gallery)";
import { waitForShadowAnimations } from "../helpers/test-utils";
import { GALLERY_COLLECTIONS, TIMELINE_TITLE_ATTR } from "../helpers/test-data";

// Helper to render gallery page at /gallery route
async function renderGalleryPage() {
  const history = createMemoryHistory();
  history.set({ value: "/gallery", replace: false, scroll: false, state: undefined });

  const page = render(() => (
    <MemoryRouter history={history}>
      <Route path="/gallery" component={Gallery} />
    </MemoryRouter>
  ));
  await waitForShadowAnimations();
  return page;
}

describe("Gallery Routes", () => {
  describe("Gallery Index Page (/gallery)", () => {
    it("renders successfully", async () => {
      const page = await renderGalleryPage();
      expect(page.container).toBeInTheDocument();
    });

    it("has Home back button linking to /", async () => {
      const page = await renderGalleryPage();

      const homeLink = page.getByRole("link", { name: /home/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute("href", "/");
    });

    it("displays all 4 collection titles", async () => {
      const page = await renderGalleryPage();

      for (const collection of GALLERY_COLLECTIONS) {
        const title = page.getByText(collection.title);
        expect(title).toBeInTheDocument();
      }
    });

    it("shows correct timeline headers", async () => {
      const page = await renderGalleryPage();

      // Check for "2018-2019" timeline
      const timeline2018 = page.container.querySelector(`[${TIMELINE_TITLE_ATTR}="2018-2019"]`);
      expect(timeline2018).toBeInTheDocument();

      // Check for "2019" timeline (appears multiple times, just verify one exists)
      const timeline2019 = page.container.querySelector(`[${TIMELINE_TITLE_ATTR}="2019"]`);
      expect(timeline2019).toBeInTheDocument();
    });

    it("renders at least one photo per collection", async () => {
      const page = await renderGalleryPage();

      // Count images - should have at least 4 (one per collection minimum)
      const images = page.container.querySelectorAll("img");
      expect(images.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Photo Links", () => {
    it.each(
      GALLERY_COLLECTIONS.flatMap((collection) =>
        collection.photos.map((photo) => ({
          collectionTitle: collection.title,
          collectionDir: collection.dir,
          photoUri: photo.uri,
        })),
      ),
    )("$collectionTitle: photo $photoUri links to full screen view", async ({ collectionDir, photoUri }) => {
      const page = await renderGalleryPage();

      // Find a link with the expected href pattern
      const expectedHref = `/gallery/collections/${collectionDir}/${photoUri}`;
      const photoLink = page.container.querySelector(`a[href="${expectedHref}"]`);

      expect(photoLink).toBeInTheDocument();
    });
  });
});
