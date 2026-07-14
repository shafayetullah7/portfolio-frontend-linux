import { useParams } from "@solidjs/router";
import { Container, QueryState } from "~/components/ui";
import ProjectDetail from "~/components/projects/ProjectDetail";
import { useClientResource } from "~/lib/api/client-resource";
import { getProjectBySlug } from "~/lib/api/endpoints/public";

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const project = useClientResource(() => getProjectBySlug(params.slug));

  return (
    <Container class="py-16 sm:py-24">
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
  );
}
