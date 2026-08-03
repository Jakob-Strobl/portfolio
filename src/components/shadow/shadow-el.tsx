import { createMemo, createRenderEffect, onCleanup, onMount } from "solid-js";
import { ShadowRect } from "./types";
import { completeShadowTransition } from "./actions";

interface ShadowRectProps {
  rect: ShadowRect;
}

/**
 * This is the actual element that is rendered to create the shadow effect
 * @warning This is an internal component and should not be used directly. In most cases, use the Shadow component instead.
 */
export default function ShadowEl({ rect }: ShadowRectProps) {
  const isShadowCold = (rect: ShadowRect) =>
    rect.shadowState() === "ready" || rect.shadowState() === "fade-in" || rect.shadowState() === "settling";
  const isShadowWarm = (rect: ShadowRect) =>
    rect.shadowState() === "mounted" || rect.shadowState() === "moving" || rect.shadowState() === "warm";

  createRenderEffect(() => {
    // Keep the source layout read tied to state changes so the browser commits the
    // detached shadow's starting geometry before transitioning to its final rect.
    rect.shadowState();
    const clientRect = rect.shadowedEl.getBoundingClientRect();
    return clientRect;
  });

  const statefulRect = createMemo(() => {
    if (isShadowWarm(rect)) {
      return {
        position: rect.activePosition(),
        dimensions: rect.activeDimensions(),
      };
    }

    return rect.origin;
  });
  const finalRect = createMemo(() => {
    if (isShadowWarm(rect)) {
      return {
        position: rect.activePosition(),
        dimensions: rect.activeDimensions(),
      };
    }

    return {
      position: rect.position(),
      dimensions: rect.dimensions(),
    };
  });
  const entranceScale = createMemo(() => {
    if (!isShadowCold(rect)) return { x: 1, y: 1 };
    const destination = finalRect().dimensions;
    return {
      x: destination.x === 0 ? 1 : rect.origin.dimensions.x / destination.x,
      y: destination.y === 0 ? 1 : rect.origin.dimensions.y / destination.y,
    };
  });
  let shadowEl: HTMLDivElement | undefined;

  onMount(() => {
    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== shadowEl || event.propertyName !== "transform") return;
      const shadowId = rect.shadowedEl.dataset["shadow"];
      if (shadowId != null) completeShadowTransition(shadowId);
    };
    shadowEl?.addEventListener("transitionend", handleTransitionEnd);
    onCleanup(() => {
      shadowEl?.removeEventListener("transitionend", handleTransitionEnd);
    });
  });

  return (
    <div
      class={`
        absolute -z-10 rounded-lg
        bg-night-black/60
        will-change-[transform,opacity]
        ${
          rect.snapToSource()
            ? "transition-none"
            : "transition-[transform,opacity,background-color] duration-[600ms] ease-out"
        }
      `}
      style={{
        display: rect.visible() ? undefined : "none",
        width: `${finalRect().dimensions.x}px`,
        height: `${finalRect().dimensions.y}px`,
        top: 0,
        left: 0,
        "transform-origin": "top left",
        transform: `translate3d(${statefulRect().position.x}px, ${statefulRect().position.y}px, 0) scale(${entranceScale().x}, ${entranceScale().y})`,
        opacity: isShadowCold(rect) ? 0 : 1,
        position: rect.fixed ? "fixed" : undefined,
        "background-color": `rgb(11 7 18 / ${rect.backgroundOpacity()})`,
      }}
      ref={(el) => (shadowEl = el)}
    ></div>
  );
}
