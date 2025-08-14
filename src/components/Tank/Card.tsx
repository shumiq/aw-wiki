import { For, Show } from "solid-js";
import { getDPMRank, getHighestDPM } from "~/utils/ranking";

export function TankCard({
  tank,
}: {
  tank: (typeof import("~/data/wiki_data.json"))[number];
}) {
  return (
    <div class="border-base-300/50 collapse rounded-2xl border shadow-lg">
      <input type="radio" name="tank-card" class="my-5" />
      <div class="collapse-title flex items-center gap-5">
        <div class="flex flex-col items-center justify-center gap-2">
          <button class="btn btn-primary btn-circle btn-sm btn-outline pointer-events-none">
            {tank.tier}
          </button>
          <div class="badge badge-primary badge-soft h-fit w-fit">
            {tank.class}
          </div>
        </div>
        <img src={tank.icon} class="h-full" />
        <div class="flex flex-col justify-center gap-2">
          <div class="flex items-center gap-2">
            <img src={tank.flag_icon} class="h-5" />
            <div class="badge badge-primary badge-soft h-fit w-fit">
              {tank.name}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <For each={tank.traits}>
              {(trait) => (
                <div class="badge badge-soft badge-xs h-fit w-fit">{trait}</div>
              )}
            </For>
          </div>
        </div>
        <div class="flex flex-1 justify-end">
          <Rank
            label="DPM"
            rank={getDPMRank(tank)}
            value={getHighestDPM(tank)}
          />
        </div>
      </div>
      <div class="collapse-content"></div>
    </div>
  );
}

const Rank = ({
  label,
  rank,
  value,
}: {
  label: string;
  rank: string;
  value?: string | number;
}) => {
  const rankStyle = {
    S: "text-[28px] text-yellow-400",
    A: "text-[18px] text-gray-300",
    default: "text-[18px] text-orange-700",
  } as Record<string, string>;
  return (
    <div class="flex flex-col items-center justify-center leading-none">
      <div class="badge badge-xs badge-soft my-2">{label}</div>
      <div class={rankStyle[rank] ?? rankStyle["default"]}>{rank}</div>
      <Show when={Boolean(value)}>
        <div class={`${rankStyle[rank] ?? rankStyle["default"]} text-[10px]!`}>
          {typeof value === "number"
            ? new Intl.NumberFormat().format(Math.round(value))
            : value}
        </div>
      </Show>
    </div>
  );
};
