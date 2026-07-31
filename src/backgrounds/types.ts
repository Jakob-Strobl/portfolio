export type BackgroundKind = "waves" | "tessellation";

export type BackgroundQuality = "auto" | "low";

export type BackgroundFrameRatePreference = "auto" | "30" | "display";

export type BackgroundRuntimePreferences = {
  quality: BackgroundQuality;
  frameRate: BackgroundFrameRatePreference;
};

export type WavesBackgroundConfig = {
  kind: "waves";
  seed: number;
  speed: number;
  intensity: number;
};

export type TessellationBackgroundConfig = {
  kind: "tessellation";
  seed: number;
  speed: number;
  intensity: number;
};

export type BackgroundConfig = WavesBackgroundConfig | TessellationBackgroundConfig;

export type BackgroundFrame = {
  elapsedSeconds: number;
  deltaSeconds: number;
  pointer: Readonly<{
    x: number;
    y: number;
  }>;
};

export type BackgroundEffect<TConfig extends BackgroundConfig = BackgroundConfig> = {
  resize(width: number, height: number): void;
  render(frame: BackgroundFrame): void;
  update(config: TConfig): void;
  dispose(): void;
};

export type BackgroundEffectFactory<TConfig extends BackgroundConfig> = (
  gl: WebGL2RenderingContext,
  config: TConfig,
) => BackgroundEffect<TConfig>;
