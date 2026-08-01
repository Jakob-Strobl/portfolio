// @vitest-environment happy-dom

import { fireEvent, render, waitFor } from "@solidjs/testing-library";

import Shadow from "../../src/components/shadow/shadow";
import Umbra, { setState, state } from "../../src/components/shadow/umbra";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function renderInteractiveShadow() {
  const page = render(() => (
    <>
      <Umbra />
      <Shadow>
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

describe("Shadow interaction border", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    setState({ shadows: [], removedShadows: [] });
  });

  afterEach(() => {
    setState({ shadows: [], removedShadows: [] });
    vi.unstubAllGlobals();
  });

  test("keeps the warm border highlighted across combined hover and focus-within", async () => {
    const { wrapper, button, rect } = renderInteractiveShadow();
    rect.setShadowState("warm");

    await fireEvent.pointerEnter(wrapper, { pointerType: "mouse" });
    await waitFor(() => expect(wrapper).toHaveClass("border-white/14"));

    await fireEvent.focusIn(button);
    await fireEvent.pointerLeave(wrapper, { pointerType: "mouse" });
    expect(wrapper).toHaveClass("border-white/14");

    await fireEvent.focusOut(button, { relatedTarget: document.body });
    await waitFor(() => expect(wrapper).toHaveClass("border-white/6"));
  });

  test("ignores touch pointer entry", async () => {
    const { wrapper, rect } = renderInteractiveShadow();
    rect.setShadowState("warm");

    await fireEvent.pointerEnter(wrapper, { pointerType: "touch" });

    expect(wrapper).toHaveClass("border-white/6");
  });

  test("does not reveal the interaction border until the shadow is warm", async () => {
    const { wrapper, rect } = renderInteractiveShadow();
    rect.setShadowState("mounted");
    await fireEvent.pointerEnter(wrapper, { pointerType: "mouse" });
    expect(wrapper).toHaveClass("border-white/0");

    rect.setShadowState("warm");
    await waitFor(() => expect(wrapper).toHaveClass("border-white/14"));
  });

  test("keeps the dark detached shadow and entrance fade without backdrop filtering", async () => {
    const { detached, rect } = renderInteractiveShadow();
    rect.setShadowState("ready");

    expect(detached).toHaveClass("bg-night-black/60");
    expect(detached.className).not.toContain("backdrop-blur");
    expect(detached).not.toHaveClass("transition-all");
    expect(detached.className).toContain("transition-[transform,opacity,background-color]");
    expect(detached).toHaveClass("duration-[600ms]");
    expect(detached.style.opacity).toBe("0");

    rect.setShadowState("warm");
    await waitFor(() => expect(detached.style.opacity).toBe("1"));
  });
});
