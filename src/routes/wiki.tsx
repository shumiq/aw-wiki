import { Title } from "@solidjs/meta";
import {
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
} from "solid-icons/tb";
import { createEffect, createSignal, For } from "solid-js";
import { TankCard } from "~/components/Tank/Card";
import Tanks from "~/data/wiki_data.json";
import { getBestDPM } from "~/utils/ranking";

const ITEMS_PER_PAGE = 10;

export default function Wiki() {
  const [page, setPage] = createSignal(1);
  const maxPages = Math.ceil(Tanks.length / ITEMS_PER_PAGE);
  let ref: HTMLDivElement | undefined;
  createEffect(() => {
    page();
    if (ref) {
      ref.scrollIntoView({ behavior: "instant", block: "start" });
    }
  });
  return (
    <div ref={ref} class="flex w-full flex-col gap-5 p-5">
      <Title>AW Wiki - Tanks</Title>
      <For
        each={Tanks.slice(
          (page() - 1) * ITEMS_PER_PAGE,
          page() * ITEMS_PER_PAGE,
        )}
      >
        {(tank) => <TankCard tank={tank} />}
      </For>
      <div class="sticky bottom-[20px] flex">
        <div class="join mx-auto flex items-center rounded-xl bg-black/50">
          <button
            class="btn btn-square btn-ghost rounded-xl"
            onclick={() => setPage(1)}
            disabled={page() === 1}
          >
            <TbChevronsLeft />
          </button>
          <button
            class="btn btn-square btn-ghost rounded-xl"
            onclick={() => setPage(page() - 1)}
            disabled={page() === 1}
          >
            <TbChevronLeft />
          </button>
          <select
            class="select select-ghost select-sm"
            onchange={(e) => setPage(Number(e.target.value))}
          >
            <For each={Array.from({ length: maxPages }, (_, i) => i + 1)}>
              {(p) => (
                <option value={p} selected={page() === p}>
                  {p}
                </option>
              )}
            </For>
          </select>
          <button
            class="btn btn-square btn-ghost rounded-xl"
            onclick={() => setPage(page() + 1)}
            disabled={page() === maxPages}
          >
            <TbChevronRight />
          </button>
          <button
            class="btn btn-square btn-ghost rounded-xl"
            onclick={() => setPage(maxPages)}
            disabled={page() === maxPages}
          >
            <TbChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
}
