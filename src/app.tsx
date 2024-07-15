import { Suspense } from "solid-js";
import "./app.css";
import IsomorphicBackground from "./components/background";
import { Route, Router, RouteSectionProps } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";

const BaseLayout = (props: RouteSectionProps) => {
  const showMenu = props.location.pathname == "/";
  console.log(`showMenu = ${showMenu}`);
  return (
    <>
      <IsomorphicBackground></IsomorphicBackground>
      <main class="flex flex-row h-screen w-screen items-center justify-center">
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
