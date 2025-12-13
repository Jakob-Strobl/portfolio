export const UpittTaSection = () => (
  <div class="flex flex-col gap-1">
    <h1 class="text-2xl">University of Pittsburgh</h1>

    <div>
      <div class="text-lg mt-2 flex justify-between">
        <h2>Undergraduate Teaching Assistant</h2>
        <h3 class="font-light">Spring 2018, Fall 2019, Spring 2020</h3>
      </div>
      <p class="text-white/70 text-base">Computer Science Department</p>
    </div>

    <ul class="list-disc list-inside text-white/80 space-y-1 mt-1 text-base">
      <li>Led labs where students implemented core concepts from lectures</li>
      <li>Reinforced important course concepts by designing presentations and examples</li>
      <li>Mentored and assisted students during weekly office hours</li>
    </ul>

    <div class="mt-2 text-white/70 text-sm">
      <p class="font-medium">Courses:</p>
      <ul class="list-disc list-inside space-y-1 mt-1">
        <li>CS0008 - Intro to Programming with Python</li>
        <li>CS0401 - Intermediate Programming in Java</li>
        <li>CS0447 - Computer Org. & Assembly</li>
        <li>
          CS0449 - Intro to Systems Programming with C
          <ul class="list-disc list-inside space-y-1 mt-1 ml-4">
            <li>
              <a
                class="hover:text-night-500 text-night-400"
                href="https://www.youtube.com/watch?v=_fTCMhaWsdk"
                target="_blank"
              >
                Attack Lab Primer - YouTube 2020
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <h1 class="text-xl mt-4">TLI - Tech Divaz & High School Academy Summer Camp</h1>
    <div>
      <div class="text-lg flex justify-between">
        <h2>Lead Instructor</h2> <h3 class="font-light">Summer 2018</h3>
      </div>
      <p class="text-white/70 text-base">Grades 6-12</p>
    </div>

    <ul class="list-disc list-inside text-white/80 space-y-1 mt-2 text-base">
      <li>Taught computer science and web fundamentals (HTML5 & JavaScript)</li>
      <li>Expanded on HTML5 concepts with a follow-along canvas game, a 'Space-Invaders' clone</li>
    </ul>
  </div>
);
