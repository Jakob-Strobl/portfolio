import { createSignal } from "solid-js";
import ChevronDown from "lucide-solid/icons/chevron-down";

import Shadow from "~/components/shadow/shadow";
import { timelineTitleDatasetKey } from "~/layouts/timeline-layout";

import { CertificatesSection } from "./+certificates";
import { UpittEducationSection } from "./+pitt-education";
import { YonseiEducationSection } from "./+yonsei-education";

export const EducationSection = () => {
  const [isEducationExpanded, setIsEducationExpanded] = createSignal(false);

  return (
    <>
      <Shadow warmupDelayMs={500} contentFadeInDelayMs={500} paddingOverride="p-0">
        <div class="rounded-lg border border-white/10 px-2 py-3 lg:px-3 lg:py-4">
          <div id="education-details" class="space-y-4">
            {UpittEducationSection(isEducationExpanded)}
            <hr class="border-white/10" />
            {YonseiEducationSection(isEducationExpanded)}
          </div>
          <button
            type="button"
            class="details-summary group mt-4 flex w-full cursor-pointer items-center justify-end gap-1 text-xs font-medium text-white/60 transition-colors duration-200 hover:text-night-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-300"
            aria-controls="education-details"
            aria-expanded={isEducationExpanded()}
            onClick={() => setIsEducationExpanded((expanded) => !expanded)}
          >
            <span>View education details</span>
            <ChevronDown
              aria-hidden="true"
              class="details-summary-icon"
              classList={{ "rotate-180": isEducationExpanded() }}
              size={17}
            />
          </button>
        </div>
      </Shadow>
      <Shadow
        warmupDelayMs={375}
        contentFadeInDelayMs={500}
        dataset={{
          [timelineTitleDatasetKey]: "2024",
        }}
      >
        {CertificatesSection()}
      </Shadow>
    </>
  );
};
