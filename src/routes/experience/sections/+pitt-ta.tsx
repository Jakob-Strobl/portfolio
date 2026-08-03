import { createSignal, Show } from "solid-js";
import ChevronDown from "lucide-solid/icons/chevron-down";

export const UpittTaSection = () => {
  const [isExpanded, setIsExpanded] = createSignal(false);

  return (
    <div>
      <div id="teaching-details" class="space-y-4">
        <div>
          <h2 class="text-2xl">University of Pittsburgh</h2>

          <div class="mt-2 space-y-3">
            <div>
              <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3>Undergraduate Teaching Assistant</h3>
                <span class="font-light">Spring 2018, Fall 2019, Spring 2020</span>
              </div>
              <p class="text-base text-white/70">Computer Science Department</p>
              <ul class="list-inside list-disc space-y-1 text-base text-white/70">
                <li>Led weekly lab sessions where students applied core concepts from lectures</li>
                <li>Reinforced course concepts through presentations and examples</li>
                <li>Mentored students during weekly office hours</li>
              </ul>
            </div>

            <div>
              <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3>TLI — Lead Instructor</h3>
                <span class="font-light">Summer 2018</span>
              </div>
              <div class="flex flex-wrap justify-between text-base text-white/70">
                <p>Tech Divaz & High School Academy Summer Camp</p>
                <p>Grades 6-12</p>
              </div>
              <ul class="list-inside list-disc space-y-1 text-base text-white/70">
                <li>Taught computer science and web-development fundamentals in HTML5 and JavaScript</li>
                <li>Expanded on HTML5 concepts through a follow-along canvas game: a Space Invaders clone</li>
              </ul>
            </div>
          </div>
        </div>

        <Show when={isExpanded()}>
          <div class="mt-4 space-y-4 border-t border-white/10 pt-4">
            <div class="text-sm text-white/70">
              <p class="font-medium">Undergraduate TA Courses:</p>
              <ul class="mt-1 list-inside list-disc space-y-1">
                <li>CS0008 - Intro to Programming with Python</li>
                <li>CS0401 - Intermediate Programming in Java</li>
                <li>CS0447 — Computer Organization and Assembly</li>
                <li>
                  CS0449 - Intro to Systems Programming with C
                  <ul class="mt-1 ml-4 list-inside list-disc space-y-1">
                    <li>
                      <a
                        class="text-night-400 hover:text-night-500"
                        href="https://www.youtube.com/watch?v=_fTCMhaWsdk"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Attack Lab primer (YouTube, 2020)
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </Show>
      </div>

      <button
        type="button"
        class="details-summary group mt-4 flex w-full cursor-pointer items-center justify-end gap-1 text-xs font-medium text-white/60 transition-colors duration-200 hover:text-night-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-300"
        aria-controls="teaching-details"
        aria-expanded={isExpanded()}
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        <span>View course details</span>
        <ChevronDown
          aria-hidden="true"
          class="details-summary-icon"
          classList={{ "rotate-180": isExpanded() }}
          size={17}
        />
      </button>
    </div>
  );
};
