import { clientOnly } from "@solidjs/start";

const ClientOnlyBackgroundComponent = clientOnly(() => import("../backgrounds/waves"));

/**
 * Isomorphic background loads the background component only on the client side
 * @returns background compatible with client/server
 */
export default function IsomorphicBackground() {
  return (
    <div class="fixed -z-10 inset-0">
      {/* Number of waves should always match the number of waves defined in the shader */}
      <ClientOnlyBackgroundComponent num_waves={4} />
    </div>
  );
}
