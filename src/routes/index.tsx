import Menu from "../components/menu";

export default function Home() {
  return (
    <main class="flex flex-row ">
      <div class="w-1/5"></div>
      <div class="w-5/6">
        <div class="w-72 flex flex-col items-center">
          <h1 class="font-medium text-white text-5xl">Jakob Strobl</h1>
          <Menu></Menu>
        </div>
      </div>
    </main>
  );
}
