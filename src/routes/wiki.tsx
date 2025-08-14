import { Title } from "@solidjs/meta";
import {
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
} from "solid-icons/tb";
import { createEffect, createSignal, For, Show } from "solid-js";
import { TankCard } from "~/components/Tank/Card";
import Tanks from "~/data/wiki_data.json";
import { useFilter } from "~/utils/filter";

const ITEMS_PER_PAGE = 10;

export default function Wiki() {
  const [page, setPage] = createSignal(1);
  const {
    classFilter,
    setClassFilter,
    tierFilter,
    setTierFilter,
    setFilter,
    results: tanks,
    reset,
  } = useFilter();
  const [maxPages, setMaxPages] = createSignal(
    Math.ceil(tanks().length / ITEMS_PER_PAGE),
  );
  createEffect(() => {
    setMaxPages(Math.ceil(tanks().length / ITEMS_PER_PAGE));
  });
  let ref: HTMLDivElement | undefined;
  createEffect(() => {
    page();
    if (ref) {
      ref.scrollIntoView({ behavior: "instant", block: "start" });
    }
  });
  createEffect(() => {
    tanks();
    setPage(1);
  });
  return (
    <div ref={ref} class="flex w-full flex-col gap-5 p-5">
      <Title>AW Wiki - Tanks</Title>
      <div class="mx-auto flex flex-col gap-1">
        <div class="mx-auto flex gap-1">
          <For each={Object.keys(classFilter())}>
            {(c) => (
              <span
                class={`badge cursor-pointer ${classFilter()[c] ? "badge-primary" : ""}`}
                onclick={() => setClassFilter(c, !classFilter()[c])}
              >
                {c}
              </span>
            )}
          </For>
        </div>
        <div class="mx-auto flex gap-1">
          <For each={Object.keys(tierFilter())}>
            {(tier) => (
              <span
                class={`badge cursor-pointer ${tierFilter()[tier] ? "badge-secondary" : ""}`}
                onclick={() => setTierFilter(tier, !tierFilter()[tier])}
              >
                {tier}
              </span>
            )}
          </For>
        </div>
        <input
          type="search"
          placeholder="Search"
          class="input input-bordered w-lg"
          onkeydown={(e) => {
            if (e.key === "Enter") {
              setFilter(e.currentTarget.value);
              e.currentTarget.blur();
            } else {
              const el = e.currentTarget;
              setTimeout(() => {
                setFilter(el.value);
              }, 0);
            }
          }}
        />
        <div class="mx-auto flex gap-1">
          <span class="badge badge-soft">found {tanks().length} tanks</span>
          <Show when={tanks().length < Tanks.length}>
            <button
              class="btn btn-xs"
              onclick={() => {
                reset();
                document.querySelector("input")!.value = "";
              }}
            >
              clear
            </button>
          </Show>
        </div>
      </div>
      <For
        each={tanks().slice(
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
            onchange={(e) => e.target.value && setPage(Number(e.target.value))}
          >
            <Show when={maxPages() === 0}>
              <option value="" disabled selected>
                No results
              </option>
            </Show>
            <For each={Array.from({ length: maxPages() }, (_, i) => i + 1)}>
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
            disabled={page() >= maxPages()}
          >
            <TbChevronRight />
          </button>
          <button
            class="btn btn-square btn-ghost rounded-xl"
            onclick={() => setPage(maxPages())}
            disabled={page() >= maxPages()}
          >
            <TbChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
}
