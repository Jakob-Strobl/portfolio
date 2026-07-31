import { createAnimationLoop } from "./animation-loop";
import type { BackgroundConfig, BackgroundEffect, BackgroundEffectFactory } from "./types";

export type WebGlBackgroundHost = {
  update(config: BackgroundConfig): void;
  resize(): void;
  dispose(): void;
};

const POINTER_FOLLOW_RATE = 7;
const FALLBACK_COLOR = [0.0745, 0.051, 0.1255, 1] as const;

export function normalizePointerPosition(clientX: number, clientY: number, width: number, height: number) {
  return {
    x: Math.min(1, Math.max(0, clientX / Math.max(1, width))),
    y: Math.min(1, Math.max(0, 1 - clientY / Math.max(1, height))),
  };
}

function getViewportDimensions() {
  const viewport = window.visualViewport;

  return {
    width: Math.max(1, Math.round(viewport?.width ?? window.innerWidth)),
    height: Math.max(1, Math.round(viewport?.height ?? window.innerHeight)),
  };
}

export function createWebGlBackgroundHost(
  canvas: HTMLCanvasElement,
  factory: BackgroundEffectFactory<BackgroundConfig>,
  initialConfig: BackgroundConfig,
): WebGlBackgroundHost | undefined {
  const context = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    desynchronized: true,
    failIfMajorPerformanceCaveat: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: false,
    stencil: false,
  });

  if (context == null) return undefined;
  const gl = context as WebGL2RenderingContext;
  gl.clearColor(...FALLBACK_COLOR);
  gl.clear(gl.COLOR_BUFFER_BIT);

  let config = initialConfig;
  let effect: BackgroundEffect<BackgroundConfig> | undefined;
  let disposed = false;
  let startedAt: number | undefined;
  let previousTimestamp: number | undefined;
  let pointerX = 0.5;
  let pointerY = 0.5;
  let pointerTargetX = 0.5;
  let pointerTargetY = 0.5;

  const loop = createAnimationLoop((timestamp) => {
    startedAt ??= timestamp;
    const deltaSeconds = previousTimestamp == null ? 0 : Math.min((timestamp - previousTimestamp) / 1000, 0.1);
    previousTimestamp = timestamp;
    const pointerFollow = 1 - Math.exp(-POINTER_FOLLOW_RATE * deltaSeconds);
    pointerX += (pointerTargetX - pointerX) * pointerFollow;
    pointerY += (pointerTargetY - pointerY) * pointerFollow;
    effect?.render({
      elapsedSeconds: (timestamp - startedAt) / 1000,
      deltaSeconds,
      pointer: { x: pointerX, y: pointerY },
    });
  });

  function resize() {
    if (disposed) return;
    const { width, height } = getViewportDimensions();

    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    gl.viewport(0, 0, width, height);
    effect?.resize(width, height);
  }

  function initializeEffect() {
    effect = factory(gl, config);
    resize();
    startedAt = undefined;
    previousTimestamp = undefined;
    effect.render({ elapsedSeconds: 0, deltaSeconds: 0, pointer: { x: pointerX, y: pointerY } });
  }

  function showFallback() {
    gl.clearColor(...FALLBACK_COLOR);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  function handlePointerMove(event: PointerEvent) {
    const { width, height } = getViewportDimensions();
    const pointer = normalizePointerPosition(event.clientX, event.clientY, width, height);
    pointerTargetX = pointer.x;
    pointerTargetY = pointer.y;
  }

  function handleContextLost(event: Event) {
    event.preventDefault();
    loop.stop();
    effect = undefined;
  }

  function handleContextRestored() {
    if (disposed) return;

    try {
      initializeEffect();
      loop.start();
    } catch (error) {
      console.error("Background: Failed to restore WebGL context", error);
      effect = undefined;
      showFallback();
    }
  }

  try {
    initializeEffect();
  } catch (error) {
    console.error("Background: Failed to initialize WebGL effect", error);
    showFallback();
    return undefined;
  }

  window.addEventListener("resize", resize, { passive: true });
  window.visualViewport?.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  canvas.addEventListener("webglcontextlost", handleContextLost);
  canvas.addEventListener("webglcontextrestored", handleContextRestored);
  loop.start();

  return {
    update(nextConfig) {
      if (nextConfig.kind !== config.kind) {
        effect?.dispose();
        effect = undefined;
        config = nextConfig;

        try {
          initializeEffect();
        } catch (error) {
          console.error("Background: Failed to switch WebGL effect", error);
          effect = undefined;
          showFallback();
        }
        return;
      }

      config = nextConfig;
      effect?.update(nextConfig);
    },
    resize,
    dispose() {
      if (disposed) return;
      disposed = true;
      loop.stop();
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      effect?.dispose();
      effect = undefined;
    },
  };
}
