import { render } from "@solidjs/testing-library";
import { Route, MemoryRouter, createMemoryHistory } from "@solidjs/router";
import Experience from "../../src/routes/experience/(experience)";
import { waitForShadowAnimations } from "../helpers/test-utils";
import { TIMELINE_TITLE_ATTR } from "../helpers/test-data";

// Helper to render Experience page at /experience route
async function renderExperiencePage() {
  const history = createMemoryHistory();
  history.set({ value: "/experience", replace: false, scroll: false, state: undefined });

  const page = render(() => (
    <MemoryRouter history={history}>
      <Route path="/experience" component={Experience} />
    </MemoryRouter>
  ));
  await waitForShadowAnimations();
  return page;
}

describe("Experience Page", () => {
  describe("Page Structure", () => {
    it("renders at /experience route", async () => {
      const page = await renderExperiencePage();
      expect(page.container).toBeInTheDocument();
    });

    it("has Home back button linking to /", async () => {
      const page = await renderExperiencePage();

      const homeLink = page.getByRole("link", { name: /home/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute("href", "/");
    });
  });

  describe("Section Headers", () => {
    it("displays Experience header", async () => {
      const page = await renderExperiencePage();
      const header = page.getByRole("heading", { name: "Experience", level: 1 });
      expect(header).toBeInTheDocument();
    });

    it("displays Education & Credentials header", async () => {
      const page = await renderExperiencePage();
      const header = page.getByRole("heading", {
        name: "Education & Credentials",
        level: 1,
      });
      expect(header).toBeInTheDocument();
    });

    it("displays Projects header", async () => {
      const page = await renderExperiencePage();
      const header = page.getByRole("heading", { name: "Projects", level: 1 });
      expect(header).toBeInTheDocument();
    });
  });

  describe("Professional Experience", () => {
    describe("Level Up", () => {
      it("displays company name", async () => {
        const page = await renderExperiencePage();
        expect(page.getByText(/Level Up/i)).toBeInTheDocument();
      });

      it("displays date range", async () => {
        const page = await renderExperiencePage();
        const dateElements = page.queryAllByText(/2025.*Present/i);
        expect(dateElements.length).toBeGreaterThan(0);
      });

      it("shows timeline header 2025", async () => {
        const page = await renderExperiencePage();
        const timeline = page.container.querySelector(`[${TIMELINE_TITLE_ATTR}="2025"]`);
        expect(timeline).toBeInTheDocument();
      });
    });

    describe("Cox Automotive", () => {
      it("displays company name", async () => {
        const page = await renderExperiencePage();
        expect(page.getByText("Cox Automotive")).toBeInTheDocument();
      });

      it("displays date range (Aug 2021 - Jul 2025)", async () => {
        const page = await renderExperiencePage();
        expect(page.getByText(/Aug 2021 - Jul 2025/i)).toBeInTheDocument();
      });

      it("displays location", async () => {
        const page = await renderExperiencePage();
        // Check for location - appears in multiple places
        const locations = page.queryAllByText(/Remote.*Arlington.*VA/i);
        expect(locations.length).toBeGreaterThan(0);
      });

      it("displays Software Engineer II title with date", async () => {
        const page = await renderExperiencePage();
        expect(page.getByText("Software Engineer II")).toBeInTheDocument();
        expect(page.getByText(/Mar 2023/)).toBeInTheDocument();
      });

      it("displays Software Engineer I title with date", async () => {
        const page = await renderExperiencePage();
        expect(page.getByText("Software Engineer I")).toBeInTheDocument();
        // Aug 2021 appears in main date range, just verify it exists
        const aug2021Elements = page.queryAllByText(/Aug 2021/);
        expect(aug2021Elements.length).toBeGreaterThan(0);
      });

      it("shows timeline header 2021", async () => {
        const page = await renderExperiencePage();
        const timeline = page.container.querySelector(`[${TIMELINE_TITLE_ATTR}="2021"]`);
        expect(timeline).toBeInTheDocument();
      });
    });

    describe("Pitt TA", () => {
      it("renders section", async () => {
        const page = await renderExperiencePage();
        // Check for TA-specific content
        expect(page.getByText(/Undergraduate Teaching Assistant/i)).toBeInTheDocument();
      });

      it("shows timeline header 2018", async () => {
        const page = await renderExperiencePage();
        const timelines = page.container.querySelectorAll(`[${TIMELINE_TITLE_ATTR}="2018"]`);
        // 2018 appears multiple times (TA and Education), just verify at least one exists
        expect(timelines.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Education", () => {
    describe("University of Pittsburgh", () => {
      it("displays institution name", async () => {
        const page = await renderExperiencePage();
        // University of Pittsburgh appears multiple times (TA and Education)
        const upittElements = page.queryAllByText("University of Pittsburgh");
        expect(upittElements.length).toBeGreaterThanOrEqual(1);
      });

      it("displays degree (B.S. Computer Science)", async () => {
        const page = await renderExperiencePage();
        expect(page.getByText(/B\.S\. Computer Science/i)).toBeInTheDocument();
      });

      it("displays honors (Summa Cum Laude)", async () => {
        const page = await renderExperiencePage();
        expect(page.getByText(/Summa Cum Laude/i)).toBeInTheDocument();
      });

      it("displays date range (2016 - 2020)", async () => {
        const page = await renderExperiencePage();
        expect(page.getByText(/2016 - 2020/)).toBeInTheDocument();
      });

      it("displays GPA", async () => {
        const page = await renderExperiencePage();
        expect(page.getByText(/GPA.*3\.79/i)).toBeInTheDocument();
      });

      it("shows timeline header 2016", async () => {
        const page = await renderExperiencePage();
        const timeline = page.container.querySelector(`[${TIMELINE_TITLE_ATTR}="2016"]`);
        expect(timeline).toBeInTheDocument();
      });
    });

    describe("Yonsei University", () => {
      it("renders section", async () => {
        const page = await renderExperiencePage();
        expect(page.getByText(/Yonsei/i)).toBeInTheDocument();
      });

      it("shows timeline header 2018", async () => {
        const page = await renderExperiencePage();
        const timelines = page.container.querySelectorAll(`[${TIMELINE_TITLE_ATTR}="2018"]`);
        // 2018 appears for both TA and Yonsei
        expect(timelines.length).toBeGreaterThan(0);
      });
    });

    describe("Certificates", () => {
      it("renders section", async () => {
        const page = await renderExperiencePage();
        // Certificates section exists - check for the header or any cert content
        const certHeader = page.container.querySelector(`[${TIMELINE_TITLE_ATTR}="2024"]`);
        expect(certHeader).toBeInTheDocument();
      });

      it("shows timeline header 2024", async () => {
        const page = await renderExperiencePage();
        const timeline = page.container.querySelector(`[${TIMELINE_TITLE_ATTR}="2024"]`);
        expect(timeline).toBeInTheDocument();
      });
    });
  });

  describe("Projects", () => {
    describe("Polish Pic", () => {
      it("renders section", async () => {
        const page = await renderExperiencePage();
        expect(page.getByText(/Polish Pic/i)).toBeInTheDocument();
      });

      it("shows timeline header 2025", async () => {
        const page = await renderExperiencePage();
        const timelines = page.container.querySelectorAll(`[${TIMELINE_TITLE_ATTR}="2025"]`);
        // 2025 appears for Level Up and Polish Pic
        expect(timelines.length).toBeGreaterThanOrEqual(2);
      });
    });

    describe("Webcam Sandbox", () => {
      it("renders section", async () => {
        const page = await renderExperiencePage();
        expect(page.getByText(/Webcam Sandbox/i)).toBeInTheDocument();
      });

      it("shows timeline header 2023", async () => {
        const page = await renderExperiencePage();
        const timeline = page.container.querySelector(`[${TIMELINE_TITLE_ATTR}="2023"]`);
        expect(timeline).toBeInTheDocument();
      });
    });

    describe("Exclaim", () => {
      it("renders section", async () => {
        const page = await renderExperiencePage();
        // Exclaim is an h1, look for it specifically
        const exclaimHeader = page.getByRole("heading", { name: /Exclaim/i });
        expect(exclaimHeader).toBeInTheDocument();
      });

      it("shows timeline header 2021", async () => {
        const page = await renderExperiencePage();
        const timelines = page.container.querySelectorAll(`[${TIMELINE_TITLE_ATTR}="2021"]`);
        // 2021 appears for Cox and Exclaim
        expect(timelines.length).toBeGreaterThanOrEqual(2);
      });
    });
  });
});
