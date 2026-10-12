import { describe, expect, it } from "vitest";
import { getHostname } from "./get-hostname";

describe("getHostname", () => {
  it("strips www and keeps path", () => {
    expect(getHostname("https://www.github.com/user")).toBe("github.com/user");
    expect(getHostname("github.com")).toBe("github.com");
  });

  it("returns invalid input as-is", () => {
    expect(getHostname("not-a-url")).toBe("not-a-url");
  });
});
