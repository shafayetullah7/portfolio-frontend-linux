import Seo from "~/components/Seo";
import { Container, QueryState, SectionHeader } from "~/components/ui";
import ProjectGrid from "~/components/projects/ProjectGrid";
import { siteConfig } from "~/content/site.config";
import { useProjects } from "~/lib/projects-context";

export default function ProjectsPage() {
  const projects = useProjects();
  const list = () => projects.list();

  return (
    <>
      <Seo
        title={`Projects — ${siteConfig.brand}`}
        description="Published systems and featured deployments from the portfolio."
      />
      <Container class="overflow-x-hidden py-16 sm:py-24">
        <SectionHeader
          title="Featured_Deployments"
          caption="All published systems from the portfolio API."
        />
        <QueryState
          loading={projects.resource.loading()}
          error={projects.resource.error()}
          empty={
            !projects.resource.loading() &&
            !projects.resource.error() &&
            list().length === 0
          }
          emptyMessage="No published projects yet."
          loadingMessage="Loading projects…"
        >
          <ProjectGrid projects={list()} />
        </QueryState>
      </Container>
    </>
  );
}
