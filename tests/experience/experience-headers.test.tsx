import { fireEvent, render } from "@solidjs/testing-library";
import { Route, MemoryRouter, createMemoryHistory } from "@solidjs/router";
import Experience from "../../src/routes/experience/(experience)";
import { waitForShadowAnimations } from "../helpers/test-utils";

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

    it("displays Education header", async () => {
      const page = await renderExperiencePage();
      const header = page.getByRole("heading", { name: "Education", level: 2 });
      expect(header).toBeInTheDocument();
    });

    it("displays Project Highlights header", async () => {
      const page = await renderExperiencePage();
      const header = page.getByRole("heading", { name: "Project Highlights", level: 2 });
      expect(header).toBeInTheDocument();
    });

    it("preserves the main section order", async () => {
      const page = await renderExperiencePage();
      const headers = Array.from(page.container.querySelectorAll(".experience-section-title")).map((header) =>
        header.textContent?.trim(),
      );

      expect(headers).toEqual(["Experience", "Education", "Technical Skills", "Project Highlights"]);
    });

    it("does not render a scroll-linked year indicator", async () => {
      const page = await renderExperiencePage();

      expect(page.container.querySelectorAll("[data-timeline-title]")).toHaveLength(0);
      expect(page.container.querySelector(".cursor-vertical-text")).not.toBeInTheDocument();
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

      it("describes the EMR platform without an NDA qualifier", async () => {
        const page = await renderExperiencePage();

        expect(page.getByRole("heading", { name: "EMR Platform" })).toBeInTheDocument();
        expect(page.queryByText(/under NDA/i)).not.toBeInTheDocument();
      });
    });

    describe("Cox Automotive", () => {
      it("displays company name", async () => {
        const page = await renderExperiencePage();
        expect(page.getByText("Cox Automotive")).toBeInTheDocument();
      });

      it("keeps the collapsed history at the full timeline width", async () => {
        const page = await renderExperiencePage();
        const details = page.getByText("Cox Automotive").closest("details");
        const timelineRow = [...page.container.querySelectorAll("div")].find(
          (element) => element.classList.contains("flex-row") && element.classList.contains("h-screen"),
        );

        expect(details).toHaveClass("min-w-0", "w-full");
        expect(timelineRow).toHaveClass("min-w-0", "w-full");
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
    });

    describe("Pitt TA", () => {
      it("renders section", async () => {
        const page = await renderExperiencePage();
        // Check for TA-specific content
        expect(page.getByText(/Undergraduate Teaching Assistant/i)).toBeInTheDocument();
        expect(page.getByText("Computer Science Department")).toBeInTheDocument();
      });

      it("surfaces the lead instructor role, grades, and key teaching bullets", async () => {
        const page = await renderExperiencePage();

        expect(page.getByText("TLI — Lead Instructor")).toBeInTheDocument();
        expect(page.getByText(/Tech Divaz & High School Academy Summer Camp/)).toBeInTheDocument();
        expect(page.getByText("Grades 6-12")).toBeInTheDocument();
        expect(page.getByText(/Mentored students during weekly office hours/i)).toBeInTheDocument();
        expect(page.getByText(/Expanded on HTML5 concepts/i)).toBeInTheDocument();
      });

      it("shows Summer 2018 once", async () => {
        const page = await renderExperiencePage();

        expect(page.queryAllByText("Summer 2018")).toHaveLength(1);
      });

      it("keeps course details behind one shared control", async () => {
        const page = await renderExperiencePage();
        const courseDetails = page.getByText("View course details").closest("details");
        const courseDetailsSummary = courseDetails?.querySelector("summary");

        expect(courseDetails).not.toHaveAttribute("open");
        expect(courseDetailsSummary).toBeInTheDocument();

        await fireEvent.click(courseDetailsSummary!);

        expect(courseDetails).toHaveAttribute("open");
        expect(page.getByText("Undergraduate TA Courses:")).toBeInTheDocument();
        const coursesLabel = page.getByText("Undergraduate TA Courses:");
        expect(page.getByText("CS0008 - Intro to Programming with Python")).toBeInTheDocument();
        expect(courseDetailsSummary).not.toContainElement(coursesLabel);
        expect(courseDetails?.querySelector(".experience-card-expanded")).toContainElement(coursesLabel);
        expect(courseDetails?.querySelector(".experience-card-expanded")).toHaveClass(
          "experience-card-expanded-standalone",
        );
      });
    });
  });

  describe("Education", () => {
    it("surfaces honors and GPAs", async () => {
      const page = await renderExperiencePage();

      expect(page.queryAllByText(/summa cum laude/i).length).toBeGreaterThan(0);
      expect(page.queryAllByText(/GPA.*3\.79/i).length).toBeGreaterThan(0);
    });

    it("keeps each GPA beneath its corresponding study details", async () => {
      const page = await renderExperiencePage();
      const educationSections = page.container.querySelectorAll("#education-details > section");
      const pittsburgh = educationSections[0];
      const yonsei = educationSections[1];

      expect(pittsburgh?.textContent?.indexOf("Minor in Korean Language")).toBeLessThan(
        pittsburgh?.textContent?.indexOf("GPA: 3.79/4.00"),
      );
      expect(yonsei?.textContent?.indexOf("Areas of study")).toBeLessThan(
        yonsei?.textContent?.indexOf("GPA: 4.00/4.30"),
      );
    });

    it("keeps detailed education content collapsed by default", async () => {
      const page = await renderExperiencePage();
      const educationDetails = page.getByText("View education details").closest("details");

      expect(educationDetails).not.toHaveAttribute("open");
      expect(educationDetails?.querySelectorAll("hr")).toHaveLength(1);
      expect(educationDetails?.querySelector("hr")).toHaveClass("border-white/10");
    });

    it("expands both schools with one control", async () => {
      const page = await renderExperiencePage();
      const educationDetails = page.getByText("View education details").closest("details");
      const educationDetailsSummary = educationDetails?.querySelector("summary");

      await fireEvent.click(educationDetailsSummary!);

      expect(educationDetails).toHaveAttribute("open");
      expect(page.getAllByText("Major Coursework:")).toHaveLength(2);
      expect(page.getByText("Clubs:")).toBeInTheDocument();
      expect(page.getByText(/Korean Conversation Club \(Business Manager\)/)).toBeInTheDocument();
      expect(educationDetails?.querySelector("h3")?.textContent).toBe("University of Pittsburgh");
    });

    it("renders certificates in their own shadow", async () => {
      const page = await renderExperiencePage();

      expect(page.getByRole("heading", { name: "Certificates" })).toBeInTheDocument();
    });

    it("describes timedat ownership and technology", async () => {
      const page = await renderExperiencePage();

      expect(page.getAllByText("Product lead · Product design & UX · Full-stack development")).toHaveLength(2);
      expect(page.getByText("Private project · Sole developer")).toBeInTheDocument();
      expect(page.getByText("Svelte 5, SvelteKit, Clerk, Tailwind CSS, Vitest, Convex")).toBeInTheDocument();
    });

    describe("University of Pittsburgh", () => {
      it("displays institution name", async () => {
        const page = await renderExperiencePage();
        // University of Pittsburgh appears multiple times (TA and Education)
        const upittElements = page.queryAllByText("University of Pittsburgh");
        expect(upittElements.length).toBeGreaterThanOrEqual(1);
      });

      it("displays degree (B.S. in Computer Science)", async () => {
        const page = await renderExperiencePage();
        expect(page.queryAllByText(/B\.S\. in Computer Science/i).length).toBeGreaterThan(0);
      });

      it("displays honors (Summa Cum Laude)", async () => {
        const page = await renderExperiencePage();
        expect(page.queryAllByText(/Summa Cum Laude/i).length).toBeGreaterThan(0);
      });

      it("displays date range (2016 - 2020)", async () => {
        const page = await renderExperiencePage();
        expect(page.getByText(/2016 - 2020/)).toBeInTheDocument();
      });

      it("displays GPA", async () => {
        const page = await renderExperiencePage();
        expect(page.queryAllByText(/GPA.*3\.79/i).length).toBeGreaterThan(0);
      });
    });

    describe("Yonsei University", () => {
      it("renders section", async () => {
        const page = await renderExperiencePage();
        expect(page.queryAllByText(/Yonsei/i).length).toBeGreaterThan(0);
      });
    });
  });

  describe("Projects", () => {
    describe("Polish Pic", () => {
      it("renders section", async () => {
        const page = await renderExperiencePage();
        expect(page.getByText(/Polish Pic/i)).toBeInTheDocument();
      });
    });

    describe("Webcam Sandbox", () => {
      it("renders section", async () => {
        const page = await renderExperiencePage();
        expect(page.getByText(/Webcam Sandbox/i)).toBeInTheDocument();
      });
    });

    describe("Exclaim", () => {
      it("renders section", async () => {
        const page = await renderExperiencePage();
        // Exclaim is an h1, look for it specifically
        const exclaimHeader = page.getByRole("heading", { name: /Exclaim/i });
        expect(exclaimHeader).toBeInTheDocument();
        expect(
          page.getByText(/COVID-era project.*Language designer & Compiler engineer.*Deprecated/),
        ).toBeInTheDocument();
        expect(page.getByText(/Designed an LL\(1\) grammar that enabled implementation/i)).toBeInTheDocument();
      });

      it("links to both GitHub repositories", async () => {
        const page = await renderExperiencePage();

        const exclaimLink = page.getByRole("link", { name: "github/exclaim" });
        const grammarLink = page.getByRole("link", { name: "github/exclaim-grammar" });

        expect(exclaimLink).toHaveAttribute("href", "https://github.com/Jakob-Strobl/exclaim");
        expect(grammarLink).toHaveAttribute("href", "https://github.com/Jakob-Strobl/exclaim-grammar");
        expect(exclaimLink).toHaveAttribute("target", "_blank");
        expect(grammarLink).toHaveAttribute("target", "_blank");
      });
    });
  });
});
