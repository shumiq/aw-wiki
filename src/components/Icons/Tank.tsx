import { TankName } from "~/data/tank_type";

export default function Tank({
  tank,
  class: className,
}: {
  tank: TankName;
  class?: string;
}) {
  return <i class={`tanksm inline-block ${tank} ${className ?? ""}`.trim()} />;
}
