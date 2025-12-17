import { render } from "@solidjs/testing-library";
import { Router, Route, MemoryRouter, createMemoryHistory } from "@solidjs/router";
import { JSX } from "solid-js";

/**
 * Default wait time for Shadow component animations
 * Based on: warmupDelayMs (max 500ms) + animationDuration (750ms)
 * Rounded to 1500ms for safety margin
 */
const DEFAULT_SHADOW_WAIT_MS = 0; // 1500; // was 1500 for checking for visible, but we can
// use 0 since we switched to checking if its in the documentx

/**
 * Type for render result from @solidjs/testing-library
 */
export type TestRenderResult = ReturnType<typeof render>;

/**
 * Waits for Shadow component animations to complete
 * @param customWaitMs - Optional custom wait time in milliseconds
 */
export async function waitForShadowAnimations(customWaitMs?: number): Promise<void> {
  const waitMs = customWaitMs ?? DEFAULT_SHADOW_WAIT_MS;
  await new Promise((resolve) => setTimeout(resolve, waitMs));
}

/**
 * Renders a component wrapped in Router
 * Automatically waits for Shadow animations by default
 *
 * @param component - Component to render
 * @param options - Rendering options
 * @returns TestRenderResult from testing-library
 */
export async function renderWithRouter(
  component: () => JSX.Element,
  options?: {
    initialRoute?: string;
    waitForAnimations?: boolean;
  },
): Promise<TestRenderResult> {
  const result = render(() => (
    <Router>
      <Route path="*" component={component} />
    </Router>
  ));

  if (options?.waitForAnimations !== false) {
    await waitForShadowAnimations();
  }

  return result;
}

/**
 * Renders a component with MemoryRouter for specific route testing
 * Automatically waits for Shadow animations by default
 *
 * @param component - Component to render
 * @param route - Initial route to render at
 * @param options - Rendering options
 * @returns TestRenderResult from testing-library
 */
export async function renderWithMemoryRouter(
  component: () => JSX.Element,
  route: string,
  options?: {
    waitForAnimations?: boolean;
  },
): Promise<TestRenderResult> {
  const history = createMemoryHistory();
  history.set({ value: route, replace: false, scroll: false, state: undefined });

  const result = render(() => (
    <MemoryRouter history={history}>
      <Route path="*" component={component} />
    </MemoryRouter>
  ));

  if (options?.waitForAnimations !== false) {
    await waitForShadowAnimations();
  }

  return result;
}
