import {
  createEffect,
  createRenderEffect,
  createSignal,
  Index,
  onMount,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import { isTest } from "../actions/test-actions";
import ShadowEl from "./shadow-el";
import { ShadowRect, UmbraState, ZERO_RECT } from "./types";
import { useLocation } from "@solidjs/router";
/**
 * Umbra is the component that manages and renders all shadow elements for shadowed elements
 */
export default function Umbra() {
  const location = useLocation();

  onMount(() => {
    // TODO [ ]: Fix resize after breaking change - Fix when using transform and signal off of that
    window.addEventListener("resize", () => {
      setState({ shadows: [...state.shadows] });
    });
  });

  createRenderEffect(() => {
    console.log("Location changed: ", location.pathname);
    queueMicrotask(() => {
      console.log("Clearing removed shadows after location change");
      clearRemovedShadows();
    });
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
  // TODO [ ]: also set fade in on mount, fade-indoesn't work with new changess
  // TODO [ ]: PERFORMANCE: Use transform() instead of top/left/width/height
  // TODO [ ]: REFACTOR: TIL about `solid-transition-group` - use it to simplify transitions
  //   TODO [ ]: REFACTOR codebase transitions with `solid-transition-group`

  return (
    <Index each={state.shadows}>
      {(shadowRect) => {
        console.log(shadowRect);
        return (
          // Only showing once no longer Default avoids hardcoded transition from corner on first initial
          <Show when={shadowRect() !== ZERO_RECT}>
            <ShadowEl
              rect={shadowRect()}
              lastAddShadowScrollY={state.lastAddShadowScrollY}
            ></ShadowEl>
          </Show>
        );
      }}
    </Index>
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
  //   If we are adding a new first shadow, check if the first removed shadow can be reused
  //   If we are adding a second shadow, check if the second removed shadow can be reused, etc
  // This allows for reusing the position of the last removed shadow in order of the DOM
  // NOTE: Elements are unmounted from bottom up, and elements are mounted from top down
  const currentNumShadows = state.shadows.length;
  const currentNumOfRemovedShadows = state.removedShadows.length;
  const reusableRemovedShadowIdx =
    currentNumOfRemovedShadows - currentNumShadows - 1;

  const reusedRemovedShadow = state.removedShadows[reusableRemovedShadowIdx];
  const [isCold, setIsCold] = createSignal(true);
  const clientRect = shadowedEl.getBoundingClientRect();
  const shadowRect: ShadowRect = {
    top: clientRect.y,
    left: clientRect.x,
    width: clientRect.width,
    height: clientRect.height,
    shadowedEl,
    isCold,
    setIsCold,
    prevRect: reusedRemovedShadow,
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
