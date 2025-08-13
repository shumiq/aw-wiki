export function TankCard({
  tank,
}: {
  tank: (typeof import("~/data/wiki_data.json"))[number];
}) {
  return (
    <div class="border-base-300 flex items-center gap-5 rounded-2xl border p-5 shadow-md">
      <button class="btn btn-primary btn-circle btn-sm btn-outline pointer-events-none">
        {tank.tier}
      </button>
      <div class="badge badge-primary badge-soft h-fit w-fit">{tank.class}</div>
      <img src={tank.flag_icon} class="w-12" />
      <img src={tank.icon} class="w-12" />
      <div class="badge badge-primary badge-soft h-fit w-fit">{tank.name}</div>
    </div>
  );
}
