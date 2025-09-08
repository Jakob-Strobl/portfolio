import { Accessor, createEffect } from "solid-js";
import { forceRecalculateShadowClientRects } from "./umbra";

export function useForceRecalculateShadowClientRects(
  ...signals: Accessor<any>[]
) {
  createEffect(() => {
    // "listen" to all passed signals
    signals.forEach((signal) => signal());
    queueMicrotask(() => {
      console.log(
        "HOOK: useForceRecalculateShadowClientRects triggered by signals: ",
        signals,
      );
      forceRecalculateShadowClientRects();
    });
  });
}
