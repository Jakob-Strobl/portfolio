// @vitest-environment happy-dom

import { fireEvent, render, waitFor } from "@solidjs/testing-library";

import Shadow from "../../src/components/shadow/shadow";
import Umbra, { setState, state } from "../../src/components/shadow/umbra";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function renderInteractiveShadow(blurOnInteraction = true) {
  const page = render(() => (
    <>
      <Umbra />
      <Shadow blurOnInteraction={blurOnInteraction}>
        <button>Card action</button>
      </Shadow>
    </>
  ));
  const source = page.container.querySelector<HTMLDivElement>("[data-shadow]")!;
  const wrapper = source.parentElement as HTMLDivElement;
  const button = page.getByRole("button", { name: "Card action" });
  const detached = page.container.querySelector<HTMLDivElement>("div[style*='translate3d']")!;
  const rect = state.shadows[0];
  rect.setVisible(true);

  return { page, source, wrapper, button, detached, rect };
}

describe("Shadow interaction backdrop blur", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    setState({ shadows: [], removedShadows: [] });
  });

  afterEach(() => {
    setState({ shadows: [], removedShadows: [] });
    vi.unstubAllGlobals();
  });

  test("uses one combined hover and focus-within state for the warm border and blur", async () => {
    const { wrapper, button, detached, rect } = renderInteractiveShadow();
    rect.setShadowState("warm");

    await fireEvent.pointerEnter(wrapper, { pointerType: "mouse" });
    expect(rect.interactionActive()).toBe(true);
    await waitFor(() => {
      expect(wrapper).toHaveClass("border-white/14");
      expect(detached).toHaveClass("backdrop-blur-md");
    });

    await fireEvent.focusIn(button);
    await fireEvent.pointerLeave(wrapper, { pointerType: "mouse" });
    expect(rect.interactionActive()).toBe(true);
    expect(wrapper).toHaveClass("border-white/14");
    expect(detached).toHaveClass("backdrop-blur-md");

    await fireEvent.focusOut(button, { relatedTarget: document.body });
    expect(rect.interactionActive()).toBe(false);
    await waitFor(() => {
      expect(wrapper).toHaveClass("border-white/6");
      expect(detached).not.toHaveClass("backdrop-blur-md");
    });
  });

  test("ignores touch pointer entry", async () => {
    const { wrapper, detached, rect } = renderInteractiveShadow();
    rect.setShadowState("warm");

    await fireEvent.pointerEnter(wrapper, { pointerType: "touch" });

    expect(rect.interactionActive()).toBe(false);
    expect(wrapper).toHaveClass("border-white/6");
    expect(detached).not.toHaveClass("backdrop-blur-md");
  });

  test("requires the opt-in, source visibility, warm state, and active interaction", async () => {
    const enabled = renderInteractiveShadow();
    enabled.rect.setShadowState("mounted");
    await fireEvent.pointerEnter(enabled.wrapper, { pointerType: "mouse" });
    expect(enabled.rect.interactionActive()).toBe(true);
    expect(enabled.detached).not.toHaveClass("backdrop-blur-md");
    expect(enabled.wrapper).toHaveClass("border-white/0");

    enabled.rect.setShadowState("warm");
    await waitFor(() => expect(enabled.detached).toHaveClass("backdrop-blur-md"));
    enabled.rect.setVisible(false);
    await waitFor(() => expect(enabled.detached).not.toHaveClass("backdrop-blur-md"));
    enabled.page.unmount();
    setState({ shadows: [], removedShadows: [] });

    const disabled = renderInteractiveShadow(false);
    disabled.rect.setShadowState("warm");
    await fireEvent.pointerEnter(disabled.wrapper, { pointerType: "mouse" });
    expect(disabled.rect.interactionActive()).toBe(true);
    expect(disabled.wrapper).toHaveClass("border-white/14");
    expect(disabled.detached).not.toHaveClass("backdrop-blur-md");
  });

  test("keeps the dark fallback and entrance fade without transitioning backdrop-filter", async () => {
    const { detached, rect } = renderInteractiveShadow();
    rect.setShadowState("ready");

    expect(detached).toHaveClass("bg-night-black/60");
    expect(detached).not.toHaveClass("backdrop-blur-md");
    expect(detached).not.toHaveClass("transition-all");
    expect(detached.className).toContain("transition-[width,height,transform,opacity,background-color]");
    expect(detached).toHaveClass("duration-[750ms]");
    expect(detached.style.opacity).toBe("0");

    rect.setShadowState("warm");
    await waitFor(() => expect(detached.style.opacity).toBe("1"));
  });
});
