import { For } from "solid-js";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";

interface FeatureListEditorProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export default function FeatureListEditor(props: FeatureListEditorProps) {
  const update = (index: number, value: string) => {
    const next = [...props.items];
    next[index] = value;
    props.onChange(next);
  };

  const add = () => props.onChange([...props.items, ""]);
  const remove = (index: number) =>
    props.onChange(props.items.filter((_, i) => i !== index));

  const move = (index: number, dir: -1 | 1) => {
    const next = [...props.items];
    const swap = index + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    props.onChange(next);
  };

  return (
    <div class="space-y-2">
      <p class="text-caption text-bf-text-muted">{props.label}</p>
      <For each={props.items}>
        {(item, index) => (
          <div class="flex flex-wrap gap-2">
            <Input
              class="min-w-0 flex-1"
              placeholder={props.placeholder}
              value={item}
              onInput={(e) => update(index(), e.currentTarget.value)}
            />
            <Button type="button" variant="ghost" onClick={() => move(index(), -1)}>
              ↑
            </Button>
            <Button type="button" variant="ghost" onClick={() => move(index(), 1)}>
              ↓
            </Button>
            <Button type="button" variant="danger" onClick={() => remove(index())}>
              −
            </Button>
          </div>
        )}
      </For>
      <Button type="button" variant="ghost" onClick={add}>
        + Add feature
      </Button>
    </div>
  );
}
