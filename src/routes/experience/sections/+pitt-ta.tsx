import CollapsibleSummary from "~/components/collapsible-summary";

export const UpittTaSection = () => (
  <details class="group" open={false}>
    <CollapsibleSummary label="View full teaching history">
      <h2 class="text-2xl">University of Pittsburgh</h2>

      <div class="mt-2 space-y-3">
        <div>
          <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-lg">
            <h3>Undergraduate Teaching Assistant</h3>
            <span class="font-light">Spring 2018, Fall 2019, Spring 2020</span>
          </div>
          <p class="text-base text-white/70">
            • Led weekly lab sessions where students applied core concepts from lectures
          </p>
        </div>

        <div>
          <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-lg">
            <h3>TLI — Tech Divaz & High School Academy Summer Camp</h3>
            <span class="font-light">Summer 2018</span>
          </div>
          <p class="text-base text-white/70">
            • Taught computer science and web-development fundamentals in HTML5 and JavaScript
          </p>
        </div>
      </div>
    </CollapsibleSummary>

    <div class="mt-4 space-y-4 border-t border-white/10 pt-4">
      <div>
        <p class="text-base text-white/70">Computer Science Department</p>
        <ul class="mt-1 list-inside list-disc space-y-1 text-base text-white/80">
          <li>Reinforced course concepts through presentations and examples</li>
          <li>Mentored students during weekly office hours</li>
        </ul>
      </div>

      <div class="text-sm text-white/70">
        <p class="font-medium">Courses:</p>
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

      <div>
        <h3 class="text-lg">Lead Instructor</h3>
        <p class="text-base text-white/70">Grades 6-12 · Summer 2018</p>
        <ul class="mt-1 list-inside list-disc space-y-1 text-base text-white/80">
          <li>Expanded on HTML5 concepts through a follow-along canvas game: a Space Invaders clone</li>
        </ul>
      </div>
    </div>
  </details>
);
