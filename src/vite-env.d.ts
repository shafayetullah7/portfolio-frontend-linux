/// <reference types="vite/client" />

declare module "virtual:resume-parity-dev" {
  import type { Component } from "solid-js";
  import type { ParityFixtureName } from "~/lib/resume/parity/fixture-names";
  const component: Component<{ fixture: ParityFixtureName }> | null;
  export default component;
}
