// @vitest-environment happy-dom

import { render } from "@solidjs/testing-library";
import { createSignal, Show } from "solid-js";

import Shadow from "../../src/components/shadow/shadow";
import Umbra, { setState, state } from "../../src/components/shadow/umbra";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("Shadow entrance lifecycle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    setState({ shadows: [], removedShadows: [] });
  });

  afterEach(() => {
    setState({ shadows: [], removedShadows: [] });
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  test("waits for the detached renderer's real transition end before becoming warm", async () => {
    const page = render(() => <Shadow warmupDelayMs={125}>Independent source</Shadow>);
    const source = page.container.querySelector<HTMLElement>("[data-shadow]")!;

    expect(state.shadows[0].shadowState()).toBe("fade-in");
    expect(source.style.opacity).toBe("0");

    await vi.advanceTimersByTimeAsync(34);
    await vi.advanceTimersByTimeAsync(125);
    expect(state.shadows[0].shadowState()).toBe("mounted");
    expect(source.style.opacity).toBe("100");

    await vi.advanceTimersByTimeAsync(1000);
    expect(state.shadows[0].shadowState()).toBe("mounted");
  });

  test("does not duplicate or restart source timers when the detached renderer remounts", async () => {
    const [showRenderer, setShowRenderer] = createSignal(true);
    render(() => (
      <>
        <Show when={showRenderer()}>
          <Umbra />
        </Show>
        <Shadow warmupDelayMs={125}>Stable source</Shadow>
      </>
    ));

    await vi.advanceTimersByTimeAsync(34);
    expect(vi.getTimerCount()).toBe(1);

    setShowRenderer(false);
    setShowRenderer(true);
    expect(vi.getTimerCount()).toBe(1);

    await vi.advanceTimersByTimeAsync(125);
    expect(state.shadows[0].shadowState()).toBe("mounted");
    expect(vi.getTimerCount()).toBe(0);

    const detached = document.querySelector<HTMLElement>("div[style*='translate3d']")!;
    const transitionEnd = new Event("transitionend", { bubbles: true });
    Object.defineProperty(transitionEnd, "propertyName", { value: "transform" });
    detached.dispatchEvent(transitionEnd);
    expect(state.shadows[0].shadowState()).toBe("warm");
  });

  test("preserves staggered entrances after a hydrated menu removal and suspended route gap", async () => {
    const [route, setRoute] = createSignal<"menu" | "loading" | "experience">("menu");
    const page = render(() => (
      <>
        <Umbra />
        <Show when={route() === "menu"}>
          <Shadow warmupDelayMs={0}>Menu</Shadow>
        </Show>
        <Show when={route() === "experience"}>
          <Shadow warmupDelayMs={125}>Level Up</Shadow>
          <Shadow warmupDelayMs={250}>Cox Automotive</Shadow>
          <Shadow warmupDelayMs={375}>University of Pittsburgh</Shadow>
        </Show>
      </>
    ));

    await vi.advanceTimersByTimeAsync(34);
    expect(state.shadows[0].shadowState()).toBe("mounted");

    setRoute("loading");
    await vi.runAllTicks();
    expect(state.shadows).toHaveLength(0);
    expect(state.removedShadows).toHaveLength(0);

    setRoute("experience");
    const sources = Array.from(page.container.querySelectorAll<HTMLElement>("[data-shadow]"));
    expect(state.shadows.map((shadow) => shadow.shadowState())).toEqual(["fade-in", "fade-in", "fade-in"]);
    expect(sources.map((source) => source.style.opacity)).toEqual(["0", "0", "0"]);

    await vi.advanceTimersByTimeAsync(34);
    await vi.advanceTimersByTimeAsync(125);
    expect(state.shadows.map((shadow) => shadow.shadowState())).toEqual(["mounted", "fade-in", "fade-in"]);
    expect(sources.map((source) => source.style.opacity)).toEqual(["100", "0", "0"]);

    await vi.advanceTimersByTimeAsync(125);
    expect(state.shadows.map((shadow) => shadow.shadowState())).toEqual(["mounted", "mounted", "fade-in"]);

    await vi.advanceTimersByTimeAsync(125);
    expect(state.shadows.map((shadow) => shadow.shadowState())).toEqual(["mounted", "mounted", "mounted"]);
  });
});
