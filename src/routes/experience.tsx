import { A } from "@solidjs/router";
import Shadow from "../components/shadow/shadow";

export default function Experience() {
  return (
    <div>
      <Shadow>
        <h1 class="text-2xl text-white justify-self-center">Working on it!</h1>
        <br></br>
        <A href="/" class="hover:text-shadow-lg duration-300 transition-text">
          back
        </A>
      </Shadow>
    </div>
  );
}
