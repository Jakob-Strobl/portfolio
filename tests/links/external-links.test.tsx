import { render } from "@solidjs/testing-library";
import { Router, Route, MemoryRouter, createMemoryHistory } from "@solidjs/router";
import Home from "../../src/routes/index";
import Contact from "../../src/routes/contact";
import { waitForShadowAnimations } from "../helpers/test-utils";
import { EXTERNAL_LINKS, NAV_LINKS } from "../helpers/test-data";
import { version } from "../../package.json";

// Helper to render Contact page at /contact route
async function renderContactPage() {
  const history = createMemoryHistory();
  history.set({ value: "/contact", replace: false, scroll: false, state: undefined });

  const page = render(() => (
    <MemoryRouter history={history}>
      <Route path="/contact" component={Contact} />
    </MemoryRouter>
  ));
  await waitForShadowAnimations();
  return page;
}

describe("External Links", () => {
  describe("Home Page Links", () => {
    it("renders home page", async () => {
      const page = render(() => (
        <Router>
          <Route path="/" component={Home} />
        </Router>
      ));
      await waitForShadowAnimations();

      expect(page.getByText("Jakob Strobl")).toBeInTheDocument();
    });

    it("displays version number", async () => {
      const page = render(() => (
        <Router>
          <Route path="/" component={Home} />
        </Router>
      ));
      await waitForShadowAnimations();

      const versionText = page.getByText(version);
      expect(versionText).toBeInTheDocument();
    });

    it("version links to GitHub releases", async () => {
      const page = render(() => (
        <Router>
          <Route path="/" component={Home} />
        </Router>
      ));
      await waitForShadowAnimations();

      const releasesLink = page.container.querySelector(`a[href="${EXTERNAL_LINKS.github.releases}"]`);
      expect(releasesLink).toBeInTheDocument();
    });

    it("GitHub releases link opens in new tab", async () => {
      const page = render(() => (
        <Router>
          <Route path="/" component={Home} />
        </Router>
      ));
      await waitForShadowAnimations();

      const releasesLink = page.container.querySelector(`a[href="${EXTERNAL_LINKS.github.releases}"]`);
      expect(releasesLink).toHaveAttribute("target", "_blank");
    });
  });

  describe("Contact Page Links", () => {
    it("renders at /contact route", async () => {
      const page = await renderContactPage();
      expect(page.getByText("Connect with me:")).toBeInTheDocument();
    });

    it("GitHub profile link has correct URL", async () => {
      const page = await renderContactPage();

      const githubSection = page.container.querySelector("#github");
      expect(githubSection).toBeInTheDocument();

      const githubLink = githubSection?.querySelector("a");
      expect(githubLink).toHaveAttribute("href", EXTERNAL_LINKS.github.profile);
    });

    it("GitHub profile link opens in new tab", async () => {
      const page = await renderContactPage();

      const githubSection = page.container.querySelector("#github");
      const githubLink = githubSection?.querySelector("a");
      expect(githubLink).toHaveAttribute("target", "_blank");
    });

    it("GitHub link has visible label", async () => {
      const page = await renderContactPage();
      expect(page.getByText("GitHub")).toBeInTheDocument();
    });

    it("LinkedIn profile link has correct URL", async () => {
      const page = await renderContactPage();

      const linkedinSection = page.container.querySelector("#linkedin");
      expect(linkedinSection).toBeInTheDocument();

      const linkedinLink = linkedinSection?.querySelector("a");
      expect(linkedinLink).toHaveAttribute("href", EXTERNAL_LINKS.linkedin);
    });

    it("LinkedIn profile link opens in new tab", async () => {
      const page = await renderContactPage();

      const linkedinSection = page.container.querySelector("#linkedin");
      const linkedinLink = linkedinSection?.querySelector("a");
      expect(linkedinLink).toHaveAttribute("target", "_blank");
    });

    it("LinkedIn link has visible label", async () => {
      const page = await renderContactPage();
      expect(page.getByText("LinkedIn")).toBeInTheDocument();
    });
  });

  describe("Menu Navigation Links", () => {
    it("all menu links point to correct routes", async () => {
      const page = render(() => (
        <Router>
          <Route path="/" component={Home} />
        </Router>
      ));
      await waitForShadowAnimations();

      const experienceLink = page.getByRole("link", { name: "Experience" });
      const contactLink = page.getByRole("link", { name: "Contact" });
      const photographyLink = page.getByRole("link", { name: "Photography" });

      expect(experienceLink).toHaveAttribute("href", NAV_LINKS.experience);
      expect(contactLink).toHaveAttribute("href", NAV_LINKS.contact);
      expect(photographyLink).toHaveAttribute("href", NAV_LINKS.gallery);
    });
  });
});
