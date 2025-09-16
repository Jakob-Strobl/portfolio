import Shadow from "../../components/shadow/shadow";
import PhotoSunsetGlimmer from "./2020/sunset-glimmer";
import PhotoViewOfModernHimeji from "./2020/view-of-modern-himeji";
import PhotoTemp from "./2025/placeholder";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";
import TimelineLayout, { timelineTitleDatasetKey } from "../../layouts/timeline-layout";

export default function Gallery() {
  return (
    <TimelineLayout
      defaultTitle="2025"
      navBack={
        <a href="/">
          <ArrowBigLeft size={20} /> Home
        </a>
      }
      content={
        <>
          <Shadow
            warmupDelayMs={125}
            contentFadeInDelayMs={500}
            dataset={{
              [timelineTitleDatasetKey]: "2025",
            }}
          >
            <div class="flex flex-col gap-4">
              <h1 class="text-4xl text-white">Japan - Hokkaido</h1>
              <div class="flex flex-wrap gap-4">
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
              </div>
            </div>
          </Shadow>
          <Shadow
            warmupDelayMs={250}
            contentFadeInDelayMs={500}
            dataset={{
              [timelineTitleDatasetKey]: "2024",
            }}
          >
            <div class="flex flex-col gap-4">
              <h1 class="text-4xl text-white">Korea - East Coast on the Pacific</h1>
              <div class="flex flex-wrap gap-4">
                <PhotoSunsetGlimmer thumbnailView={true}></PhotoSunsetGlimmer>
                <PhotoViewOfModernHimeji></PhotoViewOfModernHimeji>
              </div>
            </div>
          </Shadow>
          <Shadow
            warmupDelayMs={375}
            contentFadeInDelayMs={500}
            dataset={{
              [timelineTitleDatasetKey]: "2020",
            }}
          >
            <div class="flex flex-col gap-4">
              <h1 class="text-4xl text-white">Japan - Osaka/Himeji</h1>
              <div class="flex flex-wrap gap-4">
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
              </div>
            </div>
          </Shadow>
          <Shadow
            warmupDelayMs={500}
            contentFadeInDelayMs={500}
            dataset={{
              [timelineTitleDatasetKey]: "2019",
            }}
          >
            <div class="flex flex-col gap-4">
              <h1 class="text-4xl text-white">Korea - Study Abroad</h1>
              <div class="flex flex-wrap gap-4">
                <PhotoSunsetGlimmer thumbnailView={true}></PhotoSunsetGlimmer>
                <PhotoViewOfModernHimeji></PhotoViewOfModernHimeji>
                {/* <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp>
                <PhotoTemp thumbnailView={true}></PhotoTemp> */}
              </div>
            </div>
          </Shadow>
        </>
      }
    ></TimelineLayout>
  );
}
