import Shadow from "../../components/shadow/shadow";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";
import TimelineLayout, { timelineTitleDatasetKey } from "../../layouts/timeline-layout";
import { PhotoResource } from "../../types/photo-resource";
import GalleryPhoto from "~/components/gallery-photo";
import { PhotoCollection as GangneungPhotoCollection } from "./collections/korea-pacific-coast/+photos";
import { PhotoCollection as HimejiPhotoCollection } from "./collections/himeji/+photos";
import { PhotoCollection as JejuPhotoCollection } from "./collections/korea-jeju/+photos";
import { PhotoCollection as SeoulPhotoCollection } from "./collections/korea-seoul/+photos";
import { A } from "@solidjs/router";
export default function Gallery() {
  return (
    <TimelineLayout
      defaultTitle="2025"
      navBack={() => (
        <A href="/">
          <ArrowBigLeft size={20} /> Home
        </A>
      )}
      content={
        <>
          <Shadow
            warmupDelayMs={125}
            contentFadeInDelayMs={500}
            dataset={{
              [timelineTitleDatasetKey]: "2018-2019",
            }}
          >
            {SeoulPhotoCollection()}
          </Shadow>
          <Shadow
            warmupDelayMs={250}
            contentFadeInDelayMs={500}
            dataset={{
              [timelineTitleDatasetKey]: "2019",
            }}
          >
            {JejuPhotoCollection()}
          </Shadow>
          <Shadow
            warmupDelayMs={250}
            contentFadeInDelayMs={500}
            dataset={{
              [timelineTitleDatasetKey]: "2019",
            }}
          >
            {HimejiPhotoCollection()}
          </Shadow>
          <Shadow
            warmupDelayMs={250}
            contentFadeInDelayMs={500}
            dataset={{
              [timelineTitleDatasetKey]: "2019",
            }}
          >
            {GangneungPhotoCollection()}
          </Shadow>
        </>
      }
    ></TimelineLayout>
  );
}
