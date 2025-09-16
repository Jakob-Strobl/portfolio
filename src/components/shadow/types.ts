import { Accessor, Setter } from "solid-js";
import { Rect } from "../../types/rect";
import { Vec2 } from "../../types/vector2";

export type ShadowStartingStates = "ready" | "fade-in";
export type ShadowInProgressStates = "mounted" | "moving";
export type ShadowRestingState = "warm";
/**
 * **STARTING STATES**
 *
 * `'ready'`   : Initialize a shadow with the content ready<br>
 *             Fade-in transitions can still be managed by the content itself
 *
 * `'fade-in'` : Initialize a shadow with the content fade-in managed by shadow
 *
 * **INTERMEDIATE STATES**
 *
 * `'mounted'` : Shadow is mounted and transitioning-in on the DOM
 *
 * `'moving'`  : Reserved for special events that cause the shadows to need to move
 *             (e.g., window resize, dynamic content)
 *
 * **FINAL (RESTING) STATE**
 *
 * `'warm'`    : Shadow is positioned with transition "effectively complete".
 *             Content can fade-in now if it hasn't already
 */
export type ShadowStates = ShadowStartingStates | ShadowInProgressStates | ShadowRestingState;

/**
 * Changes the behavior of where to set the starting position of the element on mount
 *  - 'first' = select the first removed shadow in the array (if one exists)
 *  - 'relative' = select the compliment index (order removed is flipped) from recently removed shadows
 *  - 'warmest' = select the latest warm shadow ( read @warn )
 *
 * @warn Warm shadow options, like 'warmest', are best for dynamic content added to an already running page
 *       I.e., doesn't work on a cold page load's initial render since none of the shadows are "warm" yet
 */
export type ShadowOriginOptions = "first" | "relative" | "warmest";

export type ShadowRect = {
  shadowState: Accessor<ShadowStates>;
  setShadowState: Setter<ShadowStates>;
  position: Accessor<Vec2>;
  setPosition: Setter<Vec2>;
  dimensions: Accessor<Vec2>;
  setDimensions: Setter<Vec2>;
  shadowedEl: HTMLDivElement;
  origin: Rect;
  warmupDelayMs: number;
  fixed: boolean;
};

// NOTE(default-value):
//   This ZERO_RECT is used to control behavior on cold starts of Shadow
//   This allows us to scale up from center of content once the content is ready
//   Avoids starting from hardcoded position, like default (0,0), center of screen, or any other corner position
export const ZERO_RECT: ShadowRect = {
  position: () => ({ x: 0, y: 0 }),
  setPosition: () => {},
  dimensions: () => ({ x: 0, y: 0 }),
  setDimensions: () => {},
  // @ts-expect-error This is a special case constant where the value of shadowedEl never matters (any field really)
  shadowedEl: null,
  isCold: () => true,
  setIsCold: () => {},
  // @ts-expect-error This is a special case constant where the value of origin never matters (any field really)
  origin: null,
};

export interface UmbraState {
  shadows: Array<ShadowRect>;
  // Keep track of recently removed shadows so we can use their position and FLIP method transition
  removedShadows: Array<ShadowRect>;
}
