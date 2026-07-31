import { Accessor, batch, createEffect, createSignal } from "solid-js";
import { ShadowOriginOptions, ShadowRect } from "./types";
import { scaleAndCenterVec } from "../../actions/vector-actions";
import { Rect } from "../../types/rect";
import { isTest } from "../../actions/test-actions";
import { setState, state } from "./umbra";
import { isDev } from "solid-js/web";

export function createRecalculateShadowClientRectsOn(...signals: Accessor<any>[]) {
  createEffect(() => {
    // "listen" to all passed signals
    signals.forEach((signal) => signal());
    queueMicrotask(() => {
      forceRecalculateShadowClientRects();
    });
  });
}

/**
 *
 * @param shadowRect
 * @param scale numbers > 1 will scale larger. For smaller use < 1 values; 0.1 equals scaling down 1 to 10
 */
export function scaleAndCenterRect(shadowRect: ShadowRect, scale: number = 1.0): Rect {
  return scaleAndCenterVec(shadowRect.dimensions, shadowRect.position, scale);
}

const MEANINGFUL_GEOMETRY_DELTA = 0.25;

type ShadowSyncMode = "snap" | "transition";

function hasMeaningfulDelta(first: number, second: number) {
  return Math.abs(first - second) >= MEANINGFUL_GEOMETRY_DELTA;
}

export function isShadowSourceVisible(shadowedEl: HTMLElement) {
  if (!shadowedEl.isConnected) return false;
  if (
    typeof shadowedEl.checkVisibility === "function" &&
    !shadowedEl.checkVisibility({ checkVisibilityCSS: true, contentVisibilityAuto: true })
  ) {
    return false;
  }
  return Array.from(shadowedEl.getClientRects()).some((rect) => rect.width > 0 && rect.height > 0);
}

/**
 * Synchronizes every detached shadow after first measuring every source. A resize
 * in one source can move any following sibling without resizing that sibling.
 */
export function synchronizeShadowClientRects(mode: ShadowSyncMode = "transition") {
  const measurements = state.shadows.map((shadow) => {
    const clientRect = shadow.shadowedEl.getBoundingClientRect();
    const position = shadow.position();
    const dimensions = shadow.dimensions();
    const visible = isShadowSourceVisible(shadow.shadowedEl);
    const nextPosition = {
      x: clientRect.x,
      y: shadow.fixed ? Math.max(0, clientRect.y) : clientRect.y,
    };
    const nextDimensions = { x: clientRect.width, y: clientRect.height };
    const geometryChanged =
      hasMeaningfulDelta(position.x, nextPosition.x) ||
      hasMeaningfulDelta(position.y, nextPosition.y) ||
      hasMeaningfulDelta(dimensions.x, nextDimensions.x) ||
      hasMeaningfulDelta(dimensions.y, nextDimensions.y);

    return {
      shadow,
      nextPosition,
      nextDimensions,
      visible,
      geometryChanged,
      visibilityChanged: shadow.visible() !== visible,
    };
  });
  const changedMeasurements = measurements.filter(
    ({ geometryChanged, visibilityChanged }) => geometryChanged || visibilityChanged,
  );

  if (changedMeasurements.length === 0) return false;

  batch(() => {
    for (const measurement of changedMeasurements) {
      const { shadow } = measurement;
      if (measurement.geometryChanged) {
        shadow.setPosition(measurement.nextPosition);
        shadow.setDimensions(measurement.nextDimensions);
      }
      if (measurement.visibilityChanged) shadow.setVisible(measurement.visible);

      if (mode === "snap") {
        if (!shadow.snapToSource()) shadow.setSnapToSource(true);
      } else if (measurement.geometryChanged) {
        if (shadow.snapToSource()) shadow.setSnapToSource(false);
        if (shadow.shadowState() !== "moving") shadow.setShadowState("moving");
      }
    }
  });

  return true;
}

export const addShadow = (
  shadowedEl: HTMLDivElement,
  origin: ShadowOriginOptions = "relative",
  shadowRectOptions: Pick<
    ShadowRect,
    "shadowState" | "setShadowState" | "warmupDelayMs" | "fixed" | "interactionActive" | "blurOnInteraction"
  >,
) => {
  if (!isTest() && isDev) {
    console.log("Adding shadow: ", shadowedEl, state.shadows.length, state.removedShadows.length);
  }

  // Check any removed shadows to see if the removed shadows position can be used to start from
  // NOTE: Elements are unmounted from bottom up, and elements are mounted from top down
  //   If we are adding a new first shadow, check if the "first" (last element) removed shadow can be reused
  //   If we are adding a second shadow, check if the "second" (second to last) removed shadow can be reused
  //   etc,
  // This allows for reusing the position of the last removed shadow in order of the DOM
  const warmShadows = state.shadows.filter((shadow) => shadow.shadowState() == "warm");
  const currentNumShadows = state.shadows.length;
  const currentNumOfRemovedShadows = state.removedShadows.length;
  // The "compliment" shadow's index for initializing previous shadow (think like compliment color)
  const complimentShadowIndex = currentNumOfRemovedShadows - currentNumShadows - 1;

  let relativeStartingShadow;
  // Keep same scale by default
  let scale = 1.0;

  switch (origin) {
    case "relative":
      // Don't care about invalid indexing since returns undefined; which centers the shadow on new content
      relativeStartingShadow = state.removedShadows[complimentShadowIndex];
      break;
    case "first":
      // Always select first warmShadow (what about first removed?)
      relativeStartingShadow = state.removedShadows[0]; //state.shadows[0];
      scale = 0.1;
      break;
    case "warmest":
      relativeStartingShadow = warmShadows[warmShadows.length - 1];
      scale = 0.1;
      break;
    case "self":
      // Leave as undefined so we scale up from center of element to be shadowed
      break;
    default:
      console.error("unexpected origin option: ", origin);
  }

  const clientRect = shadowedEl.getBoundingClientRect();
  const [position, setPosition] = createSignal({
    x: clientRect.x,
    y: clientRect.y,
  });
  const [dimensions, setDimensions] = createSignal({
    x: clientRect.width,
    y: clientRect.height,
  });
  const [visible, setVisible] = createSignal(isShadowSourceVisible(shadowedEl));
  const [snapToSource, setSnapToSource] = createSignal(false);

  // If relativeStartingShadow is undefined, center and scale up from element we are shadowing
  let originRect =
    relativeStartingShadow == undefined
      ? scaleAndCenterVec(dimensions, position, 0.1) // center and scale up (scale = 0.1) from element we are shadowing
      : scaleAndCenterRect(relativeStartingShadow, scale); // start from a predefined position

  const shadowRect: ShadowRect = {
    ...shadowRectOptions,
    shadowedEl,
    position,
    setPosition,
    dimensions,
    setDimensions,
    visible,
    setVisible,
    snapToSource,
    setSnapToSource,
    origin: originRect,
  };

  setState((state) => {
    return {
      shadows: [...state.shadows, shadowRect],
    };
  });
};

export const removeShadow = (shadowToRemoveId: string) => {
  const removedShadow = state.shadows.find((shadow) => shadow.shadowedEl.dataset["shadow"] === shadowToRemoveId);

  if (removedShadow == undefined) {
    console.warn("Tried to remove shadow that doesn't exist: ", shadowToRemoveId);
    return;
  }

  const filteredShadows = state.shadows.filter((shadow) => shadow.shadowedEl.dataset["shadow"] !== shadowToRemoveId);

  setState({
    shadows: filteredShadows,
    removedShadows: [...state.removedShadows, removedShadow],
  });
};

export const hardRemoveShadow = (shadowToRemoveId: string | undefined) => {
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
  setState({ removedShadows: [] });
};

export const forceRecalculateShadowClientRects = () => {
  return synchronizeShadowClientRects("transition");
};
