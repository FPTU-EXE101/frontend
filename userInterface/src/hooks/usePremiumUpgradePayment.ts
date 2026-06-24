import { useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import userApi from "@/apis/userAPI";
import storePackageApi, { PLANTEST_PLAN_ID } from "@/apis/storePackageAPI";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";

type ApiEnvelope<T> = {
  data?: T;
};

type UserPlanProfile = {
  plan?: number | string | null;
  package?: string | null;
  packageType?: string | null;
  planName?: string | null;
};

const AUTH_REQUIRED_MESSAGE = "Vui lòng đăng nhập.";
const MANAGER_INFO_MESSAGE =
  "Không tìm thấy thông tin tài khoản quản lý. Vui lòng đăng nhập lại.";
const MANAGER_ROLE_MESSAGE = "Chỉ tài khoản Manager mới có thể nâng cấp gói.";
const CHECKOUT_URL_MESSAGE =
  "Không tạo được liên kết thanh toán. Vui lòng thử lại.";
const ALREADY_PREMIUM_MESSAGE = "Bạn đang sử dụng gói Premium.";

const getResponseData = <T,>(value: unknown): T | null => {
  const axiosData = (value as ApiEnvelope<unknown>).data;

  if (!axiosData) {
    return null;
  }

  if (typeof axiosData === "object" && "data" in axiosData) {
    return ((axiosData as ApiEnvelope<T>).data ?? null) as T | null;
  }

  return axiosData as T;
};

const isPremiumProfile = (profile: UserPlanProfile | null): boolean => {
  if (!profile) {
    return false;
  }

  const textPlan =
    profile.package ?? profile.packageType ?? profile.planName ?? profile.plan;

  if (typeof textPlan === "number") {
    return textPlan !== 0;
  }

  if (typeof textPlan === "string") {
    const normalizedPlan = textPlan.trim().toLowerCase();
    return normalizedPlan === "premium" || normalizedPlan === "1";
  }

  return false;
};

export const usePremiumUpgradePayment = () => {
  const currentUser = getCurrentUser();
  const isAuthenticated = Boolean(currentUser);
  const isManager =
    isAuthenticated && currentUser?.role?.toLowerCase() === "manager";
  const [checkingPlan, setCheckingPlan] = useState(false);
  const [currentPlanProfile, setCurrentPlanProfile] =
    useState<UserPlanProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPremium = useMemo(
    () => isPremiumProfile(currentPlanProfile),
    [currentPlanProfile],
  );

  const planLabel = isPremium ? "Premium" : "Normal";

  useEffect(() => {
    let ignore = false;

    const loadCurrentPlan = async () => {
      if (!isManager || !currentUser?.userId) {
        setCurrentPlanProfile(null);
        return;
      }

      setCheckingPlan(true);

      try {
        const response = await userApi.getUserById(currentUser.userId);
        if (!ignore) {
          setCurrentPlanProfile(getResponseData<UserPlanProfile>(response));
        }
      } catch {
        if (!ignore) {
          setCurrentPlanProfile(null);
        }
      } finally {
        if (!ignore) {
          setCheckingPlan(false);
        }
      }
    };

    void loadCurrentPlan();

    return () => {
      ignore = true;
    };
  }, [currentUser?.userId, isManager]);

  const handleUpgrade = useCallback(async () => {
    setError(null);

    const user = getCurrentUser();

    if (!user) {
      setError(AUTH_REQUIRED_MESSAGE);
      return;
    }

    if (user.role?.toLowerCase() !== "manager") {
      setError(MANAGER_ROLE_MESSAGE);
      return;
    }

    if (!user.userId || !user.email) {
      setError(MANAGER_INFO_MESSAGE);
      return;
    }

    if (isPremium) {
      setError(ALREADY_PREMIUM_MESSAGE);
      return;
    }

    setLoading(true);

    try {
      const packageResponse = await storePackageApi.createStorePackage({
        planId: PLANTEST_PLAN_ID,
      });
      const createdPackage = packageResponse.data;

      // Current backend contract only accepts packageId, buyerName, buyerEmail.
      // Backend should redirect /api/payment/return to /payment/success after handling PayOS.
      const paymentResponse = await storePackageApi.createStorePackagePayment({
        packageId: createdPackage.id,
        buyerName: createdPackage.managerName || user.name,
        buyerEmail: user.email,
      });

      const checkoutUrl = paymentResponse.data.checkoutUrl;

      if (!checkoutUrl) {
        setError(CHECKOUT_URL_MESSAGE);
        return;
      }

      window.location.href = checkoutUrl;
    } catch (upgradeError) {
      setError(getBackendErrorMessage(upgradeError));
    } finally {
      setLoading(false);
    }
  }, [isPremium]);

  return {
    checkingPlan,
    currentUser,
    error,
    handleUpgrade,
    isAuthenticated,
    isManager,
    isPremium,
    loading,
    planLabel,
  };
};
