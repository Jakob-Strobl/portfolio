import Shadow from "../../components/shadow/shadow";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";
import TimelineLayout, { timelineTitleDatasetKey } from "../../layouts/timeline-layout";
import { A } from "@solidjs/router";
import { createSignal } from "solid-js";
import { LevelUpSection } from "./sections/+level-up";
import { CoxAutomotiveSection } from "./sections/+cox-automotive";
import { UpittTaSection } from "./sections/+pitt-ta";
import { UpittEducationSection } from "./sections/+pitt-education";
import { YonseiEducationSection } from "./sections/+yonsei-education";
import { PolishPicSection } from "./sections/+polish-pic";
import { WebcamSandboxSection } from "./sections/+webcam-sandbox";
import { ExclaimSection } from "./sections/+exclaim";
import { CertificatesSection } from "./sections/+certificates";
import { TimedatSection } from "./sections/+timedat";
import CollapsibleSummary from "~/components/collapsible-summary";
import Seo from "~/components/seo";
import { PRODUCT_ENTITIES } from "~/data/seo";

export default function Experience() {
  const [isEducationExpanded, setIsEducationExpanded] = createSignal(false);

  return (
    <>
      <Seo
        title="Experience & Projects | Jakob Strobl"
        description="Explore Jakob Strobl's professional experience, education, and products—from full-stack engineering and cloud infrastructure to privacy-first SaaS."
        path="/experience"
        structuredData={PRODUCT_ENTITIES}
      />
      <TimelineLayout
        defaultTitle="2026"
        contentGap="gap-4"
        navBack={() => (
          <A href="/">
            <ArrowBigLeft size={20} />
            <span class="hidden sm:inline">Home</span>
          </A>
        )}
        content={
          <>
            <div>
              <h1 class="text-4xl text-white">Experience</h1>
              <hr class=" border-night-300 mt-2"></hr>
            </div>
            <Shadow
              warmupDelayMs={125}
              contentFadeInDelayMs={500}
              dataset={{
                [timelineTitleDatasetKey]: "2025",
              }}
            >
              {LevelUpSection()}
            </Shadow>
            <Shadow
              warmupDelayMs={250}
              contentFadeInDelayMs={500}
              dataset={{
                [timelineTitleDatasetKey]: "2021",
              }}
            >
              {CoxAutomotiveSection()}
            </Shadow>
            <Shadow
              warmupDelayMs={375}
              contentFadeInDelayMs={500}
              dataset={{
                [timelineTitleDatasetKey]: "2018",
              }}
            >
              {UpittTaSection()}
            </Shadow>
            {/* Education */}
            <Shadow
              warmupDelayMs={500}
              contentFadeInDelayMs={500}
              paddingOverride="p-0"
              shadowOpacity={() => (isEducationExpanded() ? 0.3 : 0.6)}
            >
              <details
                class="rounded-lg border border-white/10 px-2 py-3 lg:px-3 lg:py-4"
                onToggle={(event) => setIsEducationExpanded(event.currentTarget.open)}
              >
                <CollapsibleSummary label="Show education">
                  <h2 class="text-4xl text-white">Education & Credentials</h2>
                  <p class="mt-1 text-sm text-white/60">Academic background and professional credentials</p>
                </CollapsibleSummary>
                <div class="mt-4 space-y-4 border-t border-white/10 pt-4">
                  <Shadow
                    warmupDelayMs={375}
                    contentFadeInDelayMs={500}
                    dataset={{
                      [timelineTitleDatasetKey]: "2016",
                    }}
                  >
                    {UpittEducationSection()}
                  </Shadow>
                  <Shadow
                    warmupDelayMs={375}
                    contentFadeInDelayMs={500}
                    dataset={{
                      [timelineTitleDatasetKey]: "2018",
                    }}
                  >
                    {YonseiEducationSection()}
                  </Shadow>
                  {/* Certificates */}
                  <Shadow
                    warmupDelayMs={375}
                    contentFadeInDelayMs={500}
                    dataset={{
                      [timelineTitleDatasetKey]: "2024",
                    }}
                  >
                    {CertificatesSection()}
                  </Shadow>
                </div>
              </details>
            </Shadow>
            {/* Projects */}
            <div>
              <h2 class="text-4xl text-white">Projects</h2>
              <hr class=" border-night-300 mt-2"></hr>
            </div>
            <Shadow
              warmupDelayMs={375}
              contentFadeInDelayMs={500}
              dataset={{
                [timelineTitleDatasetKey]: "2026",
              }}
            >
              {TimedatSection()}
            </Shadow>
            <Shadow
              warmupDelayMs={375}
              contentFadeInDelayMs={500}
              dataset={{
                [timelineTitleDatasetKey]: "2025",
              }}
            >
              {PolishPicSection()}
            </Shadow>
            <Shadow
              warmupDelayMs={375}
              contentFadeInDelayMs={500}
              dataset={{
                [timelineTitleDatasetKey]: "2023",
              }}
            >
              {WebcamSandboxSection()}
            </Shadow>
            <Shadow
              warmupDelayMs={375}
              contentFadeInDelayMs={500}
              dataset={{
                [timelineTitleDatasetKey]: "2021",
              }}
            >
              {ExclaimSection()}
            </Shadow>
          </>
        }
      ></TimelineLayout>
    </>
  );
}
