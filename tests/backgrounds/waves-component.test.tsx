// @vitest-environment happy-dom

import { fireEvent, render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";

const mocks = vi.hoisted(() => ({
  createHost: vi.fn(),
  host: {
    update: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
  },
}));

vi.mock("../../src/backgrounds/webgl-background", () => ({
  createWebGlBackgroundHost: mocks.createHost,
}));

import WavesBackground from "../../src/backgrounds/waves";

describe("WavesBackground", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createHost.mockReturnValue(mocks.host);
  });

  test("updates the existing host when runtime settings change", async () => {
    const page = render(() => {
      const [seed, setSeed] = createSignal(100);
      const [kind, setKind] = createSignal<"waves" | "tessellation">("waves");
      const [speed, setSpeed] = createSignal(1);
      const [intensity, setIntensity] = createSignal(1);
      const [quality, setQuality] = createSignal<"auto" | "low">("auto");
      const [frameRate, setFrameRate] = createSignal<"auto" | "30" | "display">("auto");

      return (
        <>
          <WavesBackground
            kind={kind()}
            seed={seed()}
            speed={speed()}
            intensity={intensity()}
            quality={quality()}
            frameRate={frameRate()}
          />
          <button
            onClick={() => {
              setSeed(200);
              setKind("tessellation");
              setSpeed(1.5);
              setIntensity(0.75);
              setQuality("low");
              setFrameRate("30");
            }}
          >
            Update background
          </button>
        </>
      );
    });

    expect(mocks.createHost).toHaveBeenCalledTimes(1);
    await fireEvent.click(page.getByRole("button", { name: "Update background" }));

    expect(mocks.createHost).toHaveBeenCalledTimes(1);
    expect(mocks.host.update).toHaveBeenLastCalledWith(
      {
        kind: "tessellation",
        seed: 200,
        speed: 1.5,
        intensity: 0.75,
      },
      { quality: "low", frameRate: "30" },
    );

    page.unmount();
    expect(mocks.host.dispose).toHaveBeenCalledTimes(1);
  });

  test("keeps the canvas on the stable viewport width", () => {
    const page = render(() => <WavesBackground />);
    const canvas = page.container.querySelector("canvas");

    expect(canvas).toHaveClass("w-screen");
    expect(canvas).not.toHaveClass("w-full");
  });
});
