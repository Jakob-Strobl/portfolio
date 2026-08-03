import type { Accessor } from "solid-js";
import { Show } from "solid-js";

export const YonseiEducationSection = (isExpanded: Accessor<boolean>) => (
  <section class="flex min-w-0 flex-col gap-2">
    <h3 class="experience-card-title">Yonsei University</h3>

    <div>
      <div class="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 class="experience-card-subtitle">Study Abroad Program · Seoul, South Korea</h2>
        <h3 class="experience-card-date">Fall 2018 - Spring 2019</h3>
      </div>
      <p class="experience-card-meta">Areas of study: Computer Science and Korean Culture</p>
      <p class="experience-card-meta">GPA: 4.00/4.30</p>
    </div>

    <Show when={isExpanded()}>
      <div>
        <div>
          <p class="experience-card-detail-label">Major Coursework:</p>
          <p class="experience-card-body">
            Computer Networking, Artificial Intelligence with an Introduction to Neural Networks
          </p>
        </div>
      </div>
    </Show>
  </section>
);
