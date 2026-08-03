import type { Accessor } from "solid-js";
import { Show } from "solid-js";

export const YonseiEducationSection = (isExpanded: Accessor<boolean>) => (
  <section class="flex flex-col gap-2" data-timeline-title="2018">
    <h3 class="text-2xl">Yonsei University</h3>

    <div>
      <div class="mt-2 flex justify-between text-lg flex-wrap">
        <h2>Study Abroad Program · Seoul, South Korea</h2>
        <h3 class="font-light">Fall 2018 - Spring 2019</h3>
      </div>
      <div class="flex justify-between text-base text-white/70 flex-wrap">
        <h2>Areas of study: Computer Science and Korean Culture</h2>
        <h3>GPA: 4.00/4.30</h3>
      </div>
    </div>

    <Show when={isExpanded()}>
      <div>
        <div>
          <p class="text-white/70 text-base font-medium">Major Coursework:</p>
          <p class="text-white/80 text-sm">
            Computer Networking, Artificial Intelligence with an Introduction to Neural Networks
          </p>
        </div>
      </div>
    </Show>
  </section>
);
