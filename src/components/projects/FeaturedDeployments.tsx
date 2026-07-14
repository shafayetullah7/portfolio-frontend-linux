import { Container, QueryState, SectionHeader } from "~/components/ui";
import ProjectGrid from "~/components/projects/ProjectGrid";
import { useClientResource } from "~/lib/api/client-resource";
import { getProjects } from "~/lib/api/endpoints/public";
import { featuredProjects } from "~/lib/projects";

export default function FeaturedDeployments() {
  const projects = useClientResource(() => getProjects());
  const featured = () => featuredProjects(projects.data() ?? [], 2);

  return (
    <section class="py-16 sm:py-24">
      <Container>
        <SectionHeader
          title="Featured_Deployments"
          caption="Selected systems shipped to production."
        />
        <QueryState
          loading={projects.loading()}
          error={projects.error()}
          empty={!projects.loading() && !projects.error() && featured().length === 0}
          emptyMessage="No featured deployments yet. Publish projects in admin to show them here."
          loadingMessage="Loading deployments…"
        >
          <ProjectGrid projects={featured()} />
        </QueryState>
      </Container>
    </section>
  );
}
