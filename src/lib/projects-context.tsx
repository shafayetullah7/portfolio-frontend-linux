import {
  createContext,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";
import { useClientResource } from "~/lib/api/client-resource";
import { getProjects } from "~/lib/api/endpoints/public";
import type { Project } from "~/lib/api/types/portfolio.types";
import { featuredProjects, sortProjects } from "~/lib/projects";

type ProjectsResource = ReturnType<typeof useClientResource<Project[]>>;

interface ProjectsContextValue {
  resource: ProjectsResource;
  list: Accessor<Project[]>;
  featured: (n?: number) => Project[];
}

const ProjectsContext = createContext<ProjectsContextValue>();

export function ProjectsProvider(props: ParentProps) {
  const resource = useClientResource(() => getProjects());

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
