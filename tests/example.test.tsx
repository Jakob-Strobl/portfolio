import { test, expect } from "vitest";
import { render } from "@solidjs/testing-library";
import { version } from "../package.json";
import IsomorphicBackground from "../src/components/background";
import Home from "../src/routes";

// @vitest-environment happy-dom

test("smoke test", async () => {
  const page = render(() => <IsomorphicBackground />);
  expect(page.container.querySelector("div.w-screen.h-screen")).toBeVisible();
});

test("app smoke test", async () => {
  const page = render(() => <Home></Home>);
  page.getByText("Jakob Strobl");

  const links = page.getAllByRole("link");
  expect(links.length).toEqual(2);
  expect(links[0]).toHaveTextContent("Experience");
  expect(links[1]).toHaveTextContent("Contact");
});

test("version number from package.json renders in page", async () => {
  const page = render(() => <Home></Home>);

  const versionNumber = page.getByText(
    (_, element) => element?.textContent == `v${version}`,
  );
  expect(versionNumber).toBeVisible();
});
