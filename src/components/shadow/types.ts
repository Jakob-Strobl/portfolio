import { Accessor, Setter } from "solid-js";

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

// TODO refactor vec2
export type ShadowVec2 = {
  x: number;
  y: number;
};

export type ShadowRect = {
  shadowState: Accessor<ShadowStates>;
  setShadowState: Setter<ShadowStates>;
  position: Accessor<ShadowVec2>;
  setPosition: Setter<ShadowVec2>;
  dimensions: Accessor<ShadowVec2>;
  setDimensions: Setter<ShadowVec2>;
  shadowedEl: HTMLDivElement;
  origin: {
    position: ShadowVec2;
    dimensions: ShadowVec2;
  };
  warmupDelayMs: number;
  fixed: boolean;
};

/**
 *
 * @param shadowRect
 * @param scale numbers > 1 will scale larger. For smaller use < 1 values; 0.1 equals scaling down 1 to 10
 */
export function scaleAndCenterRect(
  shadowRect: ShadowRect,
  scale: number = 1.0,
): { position: ShadowVec2; dimensions: ShadowVec2 } {
  return scaleAndCenterVec(shadowRect.dimensions, shadowRect.position, scale);
}

/**
 *
 * @param shadowRect
 * @param scale numbers > 1 will scale larger. For smaller use < 1 values; 0.1 equals scaling down 1 to 10
 */
export function scaleAndCenterVec(
  dimensions: Accessor<ShadowVec2>,
  position: Accessor<ShadowVec2>,
  scale: number = 1.0,
): { position: ShadowVec2; dimensions: ShadowVec2 } {
  const scaledWidth = dimensions().x * scale;
  const scaledHeight = dimensions().y * scale;
  const centeredLeft = position().x + (dimensions().x - scaledWidth) / 2;
  const centeredTop = position().y + (dimensions().y - scaledHeight) / 2; // TODO [ ]: account for scrollY?

  return {
    position: { x: centeredLeft, y: centeredTop },
    dimensions: { x: scaledWidth, y: scaledHeight },
  };
}

export interface UmbraState {
  shadows: Array<ShadowRect>;
  // Keep track of recently removed shadows so we can use their position and FLIP method transition
  removedShadows: Array<ShadowRect>;
}

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
