// ─── Pet helper utilities ─────────────────────────────────────────────────────

export const calcAge = (dob: string): string => {
  if (!dob) return "Chưa rõ";
  const birth = new Date(dob);
  const now = new Date();
  const totalMonths =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (totalMonths < 12) return `${totalMonths} tháng`;
  return `${Math.floor(totalMonths / 12)} tuổi`;
};

const PET_EMOJI: Record<string, string> = {
  dog: "🐶",
  cat: "🐱",
  bird: "🐦",
  rabbit: "🐰",
  hamster: "🐹",
  fish: "🐠",
};

export const getPetEmoji = (species?: string): string => {
  if (!species) return "🐾";
  const key = species.toLowerCase();
  for (const k of Object.keys(PET_EMOJI)) {
    if (key.includes(k)) return PET_EMOJI[k];
  }
  return "🐾";
};
