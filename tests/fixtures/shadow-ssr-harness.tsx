import { renderToString } from "solid-js/web";

import Shadow from "../../src/components/shadow/shadow";
import Umbra, { setState, state } from "../../src/components/shadow/umbra";
import type { ShadowRect } from "../../src/components/shadow/types";

export function renderShadow() {
  setState({ shadows: [], removedShadows: [] });
  const html = renderToString(() => <Shadow>Server content</Shadow>);

  return {
    html,
    shadowCount: state.shadows.length,
    removedShadowCount: state.removedShadows.length,
  };
}

export async function renderUmbraWithRemovedShadow() {
  const removedShadow = {} as ShadowRect;
  setState({ shadows: [], removedShadows: [removedShadow] });

  renderToString(() => <Umbra />);
  await Promise.resolve();

  const removedShadowPreserved = state.removedShadows.length === 1 && state.removedShadows[0] === removedShadow;
  setState({ shadows: [], removedShadows: [] });
  return { removedShadowPreserved };
}
