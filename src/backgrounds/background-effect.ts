import { createTessellationEffect } from "./tessellation-effect";
import type { BackgroundConfig, BackgroundEffect } from "./types";
import { createWavesEffect } from "./waves-effect";

export function createBackgroundEffect(
  gl: WebGL2RenderingContext,
  config: BackgroundConfig,
): BackgroundEffect<BackgroundConfig> {
  if (config.kind === "waves") {
    const effect = createWavesEffect(gl, config);

    return {
      resize: effect.resize,
      render: effect.render,
      update(nextConfig) {
        if (nextConfig.kind === "waves") effect.update(nextConfig);
      },
      dispose: effect.dispose,
    };
  }

  const effect = createTessellationEffect(gl, config);

  return {
    resize: effect.resize,
    render: effect.render,
    update(nextConfig) {
      if (nextConfig.kind === "tessellation") effect.update(nextConfig);
    },
    dispose: effect.dispose,
  };
}
