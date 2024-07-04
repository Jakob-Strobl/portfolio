import { test, expect } from "vitest";
import { render } from "@solidjs/testing-library";
import IsomorphicBackground from "../src/components/background";
import App from "../src/app";

// @vitest-environment happy-dom

test("smoke test", async () => {
  const result = render(() => <IsomorphicBackground />);
  expect(result.container.querySelector("div.w-screen.h-screen")).toBeVisible();
});

test("app smoke test", async () => {
  const result = render(() => <App></App>);
  const link = result.getByTestId("link");
  expect(link).toHaveTextContent("start.solidjs.com");
});
