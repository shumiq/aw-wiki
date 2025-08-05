import { Title } from "@solidjs/meta";
import { For } from "solid-js";
import { TankRecord } from "~/data/record";

export default function Wiki() {
  return (
    <div class="flex w-full flex-col gap-2">
      <Title>AW Wiki - Tanks</Title>
      <For each={Object.values(TankRecord)}>
        {(record) => <div class="translate">{record.title}</div>}
      </For>
    </div>
  );
}
