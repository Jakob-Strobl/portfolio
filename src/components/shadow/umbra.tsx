import {
  createEffect,
  createRenderEffect,
  createSignal,
  For,
  Index,
  onMount,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import { isTest } from "../../actions/test-actions";
import ShadowEl from "./shadow-el";
import { scaleAndCenterRect, ShadowRect, UmbraState, ZERO_RECT } from "./types";
import { useLocation } from "@solidjs/router";

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
  const location = useLocation();
  const forceRefreshOnRenderEffect = props.forceRefreshOnRenderEffect ?? true;

  onMount(() => {
    // TODO [X]: Fix resize after breaking change - Fix when using transform and signal off of that
    window.addEventListener("resize", () => {
      console.log("Window resized, updating shadow positions");
      forceRecalculateShadowClientRects();
    });
  });

  createRenderEffect(() => {
    console.log("Location changed: ", location.pathname);
    queueMicrotask(() => {
      console.log("Clearing removed shadows after location change");
      clearRemovedShadows();
    });
    if (forceRefreshOnRenderEffect) {
      queueMicrotask(() => forceRecalculateShadowClientRects());
    }
  });

  createRenderEffect((prevShadows) => {
    console.log("Umbra render effect - shadows: ", state.shadows, prevShadows);
    return state.shadows;
  });

  // TODO [X]: Find a better way to initialize the position
  // TODO [X]: Avoid naive corner start
  // TODO [X]: Scale up into size on first load
  // TODO [X]: Scale up from center of content
  // TODO [X]: currently hardcoded for one shadow at a time
  // TODO [X]: make flexible with 1->N shadow transitions and N->K shadows
  // TODO [X]: Fix resize and works with multiple shadows
  // TODO [X]: Handle when layout changes from dynamic content (Example POC in index.tsx)
  // TODO [ ]: also set fade in on mount, fade-indoesn't work with new changess
  // TODO [ ]: PERFORMANCE: Use transform() instead of top/left/width/height
  // TODO [ ]: REFACTOR: TIL about `solid-transition-group` - use it to simplify transitions
  //   TODO [ ]: REFACTOR codebase transitions with `solid-transition-group`

  return (
    <For each={state.shadows}>
      {(shadowRect: ShadowRect) => {
        console.log(shadowRect);
        return (
          // Only showing once no longer Default avoids hardcoded transition from corner on first initial
          <Show when={shadowRect !== ZERO_RECT}>
            <ShadowEl
              rect={shadowRect}
              lastAddShadowScrollY={state.lastAddShadowScrollY}
            ></ShadowEl>
          </Show>
        );
      }}
    </For>
  );
}

const [state, setState] = createStore<UmbraState>({
  lastAddShadowScrollY: 0,
  shadows: [],
  removedShadows: [],
});

export const addShadow = (shadowedEl: HTMLDivElement) => {
  if (!isTest()) {
    console.log("Adding shadow: ", shadowedEl);
  }

  // Check any removed shadows to see if the removed shadows position can be used to start from
  // NOTE: Elements are unmounted from bottom up, and elements are mounted from top down
  //   If we are adding a new first shadow, check if the "first" (last element) removed shadow can be reused
  //   If we are adding a second shadow, check if the "second" (second to last) removed shadow can be reused
  //   etc,
  // This allows for reusing the position of the last removed shadow in order of the DOM
  const warmShadows = state.shadows.filter((shadow) => !shadow.isCold());
  const currentNumShadows = state.shadows.length;
  const currentNumOfRemovedShadows = state.removedShadows.length;
  // The "compliment" shadow's index for initializing previous shadow
  const complimentShadowIndex =
    currentNumOfRemovedShadows - currentNumShadows - 1;

  let relativeStartingShadow;
  let scale = 1.0;
  if (complimentShadowIndex >= 0) {
    relativeStartingShadow = state.removedShadows[complimentShadowIndex];
  } else if (currentNumOfRemovedShadows > 0) {
    // Spawn from last shadow if there wasn't a compliment shadow on the last render
    relativeStartingShadow =
      state.removedShadows[currentNumOfRemovedShadows - 1];
    scale = 0.1;
  } else if (warmShadows.length > 0) {
    // Spawn from last warm shadow
    // NOTE: I decided to pick from first shadow as a rule of thumb to follow.
    relativeStartingShadow = warmShadows[warmShadows.length - 1];
    scale = 0.1;
  }

  const clientRect = shadowedEl.getBoundingClientRect();
  const [isCold, setIsCold] = createSignal(true);
  const [position, setPosition] = createSignal({
    x: clientRect.x,
    y: clientRect.y,
  });
  const [dimensions, setDimensions] = createSignal({
    x: clientRect.width,
    y: clientRect.height,
  });

  const shadowRect: ShadowRect = {
    shadowedEl,
    isCold,
    setIsCold,
    position,
    setPosition,
    dimensions,
    setDimensions,
    prevRect:
      relativeStartingShadow != null
        ? scaleAndCenterRect(relativeStartingShadow, scale)
        : undefined,
  };

  setState((state) => {
    return {
      shadows: [...state.shadows, shadowRect],
      lastAddShadowScrollY: window.scrollY,
    };
  });
};

export const removeShadow = (shadowToRemoveId: string) => {
  if (!isTest()) {
    console.log("Removing shadow by Id: ", shadowToRemoveId);
  }

  const removedShadow = state.shadows.find(
    (shadow) => shadow.shadowedEl.dataset["shadow"] === shadowToRemoveId,
  );

  if (removedShadow == undefined) {
    console.warn(
      "Tried to remove shadow that doesn't exist: ",
      shadowToRemoveId,
    );
    return;
  }

  console.warn("Soft Removed Shadow Around: ", removedShadow.shadowedEl);

  const filteredShadows = state.shadows.filter(
    (shadow) => shadow.shadowedEl.dataset["shadow"] !== shadowToRemoveId,
  );

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
