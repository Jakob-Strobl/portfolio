import { createMemo, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { isTest } from "../actions/test-actions";

interface UmbraState {
  shadows: Array<HTMLDivElement>;
  shadow: Array<HTMLDivElement>;
}

export default function Umbra() {
  // const clientRect = createSignal(state.shadow[0]?.getBoundingClientRect())
  const clientRect = createMemo(() => {
    return (
      // TODO is there a better way to initialize the position? You can see which direction it spawned from.
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
        bg-opacity-50 bg-night-black 
        fade-in-bg duration-1000
      "
      style={{
        width: `${clientRect().width}px`,
        height: `${clientRect().height}px`,
        top: `${clientRect().top}px`,
        left: `${clientRect().left}px`,
        // TODO avoid transition on resize
        // bottom and right are not transitioned
        // bottom: `${clientRect().bottom}px`,
        // right: `${clientRect().right}px`
      }}
    ></div>
  );
}

const [state, setState] = createStore<UmbraState>({
  shadows: [],
  get shadow() {
    return this.shadows;
  },
});

export const addShadow = (shadowEl: HTMLDivElement) => {
  if (!isTest()) {
    console.log("Adding shadow: ", shadowEl);
  }
  setState((state) => {
    return { shadows: [...state.shadows, shadowEl] };
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
