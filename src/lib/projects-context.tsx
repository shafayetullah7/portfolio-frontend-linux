import {
  createContext,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";
import { getProjectsQuery } from "~/lib/api/public-queries";
import { usePublicQueryResource } from "~/lib/api/use-public-query";
import type { Project } from "~/lib/api/types/portfolio.types";
import { featuredProjects, sortProjects } from "~/lib/projects";

type ProjectsResource = ReturnType<typeof usePublicQueryResource<Project[]>>;

interface ProjectsContextValue {
  resource: ProjectsResource;
  list: Accessor<Project[]>;
  featured: (n?: number) => Project[];
}

const ProjectsContext = createContext<ProjectsContextValue>();

export function ProjectsProvider(props: ParentProps) {
  const resource = usePublicQueryResource(() => getProjectsQuery());

  const list = () => sortProjects(resource.data() ?? []);

  const featured = (n = 2) => featuredProjects(resource.data() ?? [], n);

  const value: ProjectsContextValue = {
    resource,
    list,
    featured,
  };

  return (
    <ProjectsContext.Provider value={value}>{props.children}</ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) {
    throw new Error("useProjects must be used within ProjectsProvider");
  }
  return ctx;
}
