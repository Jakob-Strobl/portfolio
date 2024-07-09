import Menu from "../components/menu";

export default function Home() {
  return (
    <>
      <div class="w-1/5"></div>
      <div class="w-4/5">
        <div class="w-72 flex flex-col items-center gap-1.5">
          <h1 class="font-medium text-white text-5xl">Jakob Strobl</h1>
          <Menu></Menu>
          <p class="text-gray-300">{process.env.PROJECT_VERSION}</p>
        </div>
      </div>
    </>
  );
}
