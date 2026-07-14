interface MetricChipProps {
  value: string;
  label: string;
  class?: string;
}

export default function MetricChip(props: MetricChipProps) {
  return (
    <div class={`flex flex-col gap-1 ${props.class ?? ""}`}>
      <span class="text-heading text-bf-text">{props.value}</span>
      <span class="text-caption uppercase tracking-wide">{props.label}</span>
    </div>
  );
}
