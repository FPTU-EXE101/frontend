import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  LogIn,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Store,
} from "lucide-react";

import storeApi from "@/apis/storeAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { queryKeys } from "@/lib/queryKeys";
import type { Store as StoreType } from "@/types/store.type";

type ApiEnvelope<T> = {
  data?: T;
};

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

const StoresPage = () => {
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
  });

  const filteredStores = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return stores;
    }

    return stores.filter(
      (store) =>
        (store.name || "").toLowerCase().includes(keyword) ||
        (store.address || "").toLowerCase().includes(keyword),
    );
  }, [searchTerm, stores]);

  return (
    <main className="min-h-screen bg-[#fff8f3]">
      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#D56756]/20 bg-[#F8DED9]/70 px-4 py-2 text-sm font-semibold text-[#B24C40]">
              <Store className="h-4 w-4" />
              Chọn phòng khám
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Chọn phòng khám thú y đối tác để đặt lịch khám
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              PetHub là nền tảng trung gian. Chọn một phòng khám đối tác để tạo
              tài khoản và đặt lịch — lịch hẹn, thú cưng, dịch vụ và hóa đơn của
              bạn sẽ gắn với đúng phòng khám đó.
            </p>
          </div>
          <div className="flex items-end">
            <div className="w-full rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Phòng khám đối tác
              </p>
              <p className="mt-3 text-5xl font-extrabold text-slate-950">
                {stores.length}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Các phòng khám thú y đang hợp tác và nhận đặt lịch trên nền tảng
                PetHub.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên hoặc địa chỉ phòng khám"
              className="h-11 rounded-lg border-slate-200 bg-white pl-10"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-lg border-slate-200 bg-white"
            onClick={() => void refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={isLoading ? "animate-spin" : ""} />
            Làm mới
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-lg border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            Không tải được danh sách phòng khám. Vui lòng thử lại sau.
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-10 text-center">
            <p className="text-lg font-bold text-slate-950">
              Chưa tìm thấy phòng khám phù hợp
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Hãy thử từ khóa khác hoặc quay lại sau khi phòng khám được kích
              hoạt.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStores.map((store) => (
              <article
                key={store.id}
                className="flex min-h-44 flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#D56756]/35 hover:shadow-md"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F8DED9] text-[#B24C40]">
                      <Store className="h-5 w-5" />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        store.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          store.isActive ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      {store.isActive ? "Đang hoạt động" : "Tạm ngưng"}
                    </span>
                  </div>
                  <h2 className="line-clamp-2 text-xl font-bold text-slate-950">
                    {store.name || "Phòng khám chưa đặt tên"}
                  </h2>
                  <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                    <p className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <span className="line-clamp-2">
                        {store.address || "Chưa cập nhật địa chỉ"}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                      <span>{store.phone || "Chưa cập nhật số điện thoại"}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-lg border-[#D56756]/35 text-[#B24C40] hover:bg-[#F8DED9]"
                  >
                    <Link
                      to={{
                        pathname: "/auth/login",
                        search: new URLSearchParams({
                          storeId: store.id,
                        }).toString(),
                      }}
                    >
                      <LogIn />
                      Đăng nhập
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="rounded-lg bg-[#D56756] hover:bg-[#B24C40]"
                  >
                    <Link
                      to={{
                        pathname: "/auth/signup",
                        search: new URLSearchParams({
                          storeId: store.id,
                        }).toString(),
                      }}
                    >
                      Tạo tài khoản
                      <ArrowRight />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default StoresPage;
