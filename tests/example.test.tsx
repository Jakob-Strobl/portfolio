import { test, expect } from "vitest";
import { render } from "@solidjs/testing-library";
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
