import { Container, QueryState, SectionHeader } from "~/components/ui";
import ProjectGrid from "~/components/projects/ProjectGrid";
import { useProjects } from "~/lib/projects-context";

export default function FeaturedDeployments() {
  const projects = useProjects();
  const featured = () => projects.featured(2);

  return (
    <section class="py-16 sm:py-24">
      <Container>
        <SectionHeader
          title="Featured_Deployments"
          caption="Selected systems shipped to production."
        />
        <QueryState
          loading={projects.resource.loading()}
          error={projects.resource.error()}
          empty={
            !projects.resource.loading() &&
            !projects.resource.error() &&
            featured().length === 0
          }
          emptyMessage="No featured deployments yet. Publish projects in admin to show them here."
          loadingMessage="Loading deployments…"
        >
          <ProjectGrid projects={featured()} />
        </QueryState>
      </Container>
    </section>
  );
}
