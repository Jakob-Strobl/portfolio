import { createMemo, createRenderEffect } from "solid-js";
import { scaleAndCenterRect, ShadowRect } from "./types";

interface ShadowRectProps {
  rect: ShadowRect;
}

/**
 * This is the actual element that is rendered to create the shadow effect
 * @warning This is an internal component and should not be used directly. In most cases, use the Shadow component instead.
 */
export default function ShadowEl({ rect }: ShadowRectProps) {
  createRenderEffect((prev) => {
    // IDK why this needs to be here to trigger css transition
    // Hypothesis 1: reading the bounding client rect forces this on the client side instead of SSR (?)
    // Hypothesis 2: this forces a reflow which is needed to trigger the transition (?)
    const clientRect = rect.shadowedEl.getBoundingClientRect();
    if (!rect.isCold()) {
      return clientRect;
    }

    // Set lambda to enter transition for shadow that "scale up" from origin position
    if (rect.warmupDelayMs === 0) {
      queueMicrotask(() => rect.setIsCold(false));
    } else {
      setTimeout(() => rect.setIsCold(false), rect.warmupDelayMs);
    }
    return clientRect;
  });

  const statefulRect = createMemo(() => {
    // console.log(rect.position(), rect.isCold(), scaleAndCenterRect(rect, 0.1), rect.origin)
    if (!rect.isCold()) {
      return {
        position: rect.position(),
        dimensions: rect.dimensions(),
      };
    }

    return rect.origin;
  });

  return (
    <div
      class="
        absolute -z-10 rounded-lg
        bg-night-black fade-in-bg
        transition-all duration-1000
      "
      style={{
        width: `${statefulRect().dimensions.x}px`,
        height: `${statefulRect().dimensions.y}px`,
        top: 0,
        left: 0,
        transform: `translate3d(${statefulRect().position.x}px, ${
          statefulRect().position.y + window.scrollY
        }px, 0)`,
        opacity: rect.isCold() ? 0 : 0.6,
      }}
    ></div>
  );
}
