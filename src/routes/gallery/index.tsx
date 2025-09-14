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
    <div class="w-236">
      <div class="flex flex-col gap-8 mb-4">
        <Shadow>
          <div class="flex flex-col gap-4">
            <h1 class="text-4xl text-white">2025</h1>
            <div class="flex flex-wrap gap-4">
              <PhotoTemp thumbnailView={true}></PhotoTemp>
              <PhotoTemp thumbnailView={true}></PhotoTemp>
              <PhotoTemp thumbnailView={true}></PhotoTemp>
              <PhotoTemp thumbnailView={true}></PhotoTemp>
              <PhotoTemp thumbnailView={true}></PhotoTemp>
            </div>
          </div>
        </Shadow>
        <Shadow warmupDelayMs={200}>
          <div class="flex flex-col gap-4">
            <h1 class="text-4xl text-white">2020</h1>
            <div class="flex flex-wrap gap-4">
              <PhotoSunsetGlimmer thumbnailView={true}></PhotoSunsetGlimmer>
              <PhotoViewOfModernHimeji></PhotoViewOfModernHimeji>
            </div>
          </div>
        </Shadow>
      </div>
      <div class="max-w-36 w-fit">
        {/* TODO [ ]: Parameterize the padding of a shadow? */}
        <Shadow warmupDelayMs={400}>
          <a
            href="/"
            class="hover:text-shadow-lg duration-300 transition-text flex gap-1 items-center"
          >
            <ArrowBigLeft size={20} /> Back
          </a>
        </Shadow>
      </div>
    </div>
  );
}
