# Portfolio Design System

This document records the UI conventions currently implemented in `src/app.css`, shared layouts/components, and the
main routes. Treat it as a guardrail for future changes, not a mandate to abstract every one-off value.

## Visual direction

The site is an immersive, dark portfolio: restrained editorial content floats over animated WebGL waves or
tessellation. Deep violet-black backgrounds, luminous purple accents, translucent panels, soft borders, and text glow
provide depth without competing with the writing or photography. The overall feel should remain polished, atmospheric,
and technically expressive rather than dashboard-like.

## Color and surfaces

- The canonical `night` scale lives in `src/app.css`: `night-black` is `#0b0712`, `night-900` is `#13051f`, and the
  purple ramp runs through `night-700` (`#531787`) and `night-300` (`#ca9cf2`) to `night-100`/white (`#fdfbfe`).
- The canvas and top timeline fade use the related base `#130d20`. Preserve this near-black violet continuity when
  adding fallbacks or overlays.
- Use white for headings; `white/80` for body copy; `white/70` for metadata; and `white/60` for muted notes. Purple
  (`night-300` or `night-400`) marks technologies, links, emphasis, active controls, and focus rings.
- Content surfaces are usually detached `Shadow` layers: `night-black/60`, rounded-lg, with responsive padding
  (`p-3`, `lg:p-4`, `2xl:p-5`) and a subtle white border that strengthens from `white/6` to `white/14` on interaction.
  Dense settings/popovers use darker 88–95% surfaces, thin `white/15` borders, blur, and rounded-lg/xl corners.

## Typography

- Figtree replaces Raleway globally, with `sans-serif` fallback. Bundle both local variable TTFs:
  `Figtree-VariableFont_wght.ttf` and `Figtree-Italic-VariableFont_wght.ttf`. Both cover weights 300–900 and use
  `font-display: swap`; keep the OFL alongside them.
- The migration reduced font files from 492,080 bytes raw / 255,172 bytes gzip to 124,704 bytes raw / 70,672 bytes
  gzip (approximately 492 KB / 255 KB to 125 KB / 71 KB).
- Do not preemptively change font sizes, element heights, tracking, or kerning solely because the font changed. Adjust a
  metric only for a demonstrated visual or layout problem at relevant breakpoints.
- Existing display hierarchy: home name `text-5xl font-medium`; major menu links `text-3xl`; route/collection section
  titles `text-4xl` (experience uses `leading-10`).
- Card hierarchy: titles use `text-2xl leading-8`; subtitles and dates use `text-lg leading-7`; normal prose uses
  `text-base`; compact labels and technology lines use `text-sm`.
- Primary content uses `leading-6`. This includes experience metadata, technology lines, summaries, main bullets, and
  body copy. Contact body copy is explicitly `leading-6` at both base and desktop sizes; this is intentionally tighter
  than the former implicit desktop `leading-7`.
- Use `leading-5` only for compact/supporting text such as muted notes and detail labels. Do not tighten main bullets to
  manufacture spacing.

## Layout and rhythm

- The application fills the viewport over a fixed background. Home is deliberately asymmetrical on `xs+` (a 1/5
  spacer and 4/5 content region); Contact is centered; Experience and Gallery use the shared timeline layout.
- Timeline pages reserve a narrow fixed back-navigation gutter, a responsive 10/12-to-3/5 content column capped at
  `max-w-4xl`, and a small right gutter. Their top offset scales from `mt-32` to `lg:mt-80` beneath the fixed gradient.
- Experience uses `gap-4` between cards and sections. Inside cards, align titles/dates on the baseline and allow wrapping
  with `gap-x-3 gap-y-1`. Preserve shared `.experience-card-*` roles instead of restyling each entry independently.
- Add `mt-1` when a bullet list directly follows a subheader or metadata line. Use `mt-2` to separate a new sub-role or
  project summary where already established. Keep grouped role content consistent; Cox's role history intentionally
  uses the tighter `space-y-2`.
- Expanded details use a quiet `white/10` top border and `pt-4`; standalone expansions add `mt-4`. Related bullet items
  use `space-y-1`, while distinct expanded groups use `space-y-4`.
- Gallery collections use `gap-4`, one column by default, two at `lg`, and three at `3xl`. Thumbnails are rounded-sm,
  dimmed to 80% until hover, and image-led; full-photo views keep controls secondary to the photograph.

## Interaction, motion, and accessibility

- Favor 200–300 ms color, opacity, and glow transitions. Shadow entrances move/fade over 600–750 ms; timeline fades
  may take 1000 ms. Staggered entrances are part of the site's pacing, but content must remain usable without them.
- Interactive text may use the lavender text glow; controls should also receive visible color/border feedback. Preserve
  `focus-visible` outlines in `night-300` with offset, not hover-only affordances.
- Keep touch behavior free of hover assumptions, preserve safe-area handling, and let reduced-motion users receive a
  static background. Maintain the custom thin scrollbar on intentional scroll regions.
- When adding UI, verify mobile wrapping, long metadata, focus states, reduced motion, and contrast over both background
  effects before introducing new tokens or exceptions.
