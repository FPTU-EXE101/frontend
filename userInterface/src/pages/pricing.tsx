import { CheckCircle, MinusCircle, Rocket, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

type PricingFeature = {
  label: string;
  enabled: boolean;
};

type PricingPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  icon: typeof Zap;
  cta: string;
  highlighted?: boolean;
  features: PricingFeature[];
};

const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "0đ",
    period: "/tháng",
    description: "Dùng thử miễn phí",
    icon: Zap,
    cta: "Gói mặc định",
    features: [
      { label: "Quản lý tối đa 50 thú cưng", enabled: true },
      { label: "Digital Pet Card cơ bản", enabled: true },
      { label: "Lịch hẹn thủ công", enabled: true },
      { label: "Lưu trữ hồ sơ y tế", enabled: true },
      { label: "Nhắc nhở thông minh (Email)", enabled: false },
      { label: "CRM & Phân loại khách hàng", enabled: false },
      { label: "Báo cáo doanh thu", enabled: false },
      { label: "Hỗ trợ ưu tiên 24/7", enabled: false },
    ],
  },
  {
    name: "Premium",
    price: "249.000đ",
    period: "/tháng",
    description: "Pet store nhỏ, Phòng khám nhỏ-vừa",
    icon: Rocket,
    cta: "Gói Premium",
    highlighted: true,
    features: [
      { label: "Quản lý KHÔNG GIỚI HẠN thú cưng", enabled: true },
      { label: "Digital Pet Card cao cấp + QR Code", enabled: true },
      { label: "Lịch hẹn tự động + Booking online", enabled: true },
      { label: "Lưu trữ Cloud không giới hạn", enabled: true },
      { label: "Nhắc nhở thông minh (Email)", enabled: true },
      { label: "CRM & Phân loại khách hàng VIP", enabled: true },
      { label: "Báo cáo doanh thu chi tiết", enabled: true },
      { label: "Hỗ trợ ưu tiên 24/7", enabled: true },
    ],
  },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-[#fff8f3]">
      <style>
        {`
          @keyframes pricingFadeUp {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes pricingSoftLine {
            0%, 100% { transform: translateX(-16px); opacity: 0.35; }
            50% { transform: translateX(16px); opacity: 0.58; }
          }

          @media (prefers-reduced-motion: reduce) {
            .pricing-fade,
            .pricing-line {
              animation: none !important;
            }
          }
        `}
      </style>

      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[linear-gradient(180deg,#fff8f3_0%,#fffdfb_100%)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-24 hidden -translate-x-1/2 select-none text-[18vw] font-black uppercase leading-none tracking-[0.04em] text-[#D56756]/[0.055] sm:block">
          PetHub
        </div>
        <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#D56756]/[0.08] blur-[60px]" />
        <div className="pointer-events-none absolute -right-20 top-80 h-80 w-80 rounded-full bg-[#ffc1ad]/[0.16] blur-[70px]" />
        <div className="pointer-events-none absolute bottom-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#f6d9bc]/[0.18] blur-[64px]" />
        <div className="pricing-line pointer-events-none absolute left-[8%] top-[46%] h-px w-[84%] bg-[linear-gradient(90deg,transparent,rgba(213,103,86,0.2),rgba(255,188,154,0.4),rgba(213,103,86,0.16),transparent)] [animation:pricingSoftLine_12s_ease-in-out_infinite]" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col justify-center">
          <div className="pricing-fade mx-auto max-w-3xl text-center [animation:pricingFadeUp_600ms_ease-out_both]">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#D56756]/20 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#B24C40] shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-[#D56756]" />
              Bắt đầu miễn phí - Không cần thẻ tín dụng
            </div>

            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Chọn gói phù hợp với quy mô cửa hàng của bạn.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Nâng cấp hoặc hạ cấp bất cứ lúc nào.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
            {pricingPlans.map((plan, index) => {
              const Icon = plan.icon;

              return (
                <article
                  key={plan.name}
                  className={`pricing-fade group relative rounded-[32px] border bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 [animation:pricingFadeUp_650ms_ease-out_both] hover:-translate-y-1.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-8 ${
                    plan.highlighted
                      ? "border-[#D56756]/45 shadow-[0_22px_70px_rgba(213,103,86,0.16)] hover:shadow-[0_28px_80px_rgba(213,103,86,0.22)]"
                      : "border-[#D56756]/15 hover:border-[#D56756]/25"
                  }`}
                  style={{ animationDelay: `${120 + index * 120}ms` }}
                >
                  {plan.highlighted ? (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-[#D56756]/20 bg-[#fff1ed] px-4 py-2 text-sm font-semibold text-[#B24C40] shadow-sm">
                      Phổ biến nhất
                    </div>
                  ) : null}

                  <div className="flex items-start justify-between gap-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#F9E0D8] text-[#D56756] shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    {plan.highlighted ? (
                      <span className="rounded-full bg-[#D56756]/10 px-3 py-1 text-xs font-semibold text-[#B24C40]">
                        Nâng cấp
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-7">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D56756]">
                      {plan.name}
                    </p>
                    <div className="mt-3 flex items-end gap-2">
                      <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                        {plan.price}
                      </h2>
                      <span className="pb-1 text-sm font-medium text-slate-500">
                        {plan.period}
                      </span>
                    </div>
                    <p className="mt-4 min-h-6 text-sm leading-6 text-slate-600">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="mt-8 space-y-4 text-sm">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.label}
                        className={`flex items-start gap-3 ${
                          feature.enabled ? "text-slate-700" : "text-slate-400"
                        }`}
                      >
                        {feature.enabled ? (
                          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#D56756]" />
                        ) : (
                          <MinusCircle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />
                        )}
                        <span>{feature.label}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`mt-9 w-full rounded-full px-5 py-6 text-sm font-semibold transition duration-300 hover:scale-[1.01] ${
                      plan.highlighted
                        ? "bg-[#D56756] text-white shadow-[0_14px_34px_rgba(213,103,86,0.24)] hover:bg-[#B24C40]"
                        : "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
