import { createRenderEffect, createSignal, For, onMount, Setter, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { isTest } from "../../actions/test-actions";
import ShadowEl from "./shadow-el";
import {
  scaleAndCenterRect,
  scaleAndCenterVec,
  ShadowOriginOptions,
  ShadowRect,
  ShadowStates,
  UmbraState,
  ZERO_RECT,
} from "./types";

export interface UmbraProps {
  /**
   * On Render Effect, force a refresh of all shadow positions
   * @default true
   */
  forceRefreshOnRenderEffect?: boolean;
}

/**
 * Umbra is the component that manages and renders all shadow elements for shadowed elements
 */
export default function Umbra(props: UmbraProps) {
  onMount(() => {
    window.addEventListener("resize", () => {
      console.log("Window resized, updating shadow positions");
      forceRecalculateShadowClientRects();
    });
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

const [state, setState] = createStore<UmbraState>({
  shadows: [],
  removedShadows: [],
});

export const addShadow = (
  shadowedEl: HTMLDivElement,
  origin: ShadowOriginOptions = "relative",
  shadowRectOptions: Pick<ShadowRect, "shadowState" | "setShadowState" | "warmupDelayMs" | "fixed">,
) => {
  if (!isTest()) {
    console.log("Adding shadow: ", shadowedEl, state.shadows.length, state.removedShadows.length);
  }

  // Check any removed shadows to see if the removed shadows position can be used to start from
  // NOTE: Elements are unmounted from bottom up, and elements are mounted from top down
  //   If we are adding a new first shadow, check if the "first" (last element) removed shadow can be reused
  //   If we are adding a second shadow, check if the "second" (second to last) removed shadow can be reused
  //   etc,
  // This allows for reusing the position of the last removed shadow in order of the DOM
  const warmShadows = state.shadows.filter((shadow) => shadow.shadowState() == "warm");
  const currentNumShadows = state.shadows.length;
  const currentNumOfRemovedShadows = state.removedShadows.length;
  // The "compliment" shadow's index for initializing previous shadow (think like compliment color)
  const complimentShadowIndex = currentNumOfRemovedShadows - currentNumShadows - 1;

  let relativeStartingShadow;
  // Keep same scale by default
  let scale = 1.0;

  switch (origin) {
    case "relative":
      // Don't care about invalid indexing since returns undefined; which centers the shadow on new content
      relativeStartingShadow = state.removedShadows[complimentShadowIndex];
      break;
    case "first":
      // Always select first warmShadow (what about first removed?)
      relativeStartingShadow = state.removedShadows[0]; //state.shadows[0];
      scale = 0.1;
      break;
    case "warmest":
      relativeStartingShadow = warmShadows[warmShadows.length - 1];
      scale = 0.1;
      break;
    default:
      console.error("unexpected origin option: ", origin);
  }

  const clientRect = shadowedEl.getBoundingClientRect();
  const [position, setPosition] = createSignal({
    x: clientRect.x,
    y: clientRect.y,
  });
  const [dimensions, setDimensions] = createSignal({
    x: clientRect.width,
    y: clientRect.height,
  });

  // If relativeStartingShadow is undefined, center and scale up from element we are shadowing
  let originRect =
    relativeStartingShadow == undefined
      ? scaleAndCenterVec(dimensions, position, 0.1) // center and scale up (scale = 0.1) from element we are shadowing
      : scaleAndCenterRect(relativeStartingShadow, scale); // start from a predefined position

  const shadowRect: ShadowRect = {
    ...shadowRectOptions,
    shadowedEl,
    position,
    setPosition,
    dimensions,
    setDimensions,
    origin: originRect,
  };

  setState((state) => {
    return {
      shadows: [...state.shadows, shadowRect],
    };
  });
};

export const removeShadow = (shadowToRemoveId: string) => {
  if (!isTest()) {
    console.log("Removing shadow by Id: ", shadowToRemoveId);
  }

  const removedShadow = state.shadows.find((shadow) => shadow.shadowedEl.dataset["shadow"] === shadowToRemoveId);

  if (removedShadow == undefined) {
    console.warn("Tried to remove shadow that doesn't exist: ", shadowToRemoveId);
    return;
  }

  console.warn("Soft Removed Shadow Around: ", removedShadow.shadowedEl);

  const filteredShadows = state.shadows.filter((shadow) => shadow.shadowedEl.dataset["shadow"] !== shadowToRemoveId);

  setState({
    shadows: filteredShadows,
    removedShadows: [...state.removedShadows, removedShadow],
  });
};

export const hardRemoveShadow = (shadowToRemoveId: string | undefined) => {
  if (!isTest()) {
    console.log("Hard removing shadow by Id: ", shadowToRemoveId);
    console.log("removedShadow length = ", state.removedShadows.length);
  }

  if (shadowToRemoveId == undefined) {
    console.warn("Tried to hard remove shadow with undefined id");
    return;
  }

  const filteredRemovedShadows = state.removedShadows.filter(
    (shadow) => shadow.shadowedEl.dataset["shadow"] !== shadowToRemoveId,
  );

  setState({ removedShadows: filteredRemovedShadows });
};

export const clearRemovedShadows = () => {
  if (!isTest()) {
    console.log(`Clearing removed shadows [${state.removedShadows.length}]`);
  }

  setState({ removedShadows: [] });
};

export const forceRecalculateShadowClientRects = () => {
  state.shadows.forEach((shadow) => {
    const clientRect = shadow.shadowedEl.getBoundingClientRect();
    shadow.setPosition({ x: clientRect.x, y: clientRect.y });
    shadow.setDimensions({ x: clientRect.width, y: clientRect.height });
  });

  setState({ shadows: [...state.shadows] });
};
