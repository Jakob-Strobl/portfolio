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
      <Shadow warmupDelayMs={500} contentFadeInDelayMs={500}>
        <div id="education-details" class="space-y-4">
          {UpittEducationSection(isEducationExpanded)}
          <hr class="border-white/10" />
          {YonseiEducationSection(isEducationExpanded)}
        </div>
        <button
          type="button"
          class="details-summary experience-card-control group mt-4 flex w-full items-center justify-end"
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
