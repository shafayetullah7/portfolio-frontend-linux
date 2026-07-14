interface MetricChipProps {
  value: string;
  label: string;
  class?: string;
}

export default function MetricChip(props: MetricChipProps) {
  return (
    <div class={`flex min-w-[8rem] flex-col gap-1.5 ${props.class ?? ""}`}>
      <span class="text-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-none text-bf-text">
        {props.value}
      </span>
      <span class="text-caption uppercase tracking-[0.12em] text-bf-text-muted">{props.label}</span>
    </div>
  );
}
