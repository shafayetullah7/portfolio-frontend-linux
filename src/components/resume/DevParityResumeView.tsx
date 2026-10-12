import { Show } from "solid-js";
import ModernSplitDocument from "~/components/resume/modern-split/ModernSplitDocument";
import { ResumePreviewStage } from "~/components/resume/ResumePreviewStage";
import type { ParityFixtureName } from "~/lib/resume/parity/fixture-names";
import { loadParityFixture } from "~/lib/resume/parity/load-fixture";
import { builderToResumeDocument } from "~/lib/resume/parity/to-resume-document";
import type { ResumeDocument } from "~/schemas/resume-document.schema";

interface DevParityResumeViewProps {
  fixture: ParityFixtureName;
}

export default function DevParityResumeView(props: DevParityResumeViewProps) {
  const doc = (): ResumeDocument => {
    const raw = loadParityFixture(props.fixture);
    return builderToResumeDocument(raw as Parameters<typeof builderToResumeDocument>[0]);
  };

  return (
    <ResumePreviewStage id="resume-parity-root">
      <Show when={doc()} keyed>
        {(d) => <ModernSplitDocument doc={d} />}
      </Show>
    </ResumePreviewStage>
  );
}
