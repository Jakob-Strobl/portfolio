import { clientOnly } from "@solidjs/start";

const ClientOnlyBackgroundComponent = clientOnly(() => import("~/backgrounds/waves"));

/**
 * Isomorphic background loads the background component only on the client side
 * @returns background compatible with client/server
 */
export default function IsomorphicBackground() {
  return (
    <div class="w-screen h-screen">
      <ClientOnlyBackgroundComponent num_waves={4} window_width={2560} window_height={1440} />
    </div>
  )
}