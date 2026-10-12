import { Show } from "solid-js";
import {
  hasResumeContact,
  isResumeSectionVisible,
} from "~/lib/resume/resume-visibility";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { ResumeCertifications } from "../sections/ResumeCertifications";
import { ResumeContact } from "../sections/ResumeContact";
import { ResumeEducation } from "../sections/ResumeEducation";
import { ResumeExperience } from "../sections/ResumeExperience";
import { ResumeInterests } from "../sections/ResumeInterests";
import { ResumeLanguages } from "../sections/ResumeLanguages";
import { ResumeProjects } from "../sections/ResumeProjects";
import { ResumeSkills } from "../sections/ResumeSkills";
import { ResumeSummary } from "../sections/ResumeSummary";
import { sectionHeaderClass } from "./documentTypography";
import { ModernSplitSection } from "./ModernSplitSection";
import { MODERN_SPLIT_SECTION_LABELS } from "./section-labels";
import { getSidebarTokens, modernSplitTokens } from "./tokens";

const DOC_FONT =
  "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif";

interface ModernSplitDocumentProps {
  doc: ResumeDocument;
}

export default function ModernSplitDocument(props: ModernSplitDocumentProps) {
  const doc = () => props.doc;
  const personal = () => doc().personal;
  const tokens = modernSplitTokens;
  const sidebarTokens = () => getSidebarTokens(tokens);
  const layout = { hideHeading: true, bare: true };

  return (
    <div
      class="modern-split-doc w-full bg-white text-gray-800 box-border"
      style={{
        "font-family": DOC_FONT,
        "-webkit-font-smoothing": "auto",
        "-moz-osx-font-smoothing": "auto",
      }}
    >
      <div class="flex min-h-0">
        <div
          class={`w-1/3 ${tokens.sidebarBg} print:bg-white ${tokens.padding} flex flex-col border-r border-gray-300`}
        >
          <div class="border-b border-gray-200 pb-2 mb-2.5">
            <h1
              class={`${tokens.typography.display} font-bold leading-tight`}
              style={{ color: tokens.accent }}
            >
              {personal().fullName}
            </h1>
            <Show when={personal().jobTitle}>
              <p
                class={`${tokens.typography.body} font-semibold mt-0.5`}
                style={{ color: tokens.accent }}
              >
                {personal().jobTitle}
              </p>
            </Show>
            <Show when={hasResumeContact(doc())}>
              <ResumeContact personal={personal()} {...layout} />
            </Show>
          </div>

          <Show when={isResumeSectionVisible(doc(), "skills")}>
            <ModernSplitSection
              label={MODERN_SPLIT_SECTION_LABELS.skills}
              tokens={sidebarTokens()}
            >
              <ResumeSkills skills={doc().skills} {...layout} />
            </ModernSplitSection>
          </Show>

          <Show when={isResumeSectionVisible(doc(), "education")}>
            <ModernSplitSection
              label={MODERN_SPLIT_SECTION_LABELS.education}
              tokens={sidebarTokens()}
            >
              <ResumeEducation education={doc().education} {...layout} />
            </ModernSplitSection>
          </Show>

          <Show when={isResumeSectionVisible(doc(), "certifications")}>
            <ModernSplitSection
              label={MODERN_SPLIT_SECTION_LABELS.certifications}
              tokens={sidebarTokens()}
            >
              <ResumeCertifications certifications={doc().certifications} {...layout} />
            </ModernSplitSection>
          </Show>

          <Show when={isResumeSectionVisible(doc(), "languages")}>
            <ModernSplitSection
              label={MODERN_SPLIT_SECTION_LABELS.languages}
              tokens={sidebarTokens()}
            >
              <ResumeLanguages languages={doc().languages} {...layout} />
            </ModernSplitSection>
          </Show>

          <Show when={isResumeSectionVisible(doc(), "interests")}>
            <ModernSplitSection
              label={MODERN_SPLIT_SECTION_LABELS.interests}
              tokens={sidebarTokens()}
            >
              <ResumeInterests interests={doc().interests} {...layout} />
            </ModernSplitSection>
          </Show>
        </div>

        <div class={`w-2/3 ${tokens.padding} flex flex-col`}>
          <Show when={isResumeSectionVisible(doc(), "summary")}>
            <ModernSplitSection
              label={MODERN_SPLIT_SECTION_LABELS.profile}
              tokens={tokens}
              headerClass={`${sectionHeaderClass(tokens.typography, tokens.sectionHeaderSpacing)} flex items-center gap-2`}
            >
              <ResumeSummary summary={personal().summary} {...layout} />
            </ModernSplitSection>
          </Show>

          <Show when={isResumeSectionVisible(doc(), "experience")}>
            <ModernSplitSection
              label={MODERN_SPLIT_SECTION_LABELS.experience}
              tokens={tokens}
            >
              <ResumeExperience experience={doc().experience} {...layout} />
            </ModernSplitSection>
          </Show>

          <Show when={isResumeSectionVisible(doc(), "projects")}>
            <ModernSplitSection
              label={MODERN_SPLIT_SECTION_LABELS.projects}
              tokens={tokens}
            >
              <ResumeProjects projects={doc().projects} {...layout} />
            </ModernSplitSection>
          </Show>
        </div>
      </div>
    </div>
  );
}
