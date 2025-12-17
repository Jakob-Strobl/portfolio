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
    it("gallery photos link to full screen view", async () => {
      const page = await renderGalleryPage();

      // Get the first photo from one of the collections
      const firstCollection = GALLERY_COLLECTIONS[0];
      const firstPhoto = firstCollection.photos[0];

      // Find a link containing the photo URI
      const photoLink = page.container.querySelector(`a[href*="${firstPhoto.uri}"]`);

      expect(photoLink).toBeInTheDocument();
    });

    it("photo links follow pattern /gallery/collections/{dir}/{uriKey}", async () => {
      const page = await renderGalleryPage();

      // Get all links
      const links = page.container.querySelectorAll("a");
      const photoLinks = Array.from(links).filter((link) =>
        link.getAttribute("href")?.includes("/gallery/collections/"),
      );

      // Should have at least some photo links
      expect(photoLinks.length).toBeGreaterThan(0);

      // Verify at least one follows the pattern
      const hasCorrectPattern = photoLinks.some((link) => {
        const href = link.getAttribute("href");
        return href?.match(/\/gallery\/collections\/[\w-]+\/[\w]+/);
      });

      expect(hasCorrectPattern).toBe(true);
    });
  });
});
