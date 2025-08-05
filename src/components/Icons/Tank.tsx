import { TankName } from "~/data/tank_type";

export function Tank({
  tank,
  class: className,
}: {
  tank: TankName;
  class?: string;
}) {
  return (
    <i
      class={`tanksm inline-block ${tank} m-0! p-0! ${className ?? ""}`.trim()}
    />
  );
}
