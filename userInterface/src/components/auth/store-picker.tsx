import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, MapPin, Phone, RefreshCw, Search, Store } from "lucide-react";

import storeApi from "@/apis/storeAPI";
import { Input } from "@/components/ui/input";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";
import type { Store as StoreType } from "@/types/store.type";

type ApiEnvelope<T> = {
  data?: T;
};

const VISIBLE_LIMIT = 5;

const normalizeStores = (value: unknown): StoreType[] => {
  const axiosData = (value as ApiEnvelope<unknown>)?.data;

  if (Array.isArray(axiosData)) {
    return axiosData as StoreType[];
  }

  if (
    axiosData &&
    typeof axiosData === "object" &&
    "data" in axiosData &&
    Array.isArray((axiosData as ApiEnvelope<unknown>).data)
  ) {
    return (axiosData as ApiEnvelope<StoreType[]>).data ?? [];
  }

  return [];
};

type StorePickerProps = {
  value: string;
  onSelect: (storeId: string) => void;
};

/**
 * Danh sách chọn phòng khám: mặc định chỉ hiện sẵn 5 phòng khám đầu tiên,
 * phần còn lại người dùng tìm bằng ô tìm kiếm. Giữ form gọn dù có rất nhiều
 * phòng khám. Chỉ tải danh sách (GET) để hiển thị, không gửi request auth.
 */
export function StorePicker({ value, onSelect }: StorePickerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: stores = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [...queryKeys.customerStores, "all"],
    queryFn: async ({ signal }) => {
      const response = await storeApi.getAllStores({ signal });
      return normalizeStores(response);
    },
    staleTime: 5 * 60 * 1000,
  });

  const keyword = searchTerm.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!keyword) return stores;
    return stores.filter(
      (store) =>
        (store.name || "").toLowerCase().includes(keyword) ||
        (store.address || "").toLowerCase().includes(keyword),
    );
  }, [keyword, stores]);

  // Mặc định (chưa tìm) chỉ hiện 5 phòng khám; khi tìm thì hiện hết kết quả khớp.
  const visibleStores = keyword ? matches : matches.slice(0, VISIBLE_LIMIT);
  const hiddenCount = keyword ? 0 : Math.max(0, stores.length - VISIBLE_LIMIT);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Tìm theo tên hoặc địa chỉ phòng khám"
          className="h-11 border-slate-200 bg-white pl-10"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[72px] animate-pulse rounded-xl border border-slate-100 bg-slate-50"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <span>Không tải được danh sách phòng khám.</span>
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex items-center gap-1.5 font-semibold underline"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Thử lại
          </button>
        </div>
      ) : visibleStores.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          Không tìm thấy phòng khám phù hợp với "{searchTerm.trim()}".
        </div>
      ) : (
        <>
          <div className="grid gap-2 sm:grid-cols-2">
            {visibleStores.map((store) => {
              const isSelected = store.id === value;
              return (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => onSelect(store.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition",
                    isSelected
                      ? "border-[#D56756] bg-[#FFF1ED] ring-1 ring-[#D56756]/30"
                      : "border-slate-200 bg-white hover:border-[#D56756]/40 hover:bg-[#fff8f3]",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      isSelected
                        ? "bg-[#D56756] text-white"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    <Store className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-900">
                      {store.name || "Phòng khám chưa đặt tên"}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {store.address || "Chưa cập nhật địa chỉ"}
                      </span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-400">
                      <Phone className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {store.phone || "Chưa cập nhật SĐT"}
                      </span>
                    </span>
                  </span>
                  {isSelected ? (
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#D56756]" />
                  ) : null}
                </button>
              );
            })}
          </div>

          {hiddenCount > 0 ? (
            <p className="text-center text-xs text-slate-400">
              Đang hiện {VISIBLE_LIMIT} / {stores.length} phòng khám — nhập từ khoá
              để tìm {hiddenCount} phòng khám còn lại.
            </p>
          ) : keyword ? (
            <p className="text-center text-xs text-slate-400">
              {matches.length} phòng khám phù hợp.
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
