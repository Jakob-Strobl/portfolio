import { Accessor, batch, createEffect, createSignal } from "solid-js";
import { ShadowOriginOptions, ShadowRect } from "./types";
import { scaleAndCenterVec } from "../../actions/vector-actions";
import { Rect } from "../../types/rect";
import { setState, state } from "./umbra";

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

function getShadowPosition(clientRect: DOMRect, fixed: boolean, scrollX: number, scrollY: number) {
  return fixed
    ? { x: clientRect.x, y: Math.max(0, clientRect.y) }
    : { x: clientRect.x + scrollX, y: clientRect.y + scrollY };
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
  if (typeof window === "undefined") return false;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const measurements = state.shadows.map((shadow) => {
    const clientRect = shadow.shadowedEl.getBoundingClientRect();
    const position = shadow.position();
    const dimensions = shadow.dimensions();
    const visible = isShadowSourceVisible(shadow.shadowedEl);
    const nextPosition = getShadowPosition(clientRect, shadow.fixed, scrollX, scrollY);
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

      // The active rectangle is immutable while a transition is running. New
      // measurements stay in position/dimensions until transitionend flushes them.
      if (measurement.geometryChanged && (shadow.shadowState() === "mounted" || shadow.shadowState() === "moving")) {
        continue;
      }

      if (mode === "snap") {
        const shadowState = shadow.shadowState();
        if (shadowState === "ready" || shadowState === "fade-in" || shadowState === "settling") {
          // Continue gathering destination geometry without changing the detached
          // element's origin. The lifecycle owns the later frozen snapshot.
          shadow.setSnapToSource(false);
          shadow.setShadowState("settling");
          shadow.advanceSettlingEpoch((epoch) => epoch + 1);
        } else if (shadowState === "warm") {
          shadow.setActivePosition(measurement.nextPosition);
          shadow.setActiveDimensions(measurement.nextDimensions);
          if (!shadow.snapToSource()) shadow.setSnapToSource(true);
        }
      } else if (measurement.geometryChanged) {
        shadow.setActivePosition(measurement.nextPosition);
        shadow.setActiveDimensions(measurement.nextDimensions);
        if (shadow.snapToSource()) shadow.setSnapToSource(false);
        if (shadow.shadowState() !== "moving") shadow.setShadowState("moving");
      }
    }
  });

  return true;
}

/** Freeze the measured destination immediately before a cold entrance begins. */
export function beginShadowEntrance(shadowId: string) {
  if (typeof window === "undefined") return false;
  const shadow = state.shadows.find((candidate) => candidate.shadowedEl.dataset["shadow"] === shadowId);
  if (shadow == null) return false;
  const shadowState = shadow.shadowState();
  if (shadowState !== "ready" && shadowState !== "fade-in" && shadowState !== "settling") return false;

  batch(() => {
    shadow.setActivePosition(shadow.position());
    shadow.setActiveDimensions(shadow.dimensions());
    shadow.setSnapToSource(false);
    shadow.setShadowState("mounted");
  });
  return true;
}

/** Complete an active transition and apply any observer measurements queued during it. */
export function completeShadowTransition(shadowId: string) {
  if (typeof window === "undefined") return false;
  const shadow = state.shadows.find((candidate) => candidate.shadowedEl.dataset["shadow"] === shadowId);
  if (shadow == null || (shadow.shadowState() !== "mounted" && shadow.shadowState() !== "moving")) return false;

  const position = shadow.position();
  const dimensions = shadow.dimensions();
  const activePosition = shadow.activePosition();
  const activeDimensions = shadow.activeDimensions();
  const pendingGeometry =
    hasMeaningfulDelta(position.x, activePosition.x) ||
    hasMeaningfulDelta(position.y, activePosition.y) ||
    hasMeaningfulDelta(dimensions.x, activeDimensions.x) ||
    hasMeaningfulDelta(dimensions.y, activeDimensions.y);

  batch(() => {
    shadow.setShadowState("warm");
    if (!pendingGeometry) return;
    shadow.setActivePosition(position);
    shadow.setActiveDimensions(dimensions);
    shadow.setSnapToSource(true);
  });
  return true;
}

export const addShadow = (
  shadowedEl: HTMLDivElement,
  origin: ShadowOriginOptions = "relative",
  shadowRectOptions: Pick<
    ShadowRect,
    | "shadowState"
    | "setShadowState"
    | "settlingEpoch"
    | "advanceSettlingEpoch"
    | "warmupDelayMs"
    | "backgroundOpacity"
    | "fixed"
  >,
) => {
  if (typeof window === "undefined" || shadowedEl == null) return false;

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
  const initialPosition = getShadowPosition(clientRect, shadowRectOptions.fixed, window.scrollX, window.scrollY);
  const [position, setPosition] = createSignal({
    x: initialPosition.x,
    y: initialPosition.y,
  });
  const [dimensions, setDimensions] = createSignal({
    x: clientRect.width,
    y: clientRect.height,
  });
  const [activePosition, setActivePosition] = createSignal(initialPosition);
  const [activeDimensions, setActiveDimensions] = createSignal({ x: clientRect.width, y: clientRect.height });
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
    activePosition,
    setActivePosition,
    activeDimensions,
    setActiveDimensions,
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
  return true;
};

export const removeShadow = (shadowToRemoveId: string) => {
  if (typeof window === "undefined") return false;
  const removedShadow = state.shadows.find((shadow) => shadow.shadowedEl.dataset["shadow"] === shadowToRemoveId);

  if (removedShadow == undefined) return false;

  const filteredShadows = state.shadows.filter((shadow) => shadow.shadowedEl.dataset["shadow"] !== shadowToRemoveId);

  setState({
    shadows: filteredShadows,
    removedShadows: [...state.removedShadows, removedShadow],
  });
  return true;
};

export const hardRemoveShadow = (shadowToRemoveId: string | undefined) => {
  if (typeof window === "undefined" || shadowToRemoveId == undefined) return false;

  const hasShadow = state.removedShadows.some((shadow) => shadow.shadowedEl.dataset["shadow"] === shadowToRemoveId);
  if (!hasShadow) return false;

  const filteredRemovedShadows = state.removedShadows.filter(
    (shadow) => shadow.shadowedEl.dataset["shadow"] !== shadowToRemoveId,
  );

  setState({ removedShadows: filteredRemovedShadows });
  return true;
};

export const clearRemovedShadows = () => {
  setState({ removedShadows: [] });
};

export const forceRecalculateShadowClientRects = () => {
  return synchronizeShadowClientRects("transition");
};
