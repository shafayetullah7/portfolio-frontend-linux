const STATIC_PATHS = ["/", "/projects", "/contact"];

export function buildSitemapXml(siteUrl: string, projectSlugs: string[] = []): string {
  const baseUrl = siteUrl.replace(/\/$/, "");
  const staticUrls = STATIC_PATHS.map(
    (path) => `  <url><loc>${baseUrl}${path}</loc><changefreq>weekly</changefreq></url>`,
  );
  const projectUrls = projectSlugs.map(
    (slug) =>
      `  <url><loc>${baseUrl}/projects/${slug}</loc><changefreq>monthly</changefreq></url>`,
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...projectUrls].join("\n")}
</urlset>`;
}

export function buildRobotsTxt(siteUrl: string): string {
  const baseUrl = siteUrl.replace(/\/$/, "");
  return [
    "User-agent: *",
    "Allow: /",
    `Sitemap: ${baseUrl}/sitemap.xml`,
    "",
  ].join("\n");
}
