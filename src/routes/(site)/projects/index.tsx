import Seo from "~/components/Seo";
import { Container, QueryState, SectionHeader } from "~/components/ui";
import ProjectGrid from "~/components/projects/ProjectGrid";
import { siteConfig } from "~/content/site.config";
import { useClientResource } from "~/lib/api/client-resource";
import { getProjects } from "~/lib/api/endpoints/public";
import { sortProjects } from "~/lib/projects";

export default function ProjectsPage() {
  const projects = useClientResource(() => getProjects());
  const list = () => sortProjects(projects.data() ?? []);

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
          loading={projects.loading()}
          error={projects.error()}
          empty={!projects.loading() && !projects.error() && list().length === 0}
          emptyMessage="No published projects yet."
          loadingMessage="Loading projects…"
        >
          <ProjectGrid projects={list()} />
        </QueryState>
      </Container>
    </>
  );
}
