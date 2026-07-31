import {
  createTessellationEdgeVertices,
  createTessellationPointVertices,
  TESSELLATION_VERTEX_STRIDE,
} from "../../src/backgrounds/tessellation-effect";
import { createTessellationModel } from "../../src/backgrounds/tessellation-model";

describe("living tessellation vertex packing", () => {
  test("encodes anchor mass into point size and tapered edge endpoint widths", () => {
    const model = createTessellationModel(81);
    const anchors = model.anchors.filter((anchor) => !anchor.boundary).slice(0, 3);
    anchors[0].mass = 0.72;
    anchors[1].mass = 1.42;
    const topology = [[anchors[0].id, anchors[1].id, anchors[2].id]] as const;
    const points = createTessellationPointVertices(model);
    const edges = createTessellationEdgeVertices(model, undefined, topology, 800, 600, {
      outgoing: 0,
      incoming: 1,
    });

    expect(points[5]).toBeCloseTo(anchors[0].mass);
    const firstEndpointNormalScale = Math.hypot(edges[5], edges[6]);
    const secondEndpointOffset = TESSELLATION_VERTEX_STRIDE;
    const secondEndpointNormalScale = Math.hypot(edges[secondEndpointOffset + 5], edges[secondEndpointOffset + 6]);
    expect(firstEndpointNormalScale).toBeCloseTo(anchors[0].mass);
    expect(secondEndpointNormalScale).toBeCloseTo(anchors[1].mass);
    expect(secondEndpointNormalScale).toBeGreaterThan(firstEndpointNormalScale);
  });
});
