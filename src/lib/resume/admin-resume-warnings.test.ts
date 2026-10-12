import { describe, expect, it } from "vitest";
import { collectAdminResumeWarnings } from "./admin-resume-warnings";

describe("collectAdminResumeWarnings", () => {
  it("flags missing email and resume summary", () => {
    const warnings = collectAdminResumeWarnings({
      contact: { email: "", socialLinks: [] },
      profile: {
        profile: { name: "A", headline: "h", bio: "b" },
        systemInfo: null,
        avatarUrl: null,
      },
      projects: [],
      experience: [],
    });
    expect(warnings.some((w) => w.id === "contact-email")).toBe(true);
    expect(warnings.some((w) => w.id === "profile-resume-summary")).toBe(true);
  });

  it("warns on resume project without resumeDescription", () => {
    const warnings = collectAdminResumeWarnings({
      contact: { email: "a@b.com", socialLinks: [] },
      profile: {
        profile: {
          name: "A",
          headline: "h",
          bio: "b",
          resumeSummary: "Short",
        },
        systemInfo: null,
        avatarUrl: null,
      },
      projects: [
        {
          id: "p1",
          title: "App",
          slug: "app",
          stack: "ts",
          description: "Long site copy",
          status: "ACTIVE",
          published: true,
          includeOnResume: true,
          features: [],
        },
      ],
      experience: [],
    });
    expect(warnings.some((w) => w.id === "project-fallback-p1")).toBe(true);
  });

  it("info when experience uses site bullet fallback", () => {
    const warnings = collectAdminResumeWarnings({
      contact: { email: "a@b.com", socialLinks: [] },
      profile: null,
      projects: [],
      experience: [
        {
          id: "e1",
          company: "Co",
          role: "Eng",
          startDate: "2020-01-01",
          level: "INFO",
          includeOnResume: true,
          resumeBullets: null,
          responsibilities: [{ id: "r1", content: "Did things" }],
          techTags: [],
        },
      ],
    });
    expect(warnings.some((w) => w.id === "experience-fallback-e1")).toBe(true);
  });
});
