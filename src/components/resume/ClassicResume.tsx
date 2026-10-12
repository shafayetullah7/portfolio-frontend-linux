import { Show } from "solid-js";
import {
  hasResumeContact,
  isResumeSectionVisible,
} from "~/lib/resume/resume-visibility";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { ResumeCertifications } from "./sections/ResumeCertifications";
import { ResumeContact } from "./sections/ResumeContact";
import { ResumeEducation } from "./sections/ResumeEducation";
import { ResumeExperience } from "./sections/ResumeExperience";
import { ResumeInterests } from "./sections/ResumeInterests";
import { ResumeLanguages } from "./sections/ResumeLanguages";
import { ResumeProjects } from "./sections/ResumeProjects";
import { ResumeSkills } from "./sections/ResumeSkills";
import { ResumeSummary } from "./sections/ResumeSummary";

interface ClassicResumeProps {
  doc: ResumeDocument;
}

/** Single-column layout for print-friendly reading order (companion to Modern Split). */
export default function ClassicResume(props: ClassicResumeProps) {
  const doc = () => props.doc;
  const personal = () => doc().personal;

  return (
    <div class="resume-doc resume-doc--classic">
      <div class="resume-doc__page">
        <header class="resume-identity">
          <h1 class="resume-doc__name">{personal().fullName}</h1>
          <Show when={personal().jobTitle}>
            <p class="resume-doc__title">{personal().jobTitle}</p>
          </Show>
        </header>

        <Show when={hasResumeContact(doc())}>
          <ResumeContact personal={personal()} />
        </Show>

        <Show when={isResumeSectionVisible(doc(), "summary")}>
          <ResumeSummary summary={personal().summary} />
        </Show>

        <Show when={isResumeSectionVisible(doc(), "experience")}>
          <ResumeExperience experience={doc().experience} />
        </Show>

        <Show when={isResumeSectionVisible(doc(), "projects")}>
          <ResumeProjects projects={doc().projects} />
        </Show>

        <Show when={isResumeSectionVisible(doc(), "skills")}>
          <ResumeSkills skills={doc().skills} />
        </Show>

        <Show when={isResumeSectionVisible(doc(), "education")}>
          <ResumeEducation education={doc().education} />
        </Show>

        <Show when={isResumeSectionVisible(doc(), "certifications")}>
          <ResumeCertifications certifications={doc().certifications} />
        </Show>

        <Show when={isResumeSectionVisible(doc(), "languages")}>
          <ResumeLanguages languages={doc().languages} />
        </Show>

        <Show when={isResumeSectionVisible(doc(), "interests")}>
          <ResumeInterests interests={doc().interests} />
        </Show>
      </div>
    </div>
  );
}
