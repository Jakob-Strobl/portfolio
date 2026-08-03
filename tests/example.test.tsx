import { fireEvent, render } from "@solidjs/testing-library";
import { Route, Router } from "@solidjs/router";

import { version } from "../package.json";
import { isTest } from "../src/actions/test-actions";
import IsomorphicBackground from "../src/components/background";
import { BackgroundProvider } from "../src/providers/background";
import Home from "../src/routes";

test("smoke test", async () => {
  const page = render(() => (
    <BackgroundProvider>
      <IsomorphicBackground />
    </BackgroundProvider>
  ));
  expect(page.container.querySelector("div")).toBeVisible();
  expect(page.container.querySelector("div")).toHaveClass("fixed");
  expect(page.container.querySelector("div")).toHaveClass("overflow-hidden");
});

test("app smoke test", async () => {
  const page = render(() => (
    <BackgroundProvider>
      <Router>
        <Route path="/" component={Home} />
      </Router>
    </BackgroundProvider>
  ));
  page.getByText("Jakob Strobl");

  const links = page.getAllByRole("link");
  expect(links.length).toEqual(5);
  expect(links[0]).toHaveTextContent("Experience");
  expect(links[1]).toHaveTextContent("Contact");
  expect(links[2]).toHaveTextContent("Photography");
  expect(links[3]).toHaveTextContent("TBD");
  expect(links[4]).toHaveAttribute("href", "https://github.com/Jakob-Strobl/portfolio/releases");
});

test("version number from package.json renders in page", async () => {
  const page = render(() => (
    <BackgroundProvider>
      <Router>
        <Route path="/" component={Home} />
      </Router>
    </BackgroundProvider>
  ));

  const versionNumber = page.getByText(version);
  // not visible due to inline style
  expect(versionNumber).toBeDefined();
  expect(versionNumber).not.toBeVisible();

  // wait for transition
  await new Promise((resolve) => setTimeout(resolve, 100));

  expect(versionNumber).toBeDefined();
  expect(versionNumber).toBeVisible();
});

test("background settings replace the home menu and restore it when closed", async () => {
  const page = render(() => (
    <BackgroundProvider>
      <Router>
        <Route path="/" component={Home} />
      </Router>
    </BackgroundProvider>
  ));

  expect(page.getByRole("link", { name: "Experience" })).toBeInTheDocument();
  await fireEvent.click(page.getByRole("button", { name: "Background settings" }));

  expect(page.queryByRole("link", { name: "Experience" })).not.toBeInTheDocument();
  expect(page.getByRole("dialog", { name: "Background" })).toBeInTheDocument();

  await fireEvent.click(page.getByRole("button", { name: "Close background settings" }));
  expect(page.getByRole("link", { name: "Experience" })).toBeInTheDocument();
});

test("Test action: isTest returns true", () => {
  const result = isTest();
  expect(result).toBeTruthy();
});
