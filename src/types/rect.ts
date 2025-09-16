import { Accessor } from "solid-js";
import { Vec2 } from "./vector2";

export type Rect = {
  position: Vec2;
  dimensions: Vec2;
};

export type StatefulRect = {
  position: Accessor<Vec2>;
  dimensions: Accessor<Vec2>;
};
