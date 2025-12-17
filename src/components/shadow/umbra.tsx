import { createRenderEffect, For, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import ShadowEl from "./shadow-el";
import { ShadowRect, UmbraState, ZERO_RECT } from "./types";
import { clearRemovedShadows, forceRecalculateShadowClientRects, scaleAndCenterRect } from "./actions";

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
  onMount(() => {
    if (window.visualViewport) {
      // Use visualViewport for modern browsers (catches window resize + Safari UI chrome)
      window.visualViewport.addEventListener(
        "resize",
        () => {
          forceRecalculateShadowClientRects();
        },
        { passive: true },
      );
    } else {
      // Fallback for older browsers without visualViewport API
      window.addEventListener(
        "resize",
        () => {
          forceRecalculateShadowClientRects();
        },
        { passive: true },
      );
    }
  });

  createRenderEffect((prevShadows) => {
    queueMicrotask(() => {
      console.log("Clearing removed shadows");
      clearRemovedShadows();
    });
    console.log("Umbra render effect - shadows: ", state.shadows, prevShadows);
    return state.shadows;
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
