import fragmentSource from "./tessellation.frag";
import {
  advanceTessellationModel,
  canAdoptTessellationTopology,
  consumeTopologyTime,
  createTessellationTransitionEdges,
  createTessellationModel,
  createTessellationValues,
  getAnchorGlow,
  getAnchorHue,
  getAnchorLife,
  getTessellationFillTransitionOpacities,
  getTessellationSpatialStyle,
  getTessellationTransitionWeights,
  isTessellationTransitionComplete,
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

export const TESSELLATION_VERTEX_STRIDE = 8;
const FLOATS_PER_VERTEX = TESSELLATION_VERTEX_STRIDE;
const BYTES_PER_VERTEX = FLOATS_PER_VERTEX * Float32Array.BYTES_PER_ELEMENT;

type TessellationUniforms = {
  resolution: WebGLUniformLocation;
  pointer: WebGLUniformLocation;
  time: WebGLUniformLocation;
  intensity: WebGLUniformLocation;
  opacity: WebGLUniformLocation;
  pass: WebGLUniformLocation;
  pointSize: WebGLUniformLocation;
  edgeHalfWidth: WebGLUniformLocation;
};

function writeVertex(
  data: Float32Array,
  offset: number,
  model: TessellationModel,
  anchor: TessellationModel["anchors"][number],
  auxiliary: readonly [number, number, number],
  lifeMultiplier = 1,
) {
  data[offset] = anchor.x;
  data[offset + 1] = anchor.y;
  data[offset + 2] = getAnchorHue(model, anchor);
  data[offset + 3] = getAnchorGlow(model, anchor) * anchor.brightness;
  data[offset + 4] = auxiliary[0];
  data[offset + 5] = auxiliary[1];
  data[offset + 6] = auxiliary[2];
  data[offset + 7] = getAnchorLife(anchor) * lifeMultiplier;
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
    const centroidX = (anchors[0]!.x + anchors[1]!.x + anchors[2]!.x) / 3;
    const centroidY = (anchors[0]!.y + anchors[1]!.y + anchors[2]!.y) / 3;
    const style = getTessellationSpatialStyle(model.seed, centroidX * model.aspectRatio, centroidY);
    const auxiliary = [style.strength, style.hue, 0] as const;
    writeVertex(data, offset, model, anchors[0]!, auxiliary);
    writeVertex(data, offset + FLOATS_PER_VERTEX, model, anchors[1]!, auxiliary);
    writeVertex(data, offset + FLOATS_PER_VERTEX * 2, model, anchors[2]!, auxiliary);
    offset += FLOATS_PER_VERTEX * 3;
  }

  return offset === data.length ? data : data.slice(0, offset);
}

export function createTessellationPointVertices(model: TessellationModel) {
  const anchors = model.anchors.filter((anchor) => !anchor.boundary && anchor.state !== "dead");
  const data = new Float32Array(anchors.length * FLOATS_PER_VERTEX);

  for (let index = 0; index < anchors.length; index += 1) {
    writeVertex(data, index * FLOATS_PER_VERTEX, model, anchors[index], [0, anchors[index].mass, 0]);
  }

  return data;
}

export function createTessellationEdgeVertices(
  model: TessellationModel,
  previousTopology: readonly TessellationTriangle[] | undefined,
  currentTopology: readonly TessellationTriangle[],
  width: number,
  height: number,
  weights: Readonly<{ outgoing: number; incoming: number }>,
) {
  const edges = createTessellationTransitionEdges(previousTopology, currentTopology, weights);
  const anchorsById = new Map(model.anchors.map((anchor) => [anchor.id, anchor]));
  const data = new Float32Array(edges.length * 6 * FLOATS_PER_VERTEX);
  let offset = 0;

  for (const { edge, opacity } of edges) {
    const first = anchorsById.get(edge[0]);
    const second = anchorsById.get(edge[1]);
    if (first == null || second == null || opacity <= 0.001) continue;
    const dx = (second.x - first.x) * width;
    const dy = (second.y - first.y) * height;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length < 0.01) continue;
    const normalX = -dy / length;
    const normalY = dx / length;

    for (const [anchor, side] of [
      [first, -1],
      [second, -1],
      [second, 1],
      [first, -1],
      [second, 1],
      [first, 1],
    ] as const) {
      writeVertex(data, offset, model, anchor, [side, normalX * anchor.mass, normalY * anchor.mass], opacity);
      offset += FLOATS_PER_VERTEX;
    }
  }

  return offset === data.length ? data : data.slice(0, offset);
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
    pass: requireUniform(gl, program, "uPass"),
    pointSize: requireUniform(gl, program, "uPointSize"),
    edgeHalfWidth: requireUniform(gl, program, "uEdgeHalfWidth"),
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
  let topologyDwellTime = 0;
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
    topologyDwellTime = 0;
  }

  function uploadAndDraw(data: Float32Array, mode: number, opacity: number) {
    if (data.length === 0 || opacity <= 0.001) return;
    gl.uniform1f(uniforms.opacity, opacity);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    gl.drawArrays(mode, 0, data.length / FLOATS_PER_VERTEX);
  }

  function rebuildTopology() {
    if (!canAdoptTessellationTopology(previousTopology != null, topologyDwellTime)) return;
    const nextTopology = triangulateTessellation(model.anchors);
    if (tessellationTopologySignature(nextTopology) === tessellationTopologySignature(currentTopology)) return;
    previousTopology = currentTopology;
    currentTopology = nextTopology;
    transitionTime = 0;
    topologyDwellTime = 0;
    const retainedIds = new Set([...previousTopology.flat(), ...currentTopology.flat()]);
    pruneDeadTessellationAnchors(model, retainedIds);
  }

  function renderMesh() {
    const transition = getTessellationTransitionWeights(transitionTime);
    const fillOpacity = getTessellationFillTransitionOpacities(previousTopology != null, transition);
    gl.uniform1i(uniforms.pass, 0);

    if (previousTopology != null) {
      uploadAndDraw(createTessellationTriangleVertices(model, previousTopology), gl.TRIANGLES, fillOpacity.previous);
    }
    uploadAndDraw(createTessellationTriangleVertices(model, currentTopology), gl.TRIANGLES, fillOpacity.current);

    gl.uniform1i(uniforms.pass, 1);
    uploadAndDraw(
      createTessellationEdgeVertices(model, previousTopology, currentTopology, width, height, transition),
      gl.TRIANGLES,
      1,
    );

    gl.uniform1i(uniforms.pass, 2);
    uploadAndDraw(createTessellationPointVertices(model), gl.POINTS, 1);

    if (previousTopology != null && isTessellationTransitionComplete(transitionTime)) {
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
      gl.uniform1f(uniforms.edgeHalfWidth, 1.4);
    },
    render(frame) {
      if (disposed) return;
      const motionDelta = frame.deltaSeconds * values.speed;
      advanceTessellationModel(model, motionDelta, frame.pointer, values.intensity);
      const topologyCadence = consumeTopologyTime(topologyTime, frame.deltaSeconds);
      topologyTime = topologyCadence.remainingSeconds;
      if (topologyCadence.shouldRebuild) rebuildTopology();
      transitionTime += frame.deltaSeconds;
      topologyDwellTime += frame.deltaSeconds;

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
