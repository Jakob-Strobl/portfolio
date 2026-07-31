import fragmentSource from "./tessellation.frag";
import {
  advanceTessellationModel,
  consumeTopologyTime,
  createTessellationModel,
  createTessellationValues,
  getAnchorLife,
  getTessellationTransitionWeights,
  pruneDeadTessellationAnchors,
  shouldResetTessellationAspect,
  tessellationTopologySignature,
  triangulateTessellation,
  type TessellationModel,
  type TessellationTriangle,
} from "./tessellation-model";
import vertexSource from "./tessellation.vert";
import type { BackgroundEffect, TessellationBackgroundConfig } from "./types";
import { createProgram, requireUniform } from "./webgl";

const FLOATS_PER_VERTEX = 8;
const BYTES_PER_VERTEX = FLOATS_PER_VERTEX * Float32Array.BYTES_PER_ELEMENT;

type TessellationUniforms = {
  resolution: WebGLUniformLocation;
  pointer: WebGLUniformLocation;
  time: WebGLUniformLocation;
  intensity: WebGLUniformLocation;
  opacity: WebGLUniformLocation;
  pointPass: WebGLUniformLocation;
  pointSize: WebGLUniformLocation;
};

function writeVertex(
  data: Float32Array,
  offset: number,
  model: TessellationModel,
  anchor: TessellationModel["anchors"][number],
  barycentric: readonly [number, number, number],
) {
  data[offset] = anchor.x;
  data[offset + 1] = anchor.y;
  data[offset + 2] = (anchor.hue + model.time * anchor.hueRate) % 1;
  data[offset + 3] = anchor.brightness;
  data[offset + 4] = barycentric[0];
  data[offset + 5] = barycentric[1];
  data[offset + 6] = barycentric[2];
  data[offset + 7] = getAnchorLife(anchor);
}

export function createTessellationTriangleVertices(
  model: TessellationModel,
  triangles: readonly TessellationTriangle[],
) {
  const data = new Float32Array(triangles.length * 3 * FLOATS_PER_VERTEX);
  const anchorsById = new Map(model.anchors.map((anchor) => [anchor.id, anchor]));
  let offset = 0;

  for (const triangle of triangles) {
    const anchors = triangle.map((anchorId) => anchorsById.get(anchorId));
    if (anchors.some((anchor) => anchor == null)) continue;
    writeVertex(data, offset, model, anchors[0]!, [1, 0, 0]);
    writeVertex(data, offset + FLOATS_PER_VERTEX, model, anchors[1]!, [0, 1, 0]);
    writeVertex(data, offset + FLOATS_PER_VERTEX * 2, model, anchors[2]!, [0, 0, 1]);
    offset += FLOATS_PER_VERTEX * 3;
  }

  return offset === data.length ? data : data.slice(0, offset);
}

export function createTessellationPointVertices(model: TessellationModel) {
  const anchors = model.anchors.filter((anchor) => !anchor.boundary && anchor.state !== "dead");
  const data = new Float32Array(anchors.length * FLOATS_PER_VERTEX);

  for (let index = 0; index < anchors.length; index += 1) {
    writeVertex(data, index * FLOATS_PER_VERTEX, model, anchors[index], [1, 1, 1]);
  }

  return data;
}

export function createTessellationEffect(
  gl: WebGL2RenderingContext,
  initialConfig: TessellationBackgroundConfig,
): BackgroundEffect<TessellationBackgroundConfig> {
  const program = createProgram(gl, vertexSource, fragmentSource);
  const vertexArray = gl.createVertexArray();
  const vertexBuffer = gl.createBuffer();

  if (vertexArray == null || vertexBuffer == null) {
    if (vertexArray != null) gl.deleteVertexArray(vertexArray);
    if (vertexBuffer != null) gl.deleteBuffer(vertexBuffer);
    gl.deleteProgram(program);
    throw new Error("WebGL could not create the tessellation mesh");
  }

  const uniforms: TessellationUniforms = {
    resolution: requireUniform(gl, program, "uResolution"),
    pointer: requireUniform(gl, program, "uPointer"),
    time: requireUniform(gl, program, "uTime"),
    intensity: requireUniform(gl, program, "uIntensity"),
    opacity: requireUniform(gl, program, "uOpacity"),
    pointPass: requireUniform(gl, program, "uPointPass"),
    pointSize: requireUniform(gl, program, "uPointSize"),
  };

  gl.bindVertexArray(vertexArray);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, BYTES_PER_VERTEX, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, BYTES_PER_VERTEX, 2 * Float32Array.BYTES_PER_ELEMENT);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 3, gl.FLOAT, false, BYTES_PER_VERTEX, 4 * Float32Array.BYTES_PER_ELEMENT);
  gl.enableVertexAttribArray(3);
  gl.vertexAttribPointer(3, 1, gl.FLOAT, false, BYTES_PER_VERTEX, 7 * Float32Array.BYTES_PER_ELEMENT);
  gl.bindVertexArray(null);

  gl.disable(gl.CULL_FACE);
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0.0745, 0.051, 0.1255, 1);

  let config = initialConfig;
  let values = createTessellationValues(config);
  let model = createTessellationModel(config.seed);
  let currentTopology = triangulateTessellation(model.anchors);
  let previousTopology: TessellationTriangle[] | undefined;
  let topologyTime = 0;
  let transitionTime = Number.POSITIVE_INFINITY;
  let width = 1;
  let height = 1;
  let hasMeasuredViewport = false;
  let disposed = false;

  function resetModel(aspectRatio: number) {
    model = createTessellationModel(config.seed, aspectRatio);
    currentTopology = triangulateTessellation(model.anchors);
    previousTopology = undefined;
    topologyTime = 0;
    transitionTime = Number.POSITIVE_INFINITY;
  }

  function uploadAndDraw(data: Float32Array, mode: number, opacity: number) {
    if (data.length === 0 || opacity <= 0.001) return;
    gl.uniform1f(uniforms.opacity, opacity);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    gl.drawArrays(mode, 0, data.length / FLOATS_PER_VERTEX);
  }

  function rebuildTopology() {
    const nextTopology = triangulateTessellation(model.anchors);
    if (tessellationTopologySignature(nextTopology) === tessellationTopologySignature(currentTopology)) return;
    previousTopology = currentTopology;
    currentTopology = nextTopology;
    transitionTime = 0;
    const retainedIds = new Set([...previousTopology.flat(), ...currentTopology.flat()]);
    pruneDeadTessellationAnchors(model, retainedIds);
  }

  function renderMesh() {
    const transition = getTessellationTransitionWeights(transitionTime);
    gl.uniform1i(uniforms.pointPass, 0);

    if (previousTopology != null && transition.outgoing > 0.001) {
      uploadAndDraw(createTessellationTriangleVertices(model, previousTopology), gl.TRIANGLES, transition.outgoing);
    }
    uploadAndDraw(createTessellationTriangleVertices(model, currentTopology), gl.TRIANGLES, transition.incoming);

    gl.uniform1i(uniforms.pointPass, 1);
    uploadAndDraw(createTessellationPointVertices(model), gl.POINTS, 1);

    if (previousTopology != null && transition.incoming >= 0.999) {
      previousTopology = undefined;
      const retainedIds = new Set(currentTopology.flat());
      pruneDeadTessellationAnchors(model, retainedIds);
    }
  }

  function update(nextConfig: TessellationBackgroundConfig) {
    const seedChanged = nextConfig.seed !== config.seed;
    config = nextConfig;
    values = createTessellationValues(config);
    if (seedChanged) resetModel(width / height);
  }

  update(initialConfig);

  return {
    resize(nextWidth, nextHeight) {
      const previousAspectRatio = width / height;
      width = nextWidth;
      height = nextHeight;
      const aspectRatio = width / height;
      if (shouldResetTessellationAspect(hasMeasuredViewport, previousAspectRatio, aspectRatio)) {
        resetModel(aspectRatio);
      }
      hasMeasuredViewport = true;
      gl.useProgram(program);
      gl.uniform2f(uniforms.resolution, width, height);
      gl.uniform1f(uniforms.pointSize, Math.max(3, Math.min(6.5, height / 170)));
    },
    render(frame) {
      if (disposed) return;
      const motionDelta = frame.deltaSeconds * values.speed;
      advanceTessellationModel(model, motionDelta, frame.pointer, values.intensity);
      const topologyCadence = consumeTopologyTime(topologyTime, frame.deltaSeconds);
      topologyTime = topologyCadence.remainingSeconds;
      if (topologyCadence.shouldRebuild) rebuildTopology();
      transitionTime += frame.deltaSeconds;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(uniforms.pointer, frame.pointer.x, frame.pointer.y);
      gl.uniform1f(uniforms.time, model.time);
      gl.uniform1f(uniforms.intensity, values.intensity);
      gl.bindVertexArray(vertexArray);
      renderMesh();
      gl.bindVertexArray(null);
    },
    update,
    dispose() {
      if (disposed) return;
      disposed = true;
      gl.deleteBuffer(vertexBuffer);
      gl.deleteVertexArray(vertexArray);
      gl.deleteProgram(program);
    },
  };
}
