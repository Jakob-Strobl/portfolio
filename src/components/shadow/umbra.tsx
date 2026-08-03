import { createRenderEffect, For, onCleanup, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import ShadowEl from "./shadow-el";
import { ShadowRect, UmbraState, ZERO_RECT } from "./types";
import { clearRemovedShadows, synchronizeShadowClientRects } from "./actions";

const [state, setState] = createStore<UmbraState>({
  shadows: [],
  removedShadows: [],
});

export { state, setState };

export interface UmbraProps {}

/**
 * Umbra is the component that manages and renders all shadow elements for shadowed elements
 */
export default function Umbra(props: UmbraProps) {
  let resizeObserver: ResizeObserver | undefined;
  let synchronizationFrame: number | undefined;
  let pendingSynchronizationScope: "all" | "fixed" | undefined;
  const observedElements = new Set<Element>();

  const scheduleSynchronization = (scope: "all" | "fixed") => {
    if (pendingSynchronizationScope !== "all") pendingSynchronizationScope = scope;
    if (synchronizationFrame !== undefined) return;
    synchronizationFrame = window.requestAnimationFrame(() => {
      synchronizationFrame = undefined;
      const nextScope = pendingSynchronizationScope ?? "all";
      pendingSynchronizationScope = undefined;
      synchronizeShadowClientRects("snap", nextScope);
    });
  };
  const scheduleFullSynchronization = () => scheduleSynchronization("all");
  const scheduleFixedSynchronization = () => scheduleSynchronization("fixed");

  const reconcileObservedElements = () => {
    if (resizeObserver == null) return;
    const nextElements = new Set<Element>(state.shadows.map((shadow) => shadow.shadowedEl));

    for (const element of observedElements) {
      if (nextElements.has(element)) continue;
      resizeObserver.unobserve(element);
      observedElements.delete(element);
    }
    for (const element of nextElements) {
      if (observedElements.has(element)) continue;
      resizeObserver.observe(element);
      observedElements.add(element);
    }
  };

  onMount(() => {
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(scheduleFullSynchronization);
      reconcileObservedElements();
    }

    document.addEventListener("toggle", scheduleFullSynchronization, true);
    window.addEventListener("resize", scheduleFullSynchronization, { passive: true });
    window.addEventListener("scroll", scheduleFixedSynchronization, { passive: true });

    // visualViewport covers browser chrome changes that do not resize the layout
    // viewport. The shared animation-frame scheduler deduplicates events when both
    // viewport APIs and ResizeObserver fire for the same layout change.
    window.visualViewport?.addEventListener("resize", scheduleFullSynchronization, { passive: true });
    window.visualViewport?.addEventListener("scroll", scheduleFixedSynchronization, { passive: true });

    onCleanup(() => {
      document.removeEventListener("toggle", scheduleFullSynchronization, true);
      window.removeEventListener("resize", scheduleFullSynchronization);
      window.removeEventListener("scroll", scheduleFixedSynchronization);
      window.visualViewport?.removeEventListener("resize", scheduleFullSynchronization);
      window.visualViewport?.removeEventListener("scroll", scheduleFixedSynchronization);
      if (synchronizationFrame !== undefined) window.cancelAnimationFrame(synchronizationFrame);
      pendingSynchronizationScope = undefined;
      resizeObserver?.disconnect();
      observedElements.clear();
    });
  });

  createRenderEffect(() => {
    if (typeof window === "undefined") return;
    const shadows = state.shadows;
    reconcileObservedElements();
    queueMicrotask(() => {
      clearRemovedShadows();
    });
    return shadows;
  });

  return (
    <For each={state.shadows}>
      {(shadowRect: ShadowRect) => {
        return (
          // Only showing once no longer Default avoids hardcoded transition from corner on first initial
          <Show when={shadowRect !== ZERO_RECT}>
            <ShadowEl rect={shadowRect}></ShadowEl>
          </Show>
        );
      }}
    </For>
  );
}
