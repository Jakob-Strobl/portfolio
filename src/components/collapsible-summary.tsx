import ChevronDown from "lucide-solid/icons/chevron-down";
import type { JSX } from "solid-js";

type CollapsibleSummaryProps = {
  children: JSX.Element;
  label: string;
};

export default function CollapsibleSummary(props: CollapsibleSummaryProps) {
  return (
    <summary class="details-summary group flex cursor-pointer flex-col gap-3 rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-300">
      <div class="min-w-0 w-full">{props.children}</div>
      <span class="mt-1 flex shrink-0 self-end items-center gap-1 text-xs font-medium text-white/60 transition-colors duration-200 group-hover:text-night-300 group-focus-visible:text-night-300">
        <span class="hidden sm:inline">{props.label}</span>
        <ChevronDown aria-hidden="true" class="details-summary-icon" size={17} />
      </span>
    </summary>
  );
}
