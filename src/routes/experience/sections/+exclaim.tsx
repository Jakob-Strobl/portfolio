export const ExclaimSection = () => (
  <div class="flex flex-col gap-2">
    <div class="text-2xl flex justify-between">
      <h1>Exclaim</h1> <h2 class="font-light">2021</h2>
    </div>
    <p class="text-white/70">Rust</p>
    <p class="text-white/70 text-base">A template language (exclaim-grammar) and compiler for static site generation</p>

    <ul class="list-disc list-inside text-white/80 space-y-1 mt-2">
      <li>Implemented a non-backtracking recursive descent parser by designing an LL(1) grammar</li>
      <li>Utilized arena-allocated index tree pattern for memory-performant AST generation</li>
    </ul>
  </div>
);
