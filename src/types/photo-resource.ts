import { Vec2 } from "./vector2";

export type PhotoResource = {
  name: string;
  uri: string;
  // Reserving in case I need to precompute for some loading shenanigans
  dimensions?: Vec2;
};
