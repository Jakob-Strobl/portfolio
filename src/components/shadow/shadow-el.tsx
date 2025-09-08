import { createMemo, createRenderEffect } from "solid-js";
import { scaleAndCenterRect, ShadowRect } from "./types";

interface ShadowRectProps {
  rect: ShadowRect;
  lastAddShadowScrollY: number;
}

/**
 * This is the actual element that is rendered to create the shadow effect
 * @warning This is an internal component and should not be used directly. In most cases, use the Shadow component instead.
 */
export default function ShadowEl({
  rect,
  lastAddShadowScrollY,
}: ShadowRectProps) {
  createRenderEffect((prev) => {
    // IDK why this needs to be here to trigger css transition
    // Hypothesis 1: reading the bounding client rect forces this on the client side instead of SSR (?)
    // Hypothesis 2: this forces a reflow which is needed to trigger the transition (?)
    const clientRect = rect.shadowedEl.getBoundingClientRect();
    if (rect.isCold()) {
      // Triggers enter transition for shadow that "scale up" from center
      queueMicrotask(() => rect.setIsCold(false));
    }
    return clientRect;
  });

  const statefulRect = createMemo(() => {
    if (!rect.isCold()) {
      return {
        position: rect.position(),
        dimensions: rect.dimensions(),
      };
    }

    if (rect.prevRect) {
      return rect.prevRect;
    }

    return scaleAndCenterRect(rect, 0.1);
  });

  return (
    <div
      class="
        absolute -z-10 transition-rect rounded-lg
        bg-night-900/66 fade-in-bg duration-1000
      "
      style={{
        width: `${statefulRect().dimensions.x}px`,
        height: `${statefulRect().dimensions.y}px`,
        top: `${statefulRect().position.y + lastAddShadowScrollY}px`,
        left: `${statefulRect().position.x}px`,
        // TODO [ ]: avoid transition on resize (Immediate change instead of animated). Check if I want this
        // bottom and right are not transitioned
        // bottom: `${shadowRect().bottom}px`,
        // right: `${shadowRect().right}px`
      }}
    ></div>
  );
}
