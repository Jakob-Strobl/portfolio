import Menu from "../components/menu";

export default function Home() {
  return (
    <main class="flex flex-row h-screen items-center">
      <div class="w-1/5"></div>
      <div class="w-4/5">
        <div class="w-72 flex flex-col items-center gap-1.5">
          <h1 class="font-medium text-white text-5xl">Jakob Strobl</h1>
          <Menu></Menu>
        </div>
      </div>
    </main>
  );
}
