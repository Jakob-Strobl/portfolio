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
        description="Explore Jakob Strobl's professional experience, education, and projects across full-stack engineering, cloud infrastructure, and privacy-first product development."
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
            <div>
              <h2 class="text-4xl text-white">Education</h2>
              <hr class="mt-2 border-night-300" />
            </div>
            {EducationSection()}
            <div>
              <h2 class="text-4xl text-white">Technical Skills</h2>
              <hr class="mt-2 border-night-300" />
            </div>
            <Shadow warmupDelayMs={875} contentFadeInDelayMs={500}>
              {SkillsSection()}
            </Shadow>
            {/* Projects */}
            <div>
              <h2 class="text-4xl text-white">Projects</h2>
              <hr class="mt-2 border-night-300" />
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
