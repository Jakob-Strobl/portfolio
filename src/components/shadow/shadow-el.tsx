import { createMemo, createRenderEffect } from "solid-js";
import { ShadowRect } from "./types";
import { hardRemoveShadow } from "./umbra";

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
    console.log("ShadowEl render effect - rect: ", rect.isCold(), rect, prev);
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

  const scaledownRect = () => {
    const scaledownSizeFactor = 10,
      scaledownPositionFactor = 2;

    const scaledWidth = rect.width / scaledownSizeFactor;
    const scaledHeight = rect.height / scaledownSizeFactor;
    const centeredLeft =
      rect.left + (rect.width - scaledWidth) / scaledownPositionFactor;
    const centeredTop =
      rect.top + (rect.height - scaledHeight) / scaledownPositionFactor; // TODO [ ]: account for scrollY?

    return {
      top: centeredTop,
      left: centeredLeft,
      width: scaledWidth,
      height: scaledHeight,
    };
  };

  const statefulRect = createMemo(() => {
    if (!rect.isCold()) {
      return rect;
    }

    if (rect.prevRect) {
      // queueMicrotask(() => hardRemoveShadow(rect.prevRect?.shadowedEl?.dataset["shadow"]));
      return rect.prevRect;
    }

    return scaledownRect();
  });

  return (
    <div
      class="
        absolute -z-10 transition-rect rounded-lg
        bg-white/50 fade-in-bg duration-1000
      "
      style={{
        width: `${statefulRect().width}px`,
        height: `${statefulRect().height}px`,
        top: `${statefulRect().top + lastAddShadowScrollY}px`,
        left: `${statefulRect().left}px`,
        // TODO [ ]: avoid transition on resize (Immediate change instead of animated). Check if I want this
        // bottom and right are not transitioned
        // bottom: `${shadowRect().bottom}px`,
        // right: `${shadowRect().right}px`
      }}
    ></div>
  );
}
