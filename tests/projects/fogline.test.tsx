// @vitest-environment happy-dom
import { render } from "@solidjs/testing-library";
import { Route, MemoryRouter, createMemoryHistory } from "@solidjs/router";
import Fogline from "../../src/routes/projects/fogline";
import Experience from "../../src/routes/experience/(experience)";
import { waitForShadowAnimations } from "../helpers/test-utils";

async function renderAt(path: string) {
  const history = createMemoryHistory();
  history.set({ value: path, replace: false, scroll: false, state: undefined });
  const page = render(() => (
    <MemoryRouter history={history}>
      <Route path="/projects/fogline" component={Fogline} />
      <Route path="/experience" component={Experience} />
    </MemoryRouter>
  ));
  await waitForShadowAnimations();
  return page;
}

describe("Fogline case study", () => {
  it("renders sections in order", async () => {
    const page = await renderAt("/projects/fogline");
    expect(page.getByRole("heading", { name: "Fogline", level: 1 })).toBeInTheDocument();
    const headings = page.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual(["Problem", "Architecture", "Evaluation method", "Roadmap", "Results"]);
  });

  it("uses click-to-play clips without autoplay", async () => {
    const page = await renderAt("/projects/fogline");
    const videos = page.container.querySelectorAll("video");
    expect(videos).toHaveLength(2);
    videos.forEach((video) => {
      expect(video).toHaveAttribute("controls");
      expect(video).not.toHaveAttribute("autoplay");
      expect(video).toHaveAttribute("poster");
    });
    expect(page.getByText("C2 console replaying a seeded run (scripted baseline controller).")).toBeInTheDocument();
  });

  it("publishes no results and no excluded roadmap items", async () => {
    const page = await renderAt("/projects/fogline");
    expect(page.getByText("Benchmark results will be published once reviewed.")).toBeInTheDocument();
    expect(page.getByText("In progress")).toBeInTheDocument();
    const visibleText = [...page.container.querySelectorAll("p, li, h1, h2, h3, figcaption")]
      .map((element) => element.textContent)
      .join(" ");
    expect(visibleText).not.toMatch(/Kubernetes|Terraform|Helm|\bCI\b|at scale|github\.com/i);
  });

  it("shows the private-repo note and credit", async () => {
    const page = await renderAt("/projects/fogline");
    expect(
      page.getByText(
        "Fogline's code is private while the benchmark matures. The write-up, architecture, and recorded runs are public. Happy to walk through the code in an interview.",
      ),
    ).toBeInTheDocument();
    expect(page.getByText("Designed by Jakob; built with AI coding agents under his direction.")).toBeInTheDocument();
  });

  it("is linked from the experience project highlights", async () => {
    const page = await renderAt("/experience");
    expect(page.getByRole("link", { name: "Read the case study" })).toHaveAttribute("href", "/projects/fogline");
  });
});
