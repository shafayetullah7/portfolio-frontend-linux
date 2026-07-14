interface PhilosophyCardProps {
  title: string;
  body: string;
  icon?: string;
}

export default function PhilosophyCard(props: PhilosophyCardProps) {
  return (
    <article class="flex flex-col border border-bf-border bg-bf-surface p-5 transition-colors hover:border-bf-accent/35 sm:min-h-[11rem] sm:p-6">
      <span class="text-caption font-semibold tracking-wider text-bf-accent" aria-hidden="true">
        [{props.icon ?? "•"}]
      </span>
      <h3 class="mt-4 text-heading text-bf-text">{props.title}</h3>
      <p class="mt-2 flex-1 text-body text-bf-text-muted">{props.body}</p>
    </article>
  );
}
