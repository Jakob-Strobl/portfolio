import { createMemo, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { isTest } from "../actions/test-actions";

interface UmbraState {
  shadows: Array<HTMLDivElement>;
  shadow: Array<HTMLDivElement>;

  // NOTE(edge-case):
  // If the user scroll position is not 0 and then they navigate, this behavior is observed:
  //   1. Shadow is removed and re-added when the destination route renders
  //   2. When re-added, the new shadow's bounding client rect is computed and memoized
  //   3. Then the scroll position is set to 0
  //
  // The top and bottom positions of the shadow's client rect are affected by the
  // current scroll position. Since the scroll position resets to 0 after computing
  // the client rect, this results in an incorrect offset of the shadow's vertical
  // position due to the previous non-zero-based position.
  lastAddShadowScrollY: number;
}

export default function Umbra() {
  // const clientRect = createSignal(state.shadow[0]?.getBoundingClientRect())
  const shadowRect = createMemo(() => {
    // TODO is there a better way to initialize the position? You can see which direction it spawned from.
    return (
      state.shadow[0]?.getBoundingClientRect() ?? {
        width: 10,
        height: 10,
        top: 0,
        left: 1920,
      }
    );
  });

  onMount(() => {
    window.addEventListener("resize", () => {
      setState({ shadows: [...state.shadows] });
    });
  });

  // TODO currently hardcoded for one shadow at a time
  // TODO make flexible with 1->N shadow transitions and N->K shadows
  // TODO also set fade in on mount, fade-indoesn't work with new changess
  return (
    <div
      class="
        absolute -z-10 transition-rect rounded-lg
        bg-night-black/50 fade-in-bg duration-1000
      "
      style={{
        width: `${shadowRect().width}px`,
        height: `${shadowRect().height}px`,
        top: `${shadowRect().top + state.lastAddShadowScrollY}px`,
        left: `${shadowRect().left}px`,
        // TODO avoid transition on resize
        // bottom and right are not transitioned
        // bottom: `${clientRect().bottom}px`,
        // right: `${clientRect().right}px`
      }}
    ></div>
  );
}

const [state, setState] = createStore<UmbraState>({
  lastAddShadowScrollY: 0,
  shadows: [],
  get shadow() {
    return this.shadows;
  },
});

export const addShadow = (shadowEl: HTMLDivElement) => {
  // if (!isTest()) {
  console.log("Adding shadow: ", shadowEl);
  // }
  setState((state) => {
    return {
      shadows: [...state.shadows, shadowEl],
      lastAddShadowScrollY: window.scrollY,
    };
  });
};

export const removeShadow = (shadowToRemoveId: string) => {
  if (!isTest()) {
    console.log("Removing shadow by Id: ", shadowToRemoveId);
  }

  const filtered = state.shadows.filter(
    (shadow) => shadow.dataset["shadow"] !== shadowToRemoveId,
  );

  setState({ shadows: [...filtered] });
};
