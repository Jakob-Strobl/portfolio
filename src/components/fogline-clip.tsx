const ASSET_DIR = "/projects/fogline";

interface FoglineClipProps {
  label: string;
  caption?: string;
  class?: string;
}

// Muted, user-started clip: no autoplay, so reduced-motion users never get unrequested motion.
export default function FoglineClip(props: FoglineClipProps) {
  return (
    <figure class={props.class}>
      <video
        class="w-full rounded-sm border border-white/10 bg-night-black"
        controls
        muted
        playsinline
        preload="none"
        width="960"
        height="540"
        poster={`${ASSET_DIR}/c2-console-poster.jpg`}
        aria-label={props.label}
      >
        <source src={`${ASSET_DIR}/c2-console.mp4`} type="video/mp4" />
      </video>
      {props.caption != null && <figcaption class="experience-card-muted mt-2">{props.caption}</figcaption>}
    </figure>
  );
}
