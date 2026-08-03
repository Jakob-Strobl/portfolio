import type { Accessor } from "solid-js";
import { Show } from "solid-js";

export const UpittEducationSection = (isExpanded: Accessor<boolean>) => (
  <section class="flex min-w-0 flex-col gap-2">
    <h3 class="experience-card-title">University of Pittsburgh</h3>
    <div>
      <div class="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 class="experience-card-subtitle">
          B.S. in Computer Science — <span class="font-medium">summa cum laude</span>
        </h2>
        <h3 class="experience-card-date">2016 - 2020</h3>
      </div>
      <div class="experience-card-meta flex flex-wrap justify-between">
        <h2>Minor in Korean Language · Certificate in Asian Studies</h2>
        <h3>GPA: 3.79/4.00 · Major GPA: 3.81/4.00</h3>
      </div>
    </div>

    <Show when={isExpanded()}>
      <div>
        <div class="space-y-2">
          <div>
            <p class="experience-card-detail-label">Major Coursework:</p>
            <p class="experience-card-body">
              Computer Graphics, Data Science, High-Performance Computing, Compiler Design, Operating Systems, Formal
              Methods, Algorithms, Data Structures
            </p>
          </div>

          <div>
            <p class="experience-card-detail-label">Clubs:</p>
            <p class="experience-card-body">Data Dojo (Business Manager), Korean Conversation Club</p>
          </div>
        </div>
      </div>
    </Show>
  </section>
);
