import { render } from "@solidjs/testing-library";
import { Router, Route } from "@solidjs/router";
import Menu from "../../src/components/menu";
import { waitForShadowAnimations } from "../helpers/test-utils";
import { NAV_LINKS } from "../helpers/test-data";

describe("Menu Component", () => {
  it("renders all navigation links", async () => {
    const page = render(() => (
      <Router>
        <Route path="/" component={() => <Menu />} />
      </Router>
    ));
    await waitForShadowAnimations();

    const experienceLink = page.getByRole("link", { name: "Experience" });
    const contactLink = page.getByRole("link", { name: "Contact" });
    const photographyLink = page.getByRole("link", { name: "Photography" });
    const tbdLink = page.getByRole("link", { name: "TBD" });

    expect(experienceLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
    expect(photographyLink).toBeInTheDocument();
    expect(tbdLink).toBeInTheDocument();
  });

  it("Experience link points to /experience", async () => {
    const page = render(() => (
      <Router>
        <Route path="/" component={() => <Menu />} />
      </Router>
    ));
    await waitForShadowAnimations();

    const experienceLink = page.getByRole("link", { name: "Experience" });
    expect(experienceLink).toHaveAttribute("href", NAV_LINKS.experience);
  });

  it("Contact link points to /contact", async () => {
    const page = render(() => (
      <Router>
        <Route path="/" component={() => <Menu />} />
      </Router>
    ));
    await waitForShadowAnimations();

    const contactLink = page.getByRole("link", { name: "Contact" });
    expect(contactLink).toHaveAttribute("href", NAV_LINKS.contact);
  });

  it("Photography link points to /gallery", async () => {
    const page = render(() => (
      <Router>
        <Route path="/" component={() => <Menu />} />
      </Router>
    ));
    await waitForShadowAnimations();

    const photographyLink = page.getByRole("link", { name: "Photography" });
    expect(photographyLink).toHaveAttribute("href", NAV_LINKS.gallery);
  });

  it("TBD link is present", async () => {
    const page = render(() => (
      <Router>
        <Route path="/" component={() => <Menu />} />
      </Router>
    ));
    await waitForShadowAnimations();

    const tbdLink = page.getByRole("link", { name: "TBD" });
    expect(tbdLink).toBeInTheDocument();
    expect(tbdLink).toHaveAttribute("href", NAV_LINKS.home);
  });
});
