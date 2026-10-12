import { describe, expect, it } from "vitest";
import { renderToString } from "solid-js/web";
import { AwardIcon, ExternalLinkIcon, GitHubIcon, MailIcon } from "./index";

function svgAttrs(html: string): Record<string, string> {
  const open = html.match(/<svg[^>]*>/)?.[0] ?? "";
  const attrs: Record<string, string> = {};
  for (const match of open.matchAll(/([\w-]+)="([^"]*)"/g)) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

describe("modern-split icons", () => {
  it("outline icons match lucide stroke contract", () => {
    for (const Icon of [MailIcon, GitHubIcon, ExternalLinkIcon, AwardIcon]) {
      const html = renderToString(() => <Icon size={24} />);
      const attrs = svgAttrs(html);
      expect(attrs.viewBox).toBe("0 0 24 24");
      expect(attrs["stroke-width"]).toBe("2");
      expect(attrs["stroke-linecap"]).toBe("round");
      expect(attrs["stroke-linejoin"]).toBe("round");
      expect(html).toContain('stroke="currentColor"');
    }
  });
});
