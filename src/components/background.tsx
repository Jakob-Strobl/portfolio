import { clientOnly } from "@solidjs/start";

import { useBackground } from "~/providers/background";

const ClientOnlyBackgroundComponent = clientOnly(() => import("../backgrounds/waves"));

/**
 * Isomorphic background loads the background component only on the client side
 * @returns background compatible with client/server
 */
export default function IsomorphicBackground() {
  const background = useBackground();

  return (
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#130d20]" aria-hidden="true">
      <ClientOnlyBackgroundComponent
        kind={background.kind()}
        seed={background.seed()}
        speed={background.speed()}
        intensity={background.intensity()}
      />
    </div>
  );
}
