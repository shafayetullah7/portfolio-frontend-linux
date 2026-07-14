import { config } from "~/lib/config";
import { buildRobotsTxt } from "~/lib/seo";

export async function GET() {
  return new Response(buildRobotsTxt(config.site.url), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
