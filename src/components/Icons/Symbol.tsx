import { SymbolName } from "~/data/symbol_type";

export default function Symbol({
  variant,
  class: className,
}: {
  variant: SymbolName;
  class?: string;
}) {
  return <i class={`inline-block ${variant} ${className ?? ""}`.trim()} />;
}
