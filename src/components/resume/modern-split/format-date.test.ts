import { describe, expect, it } from "vitest";
import {
  formatModernSplitDate,
  formatModernSplitDateRange,
} from "./format-date";

describe("formatModernSplitDate", () => {
  it("formats YYYY-MM dates", () => {
    expect(formatModernSplitDate("2021-01")).toBe("Jan 2021");
    expect(formatModernSplitDate("2018-12")).toBe("Dec 2018");
  });

  it("passes through free-text dates", () => {
    expect(formatModernSplitDate("Jan 2021")).toBe("Jan 2021");
  });
});

describe("formatModernSplitDateRange", () => {
  it("formats date ranges", () => {
    expect(formatModernSplitDateRange("2021-01", "2022-06", false)).toBe(
      "Jan 2021 — Jun 2022",
    );
    expect(formatModernSplitDateRange("2021-01", "", true)).toBe(
      "Jan 2021 — Present",
    );
  });
});
