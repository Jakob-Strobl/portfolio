import { createMemo } from "solid-js";
import type { JSX } from "solid-js";
import { createStore } from "solid-js/store";

interface UmbraState {
  shadows: Array<HTMLDivElement>;
  shadow: Array<HTMLDivElement>;
}

export default function Umbra() {
  const rect = createMemo(
    () =>
      state.shadow[0]?.getBoundingClientRect() ?? {
        width: 10,
        height: 10,
        top: 0,
        left: 0,
      },
  );

  // TODO currently hardcoded for one shadow at a time
  // TODO make flexible with 1->N shadow transitions and N->K shadows
  // TODO also set fade in on mount, fade-in doesn't work with new change
  return (
    <div
      class="
        absolute -z-10 transition-rect rounded-lg
        bg-opacity-50 bg-night-black 
        fade-in-bg duration-1000 delay-75
      "
      style={{
        width: `${rect().width}px`,
        height: `${rect().height}px`,
        top: `${rect().top}px`,
        left: `${rect().left}px`,
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
  console.log("Adding shadow: ", shadowEl);
  setState((state) => {
    return { shadows: [...state.shadows, shadowEl] };
  });
};

export const removeShadow = (shadowToRemoveId: string) => {
  console.log("Removing shadow by Id: ", shadowToRemoveId);
  const filtered = state.shadows.filter(
    (shadow) => shadow.dataset["shadow"] !== shadowToRemoveId,
  );

  setState({ shadows: [...filtered] });
};
