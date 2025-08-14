import { createSignal } from "solid-js";
import Tanks from "~/data/wiki_data.json";
export const useFilter = () => {
  const [filter, setFilter] = createSignal<string[]>([]);
  const [classFilter, setClassFilter] = createSignal<Record<string, boolean>>({
    MBT: true,
    AFV: true,
    TD: true,
    LT: true,
    SPG: true,
  });
  const [tierFilter, setTierFilter] = createSignal<Record<string, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
  });
  return {
    filter: () => filter().join(", ").trim(),
    setFilter: (f: string) =>
      setFilter(f.split(" ").map((c) => c.trim().toLowerCase())),
    addFilter: (f: string) =>
      !filter().includes(f.toLowerCase()) && setFilter([...filter(), f]),
    removeFilter: (f: string) =>
      filter().includes(f.toLowerCase()) &&
      setFilter(filter().filter((c) => c !== f.toLowerCase())),
    classFilter: classFilter,
    setClassFilter: (c: keyof ReturnType<typeof classFilter>, show: boolean) =>
      setClassFilter({ ...classFilter(), [c]: show }),
    tierFilter: tierFilter,
    setTierFilter: (t: keyof ReturnType<typeof tierFilter>, show: boolean) =>
      setTierFilter({ ...tierFilter(), [t]: show }),
    results: () =>
      Tanks.filter((tank) => {
        if (!classFilter()[tank.class]) return false;
        if (!tierFilter()[String(tank.tier)]) return false;
        const searchKey = JSON.stringify(tank).toLowerCase();
        return filter().every((f) => searchKey.includes(f.toLowerCase()));
      }),
    reset: () => {
      setFilter([]);
      setClassFilter({
        MBT: true,
        AFV: true,
        TD: true,
        LT: true,
        SPG: true,
      });
      setTierFilter({
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
        9: true,
        10: true,
      });
    },
  };
};
