import { FlagName } from "~/data/flag_type";

const sizeMap = {
  sm: "w-[20px] h-[12px]",
  md: "w-[41px] h-[24px]",
  lg: "w-[144px] h-[66px]",
};

export function Flag({
  country,
  size = "md",
  class: className,
}: {
  country: FlagName;
  size?: "sm" | "md" | "lg";
  class?: string;
}) {
  return (
    <i class={`${country} inline-block ${sizeMap[size]} ${className ?? ""}`} />
  );
}
