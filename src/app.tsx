import "./app.css";
import IsomorphicBackground from "./components/background";


export default function App() {
  return (
    <>
      <IsomorphicBackground></IsomorphicBackground>
      <main>
        <h1 class="text-3xl font-bold underline">Hello world!</h1>
        <p class="text-white">
          Visit{" "}
          <a href="https://start.solidjs.com" target="_blank">
            start.solidjs.com
          </a>{" "}
          to learn how to build SolidStart apps.
        </p>
      </main>
    </>
  );
}
