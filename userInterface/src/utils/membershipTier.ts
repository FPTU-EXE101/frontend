export type MembershipTier = "Bronze" | "Silver" | "Gold" | "Platinum";

type TierRange = {
  tier: MembershipTier;
  min: number;
  max: number | null;
  icon: string;
};

const TIER_RANGES: TierRange[] = [
  { tier: "Bronze", min: 0, max: 10, icon: "🏅" },
  { tier: "Silver", min: 11, max: 30, icon: "🥈" },
  { tier: "Gold", min: 31, max: 60, icon: "🥇" },
  { tier: "Platinum", min: 61, max: null, icon: "💎" },
];

export function getMembershipTier(totalAppointments: number) {
  const safeTotal = Math.max(0, totalAppointments);
  const currentIndex = TIER_RANGES.findIndex((range) => {
    if (range.max === null) return safeTotal >= range.min;
    return safeTotal >= range.min && safeTotal <= range.max;
  });
  const currentRange = TIER_RANGES[currentIndex] ?? TIER_RANGES[0];
  const nextRange = TIER_RANGES[currentIndex + 1] ?? null;

  const progressPercent =
    currentRange.max === null
      ? 100
      : Math.min(
          100,
          Math.max(
            0,
            ((safeTotal - currentRange.min) /
              (currentRange.max - currentRange.min)) *
              100,
          ),
        );

  return {
    tier: currentRange.tier,
    icon: currentRange.icon,
    nextTier: nextRange?.tier ?? null,
    progressPercent,
  };
}

export const membershipTierOrder = TIER_RANGES.map((range) => range.tier);
