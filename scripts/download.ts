import { mkdirSync, writeFileSync } from "fs";
import { JSDOM } from "jsdom";

const ROOT = `./src/data`;
mkdirSync(ROOT, { recursive: true });

async function downloadData() {
  const html = await fetch(
    "https://armoredwarfare.fandom.com/wiki/Vehicles",
  ).then((r) => r.text());
  const { window } = new JSDOM(html);
  const { document } = window;
  let count = 0;
  const data = await Promise.all(
    [...document.querySelectorAll("tr")]
      .map((el) => ({
        name:
          el
            .querySelector("td:first-child a:nth-child(3)")
            ?.textContent?.trim() ?? "",
        image:
          el
            .querySelector("td:first-child a:nth-child(1)")
            ?.getAttribute("href")
            ?.replace("https://static.wikia.nocookie.net", "") ?? "",
        icon:
          el
            .querySelector("td:first-child img")
            ?.getAttribute("data-src")
            ?.replace("https://static.wikia.nocookie.net", "") ?? "",
        flag_icon:
          el
            .querySelector("td:nth-child(4) img")
            ?.getAttribute("data-src")
            ?.replace("https://static.wikia.nocookie.net", "") ?? "",
        link:
          "https://armoredwarfare.fandom.com" +
          (el
            .querySelector("td:first-child a:nth-child(3)")
            ?.getAttribute("href") ?? ""),
        tier: Number(
          el.querySelector("td:nth-child(2)")?.textContent?.trim() ?? 0,
        ),
        dealer: el.querySelector("td:nth-child(3)")?.textContent?.trim() ?? "",
        traits: (el.querySelector("td:nth-child(6)")?.innerHTML?.trim() ?? "")
          .split("<br>")
          .map((t) => t.trim())
          .filter(Boolean),
      }))
      .filter((t) => t.name)
      .map(async (tank) => {
        // if (tank.name !== "XM1A3") return tank;
        // if (tank.name !== "Derivatsiya") return tank;
        // if (tank.name !== "Boxer RIWP") return tank;
        // if (tank.name !== "Merkava 4M") return tank;
        // if (tank.name !== "Object 287") return tank;
        const info = await fetch(tank.link).then((r) => r.text());
        console.log(`Download tank data [${++count}]: ${tank.name}`);
        const { window } = new JSDOM(info);
        const { document } = window;
        return {
          ...tank,
          class:
            document
              .querySelector("div[data-source='tier'] a")
              ?.textContent?.trim() ?? "",
          nation:
            document
              .querySelector("div[data-source='nation'] div")
              ?.textContent?.trim() ?? "",
          hp: Number(
            document
              .querySelector("div[data-source='hp'] div")
              ?.textContent?.trim()
              .replaceAll(",", "") ?? 0,
          ),
          ammos: [
            ...([...document.querySelectorAll("table.wikitable")]
              .filter(
                (t) =>
                  t.previousElementSibling?.textContent?.trim() ===
                  "Ammunition[]",
              )?.[0]
              ?.querySelectorAll("tr") ?? []),
          ]
            .slice(1)
            .map((el, i) => {
              if (i % 2) return undefined;
              const ammo = {
                name:
                  el
                    .querySelector("td:nth-child(2)")
                    ?.textContent?.split("[")?.[0]
                    ?.trim() ?? "",
                type:
                  el
                    .querySelector("td:nth-child(3)")
                    ?.textContent?.split("[")?.[0]
                    ?.trim() ?? "",
                damage:
                  Number(
                    el
                      .querySelector("td:nth-child(5)")
                      ?.textContent?.split("[")?.[0]
                      ?.trim()
                      ?.replace(",", "") ?? 0,
                  ) || 0,
                penetration:
                  Number(
                    el
                      .querySelector("td:nth-child(6)")
                      ?.textContent?.split("[")?.[0]
                      ?.split("mm")?.[0]
                      ?.trim()
                      ?.replace(",", "") ?? 0,
                  ) || 0,
                reload:
                  Number(
                    el
                      .querySelector("td:nth-child(8)")
                      ?.textContent?.split("[")?.[0]
                      ?.split("s")?.[0]
                      ?.trim()
                      ?.replace(",", "") ?? 0,
                  ) || 0,
                homing:
                  (el.nextElementSibling
                    ?.querySelector("td")
                    ?.textContent?.split("\n")
                    .map((s) => s.trim())
                    .filter((s) => s.startsWith("Self-Guided:"))?.[0]
                    ?.split(":")?.[1]
                    .split("[")?.[0]
                    ?.trim()
                    ?.toLowerCase() ?? "no") === "yes",
              } as Record<string, unknown>;
              const lines =
                el.nextElementSibling
                  ?.querySelector("td")
                  ?.textContent?.split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean) ?? [];
              let magazineType =
                lines
                  .filter((s) => s.startsWith("Magazine Type:"))?.[0]
                  ?.split(":")?.[1]
                  ?.split("[")?.[0]
                  ?.trim()
                  ?.toLowerCase() ??
                (lines.find((s) => s.startsWith("Shots Before Overheat:"))
                  ? "autocanon"
                  : "none");
              if (magazineType === "overheat") magazineType = "autocanon";
              if (magazineType === "clip") magazineType = "magazine";
              if (
                magazineType === "none" &&
                lines.find((s) => s.startsWith("Magazine Size:"))
              )
                magazineType = "magazine";
              ammo.magazine_type = magazineType;
              if (magazineType === "none") {
                ammo.rpm = Math.floor(60 / Number(ammo.reload));
                ammo.dpm = Number(ammo.damage) * Number(ammo.rpm);
              }
              if (
                magazineType === "ready rack" ||
                magazineType === "magazine"
              ) {
                ammo.magazine_size =
                  Number(
                    lines
                      .filter((s) => s.startsWith("Magazine Size:"))?.[0]
                      ?.split(":")?.[1]
                      .split("[")?.[0]
                      ?.replace(",", "")
                      ?.trim() ?? 1,
                  ) || 1;
                if (magazineType === "magazine") {
                  ammo.partial_reload =
                    (lines
                      .filter((s) => s.startsWith("Partial Reload:"))?.[0]
                      ?.split(":")?.[1]
                      .split("[")?.[0]
                      ?.trim()
                      ?.toLowerCase() ?? "no") === "yes";
                }
                ammo.reload_within_magazine =
                  Number(
                    lines
                      .filter((s) =>
                        s.startsWith("Reload within Magazine:"),
                      )?.[0]
                      ?.split(":")?.[1]
                      .split("[")?.[0]
                      ?.split("s")?.[0]
                      ?.trim() ?? 0,
                  ) ||
                  60 /
                    Number(
                      lines
                        .filter((s) => s.startsWith("Burst Fire Rate:"))?.[0]
                        ?.split(":")?.[1]
                        .split("[")?.[0]
                        ?.split("rd")?.[0]
                        ?.replace(",", "")
                        ?.trim() ?? Infinity,
                    ) ||
                  1;
                ammo.burst_rate =
                  Number(
                    lines
                      .filter((s) => s.startsWith("Burst Fire Rate:"))?.[0]
                      ?.split(":")?.[1]
                      .split("[")?.[0]
                      ?.split("rd")?.[0]
                      ?.replace(",", "")
                      ?.trim(),
                  ) ||
                  60 /
                    Number(
                      lines
                        .filter((s) =>
                          s.startsWith("Reload within Magazine:"),
                        )?.[0]
                        ?.split(":")?.[1]
                        .split("[")?.[0]
                        ?.split("s")?.[0]
                        ?.trim() ?? Infinity,
                    ) ||
                  60;
                if (magazineType === "magazine") {
                  if (Number(ammo.burst_rate) <= Number(ammo.magazine_size)) {
                    ammo.rpm = ammo.burst_rate;
                  } else {
                    ammo.rpm = Math.floor(
                      (Number(ammo.magazine_size) * 60) /
                        (Number(ammo.magazine_size) *
                          Number(ammo.reload_within_magazine) +
                          Number(ammo.reload)),
                    );
                  }
                  ammo.dpm = Number(ammo.damage) * Number(ammo.rpm);
                } else {
                  ammo.rpm = Math.floor(
                    Number(ammo.magazine_size) +
                      (60 -
                        Number(ammo.reload_within_magazine) *
                          Number(ammo.magazine_size)) /
                        Number(ammo.reload),
                  );
                  ammo.dpm = Number(ammo.damage) * Number(ammo.rpm);
                }
              }
              if (magazineType === "autocanon") {
                ammo.burst_rate =
                  Number(
                    lines
                      .filter((s) => s.startsWith("Burst Fire Rate:"))?.[0]
                      ?.split(":")?.[1]
                      .split("[")?.[0]
                      ?.split("rd")?.[0]
                      ?.replace(",", "")
                      ?.trim(),
                  ) || 60 / Number(ammo.reload);
                ammo.reload_within_magazine = 60 / Number(ammo.burst_rate);
                const shots =
                  Number(
                    lines
                      .filter((s) =>
                        s.startsWith("Shots Before Overheat:"),
                      )?.[0]
                      ?.split(":")?.[1]
                      .split("[")?.[0]
                      ?.replace(",", "")
                      ?.trim() ?? 0,
                  ) || 0;
                const cooldown =
                  Number(
                    lines
                      .filter((s) => s.startsWith("Cooldown Time:"))?.[0]
                      ?.split(":")?.[1]
                      .split("[")?.[0]
                      .split("s")?.[0]
                      ?.trim() ?? 0,
                  ) || 0;
                ammo.overheat = {
                  shots: shots,
                  cooldown: cooldown,
                };
                ammo.rpm = Math.floor(
                  (shots * 60) /
                    (shots * Number(ammo.reload_within_magazine) + cooldown),
                );
                ammo.dpm = Number(ammo.damage) * Number(ammo.rpm);
              }
              return ammo;
            })
            .filter(Boolean),
          armors: [
            ...([...document.querySelectorAll("table.wikitable")]
              .filter(
                (t) =>
                  t.previousElementSibling?.textContent?.trim() === "Armor[]",
              )?.[0]
              ?.querySelectorAll("tr") ?? []),
          ]
            .slice(1)
            .map((el) => ({
              name:
                el.querySelector("td:nth-child(1)")?.textContent?.trim() ?? "",
              hull: {
                ap:
                  Number(
                    el
                      .querySelector("td:nth-child(3)")
                      ?.textContent?.trim()
                      ?.split(" mm")?.[0]
                      ?.replaceAll(",", "") ?? 0,
                  ) || 0,
                heat:
                  Number(
                    el
                      .querySelector("td:nth-child(3)")
                      ?.textContent?.trim()
                      ?.split(" mm")?.[1]
                      ?.split(")")?.[1]
                      ?.replaceAll(",", "") ?? 0,
                  ) || 0,
              },
              turret: {
                ap:
                  Number(
                    el
                      .querySelector("td:nth-child(5)")
                      ?.textContent?.trim()
                      ?.split(" mm")?.[0]
                      ?.replaceAll(",", "") ?? 0,
                  ) || 0,
                heat:
                  Number(
                    el
                      .querySelector("td:nth-child(5)")
                      ?.textContent?.trim()
                      ?.split(" mm")?.[1]
                      ?.split(")")?.[1]
                      ?.replaceAll(",", "") ?? 0,
                  ) || 0,
              },
              era:
                el.querySelector("td:nth-child(7)")?.textContent?.trim() ??
                "N/A",
            }))
            .filter((armor) => armor.hull.ap),
          weapons: [
            ...([...document.querySelectorAll("table.wikitable")]
              .filter(
                (t) =>
                  t.previousElementSibling?.textContent?.trim() === "Weapon[]",
              )?.[0]
              ?.querySelectorAll("tr") ?? []),
          ]
            .slice(1)
            .map((el, i) =>
              i % 2
                ? undefined
                : {
                    name:
                      el
                        .querySelector("td:nth-child(2)")
                        ?.innerHTML?.trim()
                        .replace("<br>", " + ") ?? "",
                    shells:
                      el.nextElementSibling
                        ?.querySelector("td div:nth-child(2)")
                        ?.innerHTML.split("<br>")
                        .slice(1)
                        .map((s) => s.trim())
                        .filter(Boolean) ?? "",
                  },
            )
            .filter(Boolean),
          engines: [
            ...([...document.querySelectorAll("table.wikitable")]
              .filter(
                (t) =>
                  t.previousElementSibling?.textContent?.trim() === "Engine[]",
              )?.[0]
              ?.querySelectorAll("tr") ?? []),
          ]
            .slice(1)
            .map((el) => ({
              name:
                el
                  .querySelector("td:nth-child(1)")
                  ?.textContent?.split("[")?.[0]
                  ?.trim() ?? "",
              top_speed: Number(
                el
                  .querySelector("td:nth-child(4)")
                  ?.textContent?.trim()
                  .split(" ")[0] ?? 0,
              ),
              acc_to_32: Number(
                el
                  .querySelector("td:nth-child(6)")
                  ?.textContent?.trim()
                  .split(" s ")[0] ?? 0,
              ),
              acc_to_top: Number(
                el
                  .querySelector("td:nth-child(6)")
                  ?.textContent?.trim()
                  .split(" s ")[1]
                  ?.split(")")
                  .slice(-1)[0] ?? 0,
              ),
            })),
          parts: [
            ...([...document.querySelectorAll("table.wikitable")]
              .filter(
                (t) =>
                  t.previousElementSibling?.textContent?.trim() === "Parts[]",
              )?.[0]
              ?.querySelectorAll("tr") ?? []),
          ]
            .slice(1)
            .map((el) => ({
              name:
                el.querySelector("td:nth-child(1)")?.textContent?.trim() ?? "",
              icon:
                el
                  .querySelector("td:nth-child(1) img")
                  ?.getAttribute("data-src")
                  ?.replace("https://static.wikia.nocookie.net", "") ?? "",
            })),
          abilities: [
            ...([...document.querySelectorAll("table.wikitable")]
              .filter(
                (t) =>
                  t.previousElementSibling?.textContent?.trim() ===
                  "Abilities[]",
              )?.[0]
              ?.querySelectorAll("tr") ?? []),
          ]
            .slice(1)
            .map((el, i) =>
              i % 2
                ? undefined
                : {
                    name:
                      el
                        .querySelector("td:nth-child(2)")
                        ?.textContent?.trim() ?? "",
                    icon:
                      el
                        .querySelector("td:nth-child(2) img")
                        ?.getAttribute("data-src")
                        ?.replace("https://static.wikia.nocookie.net", "") ??
                      "",
                  },
            )
            .filter(Boolean),
        };
      }),
  );
  writeFileSync(`${ROOT}/wiki_data.json`, JSON.stringify(data, null, 2));
}

Promise.all([downloadData()]);
