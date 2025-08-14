export const getBestDPM = (
  tank: (typeof import("~/data/wiki_data.json"))[number],
  includeHE = false,
): number => {
  let dpm = 0;
  const shouldIncludeHE = includeHE || tank.class === "SPG";
  tank.ammos.forEach((ammo) => {
    if (!shouldIncludeHE && (ammo.type === "HE" || ammo.type === "ATGM-TB"))
      return;
    dpm = Math.max(dpm, ammo.dpm ?? 0);
  });
  if (!dpm && !includeHE) return getBestDPM(tank, true);
  return dpm;
};
export const getDPMRank = (
  tank: (typeof import("~/data/wiki_data.json"))[number],
) => {
  const dpm = getBestDPM(tank);
  if (dpm < 10000) return "B";
  if (dpm < 16000) return "A";
  return "S";
};
export const getBestArmor = (
  tank: (typeof import("~/data/wiki_data.json"))[number],
) => {
  let hull = 0;
  let turret = 0;
  tank.armors.forEach((armor) => {
    hull = Math.max(hull, armor.hull.ap);
    turret = Math.max(turret, armor.turret.ap);
  });
  return { hull, turret };
};
export const getArmorRank = (
  tank: (typeof import("~/data/wiki_data.json"))[number],
) => {
  const armor = getBestArmor(tank);
  if (armor.hull < 300) return "B";
  if (armor.hull < 700) return "A";
  return "S";
};
export const getBestAgility = (
  tank: (typeof import("~/data/wiki_data.json"))[number],
): number => {
  let timeTo32 = Infinity;
  tank.engines.forEach((engine) => {
    timeTo32 = Math.min(timeTo32, engine.time_to_speed_32);
  });
  return timeTo32;
};
export const getAgilityRank = (
  tank: (typeof import("~/data/wiki_data.json"))[number],
) => {
  const timeTo32 = getBestAgility(tank);
  if (timeTo32 > 5) return "B";
  if (timeTo32 > 3) return "A";
  return "S";
};
export const getHighestSpeed = (
  tank: (typeof import("~/data/wiki_data.json"))[number],
) => {
  let timeToTop = Infinity;
  let topSpeed = 0;
  tank.engines.forEach((engine) => {
    timeToTop = Math.min(timeToTop, engine.time_to_speed_top);
    topSpeed = Math.max(topSpeed, engine.top_speed);
  });
  return { timeToTop, topSpeed };
};
export const getSpeedRank = (
  tank: (typeof import("~/data/wiki_data.json"))[number],
) => {
  const speed = getHighestSpeed(tank);
  if (speed.topSpeed < 70 || speed.topSpeed / speed.timeToTop < 3) return "B";
  if (speed.topSpeed / speed.timeToTop < 5) return "A";
  return "S";
};
export const getBestDamage = (
  tank: (typeof import("~/data/wiki_data.json"))[number],
  includeHE = false,
): number => {
  let damage = 0;
  const shouldIncludeHE = includeHE || tank.class === "SPG";
  tank.ammos.forEach((ammo) => {
    if (!shouldIncludeHE && (ammo.type === "HE" || ammo.type === "ATGM-TB"))
      return;
    if ((ammo.burst_rate ?? 0) / 60 >= 1) {
      const magazineSize =
        (ammo as { magazine_size?: number }).magazine_size ?? Infinity;
      if (tank.name === "CATTB") console.log(ammo);
      damage = Math.max(
        damage,
        ammo.damage * Math.min(1 + (ammo.burst_rate ?? 0) / 60, magazineSize),
      );
    } else damage = Math.max(damage, ammo.damage);
  });
  if (!damage && !includeHE) return getBestDPM(tank, true);
  return damage;
};
export const getDamangeRank = (
  tank: (typeof import("~/data/wiki_data.json"))[number],
) => {
  const damage = getBestDamage(tank);
  if (damage < 1000) return "B";
  if (damage < 1500) return "A";
  return "S";
};
