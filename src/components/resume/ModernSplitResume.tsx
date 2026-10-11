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

interface ModernSplitResumeProps {
  doc: ResumeDocument;
}

export default function ModernSplitResume(props: ModernSplitResumeProps) {
  const doc = () => props.doc;
  const personal = () => doc().personal;

  return (
    <div class="resume-doc">
      <div class="resume-doc__page">
        <div class="resume-doc__split">
          <aside class="resume-doc__sidebar" aria-label="Resume sidebar">
            <header class="resume-identity">
              <h1 class="resume-doc__name">{personal().fullName}</h1>
              <Show when={personal().jobTitle}>
                <p class="resume-doc__title">{personal().jobTitle}</p>
              </Show>
            </header>

            <Show when={hasResumeContact(doc())}>
              <ResumeContact personal={personal()} />
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
          </aside>

          <div class="resume-doc__main" aria-label="Resume main">
            <Show when={isResumeSectionVisible(doc(), "summary")}>
              <ResumeSummary summary={personal().summary} />
            </Show>

            <Show when={isResumeSectionVisible(doc(), "experience")}>
              <ResumeExperience experience={doc().experience} />
            </Show>

            <Show when={isResumeSectionVisible(doc(), "projects")}>
              <ResumeProjects projects={doc().projects} />
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}
