import { Store } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useAuthenticatedStore } from "@/hooks/useAuthenticatedStore";

const UserInfoLayout = () => {
  const { data: store, isLoading, isStoreIdMissing } = useAuthenticatedStore();

  return (
    <div className="min-h-screen w-full">
      <div className="border-b border-[#D56756]/20 bg-[#F8DED9]/55">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#B24C40] shadow-sm">
            <Store className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-[#B24C40]">
              Bạn đang đặt lịch tại phòng khám
            </p>
            <p className="truncate text-sm font-bold text-slate-950">
              {isLoading
                ? "Đang tải phòng khám..."
                : isStoreIdMissing
                  ? "Chưa gắn phòng khám"
                  : store?.name || "Chưa xác định phòng khám"}
            </p>
          </div>
        </div>
      </div>
      <main>
        <div className="mx-auto max-w-7xl p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserInfoLayout;
