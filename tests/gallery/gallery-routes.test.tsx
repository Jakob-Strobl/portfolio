import { render, fireEvent } from "@solidjs/testing-library";
import { Route, MemoryRouter, createMemoryHistory } from "@solidjs/router";
import Gallery from "../../src/routes/gallery/(gallery)";
import { waitForShadowAnimations } from "../helpers/test-utils";
import { GALLERY_COLLECTIONS, TIMELINE_TITLE_ATTR } from "../helpers/test-data";

async function renderGalleryPage(route = "/gallery") {
  const history = createMemoryHistory();
  history.set({ value: route, replace: false, scroll: false, state: undefined });

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

      const timeline2018 = page.container.querySelector(`[${TIMELINE_TITLE_ATTR}="2018-2019"]`);
      expect(timeline2018).toBeInTheDocument();

      const timeline2019 = page.container.querySelector(`[${TIMELINE_TITLE_ATTR}="2019"]`);
      expect(timeline2019).toBeInTheDocument();
    });

    it("renders at least one photo per collection", async () => {
      const page = await renderGalleryPage();

      const images = page.container.querySelectorAll("img");
      expect(images.length).toBeGreaterThanOrEqual(4);
    });

    it("uses R2 image URLs (transforms applied in production only)", async () => {
      const page = await renderGalleryPage();

      const images = page.container.querySelectorAll("img");
      expect(images.length).toBeGreaterThan(0);

      for (const image of images) {
        const src = image.getAttribute("src") ?? "";
        expect(src).toContain("images.jstrobl.dev/gallery/");
        expect(src).not.toContain("ufs.sh");
      }
    });
  });

  describe("Photo Links", () => {
    it.each(
      GALLERY_COLLECTIONS.flatMap((collection) =>
        collection.photos.map((photo) => ({
          collectionTitle: collection.title,
          collectionDir: collection.dir,
          photoId: photo.id,
        })),
      ),
    )("$collectionTitle: photo $photoId links to full screen view", async ({ collectionDir, photoId }) => {
      const page = await renderGalleryPage();

      const expectedHref = `/gallery/collections/${collectionDir}/${photoId}`;
      const photoLink = page.container.querySelector(`a[href="${expectedHref}"]`);

      expect(photoLink).toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    it("shows load-more button when page size is smaller than photo count", async () => {
      const page = await renderGalleryPage("/gallery?pageSize=4");

      const button = page.getByRole("button", { name: /load more photos/i });
      expect(button).toBeInTheDocument();
    });

    it("clicking load-more appends additional photos without duplicates", async () => {
      const page = await renderGalleryPage("/gallery?pageSize=4");

      const linksBefore = page.container.querySelectorAll('a[href^="/gallery/collections/"]');
      const uniqueBefore = new Set(Array.from(linksBefore).map((link) => link.getAttribute("href") ?? ""));
      expect(uniqueBefore.size).toBe(4);

      const button = page.getByRole("button", { name: /load more photos/i });
      await fireEvent.click(button);
      await waitForShadowAnimations();

      const linksAfter = page.container.querySelectorAll('a[href^="/gallery/collections/"]');
      const uniqueAfter = new Set(Array.from(linksAfter).map((link) => link.getAttribute("href") ?? ""));
      expect(uniqueAfter.size).toBeGreaterThan(uniqueBefore.size);
      expect(uniqueAfter.size).toBe(8);
    });
  });
});
