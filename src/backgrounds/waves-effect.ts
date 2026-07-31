import fragmentSource from "./waves.frag";
import vertexSource from "./waves.vert";
import type { BackgroundEffect, WavesBackgroundConfig } from "./types";
import { createWaveHueOffset, createWaveParameters } from "./wave-model";
import { createProgram, requireUniform } from "./webgl";

const GRID_COLUMNS = 64;
const GRID_ROWS = 64;
const WAVE_COUNT = 4;
const MOTION_TIME_SCALE = 0.35;

type WaveUniforms = {
  directions: WebGLUniformLocation;
  amplitudes: WebGLUniformLocation;
  waveNumbers: WebGLUniformLocation;
  angularFrequencies: WebGLUniformLocation;
  steepness: WebGLUniformLocation;
  phases: WebGLUniformLocation;
  hueOffset: WebGLUniformLocation;
  intensity: WebGLUniformLocation;
  time: WebGLUniformLocation;
  aspectRatio: WebGLUniformLocation;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function createWaveGrid() {
  const positions = new Float32Array((GRID_COLUMNS + 1) * (GRID_ROWS + 1) * 3);
  const indices = new Uint16Array(GRID_COLUMNS * GRID_ROWS * 6);
  let positionOffset = 0;
  let indexOffset = 0;

  for (let row = 0; row <= GRID_ROWS; row += 1) {
    const rowProgress = row / GRID_ROWS;
    const z = 8 - rowProgress * 78;
    const halfWidth = 14 + rowProgress * 86;

    for (let column = 0; column <= GRID_COLUMNS; column += 1) {
      const columnProgress = column / GRID_COLUMNS;
      positions[positionOffset++] = (columnProgress * 2 - 1) * halfWidth;
      positions[positionOffset++] = -2;
      positions[positionOffset++] = z;
    }
  }

  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let column = 0; column < GRID_COLUMNS; column += 1) {
      const topLeft = row * (GRID_COLUMNS + 1) + column;
      const bottomLeft = topLeft + GRID_COLUMNS + 1;

      indices[indexOffset++] = topLeft;
      indices[indexOffset++] = bottomLeft;
      indices[indexOffset++] = topLeft + 1;
      indices[indexOffset++] = topLeft + 1;
      indices[indexOffset++] = bottomLeft;
      indices[indexOffset++] = bottomLeft + 1;
    }
  }

  return { positions, indices };
}

export function createWavesEffect(
  gl: WebGL2RenderingContext,
  initialConfig: WavesBackgroundConfig,
): BackgroundEffect<WavesBackgroundConfig> {
  const program = createProgram(gl, vertexSource, fragmentSource);
  const vertexArray = gl.createVertexArray();
  const positionBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();

  if (vertexArray == null || positionBuffer == null || indexBuffer == null) {
    if (vertexArray != null) gl.deleteVertexArray(vertexArray);
    if (positionBuffer != null) gl.deleteBuffer(positionBuffer);
    if (indexBuffer != null) gl.deleteBuffer(indexBuffer);
    gl.deleteProgram(program);
    throw new Error("WebGL could not create the waves mesh");
  }

  const uniforms: WaveUniforms = {
    directions: requireUniform(gl, program, "uWaveDirections[0]"),
    amplitudes: requireUniform(gl, program, "uWaveAmplitudes[0]"),
    waveNumbers: requireUniform(gl, program, "uWaveNumbers[0]"),
    angularFrequencies: requireUniform(gl, program, "uAngularFrequencies[0]"),
    steepness: requireUniform(gl, program, "uWaveSteepness[0]"),
    phases: requireUniform(gl, program, "uWavePhases[0]"),
    hueOffset: requireUniform(gl, program, "uHueOffset"),
    intensity: requireUniform(gl, program, "uIntensity"),
    time: requireUniform(gl, program, "uTime"),
    aspectRatio: requireUniform(gl, program, "uAspectRatio"),
  };
  const { positions, indices } = createWaveGrid();

  gl.bindVertexArray(vertexArray);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.bindVertexArray(null);

  gl.disable(gl.BLEND);
  gl.disable(gl.CULL_FACE);
  gl.disable(gl.DEPTH_TEST);
  gl.clearColor(0.0745, 0.051, 0.1255, 1);

  let config = initialConfig;
  let disposed = false;

  function update(nextConfig: WavesBackgroundConfig) {
    config = nextConfig;
    const waves = createWaveParameters(config.seed);
    const directions = new Float32Array(WAVE_COUNT * 2);

    for (let index = 0; index < waves.length; index += 1) {
      directions[index * 2] = waves[index].direction[0];
      directions[index * 2 + 1] = waves[index].direction[1];
    }

    gl.useProgram(program);
    gl.uniform2fv(uniforms.directions, directions);
    gl.uniform1fv(
      uniforms.amplitudes,
      waves.map((wave) => wave.amplitude),
    );
    gl.uniform1fv(
      uniforms.waveNumbers,
      waves.map((wave) => wave.waveNumber),
    );
    gl.uniform1fv(
      uniforms.angularFrequencies,
      waves.map((wave) => wave.angularFrequency),
    );
    gl.uniform1fv(
      uniforms.steepness,
      waves.map((wave) => wave.steepness),
    );
    gl.uniform1fv(
      uniforms.phases,
      waves.map((wave) => wave.phase),
    );
    gl.uniform1f(uniforms.hueOffset, createWaveHueOffset(config.seed));
    gl.uniform1f(uniforms.intensity, clamp(config.intensity, 0, 1.5));
  }

  update(initialConfig);

  return {
    resize(width, height) {
      gl.useProgram(program);
      gl.uniform1f(uniforms.aspectRatio, width / height);
    },
    render(frame) {
      if (disposed) return;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform1f(uniforms.time, frame.elapsedSeconds * MOTION_TIME_SCALE * clamp(config.speed, 0, 2));
      gl.bindVertexArray(vertexArray);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      gl.bindVertexArray(null);
    },
    update,
    dispose() {
      if (disposed) return;
      disposed = true;
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteVertexArray(vertexArray);
      gl.deleteProgram(program);
    },
  };
}
