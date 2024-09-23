import { Suspense } from "solid-js";
import "./app.css";
import IsomorphicBackground from "./components/background";
import { Router, RouteSectionProps } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import Umbra from "./components/umbra";

const BaseLayout = (props: RouteSectionProps) => {
  return (
    <>
      <IsomorphicBackground></IsomorphicBackground>
      <main class="flex flex-row h-screen w-screen items-center justify-center">
        <Umbra></Umbra>
        <Suspense>{props.children}</Suspense>
      </main>
    </>
  );
};

export default function App() {
  return (
    <Router root={BaseLayout}>
      <FileRoutes />
      {/* <Route path="404" component={<div><h1>404 Whoops</h1></div>}></Route> */}
    </Router>
  );
}
