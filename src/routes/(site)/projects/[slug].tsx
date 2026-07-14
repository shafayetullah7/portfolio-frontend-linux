import { Show } from "solid-js";
import { useParams } from "@solidjs/router";
import Seo from "~/components/Seo";
import { Container, QueryState } from "~/components/ui";
import ProjectDetail from "~/components/projects/ProjectDetail";
import { siteConfig, truncateBio } from "~/content/site.config";
import { getProjectBySlugQuery } from "~/lib/api/public-queries";
import { usePublicQueryResource } from "~/lib/api/use-public-query";

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const project = usePublicQueryResource(() => getProjectBySlugQuery(params.slug));

  return (
    <>
      <Show
        when={project.data()}
        fallback={
          <Seo
            title={`Project — ${siteConfig.brand}`}
            description="Project detail from the portfolio."
          />
        }
      >
        {(p) => (
          <Seo
            title={`${p().title} — ${siteConfig.brand}`}
            description={truncateBio(p().description, 160)}
          />
        )}
      </Show>
      <Container class="overflow-x-hidden py-16 sm:py-24">
        <QueryState
          loading={project.loading()}
          error={project.error()}
          empty={!project.loading() && !project.error() && !project.data()}
          emptyMessage="Project not found."
          loadingMessage="Loading project…"
          errorMessage="Could not load this project."
        >
          <ProjectDetail project={project.data()!} />
        </QueryState>
      </Container>
    </>
  );
}
