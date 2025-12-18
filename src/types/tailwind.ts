type GapScale =
  | 0
  | 0.5
  | 1
  | 1.5
  | 2
  | 2.5
  | 3
  | 3.5
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 14
  | 16
  | 20
  | 24
  | 28
  | 32
  | 36
  | 40
  | 44
  | 48
  | 52
  | 56
  | 60
  | 64
  | 72
  | 80
  | 96;
type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
type Variant = "hover" | "focus" | "active";

const justifyValues = ["start", "end", "center", "between", "around", "evenly"] as const;
type JustifyClass = `justify-${(typeof justifyValues)[number]}`;

const itemsValues = ["start", "end", "center", "baseline", "stretch"] as const;
type ItemsClass = `items-${(typeof itemsValues)[number]}`;

const contentValues = ["start", "end", "center", "between", "around", "evenly", "stretch"] as const;
type ContentClass = `content-${(typeof contentValues)[number]}`;

export type WithVariants<T extends string> =
  | T
  | `${Breakpoint}:${T}`
  | `${Variant}:${T}`
  | `${Breakpoint}:${Variant}:${T}`;

export type GapClass = WithVariants<`gap-${GapScale}`>;
export type FlexAlignClass = WithVariants<JustifyClass | ItemsClass | ContentClass>;
