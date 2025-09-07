import { Accessor, Setter, Signal } from "solid-js";

export type ShadowVec2 = {
  x: number;
  y: number;
};

export type ShadowRect = {
  isCold: Accessor<boolean>;
  setIsCold: Setter<boolean>;
  position: Accessor<ShadowVec2>;
  setPosition: Setter<ShadowVec2>;
  dimensions: Accessor<ShadowVec2>;
  setDimensions: Setter<ShadowVec2>;
  shadowedEl: HTMLDivElement;
  prevRect?: {
    position: ShadowVec2;
    dimensions: ShadowVec2;
  };
};

export interface UmbraState {
  shadows: Array<ShadowRect>;
  removedShadows: Array<ShadowRect>;

  /**  NOTE(edge-case):
   * If the user scroll position is not 0 and then they navigate, this behavior is observed:
   *   1. Shadow is removed and re-added when the destination route renders
   *   2. When re-added, the new shadow's bounding client rect is computed and memoized
   *   3. Then the scroll position is set to 0
   *
   * The top and bottom positions of the shadow's client rect are affected by the
   * current scroll position. Since the scroll position resets to 0 after computing
   * the client rect, this results in an incorrect offset of the shadow's vertical
   * position due to the previous non-zero-based position.
   */
  lastAddShadowScrollY: number;
}

// NOTE(default-value):
//   This is evaluated on the server-context of SSR
//   DOMRect is not defined in the server context
//   We set the type (since typedef isn't evaluated) to keep type narrowing happy
//   We just fill in a bogus DOMRect to satisy constraints
export const ZERO_RECT: ShadowRect = {
  position: () => ({ x: 0, y: 0 }),
  setPosition: () => {},
  dimensions: () => ({ x: 0, y: 0 }),
  setDimensions: () => {},
  shadowedEl: null as unknown as HTMLDivElement,
  isCold: () => true,
  setIsCold: () => {},
};
