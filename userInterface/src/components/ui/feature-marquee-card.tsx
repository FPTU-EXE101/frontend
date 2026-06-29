import type { LucideIcon } from "lucide-react";

export type FeatureMarqueeItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

/** Thẻ tính năng dùng trong dải marquee ở trang chủ và trang /features. */
export const FeatureMarqueeCard = ({
  feature,
}: {
  feature: FeatureMarqueeItem;
}) => {
  const Icon = feature.icon;

  return (
    <div className="group h-full w-[280px] shrink-0 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/70 transition duration-300 hover:-translate-y-1 hover:border-[#D56756]/30 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:w-[330px] sm:p-6 lg:w-[370px] lg:p-7">
      <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-[#fff1ee] text-[#D56756] ring-1 ring-[#f3d3cd] transition duration-300 group-hover:scale-105 group-hover:bg-[#D56756] group-hover:text-white sm:h-14 sm:w-14">
        <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
      </div>
      <h3 className="mb-3 text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
        {feature.title}
      </h3>
      <p className="text-sm leading-7 text-slate-600">{feature.description}</p>
    </div>
  );
};
