import { createSignal, onCleanup, onMount, type JSX } from "solid-js";
import { Portal } from "solid-js/web";

// TODO probably a better place to put this generic 2d vec type
// TODO vec2.origin = { 0 , 0 }
type Position = {
  x: number;
  y: number;
};

interface NotifyBubbleProps {
  children: JSX.Element | JSX.ArrayElement;
  /**
   * @field x Left (- negative) / Right (+ positive) of the cursor
   * @field y Up (-) / Below (+) the cursor
   */
  offset?: Partial<Position>;
  /**
   * Any mouse event that initiated this bubble
   * Used to get the starting position of the mouse
   */
  originEvent?: MouseEvent;
}

export default function NotifyBubble(props: NotifyBubbleProps) {
  // Defaults for Props
  const offsetX = props.offset?.x ?? 0;
  const offsetY = props.offset?.y ?? 0;

  const [isReady, setReady] = createSignal(false);

  const [mousePosition, setMousePosition] = createSignal<Position>(
    props.originEvent ?? {
      x: 0,
      y: 0,
    },
  );

  const handleMouseMove = (event: MouseEvent) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  onMount(() => {
    window.addEventListener("mousemove", handleMouseMove);
    setTimeout(() => setReady(true), 0);

    // NOTE(solidJS):
    // onCleanup runs on the server, so that's why window is undefined and crashed the server on refresh
    // "[to] cleanup side effects created by onMount, we should nest onCleanup inside the onMount."
    //
    // SEE: https://github.com/solidjs/solid/issues/1616
    onCleanup(() => {
      window.removeEventListener("mousemove", handleMouseMove);
    });
  });

  return (
    <Portal>
      <div
        class="
          absolute p-2 rounded-lg
          fade-in duration-150 bg-opacity-80 bg-night-black
          text-white
        "
        style={{
          left: `${mousePosition().x + offsetX}px`,
          top: `${mousePosition().y + offsetY}px`,
          transform: "translate(-50%, -100%)",
          opacity: isReady() ? "" : "0",
        }}
      >
        {props.children}
      </div>
    </Portal>
  );
}
