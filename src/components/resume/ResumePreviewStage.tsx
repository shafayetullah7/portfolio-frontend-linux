import type { JSX } from "solid-js";
import { A4_WIDTH_MM, useA4PageZoom } from "~/lib/resume/useA4PageZoom";

interface ResumePreviewStageProps {
  id?: string;
  children: JSX.Element;
}

export function ResumePreviewStage(props: ResumePreviewStageProps) {
  let scrollRef: HTMLDivElement | undefined;
  const pageZoom = useA4PageZoom(() => scrollRef);

  return (
    <main
      id={props.id}
      class="resume-preview-stage flex w-full min-h-0 flex-1 flex-col"
    >
      <div
        ref={scrollRef}
        class="w-full min-h-0 flex-1 overflow-auto bg-gray-200 p-4 sm:p-6 md:p-8 print:bg-white print:p-0"
      >
        <div class="flex w-full justify-center">
          <div
            class="relative overflow-hidden bg-white shadow-md print:bg-white print:shadow-none"
            style={{
              width: `${A4_WIDTH_MM}mm`,
              zoom: pageZoom(),
            }}
          >
            <div class="w-full bg-white print:m-0 print:p-0">{props.children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
