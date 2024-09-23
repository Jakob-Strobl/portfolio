import { children, createMemo, createUniqueId } from "solid-js";
import type { JSX } from "solid-js";
import { createStore } from "solid-js/store";

interface UmbraProps {
  children: JSX.Element | JSX.ArrayElement;
}

interface UmbraState {
  shadows: Array<HTMLDivElement>;
  shadow: () => Array<HTMLDivElement>;
}

export default function Umbra(props: UmbraProps) {
  const resolved = children(() => props.children);
  const shadowMemo = createMemo(() => state.shadow);
  console.log(shadowMemo());
  return resolved();
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
