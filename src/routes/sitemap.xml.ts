import { config } from "~/lib/config";
import { buildSitemapXml } from "~/lib/seo";

export async function GET() {
  let projectSlugs: string[] = [];
  try {
    const base = config.api.baseUrl.replace(/\/$/, "");
    const res = await fetch(`${base}/api/v1/public/projects`);
    if (res.ok) {
      const json = await res.json();
      const projects = json?.data ?? json;
      if (Array.isArray(projects)) {
        projectSlugs = projects.map((p: { slug: string }) => p.slug).filter(Boolean);
      }
    }
  } catch {
    projectSlugs = [];
  }

  return new Response(buildSitemapXml(config.site.url, projectSlugs), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
