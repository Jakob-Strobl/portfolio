import { createSignal, Show } from "solid-js";

import CollapsibleSummary from "~/components/collapsible-summary";

export const UpittTaSection = () => {
  const [isExpanded, setIsExpanded] = createSignal(false);

  return (
    <details class="group min-w-0 w-full" onToggle={(event) => setIsExpanded(event.currentTarget.open)}>
      <CollapsibleSummary label="View course details">
        <div id="teaching-details" class="space-y-4">
          <div>
            <h2 class="experience-card-title">University of Pittsburgh</h2>

            <div class="mt-2 space-y-3">
              <div>
                <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 class="experience-card-subtitle">Undergraduate Teaching Assistant</h3>
                  <span class="experience-card-date">Spring 2018, Fall 2019, Spring 2020</span>
                </div>
                <p class="experience-card-meta">Computer Science Department</p>
                <ul class="experience-card-body list-inside list-disc space-y-1">
                  <li>Led weekly lab sessions where students applied core concepts from lectures</li>
                  <li>Reinforced course concepts through presentations and examples</li>
                  <li>Mentored students during weekly office hours</li>
                </ul>
              </div>

              <div>
                <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 class="experience-card-subtitle">TLI — Lead Instructor</h3>
                  <span class="experience-card-date">Summer 2018</span>
                </div>
                <div class="experience-card-meta flex flex-wrap justify-between">
                  <p>Tech Divaz & High School Academy Summer Camp</p>
                  <p>Grades 6-12</p>
                </div>
                <ul class="experience-card-body list-inside list-disc space-y-1">
                  <li>Taught computer science and web-development fundamentals in HTML5 and JavaScript</li>
                  <li>Expanded on HTML5 concepts through a follow-along canvas game: a Space Invaders clone</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSummary>

      <Show when={isExpanded()}>
        <div class="experience-card-expanded">
          <div>
            <p class="experience-card-detail-label">Undergraduate TA Courses:</p>
            <ul class="experience-card-body mt-1 list-inside list-disc space-y-1">
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
    </details>
  );
};
