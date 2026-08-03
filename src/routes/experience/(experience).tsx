import Shadow from "../../components/shadow/shadow";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";
import TimelineLayout from "../../layouts/timeline-layout";
import { A } from "@solidjs/router";
import { LevelUpSection } from "./sections/+level-up";
import { CoxAutomotiveSection } from "./sections/+cox-automotive";
import { UpittTaSection } from "./sections/+pitt-ta";
import { EducationSection } from "./sections/+education";
import { PolishPicSection } from "./sections/+polish-pic";
import { WebcamSandboxSection } from "./sections/+webcam-sandbox";
import { ExclaimSection } from "./sections/+exclaim";
import { TimedatSection } from "./sections/+timedat";
import { SkillsSection } from "./sections/+skills";
import Seo from "~/components/seo";
import { PRODUCT_ENTITIES } from "~/data/seo";

export default function Experience() {
  return (
    <>
      <Seo
        title="Experience & Projects | Jakob Strobl"
        description="Explore Jakob Strobl's professional experience, education, and projects across full-stack engineering, cloud infrastructure, and privacy-first product development."
        path="/experience"
        structuredData={PRODUCT_ENTITIES}
      />
      <TimelineLayout
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
              <h1 class="experience-section-title">Experience</h1>
              <hr class="mt-2 border-night-300" />
            </div>
            <Shadow warmupDelayMs={125} contentFadeInDelayMs={500}>
              {LevelUpSection()}
            </Shadow>
            <Shadow warmupDelayMs={250} contentFadeInDelayMs={500}>
              {CoxAutomotiveSection()}
            </Shadow>
            <Shadow warmupDelayMs={375} contentFadeInDelayMs={500}>
              {UpittTaSection()}
            </Shadow>
            {/* Education */}
            <div>
              <h2 class="experience-section-title">Education</h2>
              <hr class="mt-2 border-night-300" />
            </div>
            {EducationSection()}
            <div>
              <h2 class="experience-section-title">Technical Skills</h2>
              <hr class="mt-2 border-night-300" />
            </div>
            <Shadow warmupDelayMs={750} contentFadeInDelayMs={500}>
              {SkillsSection()}
            </Shadow>
            {/* Projects */}
            <div>
              <h2 class="experience-section-title">Project Highlights</h2>
              <hr class="mt-2 border-night-300" />
            </div>
            <Shadow warmupDelayMs={875} contentFadeInDelayMs={500}>
              {TimedatSection()}
            </Shadow>
            <Shadow warmupDelayMs={1000} contentFadeInDelayMs={500}>
              {PolishPicSection()}
            </Shadow>
            <Shadow warmupDelayMs={1125} contentFadeInDelayMs={500}>
              {WebcamSandboxSection()}
            </Shadow>
            <Shadow warmupDelayMs={1250} contentFadeInDelayMs={500}>
              {ExclaimSection()}
            </Shadow>
          </>
        }
      ></TimelineLayout>
    </>
  );
}
