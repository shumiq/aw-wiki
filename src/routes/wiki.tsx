import { Title } from "@solidjs/meta";
import { For } from "solid-js";
import { TankCard } from "~/components/Tank/Card";
import { TankRecord } from "~/data/record";

export default function Wiki() {
  return (
    <div class="flex w-full flex-col gap-5 p-5">
      <Title>AW Wiki - Tanks</Title>
      <For each={Object.values(TankRecord)}>
        {(record) => (
          <div class="translate">
            <TankCard tank={record} />
          </div>
        )}
      </For>
    </div>
  );
}
