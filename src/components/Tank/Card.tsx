import { FlagName } from "~/data/flag_type";
import { SymbolName } from "~/data/symbol_type";
import { TankName } from "~/data/tank_type";
import { Flag } from "../Icons/Flag";
import { Symbol } from "../Icons/Symbol";
import { Tank } from "../Icons/Tank";

export function TankCard({
  tank,
}: {
  tank: (typeof import("~/data/record").TankRecord)[TankName];
}) {
  return (
    <div class="border-base-300 flex items-center gap-5 rounded-2xl border p-5 shadow-md">
      <button class="btn btn-primary btn-circle btn-sm pointer-events-none">
        {tank.Tier}
      </button>
      <Symbol variant={`font-class-${tank.vehicle_class_icon}` as SymbolName} />
      <Flag country={`flag_${tank.nation_icon}` as FlagName} size="md" />
      <Tank tank={tank.tank_key} />
      <div class="badge badge-primary h-fit w-fit">{tank.data.name}</div>
    </div>
  );
}
