import Dice5 from "lucide-solid/icons/dice-5";
import Save from "lucide-solid/icons/save";
import SlidersHorizontal from "lucide-solid/icons/sliders-horizontal";
import X from "lucide-solid/icons/x";
import { createEffect, createSignal, onCleanup, Show } from "solid-js";

import { BACKGROUND_CONTROL_RANGES, useBackground } from "~/providers/background";

type BackgroundSettingsTriggerProps = {
  isOpen: boolean;
  panelId: string;
  onOpenChange(isOpen: boolean): void;
  triggerRef?: (element: HTMLButtonElement) => void;
  describedBy?: string;
};

type BackgroundSettingsPanelProps = {
  id: string;
  onClose(): void;
};

export function BackgroundSettingsTrigger(props: BackgroundSettingsTriggerProps) {
  let triggerEl: HTMLButtonElement | undefined;

  function close(options: { restoreFocus?: boolean } = {}) {
    if (!props.isOpen) return;
    props.onOpenChange(false);
    if (options.restoreFocus !== false) queueMicrotask(() => triggerEl?.focus());
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== "Escape" || !props.isOpen) return;
    event.preventDefault();
    close();
  }

  function handlePointerDown(event: PointerEvent) {
    if (!props.isOpen) return;
    const target = event.target as Node;
    const panel = document.getElementById(props.panelId);
    if (triggerEl?.contains(target) || panel?.contains(target)) return;
    close({ restoreFocus: false });
  }

  createEffect(() => {
    if (!props.isOpen) return;
    queueMicrotask(() => document.getElementById(props.panelId)?.focus());
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    });
  });

  return (
    <button
      ref={(element) => {
        triggerEl = element;
        props.triggerRef?.(element);
      }}
      type="button"
      class="h-8 w-8 rounded-md p-1 transition-all duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-300"
      classList={{
        "bg-night-700/35 text-night-100 shadow-[0_0_0.65rem_rgba(202,156,242,0.5)]": props.isOpen,
        "text-gray-300/80": !props.isOpen,
      }}
      aria-label="Background settings"
      aria-haspopup="dialog"
      aria-expanded={props.isOpen}
      aria-controls={props.panelId}
      aria-describedby={props.describedBy}
      onClick={() => props.onOpenChange(!props.isOpen)}
    >
      <SlidersHorizontal aria-hidden="true" size={15} strokeWidth={1.75} />
    </button>
  );
}

export function BackgroundSettingsPanel(props: BackgroundSettingsPanelProps) {
  const background = useBackground();
  const [saveMessage, setSaveMessage] = createSignal("");
  const panelTitleId = `${props.id}-title`;
  const speedId = `${props.id}-speed`;
  const intensityId = `${props.id}-intensity`;

  function savePreferences() {
    setSaveMessage(background.savePreferences() ? "Saved for future sessions." : "Could not save preferences.");
  }

  return (
    <div
      id={props.id}
      role="dialog"
      aria-labelledby={panelTitleId}
      tabindex="-1"
      class="fade-in max-h-[calc(100dvh-10rem)] w-full overflow-y-auto rounded-xl border border-white/15 bg-night-black/88 p-3.5 text-left text-sm text-night-100 shadow-2xl shadow-black/55 backdrop-blur-xl focus:outline-none"
    >
      <div class="mb-3 flex items-start justify-between gap-4">
        <div>
          <h2 id={panelTitleId} class="text-base font-medium text-white">
            Background
          </h2>
          <p class="mt-0.5 text-xs leading-relaxed text-gray-300/75">Tune the ambience for this visit.</p>
        </div>
        <button
          type="button"
          class="-mt-1 -mr-1 rounded-md p-1.5 text-gray-300/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-300"
          aria-label="Close background settings"
          onClick={() => props.onClose()}
        >
          <X aria-hidden="true" size={16} />
        </button>
      </div>

      <div class="space-y-3">
        <label class="block">
          <span class="mb-1.5 block text-xs font-medium text-gray-200">Effect</span>
          <select
            class="w-full rounded-md border border-white/15 bg-night-900 px-2.5 py-2 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-300"
            value={background.effectPreference()}
            onChange={(event) =>
              background.setEffectPreference(event.currentTarget.value as "random" | "waves" | "tessellation")
            }
          >
            <option value="random">Random - {background.kind() === "waves" ? "Waves" : "Tessellation"}</option>
            <option value="waves">Waves</option>
            <option value="tessellation">Tessellation</option>
          </select>
        </label>

        <p class="-mt-2 text-xs leading-relaxed text-gray-300/75">Random selects a new effect on each session.</p>

        <button
          type="button"
          class="flex w-full items-center justify-center gap-2 rounded-md border border-white/15 bg-white/6 px-3 py-2 text-sm text-white transition-colors hover:border-white/25 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-300"
          onClick={() => background.regenerateSeed()}
        >
          <Dice5 aria-hidden="true" size={16} />
          New seed
        </button>

        <div>
          <span class="mb-1 flex items-baseline justify-between gap-3">
            <label for={speedId} class="text-xs font-medium text-gray-200">
              Motion speed
            </label>
            <output class="text-xs tabular-nums text-gray-300" for={speedId}>
              {background.speed().toFixed(2)}×
            </output>
          </span>
          <input
            id={speedId}
            class="block w-full accent-night-400"
            type="range"
            min={BACKGROUND_CONTROL_RANGES.speed.minimum}
            max={BACKGROUND_CONTROL_RANGES.speed.maximum}
            step={BACKGROUND_CONTROL_RANGES.speed.step}
            value={background.speed()}
            onInput={(event) => background.setSpeed(event.currentTarget.valueAsNumber)}
          />
        </div>

        <div>
          <span class="mb-1 flex items-baseline justify-between gap-3">
            <label for={intensityId} class="text-xs font-medium text-gray-200">
              Visual intensity
            </label>
            <output class="text-xs tabular-nums text-gray-300" for={intensityId}>
              {Math.round(background.intensity() * 100)}%
            </output>
          </span>
          <input
            id={intensityId}
            class="block w-full accent-night-400"
            type="range"
            min={BACKGROUND_CONTROL_RANGES.intensity.minimum}
            max={BACKGROUND_CONTROL_RANGES.intensity.maximum}
            step={BACKGROUND_CONTROL_RANGES.intensity.step}
            value={background.intensity()}
            onInput={(event) => background.setIntensity(event.currentTarget.valueAsNumber)}
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <label class="block">
            <span class="mb-1.5 block text-xs font-medium text-gray-200">Quality</span>
            <select
              class="w-full rounded-md border border-white/15 bg-night-900 px-2 py-2 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-300"
              value={background.quality()}
              onChange={(event) => background.setQuality(event.currentTarget.value as "auto" | "low")}
            >
              <option value="auto">Auto</option>
              <option value="low">Low</option>
            </select>
          </label>

          <label class="block">
            <span class="mb-1.5 block text-xs font-medium text-gray-200">Frame rate</span>
            <select
              class="w-full rounded-md border border-white/15 bg-night-900 px-2 py-2 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-300"
              value={background.frameRate()}
              onChange={(event) => background.setFrameRate(event.currentTarget.value as "auto" | "30" | "display")}
            >
              <option value="auto">Auto</option>
              <option value="30">30 FPS</option>
              <option value="display">Display</option>
            </select>
          </label>
        </div>

        <p class="-mt-2 text-xs leading-relaxed text-gray-300/75">
          Auto uses 30 FPS on mobile and battery power. Choose Low quality or 30 FPS for older devices, heat, or longer
          battery life. Reduced motion stays static.
        </p>

        <button
          type="button"
          class="flex w-full items-center justify-center gap-2 rounded-md border border-night-400/50 bg-night-700/25 px-3 py-2 text-sm text-white transition-colors hover:border-night-300 hover:bg-night-700/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-300"
          onClick={savePreferences}
        >
          <Save aria-hidden="true" size={16} />
          Save for future sessions
        </button>
        <p class="-mt-2 text-xs leading-relaxed text-gray-300/75">
          Saving preserves all settings except seeds. Seeds are regenerated each session.
        </p>
        <Show when={saveMessage()}>
          <p role="status" class="text-center text-xs text-night-300">
            {saveMessage()}
          </p>
        </Show>
      </div>
    </div>
  );
}

export default BackgroundSettingsTrigger;
