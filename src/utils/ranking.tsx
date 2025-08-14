export const getHighestDPM = (
  tank: (typeof import("~/data/wiki_data.json"))[number],
  includeHE = false,
): number => {
  let highestDPM = 0;
  const shouldIncludeHE = includeHE || tank.class === "SPG";
  tank.ammos.forEach((ammo) => {
    if (!shouldIncludeHE && (ammo.type === "HE" || ammo.type === "ATGM-TB"))
      return;
    highestDPM = Math.max(highestDPM, ammo.dpm ?? 0);
  });
  if (!highestDPM && !includeHE) return getHighestDPM(tank, true);
  return highestDPM;
};

export const getDPMRank = (
  tank: (typeof import("~/data/wiki_data.json"))[number],
) => {
  const dpm = getHighestDPM(tank);
  if (dpm < 10000) return "B";
  if (dpm < 16000) return "A";
  return "S";
};
