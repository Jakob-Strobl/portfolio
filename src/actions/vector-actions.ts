import { Accessor } from "solid-js";
import { Rect } from "../types/rect";
import { Vec2 } from "../types/vector2";

/**
 *
 * @param shadowRect
 * @param scale numbers > 1 will scale larger. For smaller use < 1 values; 0.1 equals scaling down 1 to 10
 */
export function scaleAndCenterVec(dimensions: Accessor<Vec2>, position: Accessor<Vec2>, scale: number = 1.0): Rect {
  const scaledWidth = dimensions().x * scale;
  const scaledHeight = dimensions().y * scale;
  const centeredLeft = position().x + (dimensions().x - scaledWidth) / 2;
  const centeredTop = position().y + (dimensions().y - scaledHeight) / 2; // TODO [ ]: account for scrollY?

  return {
    position: { x: centeredLeft, y: centeredTop },
    dimensions: { x: scaledWidth, y: scaledHeight },
  };
}

export function aspectRatio(dimensions?: Vec2): number {
  if (dimensions == null) {
    return 1.5; // default to 3:2
  }
  return dimensions.x / dimensions.y;
}
