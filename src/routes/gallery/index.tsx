import LinearLayout from "~/layouts/linear-layout";
import Shadow from "../../components/shadow/shadow";
import PhotoSunsetGlimmer from "./2020/sunset-glimmer";
import PhotoViewOfModernHimeji from "./2020/view-of-modern-himeji";
import PhotoTemp from "./2025/placeholder";
import ArrowBigLeft from "lucide-solid/icons/arrow-big-left";

export default function Gallery() {
  return (
    // Width of photos is w-42 (desktop) = w-42 * 5 images = 210
    // Width of gap is 4 (4 gaps per 5 images) = 16
    // Width of shadow padding is p-5 = p-5 * 2 both sides = 10
    // Sum: 236
    // TODO [X] Create a layout based on this left-center-right structure that starts offset from the top
    // Right now mt-120 looks good on desktop (1440p full + half screen).
    // Will need to change layout for mobile portriat
    <LinearLayout
      navBack={
        <Shadow warmupDelayMs={0} contentFadeInDelayMs={500} fixed>
          <a href="/" class="hover:text-shadow-lg duration-300 transition-text flex gap-1 items-center">
            <ArrowBigLeft size={20} /> Home
          </a>
        </Shadow>
      }
      content={
        <>
          <Shadow warmupDelayMs={125} contentFadeInDelayMs={500}>
            <div class="flex flex-col gap-4">
              <h1 class="text-4xl text-white">2025</h1>
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
          <Shadow warmupDelayMs={250} contentFadeInDelayMs={500}>
            <div class="flex flex-col gap-4">
              <h1 class="text-4xl text-white">2020</h1>
              <div class="flex flex-wrap gap-4">
                <PhotoSunsetGlimmer thumbnailView={true}></PhotoSunsetGlimmer>
                <PhotoViewOfModernHimeji></PhotoViewOfModernHimeji>
              </div>
            </div>
          </Shadow>
        </>
      }
    ></LinearLayout>
  );
}
