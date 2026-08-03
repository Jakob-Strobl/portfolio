import { createSignal } from "solid-js";

import Shadow from "~/components/shadow/shadow";
import CollapsibleSummary from "~/components/collapsible-summary";

import { CertificatesSection } from "./+certificates";
import { UpittEducationSection } from "./+pitt-education";
import { YonseiEducationSection } from "./+yonsei-education";

export const EducationSection = () => {
  const [isEducationExpanded, setIsEducationExpanded] = createSignal(false);

  return (
    <>
      <Shadow warmupDelayMs={500} contentFadeInDelayMs={500}>
        <details class="group min-w-0 w-full" onToggle={(event) => setIsEducationExpanded(event.currentTarget.open)}>
          <CollapsibleSummary label="View education details">
            <div id="education-details" class="space-y-4">
              {UpittEducationSection(isEducationExpanded)}
              {YonseiEducationSection(isEducationExpanded)}
            </div>
          </CollapsibleSummary>
        </details>
      </Shadow>
      <Shadow warmupDelayMs={625} contentFadeInDelayMs={500}>
        {CertificatesSection()}
      </Shadow>
    </>
  );
};
