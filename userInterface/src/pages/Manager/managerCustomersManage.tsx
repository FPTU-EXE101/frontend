import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Scissors} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { User } from "@/types/user.type";
import userApi from "@/apis/userAPI";
import { useDebounce } from "@/hooks/useDebounce";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { usePagination } from "@/hooks/usePagination";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";


const ManagerCustomersManage = () => {
  const [users, setusers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  // const [numberOfPets, setNumberOfPets] = useState<{ [userId: string]: number }>({});
  useEffect(() => {
    const controller = new AbortController();

    const loadusers = async () => {
      setLoading(true);
      try {
        const response = await userApi.getAllUsers({
          signal: controller.signal,
        });
        setusers(response?.data ?? []);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(getBackendErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadusers();
    return () => controller.abort();
  }, []);
  // const fetchNumberOfPets = async (userId: string) => {}
  const filteredServices = useMemo(
    () =>
      users.filter((user) =>
        user.userName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      ),
    [debouncedSearchTerm, users],
  );
  const customerPagination = usePagination(filteredServices, 10);
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:users-center sm:justify-between">
          <div>
            <div className="mb-3 flex users-center gap-2 text-sm text-slate-500">
              <span className="inline-flex h-7 w-7 users-center justify-center rounded-full bg-slate-100 text-slate-700">
                <Scissors className="h-4 w-4" />
              </span>
              <span>Danh mục</span>
            </div>
            <h1 className="text-3xl font-semibold text-slate-950">
              Quản lý Khách hàng
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Tổng số {filteredServices.length} Khách hàng
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:users-center">
            <div className="relative w-full sm:w-[24rem]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm Khách hàng theo tên..."
                className="pl-12"
              />
            </div>
            <Button className="h-11 whitespace-nowrap bg-[#D56756] text-white hover:bg-[#b2483c]">
              <Link to="/manager/services/new">+ Thêm Khách hàng mới</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1fr] gap-0 border-b border-slate-200 bg-[#F8F1E4] px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.14em] text-slate-700">
          <span>Tên Khách hàng</span>
          <span>Liên lạc</span>
          <span>Plan</span>
          <span>Thú cưng</span>
          <span>Tổng chi tiêu</span>
          <span>Hành động</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Đang tải Khách hàng...
          </div>
        ) : filteredServices.length > 0 ? (
          customerPagination.pageItems.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1fr] users-center gap-0 border-b border-slate-200 px-6 py-5 text-sm text-slate-700 last:border-b-0"
            >
              <div>
                <p className="font-semibold text-slate-950">{user.userName}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Khách hàng chăm sóc thú cưng
                </p>
              </div>
              <div className="font-medium text-slate-950">
                {user.email}
              </div>
              <div>
                {user.plan === 0 ? (
                  <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                    Normal
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Premium
                  </span>
                )}
              </div>
              <div className="flex justify-end gap-2">
                {/* <Button
                  asChild
                  variant="outline"
                  className="h-9 w-9 rounded-full p-0 text-slate-700 hover:bg-slate-100"
                >
                  <Link
                    to={`/manager/services/${user.id}/edit`}
                    aria-label={`Sửa ${user.name}`}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Link>
                </Button> */}
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-slate-500">
            Không có Khách hàng nào phù hợp.
          </div>
        )}
      </section>

      <PaginationControls
        canGoNext={customerPagination.canGoNext}
        canGoPrevious={customerPagination.canGoPrevious}
        currentPage={customerPagination.currentPage}
        onNext={customerPagination.goNext}
        onPrevious={customerPagination.goPrevious}
        totalItems={customerPagination.totalItems}
        totalPages={customerPagination.totalPages}
      />

      {error && (
        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 whitespace-pre-line">
          {error}
        </div>
      )}
    </div>
  );
};

export default ManagerCustomersManage;
