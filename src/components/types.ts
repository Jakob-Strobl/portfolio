import { Accessor, Setter } from "solid-js";

export type ShadowRect = {
  height: number;
  width: number;
  top: number;
  left: number;
  shadowedEl: HTMLDivElement;
  isCold: Accessor<boolean>;
  setIsCold: Setter<boolean>;
  prevRect?: Partial<ShadowRect> & {
    width: number;
    height: number;
    top: number;
    left: number;
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
  height: 0,
  width: 0,
  left: 0,
  top: 0,
  shadowedEl: null as unknown as HTMLDivElement,
  isCold: () => true,
  setIsCold: () => {},
};
