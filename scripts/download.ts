import { mkdirSync, writeFileSync } from "fs";
import { JSDOM } from "jsdom";

const ROOT = `./src/data`;
mkdirSync(ROOT, { recursive: true });

async function downloadTypes() {
  // Flags
  {
    console.log("Downloading flags...");
    const css = await fetch(
      "https://arwar.ru/static/arwar.ru/css/main/content/tankopedia/flags.css",
    ).then((r) => r.text());
    const lines = css.split("\n").map((l) => l.trim());
    const countries = [] as string[];
    lines.forEach(async (line) => {
      if (!line.startsWith(".")) return;
      countries.push(line.replace(".", "").split("{")[0].trim());
    });
    const flagType = `export type FlagName = ${countries.map((c) => `"${c.split(".")[0]}"`).join(" | ")};`;
    writeFileSync(`${ROOT}/flag_type.ts`, flagType);
  }
  // Icons
  {
    console.log("Downloading icons...");
    const css = await fetch(
      "https://arwar.ru/static/arwar.ru/css/main/content/tankopedia/tankopedia-sprite.css",
    ).then((r) => r.text());
    const lines = css.split("\n").map((l) => l.trim());
    const iconName = [] as string[];
    lines.forEach(async (line) => {
      if (!line.startsWith(".font-") && !line.startsWith(".icon-")) return;
      iconName.push(
        line.replace(".", "").split("{")[0].replace("::before", "").trim(),
      );
    });
    const iconType = `export type SymbolName = ${iconName.map((c) => `"${c.split(".")[0]}"`).join(" | ")};`;
    writeFileSync(`${ROOT}/symbol_type.ts`, iconType);
  }
}

async function downloadTankData(key: string) {
  const html = await fetch("https://arwar.ru/kb/get_tank/", {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: `tank=${key}`,
    method: "POST",
  }).then((r) => r.text());
  const { window } = new JSDOM(html);
  const document = window.document;
  const data = {
    key: key,
    name: document.querySelector("h2.mainheader")?.textContent,
    info: document
      .querySelector("div.tankopedia_tank_text")
      ?.textContent?.replaceAll("\t", ""),
    img: document
      .querySelector("div.tankpedia_tank_mainimg img")
      ?.getAttribute("src"),
    basic: {
      gun: document
        .querySelector(
          "div.tankopedia_tank_options > div[class='table table_t01'] .tr .th",
        )
        ?.textContent?.replace("Урон", "")
        .trim(),
      penetration: Number(
        document
          .querySelectorAll(
            "div.tankopedia_tank_options > div[class='table table_t01'] .tr .td",
          )?.[1]
          ?.textContent?.trim(),
      ),
      damage: Number(
        document
          .querySelectorAll(
            "div.tankopedia_tank_options > div[class='table table_t01'] .tr .td",
          )?.[3]
          ?.textContent?.trim(),
      ),
      dpm: Number(
        document
          .querySelectorAll(
            "div.tankopedia_tank_options > div[class='table table_t01'] .tr .td",
          )?.[5]
          ?.textContent?.trim(),
      ),
      reload: Number(
        document
          .querySelectorAll(
            "div.tankopedia_tank_options > div[class='table table_t01'] .tr .td",
          )?.[7]
          ?.textContent?.replace(" с", "")
          .trim(),
      ),
      topSpeed: Number(
        document
          .querySelectorAll(
            "div.tankopedia_tank_options > div[class='table table_t01 mrgr0'] .tr .td",
          )[1]
          ?.textContent?.split(" ")[0]
          .trim(),
      ),
      acc0to32: Number(
        document
          .querySelectorAll(
            "div.tankopedia_tank_options > div[class='table table_t01 mrgr0'] .tr .td",
          )[3]
          ?.textContent?.split(" ")[0]
          .trim(),
      ),
      camo: Number(
        document
          .querySelectorAll(
            "div.tankopedia_tank_options > div[class='table table_t01 mrgr0'] .tr .td",
          )[5]
          ?.textContent?.trim(),
      ),
      viewRange: Number(
        document
          .querySelectorAll(
            "div.tankopedia_tank_options > div[class='table table_t01 mrgr0'] .tr .td",
          )[7]
          ?.textContent?.trim(),
      ),
      hp: Number(
        document
          .querySelectorAll(
            "div.tankopedia_tank_options > div[class='table'] .tr .td",
          )[5]
          ?.textContent?.trim(),
      ),
      armor: {
        hull: {
          front: Number(
            document
              .querySelectorAll(
                "div.tankopedia_tank_options > div[class='table'] .tr .td",
              )[1]
              ?.textContent?.split("/")[0]
              .trim(),
          ),
          side: Number(
            document
              .querySelectorAll(
                "div.tankopedia_tank_options > div[class='table'] .tr .td",
              )[1]
              ?.textContent?.split("/")[1]
              .trim(),
          ),
          rear: Number(
            document
              .querySelectorAll(
                "div.tankopedia_tank_options > div[class='table'] .tr .td",
              )[1]
              ?.textContent?.split("/")[2]
              .trim(),
          ),
        },
        turret: {
          front: Number(
            document
              .querySelectorAll(
                "div.tankopedia_tank_options > div[class='table mrgr0'] .tr .td",
              )[1]
              ?.textContent?.split("/")[0]
              .trim(),
          ),
          side: Number(
            document
              .querySelectorAll(
                "div.tankopedia_tank_options > div[class='table mrgr0'] .tr .td",
              )[1]
              ?.textContent?.split("/")[1]
              .trim(),
          ),
          rear: Number(
            document
              .querySelectorAll(
                "div.tankopedia_tank_options > div[class='table mrgr0'] .tr .td",
              )[1]
              ?.textContent?.split("/")[2]
              .trim(),
          ),
        },
      },
    },
    detail: {
      guns: [
        ...document.querySelectorAll(
          "div.tankopedia_tank_options > div[class='table table_t02'] > .tr > .td.t01",
        ),
      ]
        .filter((el) =>
          el.parentElement?.nextElementSibling?.classList?.contains("table"),
        )
        .map((el) => ({
          name: el.textContent?.replaceAll("\n", ", ").trim(),
          shells: [
            ...(el.parentElement?.nextElementSibling?.querySelectorAll(".tr") ??
              []),
          ]
            .slice(1)
            .map((el) => ({
              name: el.querySelector(".td.t01")?.textContent?.trim(),
              type: el.querySelector(".td.t04")?.textContent?.trim(),
              speed: Number(el.querySelector(".td.t02")?.textContent?.trim()),
              penetration: Number(
                el.querySelector(".td.t05")?.textContent?.trim(),
              ),
              damage: Number(el.querySelector(".td.t06")?.textContent?.trim()),
            })),
        })),
      armors: [
        ...document.querySelectorAll(
          "div.tankopedia_tank_options > div[class='table table_t05'] .tr",
        ),
      ]
        .slice(1)
        .map((el) => ({
          name: el.querySelector(".td.t01")?.textContent?.trim(),
          hull: {
            front: Number(
              el.querySelectorAll(".td.t04 span")?.[0]?.textContent?.trim(),
            ),
            side: Number(
              el.querySelectorAll(".td.t04 span")?.[1]?.textContent?.trim(),
            ),
            rear: Number(
              el.querySelectorAll(".td.t04 span")?.[2]?.textContent?.trim(),
            ),
          },
          turret: {
            front: Number(
              el.querySelectorAll(".td.t06 span")?.[0]?.textContent?.trim(),
            ),
            side: Number(
              el.querySelectorAll(".td.t06 span")?.[1]?.textContent?.trim(),
            ),
            rear: Number(
              el.querySelectorAll(".td.t06 span")?.[2]?.textContent?.trim(),
            ),
          },
        })),
      equipments: [
        ...document.querySelectorAll(
          "div.tankopedia_tank_options > div[class='table table_t06'] .tr .td.t01",
        ),
      ].map((e) => e.textContent?.trim()),
      smoke: [
        ...document.querySelectorAll(
          "div.tankopedia_tank_options > div[class='table table_t02'] > .tr > .td.t01",
        ),
      ]
        .filter(
          (el) =>
            !el.parentElement?.nextElementSibling?.classList?.contains("table"),
        )
        .map((e) => e.textContent?.trim()),
    },
  };
  return data;
}

async function downloadData() {
  console.log("Downloading data...");
  const html = await fetch("https://arwar.ru/kb/").then((r) => r.text());
  const lines = html.split("\n").map((l) => l.trim());
  lines
    .filter((line) => line.startsWith("var "))
    .forEach(async (line) => {
      const parts = line.split("=");
      const name = parts[0].replace("var ", "");
      const value = parts[1].replace(";", "");
      if (name === "datajson") {
        const data = JSON.parse(value) as Record<string, { tank_key: string }>;
        writeFileSync(`${ROOT}/tanks.json`, JSON.stringify(data, null, 2));
        const tankNames = Object.values(data)
          .filter((t) => typeof t === "object" && t.tank_key)
          .map((t) => t.tank_key);
        writeFileSync(
          `${ROOT}/tank_type.ts`,
          `export type TankName = ${tankNames
            .map((name) => `"${name}"`)
            .join(" | ")};`,
        );
        let count = 0;
        const tankData = await Promise.all(
          tankNames.map(async (name) => {
            // if (name !== "boxer-tracked") return;
            const data = await downloadTankData(name);
            console.log(
              `Downloading tank data [${++count}/${tankNames.length}]: ${name} `,
            );
            return data;
          }),
        );
        writeFileSync(
          `${ROOT}/tank_data.json`,
          JSON.stringify(
            Object.fromEntries(
              tankData.filter(Boolean).map((t) => [t!.key, t]),
            ),
            null,
            2,
          ),
        );
      }
      if (name === "typenation") {
        const data = JSON.parse(value) as Record<string, string>;
        writeFileSync(`${ROOT}/nations.json`, JSON.stringify(data, null, 2));
        writeFileSync(
          `${ROOT}/nation_type.ts`,
          `export type NationName = ${Object.keys(data)
            .map((t) => `"${t}"`)
            .join(" | ")};`,
        );
      }
      if (name === "typeclass") {
        const data = JSON.parse(value) as Record<string, string>;
        writeFileSync(`${ROOT}/classes.json`, JSON.stringify(data, null, 2));
        writeFileSync(
          `${ROOT}/class_type.ts`,
          `export type TankClassName = ${Object.keys(data)
            .map((t) => `"${t}"`)
            .join(" | ")};`,
        );
      }
    });
}

Promise.all([downloadTypes(), downloadData()]);
