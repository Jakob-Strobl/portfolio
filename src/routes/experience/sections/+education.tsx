import Shadow from "~/components/shadow/shadow";
import CollapsibleSummary from "~/components/collapsible-summary";

import { CertificatesSection } from "./+certificates";
import { UpittEducationDetails, UpittEducationSection } from "./+pitt-education";
import { YonseiEducationDetails, YonseiEducationSection } from "./+yonsei-education";

export const EducationSection = () => {
  return (
    <>
      <Shadow warmupDelayMs={1125} contentFadeInDelayMs={500}>
        <details class="group min-w-0 w-full">
          <CollapsibleSummary label="View education details">
            <div class="space-y-4">
              {UpittEducationSection()}
              <hr class="border-white/10" />
              {YonseiEducationSection()}
            </div>
          </CollapsibleSummary>

          <div class="experience-card-expanded experience-card-expanded-standalone space-y-4">
            {UpittEducationDetails()}
            <hr class="border-white/10" />
            {YonseiEducationDetails()}
          </div>
        </details>
      </Shadow>
      <Shadow warmupDelayMs={1250} contentFadeInDelayMs={500}>
        {CertificatesSection()}
      </Shadow>
    </>
  );
};
