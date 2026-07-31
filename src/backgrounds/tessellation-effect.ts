import fragmentSource from "./tessellation.frag";
import { createTessellationUniformValues } from "./tessellation-model";
import vertexSource from "./tessellation.vert";
import type { BackgroundEffect, TessellationBackgroundConfig } from "./types";
import { createProgram, requireUniform } from "./webgl";

type TessellationUniforms = {
  resolution: WebGLUniformLocation;
  pointer: WebGLUniformLocation;
  seed: WebGLUniformLocation;
  time: WebGLUniformLocation;
  intensity: WebGLUniformLocation;
};

export function createTessellationEffect(
  gl: WebGL2RenderingContext,
  initialConfig: TessellationBackgroundConfig,
): BackgroundEffect<TessellationBackgroundConfig> {
  const program = createProgram(gl, vertexSource, fragmentSource);
  const uniforms: TessellationUniforms = {
    resolution: requireUniform(gl, program, "uResolution"),
    pointer: requireUniform(gl, program, "uPointer"),
    seed: requireUniform(gl, program, "uSeed"),
    time: requireUniform(gl, program, "uTime"),
    intensity: requireUniform(gl, program, "uIntensity"),
  };
  let values = createTessellationUniformValues(initialConfig);
  let disposed = false;

  gl.disable(gl.BLEND);
  gl.disable(gl.CULL_FACE);
  gl.disable(gl.DEPTH_TEST);

  function update(config: TessellationBackgroundConfig) {
    values = createTessellationUniformValues(config);
    gl.useProgram(program);
    gl.uniform2f(uniforms.seed, values.seed[0], values.seed[1]);
    gl.uniform1f(uniforms.intensity, values.intensity);
  }

  update(initialConfig);

  return {
    resize(width, height) {
      gl.useProgram(program);
      gl.uniform2f(uniforms.resolution, width, height);
    },
    render(frame) {
      if (disposed) return;
      gl.useProgram(program);
      gl.uniform1f(uniforms.time, frame.elapsedSeconds * values.speed);
      gl.uniform2f(uniforms.pointer, frame.pointer.x, frame.pointer.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    update,
    dispose() {
      if (disposed) return;
      disposed = true;
      gl.deleteProgram(program);
    },
  };
}
