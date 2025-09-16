import { Accessor, createEffect } from "solid-js";
import { forceRecalculateShadowClientRects } from "./umbra";
import { ShadowRect } from "./types";
import { scaleAndCenterVec } from "~/actions/vector-actions";

export function createRecalculateShadowClientRectsOn(...signals: Accessor<any>[]) {
  createEffect(() => {
    // "listen" to all passed signals
    signals.forEach((signal) => signal());
    queueMicrotask(() => {
      console.log("HOOK: listenToForceRecalculateShadowClientRects triggered by signals: ", signals);
      forceRecalculateShadowClientRects();
    });
  });
}

/**
 *
 * @param shadowRect
 * @param scale numbers > 1 will scale larger. For smaller use < 1 values; 0.1 equals scaling down 1 to 10
 */
export function scaleAndCenterRect(shadowRect: ShadowRect, scale: number = 1.0): { position: Vec2; dimensions: Vec2 } {
  return scaleAndCenterVec(shadowRect.dimensions, shadowRect.position, scale);
}
