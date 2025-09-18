import Shadow from "../../components/shadow/shadow";
import PhotoSunsetGlimmer from "./2020/sunset-glimmer";
import PhotoViewOfModernHimeji from "./2020/view-of-modern-himeji";
import PhotoTemp from "./2025/placeholder";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";
import TimelineLayout, { timelineTitleDatasetKey } from "../../layouts/timeline-layout";
import FullPhotoLayout from "../../layouts/full-photo-layout";
import { PhotoResource } from "../../types/photo-resource";

const exampleResource: PhotoResource = {
  name: "Sunset Glimmer",
  uri: "https://od73or139i.ufs.sh/f/fASTqmqQqXI1sZyUvqV9vPXZ6p0bHc3QqiN2RsAoaWTrhzx1",
};
export default function Gallery() {
  const navBack = (
    <a href="/gallery" class="flex gap-1 items-center">
      <ArrowBigLeft size={20} /> Back
    </a>
  );
  return (
    // <FullPhotoLayout resource={exampleResource} navBack={navBack}></FullPhotoLayout>
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
              <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
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
              <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
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
              <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
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
              <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
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
