import { createMemo, createRenderEffect } from "solid-js";
import { ShadowRect } from "./types";

interface ShadowRectProps {
  rect: ShadowRect;
}

/**
 * This is the actual element that is rendered to create the shadow effect
 * @warning This is an internal component and should not be used directly. In most cases, use the Shadow component instead.
 */
export default function ShadowEl({ rect }: ShadowRectProps) {
  const animationDurationMs = 750;
  // WARN: Dependent on the bezier curve's input values.
  //   Go to https://cubic-bezier.com, put in bezier-curve and find Time interval that is close to 100% progression
  //   "Effectively done" is more visual than math, so even progress >= 95% is usually good enough
  const bezierCurveEffectiveCompleteProgressionRate = 0.75;
  // Warmup + Rate (%) of animation duration, transition should look done
  const animationEffectivelyCompleteTimer =
    rect.warmupDelayMs + animationDurationMs * bezierCurveEffectiveCompleteProgressionRate;

  const isShadowCold = (rect: ShadowRect) => rect.shadowState() === "ready" || rect.shadowState() === "fade-in";
  const isShadowWarm = (rect: ShadowRect) =>
    rect.shadowState() === "mounted" || rect.shadowState() === "moving" || rect.shadowState() === "warm";

  createRenderEffect(() => {
    // IDK why this get client rect call needs to be here.
    //   It helps with starting transitions the transitions consistent after multiple navigations
    //   Even though the result is not used outside of this effect...
    // Hypothesis 1: reading the bounding client rect forces this on the client side instead of SSR (?)
    // Hypothesis 2: this forces a reflow which is needed to trigger the transition (?)
    const clientRect = rect.shadowedEl.getBoundingClientRect();
    if (isShadowWarm(rect)) {
      rect.shadowState() !== "warm" && setTimeout(() => rect.setShadowState("warm"), animationEffectivelyCompleteTimer);
      return clientRect;
    }

    // Set lambda to enter transition for shadow that "scale up" from origin position
    if (rect.warmupDelayMs >= 0) {
      setTimeout(() => rect.setShadowState("mounted"), rect.warmupDelayMs);
    } else {
      queueMicrotask(() => rect.setShadowState("mounted"));
    }
    setTimeout(() => rect.setShadowState("warm"), animationEffectivelyCompleteTimer);

    return clientRect;
  });

  const statefulRect = createMemo(() => {
    // console.log(rect.position(), isShadowCold(rect), scaleAndCenterRect(rect, 0.1), rect.origin)
    if (isShadowWarm(rect)) {
      return {
        position: rect.position(),
        dimensions: rect.dimensions(),
      };
    }

    return rect.origin;
  });

  return (
    <div
      class={`
        absolute -z-10 rounded-lg
        bg-night-black fade-in-bg
        transition-all duration-[${animationDurationMs}ms] ease-out
      `}
      style={{
        width: `${statefulRect().dimensions.x}px`,
        height: `${statefulRect().dimensions.y}px`,
        top: 0,
        left: 0,
        transform: `translate3d(${statefulRect().position.x}px, ${
          statefulRect().position.y + (rect.fixed ? 0 : window.scrollY)
        }px, 0)`,
        opacity: isShadowCold(rect) ? 0 : 0.6,
        position: rect.fixed ? "fixed" : undefined,
      }}
    ></div>
  );
}
