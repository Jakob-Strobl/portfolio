// @vitest-environment happy-dom

import { fireEvent, render } from "@solidjs/testing-library";
import { createSignal, Show } from "solid-js";

import { BackgroundSettingsPanel, BackgroundSettingsTrigger } from "../../src/components/background-settings";
import { BACKGROUND_PREFERENCES_STORAGE_KEY, BackgroundProvider, useBackground } from "../../src/providers/background";

function BackgroundStateProbe() {
  const background = useBackground();

  return (
    <dl data-testid="background-state">
      <dt>Seed</dt>
      <dd data-testid="seed">{background.seed()}</dd>
      <dt>Effect</dt>
      <dd data-testid="effect">{background.kind()}</dd>
      <dt>Effect preference</dt>
      <dd data-testid="effect-preference">{background.effectPreference()}</dd>
      <dt>Speed</dt>
      <dd data-testid="speed">{background.speed()}</dd>
      <dt>Intensity</dt>
      <dd data-testid="intensity">{background.intensity()}</dd>
      <dt>Frame rate</dt>
      <dd data-testid="frame-rate">{background.frameRate()}</dd>
      <dt>Quality</dt>
      <dd data-testid="quality">{background.quality()}</dd>
    </dl>
  );
}

function renderSettings() {
  function SettingsHarness() {
    const [isOpen, setOpen] = createSignal(false);
    const panelId = "test-background-settings";

    return (
      <>
        <BackgroundSettingsTrigger isOpen={isOpen()} panelId={panelId} onOpenChange={setOpen} />
        <Show when={isOpen()}>
          <BackgroundSettingsPanel id={panelId} onClose={() => setOpen(false)} />
        </Show>
      </>
    );
  }

  return render(() => (
    <BackgroundProvider>
      <SettingsHarness />
      <BackgroundStateProbe />
    </BackgroundProvider>
  ));
}

describe("BackgroundSettings", () => {
  beforeEach(() => {
    window.localStorage.removeItem(BACKGROUND_PREFERENCES_STORAGE_KEY);
  });

  afterEach(() => {
    window.localStorage.removeItem(BACKGROUND_PREFERENCES_STORAGE_KEY);
  });

  test("opens an accessible dialog and exposes the staged effect choices", async () => {
    const page = renderSettings();
    const trigger = page.getByRole("button", { name: "Background settings" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(page.queryByRole("dialog")).not.toBeInTheDocument();

    await fireEvent.click(trigger);
    const dialog = page.getByRole("dialog", { name: "Background" });
    const effect = page.getByLabelText("Effect") as HTMLSelectElement;
    const tessellation = page.getByRole("option", { name: "Tessellation" });

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", dialog.id);
    expect(trigger.className).toContain("shadow-");
    expect(dialog).toHaveFocus();
    expect(effect.value).toBe("random");
    expect(tessellation).toBeEnabled();

    await fireEvent.change(effect, { target: { value: "tessellation" } });
    expect(page.getByTestId("effect")).toHaveTextContent("tessellation");
    expect(page.getByTestId("effect-preference")).toHaveTextContent("tessellation");
  });

  test("saves selected preferences without saving the seed", async () => {
    const page = renderSettings();
    await fireEvent.click(page.getByRole("button", { name: "Background settings" }));
    const seed = page.getByTestId("seed").textContent;

    await fireEvent.change(page.getByLabelText("Effect"), { target: { value: "waves" } });
    await fireEvent.input(page.getByLabelText("Motion speed"), { target: { value: "1.5" } });
    await fireEvent.input(page.getByLabelText("Visual intensity"), { target: { value: "0.75" } });
    await fireEvent.change(page.getByLabelText("Quality"), { target: { value: "low" } });
    await fireEvent.change(page.getByLabelText("Frame rate"), { target: { value: "30" } });
    await fireEvent.click(page.getByRole("button", { name: "Save for future sessions" }));

    const savedPreferences = JSON.parse(window.localStorage.getItem(BACKGROUND_PREFERENCES_STORAGE_KEY) ?? "null");
    expect(savedPreferences).toEqual({
      effect: "waves",
      speed: 1.5,
      intensity: 0.75,
      quality: "low",
      frameRate: "30",
    });
    expect(savedPreferences).not.toHaveProperty("seed");
    expect(page.getByText("Saved for future sessions.", { exact: true })).toBeInTheDocument();
    expect(page.getByTestId("seed")).toHaveTextContent(seed ?? "");
  });

  test("loads saved preferences and supports a random effect preference", async () => {
    window.localStorage.setItem(
      BACKGROUND_PREFERENCES_STORAGE_KEY,
      JSON.stringify({
        effect: "tessellation",
        speed: 1.5,
        intensity: 0.75,
        quality: "low",
        frameRate: "30",
      }),
    );

    const page = renderSettings();
    await fireEvent.click(page.getByRole("button", { name: "Background settings" }));

    expect((page.getByLabelText("Effect") as HTMLSelectElement).value).toBe("tessellation");
    expect(page.getByTestId("effect")).toHaveTextContent("tessellation");
    expect(page.getByTestId("speed")).toHaveTextContent("1.5");
    expect(page.getByTestId("intensity")).toHaveTextContent("0.75");
    expect(page.getByTestId("quality")).toHaveTextContent("low");
    expect(page.getByTestId("frame-rate")).toHaveTextContent("30");

    await fireEvent.change(page.getByLabelText("Effect"), { target: { value: "random" } });
    expect(page.getByTestId("effect-preference")).toHaveTextContent("random");
  });

  test("regenerates the seed and updates curated runtime controls", async () => {
    const page = renderSettings();
    await fireEvent.click(page.getByRole("button", { name: "Background settings" }));
    const initialSeed = page.getByTestId("seed").textContent;
    const speed = page.getByLabelText("Motion speed") as HTMLInputElement;
    const intensity = page.getByLabelText("Visual intensity") as HTMLInputElement;
    const quality = page.getByLabelText("Quality") as HTMLSelectElement;
    const frameRate = page.getByLabelText("Frame rate") as HTMLSelectElement;

    await fireEvent.click(page.getByRole("button", { name: "New seed" }));
    await fireEvent.input(speed, { target: { value: "1.5" } });
    await fireEvent.input(intensity, { target: { value: "0.75" } });
    await fireEvent.change(quality, { target: { value: "low" } });
    await fireEvent.change(frameRate, { target: { value: "display" } });

    expect(page.getByTestId("seed")).not.toHaveTextContent(initialSeed ?? "");
    expect(page.getByTestId("speed")).toHaveTextContent("1.5");
    expect(page.getByTestId("intensity")).toHaveTextContent("0.75");
    expect(page.getByTestId("quality")).toHaveTextContent("low");
    expect(page.getByTestId("frame-rate")).toHaveTextContent("display");
  });

  test("closes on Escape, restores focus, and closes on an outside pointer", async () => {
    const page = renderSettings();
    const trigger = page.getByRole("button", { name: "Background settings" });

    await fireEvent.click(trigger);
    await fireEvent.keyDown(document, { key: "Escape" });
    await Promise.resolve();

    expect(page.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();

    await fireEvent.click(trigger);
    await fireEvent.pointerDown(document.body);

    expect(page.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
