import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Clock, ImageIcon, Scissors, Tag } from "lucide-react";
import itemApi from "@/apis/itemsAPI";
// import type { Items } from "@/types/item.type";
import { queryKeys } from "@/lib/queryKeys";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { usePagination } from "@/hooks/usePagination";

const formatPrice = (value?: number): string | null => {
  if (typeof value !== "number") {
    return null;
  }

  return `${value.toLocaleString("vi-VN")}đ`;
};

const formatDuration = (value?: number): string | null => {
  if (typeof value !== "number") {
    return null;
  }

  return `${value} phút`;
};

const getStatusClassName = (status: string): string => {
  const statusValue = status.toLowerCase();

  if (statusValue === "active" || statusValue === "available") {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }

  if (statusValue === "inactive" || statusValue === "unavailable") {
    return "bg-slate-100 text-slate-600 border-slate-200";
  }

  return "bg-sky-50 text-sky-700 border-sky-100";
};

const UserServicePage = () => {
  const {
    data: services = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: queryKeys.services,
    queryFn: async ({ signal }) => {
      const response = await itemApi.getAllServices({ signal });
      return Array.isArray(response?.data) ? response.data : [];
    },
  });

  const visibleServices = useMemo(() => services, [services]);
  const servicePagination = usePagination(visibleServices, 12);

  return (
    <div className="min-h-[calc(100vh-3rem)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#D56756]">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-[#D56756]">
                  <Scissors className="h-4 w-4" />
                </span>
                Dịch vụ PetHub
              </div>
              <h1 className="text-3xl font-semibold text-slate-900">
                Dịch vụ chăm sóc thú cưng
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Xem các dịch vụ hiện có của phòng khám để chọn gói chăm sóc phù
                hợp cho bé cưng.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-medium text-[#D56756]">
              <Tag className="h-4 w-4" />
              {visibleServices.length} dịch vụ
            </div>
          </div>
        </section>

        {loading ? (
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-44 animate-pulse bg-slate-100" />
                <div className="space-y-4 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </section>
        ) : isError ? (
          <section className="rounded-[30px] border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>Không tải được danh sách dịch vụ. Vui lòng thử lại sau.</p>
            </div>
          </section>
        ) : visibleServices.length === 0 ? (
          <section className="rounded-[30px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Scissors className="h-7 w-7" />
            </div>
            <p className="font-medium text-slate-700">
              Hiện chưa có dịch vụ nào.
            </p>
          </section>
        ) : (
          <div className="space-y-5">
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {servicePagination.pageItems.map((service) => {
                const price = formatPrice(service.price);
                const duration = formatDuration(service.duration);

                return (
                  <article
                    key={service.id}
                    className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={`Dịch vụ ${service.name}`}
                        className="h-44 w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-[#F8F1E4] text-[#D56756]">
                        <ImageIcon className="h-10 w-10" />
                      </div>
                    )}

                    <div className="flex min-h-60 flex-col gap-4 p-5">
                      <div>
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-[#D56756]">
                            Dịch vụ
                          </span>
                          {service.status ? (
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClassName(
                                service.status,
                              )}`}
                            >
                              {service.status}
                            </span>
                          ) : null}
                        </div>

                        <h2 className="text-xl font-semibold text-slate-950">
                          {service.name}
                        </h2>

                        {service.description ? (
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                            {service.description}
                          </p>
                        ) : (
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            Dịch vụ chăm sóc thú cưng tại phòng khám.
                          </p>
                        )}
                      </div>

                      <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                        {price ? (
                          <div className="rounded-2xl bg-slate-50 px-4 py-2">
                            <p className="text-xs text-slate-500">Giá</p>
                            <p className="font-semibold text-slate-950">
                              {price}
                            </p>
                          </div>
                        ) : null}

                        {duration ? (
                          <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                            <Clock className="h-4 w-4 text-slate-400" />
                            {duration}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
            <PaginationControls
              canGoNext={servicePagination.canGoNext}
              canGoPrevious={servicePagination.canGoPrevious}
              currentPage={servicePagination.currentPage}
              onNext={servicePagination.goNext}
              onPrevious={servicePagination.goPrevious}
              totalItems={servicePagination.totalItems}
              totalPages={servicePagination.totalPages}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserServicePage;
