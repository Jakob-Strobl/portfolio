import { test, expect } from "vitest";
import { render } from "@solidjs/testing-library";
import { version } from "../package.json";
import IsomorphicBackground from "../src/components/background";
import Home from "../src/routes";
import { isTest } from "../src/actions/test-actions";
import { Route, Router } from "@solidjs/router";

// @vitest-environment happy-dom

test("smoke test", async () => {
  const page = render(() => <IsomorphicBackground />);
  expect(page.container.querySelector("div")).toBeVisible();
  expect(page.container.querySelector("div")).toHaveClass("fixed");
  expect(page.container.querySelector("div")).toHaveClass("w-[100lvw]");
  expect(page.container.querySelector("div")).toHaveClass("h-[100lvh]");
});

test("app smoke test", async () => {
  const page = render(() => (
    <Router>
      <Route path="/" component={Home} />
    </Router>
  ));
  page.getByText("Jakob Strobl");

  const links = page.getAllByRole("link");
  expect(links.length).toEqual(4);
  expect(links[0]).toHaveTextContent("Experience");
  expect(links[1]).toHaveTextContent("Contact");
  expect(links[2]).toHaveTextContent("Photography");
  expect(links[3]).toHaveTextContent("TBD");
});

test("version number from package.json renders in page", async () => {
  const page = render(() => (
    <Router>
      <Route path="/" component={Home} />
    </Router>
  ));

  const versionNumber = page.getByText((_, element) => element?.textContent == `v${version}`);
  // not visible due to inline style
  expect(versionNumber).toBeDefined();
  expect(versionNumber).not.toBeVisible();

  // wait for transition
  await new Promise((resolve) => setTimeout(resolve, 100));

  expect(versionNumber).toBeDefined();
  expect(versionNumber).toBeVisible();
});

test("Test action: isTest returns true", () => {
  const result = isTest();
  expect(result).toBeTruthy();
});
