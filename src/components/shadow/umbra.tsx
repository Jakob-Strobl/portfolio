import { createRenderEffect, For, onCleanup, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import ShadowEl from "./shadow-el";
import { ShadowRect, UmbraState, ZERO_RECT } from "./types";
import { clearRemovedShadows, forceRecalculateShadowClientRects, synchronizeShadowClientRects } from "./actions";
import { isMobile } from "~/actions/device-actions";

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
  const observedElements = new Set<Element>();

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
      resizeObserver = new ResizeObserver(() => {
        synchronizeShadowClientRects("snap");
      });
      reconcileObservedElements();
    }

    const handleResize = () => forceRecalculateShadowClientRects();
    const handleToggle = () => synchronizeShadowClientRects("snap");
    document.addEventListener("toggle", handleToggle, true);
    onCleanup(() => document.removeEventListener("toggle", handleToggle, true));
    // Turning off on mobile because it was causing a lot of thrashing and recalcs
    // It handles tab bar collapse on Mac Safari in a desktop environment
    if (window.visualViewport && !isMobile()) {
      // Use visualViewport for modern browsers (catches window resize + Safari UI chrome tab bar)
      window.visualViewport.addEventListener("resize", handleResize, { passive: true });
      onCleanup(() => window.visualViewport?.removeEventListener("resize", handleResize));
    } else {
      // Fallback for older browsers without visualViewport API
      window.addEventListener("resize", handleResize, { passive: true });
      onCleanup(() => window.removeEventListener("resize", handleResize));
    }

    onCleanup(() => {
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
