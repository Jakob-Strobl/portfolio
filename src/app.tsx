import "./app.css";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import BaseLayout from "./layouts/base-layout";

export default function App() {
  return (
    <Router root={BaseLayout}>
      <FileRoutes />
      {/* <Route path="404" component={<div><h1>404 Whoops</h1></div>}></Route> */}
    </Router>
  );
}
