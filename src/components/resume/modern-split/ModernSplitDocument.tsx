import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { isResumeSectionVisible } from "~/lib/resume/resume-visibility";
import { MODERN_SPLIT_SECTION_LABELS } from "./section-labels";
import { getSidebarTokens, modernSplitTokens } from "./tokens";
import { CertificationsSection } from "./sections/CertificationsSection";
import { EducationSection } from "./sections/EducationSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { IdentityBlock } from "./sections/IdentityBlock";
import { InterestsSection } from "./sections/InterestsSection";
import { LanguagesSection } from "./sections/LanguagesSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { SkillsSection } from "./sections/SkillsSection";
import { SummarySection } from "./sections/SummarySection";

const DOC_FONT =
  "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif";

interface ModernSplitDocumentProps {
  doc: ResumeDocument;
}

export default function ModernSplitDocument(props: ModernSplitDocumentProps) {
  const doc = () => props.doc;
  const tokens = modernSplitTokens;
  const sidebarTokens = () => getSidebarTokens(tokens);
  const vis = (key: keyof ResumeDocument["meta"]["sectionVisibility"]) =>
    isResumeSectionVisible(doc(), key);

  return (
    <div
      class="modern-split-doc w-full bg-white text-gray-800 box-border"
      style={{ "font-family": DOC_FONT }}
    >
      <div class="flex min-h-0">
        <div
          class={`w-1/3 ${tokens.sidebarBg} print:bg-white ${tokens.padding} flex flex-col border-r border-gray-300`}
        >
          <IdentityBlock personal={doc().personal} tokens={sidebarTokens()} />

          <SkillsSection
            skills={doc().skills}
            label={MODERN_SPLIT_SECTION_LABELS.skills}
            tokens={sidebarTokens()}
            visible={vis("skills")}
          />
          <EducationSection
            education={doc().education}
            label={MODERN_SPLIT_SECTION_LABELS.education}
            tokens={sidebarTokens()}
            visible={vis("education")}
          />
          <CertificationsSection
            certifications={doc().certifications}
            label={MODERN_SPLIT_SECTION_LABELS.certifications}
            tokens={sidebarTokens()}
            visible={vis("certifications")}
          />
          <LanguagesSection
            languages={doc().languages}
            label={MODERN_SPLIT_SECTION_LABELS.languages}
            tokens={sidebarTokens()}
            visible={vis("languages")}
          />
          <InterestsSection
            interests={doc().interests}
            label={MODERN_SPLIT_SECTION_LABELS.interests}
            tokens={sidebarTokens()}
            visible={vis("interests")}
          />
        </div>

        <div class={`w-2/3 ${tokens.padding} flex flex-col`}>
          <SummarySection
            summary={doc().personal.summary}
            label={MODERN_SPLIT_SECTION_LABELS.profile}
            tokens={tokens}
            visible={vis("summary")}
          />
          <ExperienceSection
            experience={doc().experience}
            label={MODERN_SPLIT_SECTION_LABELS.experience}
            tokens={tokens}
            visible={vis("experience")}
          />
          <ProjectsSection
            projects={doc().projects}
            label={MODERN_SPLIT_SECTION_LABELS.projects}
            tokens={tokens}
            visible={vis("projects")}
          />
        </div>
      </div>
    </div>
  );
}
