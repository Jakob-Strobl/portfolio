import Shadow from "../../components/shadow/shadow";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";
import TimelineLayout, { timelineTitleDatasetKey } from "../../layouts/timeline-layout";
import { A } from "@solidjs/router";
import { LevelUpSection } from "./sections/+level-up";
import { CoxAutomotiveSection } from "./sections/+cox-automotive";
import { UpittTaSection } from "./sections/+pitt-ta";
import { UpittEducationSection } from "./sections/+pitt-education";
import { YonseiEducationSection } from "./sections/+yonsei-education";
import { PolishPicSection } from "./sections/+polish-pic";
import { WebcamSandboxSection } from "./sections/+webcam-sandbox";
import { ExclaimSection } from "./sections/+exclaim";
import { CertificatesSection } from "./sections/+certificates";
export default function Experience() {
  return (
    <TimelineLayout
      defaultTitle="2025"
      contentGap="gap-4"
      navBack={() => (
        <A href="/">
          <ArrowBigLeft size={20} /> Home
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
            warmupDelayMs={250}
            contentFadeInDelayMs={500}
            dataset={{
              [timelineTitleDatasetKey]: "2018",
            }}
          >
            {UpittTaSection()}
          </Shadow>
          {/* Education */}
          <div>
            <h1 class="text-4xl text-white">Education & Credentials</h1>
            <hr class=" border-night-300 mt-2"></hr>
          </div>
          <Shadow
            warmupDelayMs={250}
            contentFadeInDelayMs={500}
            dataset={{
              [timelineTitleDatasetKey]: "2016",
            }}
          >
            {UpittEducationSection()}
          </Shadow>
          <Shadow
            warmupDelayMs={250}
            contentFadeInDelayMs={500}
            dataset={{
              [timelineTitleDatasetKey]: "2018",
            }}
          >
            {YonseiEducationSection()}
          </Shadow>
          {/* Certificates */}
          <Shadow
            warmupDelayMs={250}
            contentFadeInDelayMs={500}
            dataset={{
              [timelineTitleDatasetKey]: "2024",
            }}
          >
            {CertificatesSection()}
          </Shadow>
          {/* Projects */}
          <div>
            <h1 class="text-4xl text-white">Projects</h1>
            <hr class=" border-night-300 mt-2"></hr>
          </div>
          <Shadow
            warmupDelayMs={250}
            contentFadeInDelayMs={500}
            dataset={{
              [timelineTitleDatasetKey]: "2025",
            }}
          >
            {PolishPicSection()}
          </Shadow>
          <Shadow
            warmupDelayMs={250}
            contentFadeInDelayMs={500}
            dataset={{
              [timelineTitleDatasetKey]: "2023",
            }}
          >
            {WebcamSandboxSection()}
          </Shadow>
          <Shadow
            warmupDelayMs={250}
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
  );
}
