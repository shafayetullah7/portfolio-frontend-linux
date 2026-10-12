import type { ParityFixtureName } from "./fixture-names";

import edge from "~/__fixtures__/resume-parity/edge.builder.json";
import full from "~/__fixtures__/resume-parity/full.builder.json";
import long from "~/__fixtures__/resume-parity/long.builder.json";
import sparse from "~/__fixtures__/resume-parity/sparse.builder.json";
import typical from "~/__fixtures__/resume-parity/typical.builder.json";

const FIXTURES: Record<ParityFixtureName, unknown> = {
  full,
  typical,
  sparse,
  long,
  edge,
};

export function loadParityFixture(name: ParityFixtureName): unknown {
  return FIXTURES[name];
}
