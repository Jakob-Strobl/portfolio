import { Vec2 } from "./vector2";

export type ImageTransformVariant = {
  width: number;
  height: number;
  fit: "cover" | "scale-down" | "contain" | "crop";
  quality: number;
};

export const IMAGE_VARIANTS = {
  thumb: { width: 640, height: 640, fit: "cover", quality: 70 },
  grid: { width: 1280, height: 960, fit: "cover", quality: 78 },
  full: { width: 2560, height: 2560, fit: "scale-down", quality: 82 },
} as const satisfies Record<string, ImageTransformVariant>;

export type PhotoVariantKey = keyof typeof IMAGE_VARIANTS;

export type PhotoResource = {
  id: string;
  name: string;
  collection: string;
  dimensions: Vec2;
  r2Key: string;
  takenAt?: string;
};
