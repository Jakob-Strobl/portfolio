// @vitest-environment happy-dom

import { render, waitFor } from "@solidjs/testing-library";
import { createSignal, type Setter } from "solid-js";

import Shadow from "../../src/components/shadow/shadow";
import Umbra, { setState, state } from "../../src/components/shadow/umbra";
import {
  addShadow,
  beginShadowEntrance,
  completeShadowTransition,
  forceRecalculateShadowClientRects,
  removeShadow,
  synchronizeShadowClientRects,
} from "../../src/components/shadow/actions";
import type { ShadowRect, ShadowStates } from "../../src/components/shadow/types";

class ResizeObserverMock {
  static instances: ResizeObserverMock[] = [];

  readonly observe = vi.fn<(target: Element) => void>();
  readonly unobserve = vi.fn<(target: Element) => void>();
  readonly disconnect = vi.fn<() => void>();

  constructor(private readonly callback: ResizeObserverCallback) {
    ResizeObserverMock.instances.push(this);
  }

  trigger() {
    this.callback([], this as unknown as ResizeObserver);
  }
}

type MutableLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
};

function mockLayout(element: HTMLElement, layout: MutableLayout, onRead?: () => void) {
  vi.spyOn(element, "getBoundingClientRect").mockImplementation(() => {
    onRead?.();
    return new DOMRect(layout.x, layout.y, layout.width, layout.height);
  });
  vi.spyOn(element, "checkVisibility").mockImplementation(() => layout.visible);
  vi.spyOn(element, "getClientRects").mockImplementation(
    () =>
      (layout.width > 0 && layout.height > 0
        ? [new DOMRect(layout.x, layout.y, layout.width, layout.height)]
        : []) as unknown as DOMRectList,
  );
}

async function flushSynchronizationFrame() {
  await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
}

function createShadowRect(
  element: HTMLDivElement,
  layout: MutableLayout,
  writeLog: string[] = [],
  initialState: ShadowStates = "warm",
): ShadowRect {
  const [position, setPositionSignal] = createSignal({ x: layout.x, y: layout.y });
  const [dimensions, setDimensionsSignal] = createSignal({ x: layout.width, y: layout.height });
  const [activePosition, setActivePositionSignal] = createSignal({ x: layout.x, y: layout.y });
  const [activeDimensions, setActiveDimensionsSignal] = createSignal({ x: layout.width, y: layout.height });
  const [settlingEpoch, advanceSettlingEpochSignal] = createSignal(0);
  const [visible, setVisibleSignal] = createSignal(layout.visible);
  const [snapToSource, setSnapToSourceSignal] = createSignal(false);
  const [shadowState, setShadowStateSignal] = createSignal<ShadowStates>(initialState);
  const wrapSetter = <T,>(name: string, setter: Setter<T>): Setter<T> =>
    ((value: T | ((previous: T) => T)) => {
      writeLog.push(name);
      return (setter as (nextValue: T | ((previous: T) => T)) => T)(value);
    }) as Setter<T>;

  return {
    shadowedEl: element,
    position,
    setPosition: wrapSetter("position", setPositionSignal),
    dimensions,
    setDimensions: wrapSetter("dimensions", setDimensionsSignal),
    activePosition,
    setActivePosition: wrapSetter("active-position", setActivePositionSignal),
    activeDimensions,
    setActiveDimensions: wrapSetter("active-dimensions", setActiveDimensionsSignal),
    settlingEpoch,
    advanceSettlingEpoch: wrapSetter("settling-epoch", advanceSettlingEpochSignal),
    visible,
    setVisible: wrapSetter("visible", setVisibleSignal),
    snapToSource,
    setSnapToSource: wrapSetter("snap", setSnapToSourceSignal),
    shadowState,
    setShadowState: wrapSetter("state", setShadowStateSignal),
    origin: { position: { x: layout.x, y: layout.y }, dimensions: { x: layout.width, y: layout.height } },
    warmupDelayMs: 0,
    fixed: false,
  };
}

describe("Umbra shadow geometry observer", () => {
  beforeEach(() => {
    ResizeObserverMock.instances = [];
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    setState({ shadows: [], removedShadows: [] });
  });

  afterEach(() => {
    setState({ shadows: [], removedShadows: [] });
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test("resizes an expanded source without duplicate observer registration", async () => {
    const page = render(() => (
      <>
        <Umbra />
        <Shadow>Expandable content</Shadow>
      </>
    ));
    const source = page.container.querySelector<HTMLDivElement>("[data-shadow]")!;
    const layout = { x: 12, y: 24, width: 240, height: 80, visible: true };
    mockLayout(source, layout);
    const observer = ResizeObserverMock.instances[0];
    state.shadows[0].setShadowState("warm");

    observer.trigger();
    layout.height = 220;
    observer.trigger();
    await flushSynchronizationFrame();

    expect(observer.observe).toHaveBeenCalledTimes(1);
    expect(state.shadows).toHaveLength(1);
    expect(state.shadows[0].dimensions()).toEqual({ x: 240, y: 220 });
    expect(state.shadows[0].activeDimensions()).toEqual({ x: 240, y: 220 });
    expect(state.shadows[0].snapToSource()).toBe(true);
    await waitFor(() => expect(page.container.querySelector(".transition-none")).toBeInTheDocument());
  });

  test("queues several cold observer corrections and commits one frozen entrance destination", async () => {
    const page = render(() => (
      <>
        <Umbra />
        <Shadow warmupDelayMs={250}>Lazy route card</Shadow>
      </>
    ));
    const source = page.container.querySelector<HTMLDivElement>("[data-shadow]")!;
    const layout = { x: 24, y: 320, width: 280, height: 160, visible: true };
    mockLayout(source, layout);

    const shadow = state.shadows[0];
    const originalActivePosition = shadow.activePosition();
    const originalActiveDimensions = shadow.activeDimensions();
    ResizeObserverMock.instances[0].trigger();
    layout.y = 360;
    layout.height = 220;
    ResizeObserverMock.instances[0].trigger();
    await flushSynchronizationFrame();

    expect(shadow.shadowState()).toBe("settling");
    expect(shadow.position()).toEqual({ x: 24, y: 360 });
    expect(shadow.dimensions()).toEqual({ x: 280, y: 220 });
    expect(shadow.activePosition()).toEqual(originalActivePosition);
    expect(shadow.activeDimensions()).toEqual(originalActiveDimensions);
    expect(shadow.settlingEpoch()).toBe(1);
    expect(beginShadowEntrance(source.dataset.shadow!)).toBe(true);
    expect(shadow.shadowState()).toBe("mounted");
    expect(shadow.activePosition()).toEqual({ x: 24, y: 360 });
    expect(shadow.activeDimensions()).toEqual({ x: 280, y: 220 });
    expect(beginShadowEntrance(source.dataset.shadow!)).toBe(false);
    await waitFor(() => {
      const detached = page.container.querySelector<HTMLElement>("div[style*='translate3d']")!;
      expect(detached).not.toHaveClass("transition-none");
      expect(detached.className).toContain("transition-[transform,opacity,background-color]");
    });
  });

  test("settles a hidden entrance without waiting for an impossible transition end", () => {
    const element = document.body.appendChild(document.createElement("div"));
    element.dataset.shadow = "hidden-card";
    const layout = { x: 24, y: 360, width: 280, height: 220, visible: false };
    mockLayout(element, layout);
    const shadow = createShadowRect(element, layout, [], "fade-in");
    setState({ shadows: [shadow] });

    expect(beginShadowEntrance("hidden-card")).toBe(true);
    expect(shadow.shadowState()).toBe("warm");
    expect(shadow.snapToSource()).toBe(true);
    expect(shadow.activePosition()).toEqual({ x: 24, y: 360 });
    expect(shadow.activeDimensions()).toEqual({ x: 280, y: 220 });
    element.remove();
  });

  test("queues mounted observer corrections until transition completion", () => {
    const element = document.body.appendChild(document.createElement("div"));
    element.dataset.shadow = "mounted-card";
    const layout = { x: 10, y: 20, width: 200, height: 80, visible: true };
    mockLayout(element, layout);
    const shadow = createShadowRect(element, layout, [], "mounted");
    setState({ shadows: [shadow] });

    layout.y = 52;
    layout.height = 160;
    expect(synchronizeShadowClientRects("snap")).toBe(true);
    expect(shadow.position()).toEqual({ x: 10, y: 52 });
    expect(shadow.dimensions()).toEqual({ x: 200, y: 160 });
    expect(shadow.activePosition()).toEqual({ x: 10, y: 20 });
    expect(shadow.activeDimensions()).toEqual({ x: 200, y: 80 });
    expect(shadow.snapToSource()).toBe(false);

    expect(completeShadowTransition("mounted-card")).toBe(true);
    expect(shadow.shadowState()).toBe("warm");
    expect(shadow.activePosition()).toEqual({ x: 10, y: 52 });
    expect(shadow.activeDimensions()).toEqual({ x: 200, y: 160 });
    expect(shadow.snapToSource()).toBe(true);
    element.remove();
  });

  test("remeasures every shadow when one source resize moves a sibling", () => {
    const firstElement = document.body.appendChild(document.createElement("div"));
    const secondElement = document.body.appendChild(document.createElement("div"));
    const firstLayout = { x: 10, y: 20, width: 200, height: 80, visible: true };
    const secondLayout = { x: 10, y: 120, width: 200, height: 80, visible: true };
    mockLayout(firstElement, firstLayout);
    mockLayout(secondElement, secondLayout);
    const first = createShadowRect(firstElement, firstLayout);
    const second = createShadowRect(secondElement, secondLayout);
    setState({ shadows: [first, second] });

    firstLayout.height = 180;
    secondLayout.y = 220;
    expect(synchronizeShadowClientRects("snap")).toBe(true);

    expect(first.dimensions()).toEqual({ x: 200, y: 180 });
    expect(second.position()).toEqual({ x: 10, y: 220 });
    firstElement.remove();
    secondElement.remove();
  });

  test("suppresses closed content and restores it immediately when rendered again", async () => {
    const page = render(() => (
      <>
        <Umbra />
        <details open>
          <summary>Education</summary>
          <Shadow>Education content</Shadow>
        </details>
      </>
    ));
    const details = page.container.querySelector("details")!;
    const source = page.container.querySelector<HTMLDivElement>("[data-shadow]")!;
    const layout = { x: 20, y: 40, width: 260, height: 100, visible: true };
    mockLayout(source, layout);
    const observer = ResizeObserverMock.instances[0];
    observer.trigger();
    await flushSynchronizationFrame();
    expect(beginShadowEntrance(source.dataset.shadow!)).toBe(true);
    expect(completeShadowTransition(source.dataset.shadow!)).toBe(true);

    layout.visible = false;
    details.open = false;
    details.dispatchEvent(new Event("toggle"));
    await flushSynchronizationFrame();
    expect(state.shadows[0].visible()).toBe(false);
    await waitFor(() => {
      const detachedShadow = page.container.querySelector<HTMLElement>("div[style*='translate3d']")!;
      expect(detachedShadow.style.display).toBe("none");
    });

    layout.x = 36;
    layout.y = 72;
    layout.width = 340;
    layout.height = 180;
    window.dispatchEvent(new Event("resize"));
    await flushSynchronizationFrame();
    expect(state.shadows[0].position()).toEqual({ x: 36, y: 72 });
    expect(state.shadows[0].dimensions()).toEqual({ x: 340, y: 180 });

    layout.visible = true;
    details.open = true;
    details.dispatchEvent(new Event("toggle"));
    await flushSynchronizationFrame();
    expect(state.shadows[0].visible()).toBe(true);
    expect(state.shadows[0].activePosition()).toEqual({ x: 36, y: 72 });
    expect(state.shadows[0].activeDimensions()).toEqual({ x: 340, y: 180 });
    await waitFor(() => {
      const detachedShadow = page.container.querySelector<HTMLElement>("div[style*='translate3d']")!;
      expect(detachedShadow.style.display).toBe("");
    });
  });

  test("performs every layout read before batched writes and ignores subpixel no-ops", () => {
    const log: string[] = [];
    const firstElement = document.body.appendChild(document.createElement("div"));
    const secondElement = document.body.appendChild(document.createElement("div"));
    const firstLayout = { x: 0, y: 0, width: 100, height: 50, visible: true };
    const secondLayout = { x: 0, y: 80, width: 100, height: 50, visible: true };
    mockLayout(firstElement, firstLayout, () => log.push("read-first"));
    mockLayout(secondElement, secondLayout, () => log.push("read-second"));
    const first = createShadowRect(firstElement, firstLayout, log);
    const second = createShadowRect(secondElement, secondLayout, log);
    setState({ shadows: [first, second] });

    firstLayout.height += 20;
    secondLayout.y += 20;
    expect(synchronizeShadowClientRects("snap")).toBe(true);
    const firstWriteIndex = log.findIndex((entry) => !entry.startsWith("read"));
    expect(log.slice(0, firstWriteIndex)).toEqual(["read-first", "read-second"]);

    log.length = 0;
    firstLayout.height += 0.1;
    secondLayout.y += 0.1;
    expect(synchronizeShadowClientRects("snap")).toBe(false);
    expect(log).toEqual(["read-first", "read-second"]);
    firstElement.remove();
    secondElement.remove();
  });

  test("cleans up the observer, retains resize fallback, and preserves transition recalculation", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const page = render(() => <Umbra />);
    const observer = ResizeObserverMock.instances[0];
    page.unmount();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);

    vi.stubGlobal("ResizeObserver", undefined);
    const fallback = render(() => <Umbra />);
    expect(addEventListener).toHaveBeenCalledWith("resize", expect.any(Function), { passive: true });
    fallback.unmount();
    expect(removeEventListener).toHaveBeenCalledWith("resize", expect.any(Function));

    const element = document.body.appendChild(document.createElement("div"));
    const initial = { x: 4, y: 8, width: 100, height: 60, visible: true };
    mockLayout(element, initial);
    const shadow = createShadowRect(element, initial);
    shadow.setSnapToSource(true);
    setState({ shadows: [shadow] });
    initial.width = 180;
    expect(forceRecalculateShadowClientRects()).toBe(true);
    expect(shadow.snapToSource()).toBe(false);
    expect(shadow.shadowState()).toBe("moving");
    element.remove();
  });

  test("keeps non-fixed shadows in document coordinates through scrolling and repeated layout toggles", () => {
    let scrollX = 25;
    let scrollY = 400;
    vi.spyOn(window, "scrollX", "get").mockImplementation(() => scrollX);
    vi.spyOn(window, "scrollY", "get").mockImplementation(() => scrollY);
    const element = document.body.appendChild(document.createElement("div"));
    element.dataset.shadow = "scrolling-card";
    const layout = { x: -5, y: 600, width: 300, height: 120, visible: true };
    mockLayout(element, layout);
    const [shadowState, setShadowState] = createSignal<ShadowStates>("warm");

    expect(
      addShadow(element, "self", {
        shadowState,
        setShadowState,
        warmupDelayMs: 0,
        fixed: false,
      }),
    ).toBe(true);
    const shadow = state.shadows[0];
    expect(shadow.position()).toEqual({ x: 20, y: 1000 });

    // First expansion moves the project down while scroll anchoring also moves the viewport.
    scrollY = 650;
    layout.y = 750;
    expect(synchronizeShadowClientRects("snap")).toBe(true);
    expect(shadow.position().y).toBe(1400);

    // Collapse and a second expansion use different scroll positions but resolve
    // to the same document positions as the corresponding previous states.
    scrollY = 300;
    layout.y = 700;
    synchronizeShadowClientRects("snap");
    expect(shadow.position().y).toBe(1000);
    scrollY = 720;
    layout.y = 680;
    synchronizeShadowClientRects("snap");
    expect(shadow.position().y).toBe(1400);

    // Horizontal document coordinates use the same current-scroll model.
    scrollX = 40;
    layout.x = -20;
    expect(synchronizeShadowClientRects("snap")).toBe(false);
    expect(shadow.position().x).toBe(20);
    element.remove();
  });

  test("keeps fixed shadows viewport-relative and makes cleanup idempotent", () => {
    let scrollX = 80;
    let scrollY = 500;
    vi.spyOn(window, "scrollX", "get").mockImplementation(() => scrollX);
    vi.spyOn(window, "scrollY", "get").mockImplementation(() => scrollY);
    const element = document.body.appendChild(document.createElement("div"));
    element.dataset.shadow = "fixed-card";
    const layout = { x: 20, y: -15, width: 200, height: 60, visible: true };
    mockLayout(element, layout);
    const [shadowState, setShadowState] = createSignal<ShadowStates>("warm");
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});

    addShadow(element, "self", {
      shadowState,
      setShadowState,
      warmupDelayMs: 0,
      fixed: true,
    });
    const shadow = state.shadows[0];
    expect(shadow.position()).toEqual({ x: 20, y: 0 });

    scrollX = 120;
    scrollY = 700;
    layout.y = 45;
    synchronizeShadowClientRects("snap");
    expect(shadow.position()).toEqual({ x: 20, y: 45 });

    expect(removeShadow("fixed-card")).toBe(true);
    expect(removeShadow("fixed-card")).toBe(false);
    expect(state.removedShadows).toHaveLength(1);
    expect(warning).not.toHaveBeenCalled();
    element.remove();
  });
});
