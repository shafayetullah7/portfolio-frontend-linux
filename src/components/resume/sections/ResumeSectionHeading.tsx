interface ResumeSectionHeadingProps {
  title: string;
}

export function ResumeSectionHeading(props: ResumeSectionHeadingProps) {
  return <h2 class="resume-section__heading">{props.title}</h2>;
}
