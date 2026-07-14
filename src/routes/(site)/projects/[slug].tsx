import { Show } from "solid-js";
import { useParams } from "@solidjs/router";
import Seo from "~/components/Seo";
import { Container, QueryState } from "~/components/ui";
import ProjectDetail from "~/components/projects/ProjectDetail";
import { siteConfig, truncateBio } from "~/content/site.config";
import { useClientResource } from "~/lib/api/client-resource";
import { getProjectBySlug } from "~/lib/api/endpoints/public";

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const project = useClientResource(
    () => getProjectBySlug(params.slug),
    () => params.slug,
  );

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
