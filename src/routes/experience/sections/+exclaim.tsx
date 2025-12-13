export const ExclaimSection = () => (
  <div class="flex flex-col gap-2">
    <div>
      <div class="text-2xl flex justify-between items-baseline">
        <h1>Exclaim</h1> <h2 class="font-light text-xl">2021</h2>
      </div>
      <p class="text-white/70">Rust</p>
    </div>
    <p class="text-white/70 text-base">A template language (exclaim-grammar) and compiler for static site generation</p>

    <ul class="list-disc list-inside text-white/80 space-y-1 mt-2 text-base">
      <li>Implemented a non-backtracking recursive descent parser by designing an LL(1) grammar</li>
      <li>Utilized arena-allocated index tree pattern for memory-performant AST generation</li>
    </ul>
  </div>
);
