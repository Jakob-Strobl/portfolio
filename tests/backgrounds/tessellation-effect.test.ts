import {
  createTessellationEdgeVertices,
  createTessellationPointVertices,
  createTessellationTriangleVertices,
  TESSELLATION_VERTEX_STRIDE,
} from "../../src/backgrounds/tessellation-effect";
import {
  createTessellationModel,
  getTessellationFacetLight,
  getTessellationSpatialStyle,
  triangulateTessellation,
} from "../../src/backgrounds/tessellation-model";

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

  test("packs one stable stained-glass style and flat light uniformly across a selected facet", () => {
    const model = createTessellationModel(704);
    const anchorsById = new Map(model.anchors.map((anchor) => [anchor.id, anchor]));
    const triangle = triangulateTessellation(model.anchors).find((candidate) => {
      const anchors = candidate.map((id) => anchorsById.get(id)!);
      const x = ((anchors[0].x + anchors[1].x + anchors[2].x) / 3) * model.aspectRatio;
      const y = (anchors[0].y + anchors[1].y + anchors[2].y) / 3;
      return getTessellationSpatialStyle(model.seed, x, y).selected;
    })!;
    const anchors = triangle.map((id) => anchorsById.get(id)!);
    const style = getTessellationSpatialStyle(
      model.seed,
      ((anchors[0].x + anchors[1].x + anchors[2].x) / 3) * model.aspectRatio,
      (anchors[0].y + anchors[1].y + anchors[2].y) / 3,
    );
    const vertices = createTessellationTriangleVertices(model, [triangle]);
    const facetLight = getTessellationFacetLight([anchors[0], anchors[1], anchors[2]], model.aspectRatio);

    for (let vertex = 0; vertex < 3; vertex += 1) {
      const offset = vertex * TESSELLATION_VERTEX_STRIDE;
      expect(vertices[offset + 4]).toBeCloseTo(style.strength);
      expect(vertices[offset + 5]).toBeCloseTo(style.hue);
      expect(vertices[offset + 6]).toBeCloseTo(facetLight);
    }
  });
});
