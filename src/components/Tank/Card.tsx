import { For } from "solid-js";
import {
  getAgilityRank,
  getArmorRank,
  getBestAgility,
  getBestArmor,
  getBestDamage,
  getBestDPM,
  getDamangeRank,
  getDPMRank,
  getHighestSpeed,
  getSpeedRank,
} from "~/utils/ranking";

export function TankCard({
  tank,
}: {
  tank: (typeof import("~/data/wiki_data.json"))[number];
}) {
  return (
    <div class="border-base-300/50 rounded-2xl border shadow-lg">
      <div class="flex items-center gap-5 p-5">
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
          <div>
            <For each={tank.traits}>
              {(trait) => (
                <div class="badge badge-soft badge-xs mr-1 mb-1 h-fit w-fit">
                  {trait}
                </div>
              )}
            </For>
          </div>
        </div>
        <div class="flex flex-1 items-start justify-end gap-1">
          <Rank
            label="1-SHOT"
            rank={getDamangeRank(tank)}
            value={new Intl.NumberFormat().format(
              Math.round(getBestDamage(tank)),
            )}
          />
          <Rank
            label="DPM"
            rank={getDPMRank(tank)}
            value={new Intl.NumberFormat().format(Math.round(getBestDPM(tank)))}
          />
          <Rank
            label="Armor"
            rank={getArmorRank(tank)}
            value={`hull ${new Intl.NumberFormat().format(Math.round(getBestArmor(tank).hull))}mm${getBestArmor(tank).turret ? `, turret ${new Intl.NumberFormat().format(Math.round(getBestArmor(tank).turret))}mm` : ""}`}
          />
          <Rank
            label="Agility"
            rank={getAgilityRank(tank)}
            value={`${getBestAgility(tank).toFixed(1)}s to 32km/h`}
          />
          <Rank
            label="Speed"
            rank={getSpeedRank(tank)}
            value={`${getHighestSpeed(tank).timeToTop}s to ${getHighestSpeed(tank).topSpeed}km/h`}
          />
        </div>
      </div>
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
    S: "btn btn-square text-[18px] text-yellow-400",
    A: "btn btn-square text-[18px] text-gray-300",
    default: "btn btn-square text-[18px] text-orange-700",
  } as Record<string, string>;
  return (
    <div class="flex h-full flex-col items-center justify-center leading-none">
      <div class="badge badge-xs badge-soft my-2">{label}</div>
      <div class="tooltip tooltip-bottom" data-tip={value}>
        <button class={rankStyle[rank] ?? rankStyle["default"]}>{rank}</button>
      </div>
    </div>
  );
};
