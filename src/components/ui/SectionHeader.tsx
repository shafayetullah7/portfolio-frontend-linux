interface SectionHeaderProps {
  title: string;
  caption?: string;
  class?: string;
}

export default function SectionHeader(props: SectionHeaderProps) {
  return (
    <div class={`mb-8 ${props.class ?? ""}`}>
      <h2 class="text-heading text-bf-text">{props.title}</h2>
      {props.caption ? <p class="mt-2 text-caption">{props.caption}</p> : null}
    </div>
  );
}
