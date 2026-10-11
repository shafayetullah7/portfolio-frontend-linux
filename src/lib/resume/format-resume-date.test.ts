import { describe, expect, it } from "vitest";
import {
  formatResumeCertDate,
  formatResumeDateRange,
  formatResumeEducationRange,
  formatResumeMonthYear,
} from "./format-resume-date";

describe("formatResumeMonthYear", () => {
  it("formats ISO date as Month Year", () => {
    expect(formatResumeMonthYear("2022-03-15")).toBe("Mar 2022");
  });

  it("returns empty for null", () => {
    expect(formatResumeMonthYear(null)).toBe("");
  });

  it("falls back for invalid ISO", () => {
    expect(formatResumeMonthYear("not-a-date")).toBe("not-a-date");
  });
});

describe("formatResumeDateRange", () => {
  it("shows Present for current role", () => {
    expect(formatResumeDateRange("2020-01-01", null, true)).toBe(
      "Jan 2020 — Present",
    );
  });

  it("shows closed range", () => {
    expect(formatResumeDateRange("2020-01-01", "2022-06-01", false)).toBe(
      "Jan 2020 — Jun 2022",
    );
  });
});

describe("formatResumeEducationRange", () => {
  it("handles both dates", () => {
    expect(formatResumeEducationRange("2016-09-01", "2020-05-01")).toBe(
      "Sep 2016 — May 2020",
    );
  });

  it("handles end only", () => {
    expect(formatResumeEducationRange(null, "2020-05-01")).toBe("May 2020");
  });
});

describe("formatResumeCertDate", () => {
  it("formats certification date", () => {
    expect(formatResumeCertDate("2024-11-01")).toBe("Nov 2024");
  });
});
