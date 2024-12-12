import Shadow from "~/components/shadow";

export default function Contact() {
  return (
    <div>
      <Shadow>
        {/* padding's screem size breakpoints should match the image width's breakpoints */}
        <div class="flex items-end p-6 sm:p-8 xl:p-12">
          <div id="github">
            <a
              class="flex flex-col items-center gap-8"
              href="https://github.com/Jakob-Strobl"
              target="_blank"
            >
              <img
                class="github-normalized-size"
                src="./images/Github-octocat.png"
              />
              <p>GitHub</p>
            </a>
          </div>

          <div id="linkedin">
            <a
              class="flex flex-col items-center gap-8"
              href="https://www.linkedin.com/in/jakob-strobl"
              target="_blank"
            >
              <img
                class="linkedin-normalized-size"
                src="./images/LinkedIn.png"
              />
              <p>LinkedIn</p>
            </a>
          </div>
        </div>
        <a href="/" class="hover:text-stroke-lg duration-300 transition-text">
          back
        </a>
      </Shadow>
    </div>
  );
}
