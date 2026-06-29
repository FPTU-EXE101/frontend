import { useEffect, useMemo, useState } from "react";
import platformPlanApi from "@/apis/platformPlanAPI";
import type { PlatformPlan } from "@/types/platformPlan.type";

const isPremiumName = (plan: PlatformPlan) =>
  plan.name?.trim().toLowerCase() === "premium";

/**
 * Tải danh sách gói nền tảng từ GET /api/platformplan và phân giải gói
 * miễn phí (Starter) cùng gói trả phí (Premium) để dùng chung cho các
 * màn hình hiển thị/nâng cấp gói.
 */
export const usePlatformPlans = () => {
  const [plans, setPlans] = useState<PlatformPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadPlans = async () => {
      setLoading(true);
      try {
        const response = await platformPlanApi.getAllPlatformPlans({
          signal: controller.signal,
        });
        setPlans(response?.data ?? []);
      } catch {
        if (!controller.signal.aborted) {
          setPlans([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadPlans();

    return () => controller.abort();
  }, []);

  const freePlan = useMemo(
    () => plans.find((plan) => plan.price <= 0) ?? null,
    [plans],
  );

  // Ưu tiên gói tên "Premium" đang bật, sau đó gói "Premium" bất kỳ, cuối
  // cùng mới fallback sang gói trả phí đắt nhất đang hoạt động.
  const premiumPlan = useMemo(() => {
    const activePremium = plans.find((plan) => isPremiumName(plan) && plan.isActive);
    if (activePremium) {
      return activePremium;
    }

    const anyPremium = plans.find(isPremiumName);
    if (anyPremium) {
      return anyPremium;
    }

    return (
      plans
        .filter((plan) => plan.isActive && plan.price > 0)
        .sort((a, b) => b.price - a.price)[0] ?? null
    );
  }, [plans]);

  return { plans, freePlan, premiumPlan, loading };
};
