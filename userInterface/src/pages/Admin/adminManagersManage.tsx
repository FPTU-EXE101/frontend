import { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import userApi from "@/apis/userAPI";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import type { User } from "@/types/user.type";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";

const getFullName = (user: User) => {
  const fullName = [user.lastName, user.firstName].filter(Boolean).join(" ");
  return fullName || user.userName;
};

const AdminManagersManage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);

  useEffect(() => {
    const controller = new AbortController();

    const loadManagers = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await userApi.getAllUsers({
          signal: controller.signal,
        });
        setUsers(response?.data ?? []);
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(getBackendErrorMessage(loadError));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadManagers();

    return () => controller.abort();
  }, []);

  const managerUsers = useMemo(
    () =>
      users.filter((user) => user.role?.toLowerCase() === "manager"),
    [users],
  );

  const filteredManagers = useMemo(() => {
    const query = debouncedSearchTerm.trim().toLowerCase();

    if (!query) {
      return managerUsers;
    }

    return managerUsers.filter((user) => {
      return (
        user.userName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        getFullName(user).toLowerCase().includes(query)
      );
    });
  }, [debouncedSearchTerm, managerUsers]);

  const managerPagination = usePagination(filteredManagers, 10);

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#D56756]/10 text-[#B24C40]">
          <Users className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
          Quản lý tài khoản Manager
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Tổng số {filteredManagers.length} tài khoản Manager.
        </p>
      </div>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-slate-950">Danh sách Manager</h2>
            <p className="mt-1 text-sm text-slate-500">
              Lọc từ danh sách người dùng có role là Manager.
            </p>
          </div>
          <div className="relative w-full md:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm Manager"
              value={searchTerm}
            />
          </div>
        </div>

        <div className="grid grid-cols-[1.4fr_2fr_1fr_1fr] border-b border-slate-200 bg-[#F8F1E4] px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.14em] text-slate-700">
          <span>Tài khoản</span>
          <span>Email</span>
          <span>Plan</span>
          <span>Trạng thái</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Đang tải danh sách Manager...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-sm font-semibold text-red-600">
            {error}
          </div>
        ) : filteredManagers.length > 0 ? (
          managerPagination.pageItems.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[1.4fr_2fr_1fr_1fr] items-center border-b border-slate-200 px-6 py-5 text-sm text-slate-700 last:border-b-0"
            >
              <div>
                <p className="font-semibold text-slate-950">
                  {user.userName}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {getFullName(user)}
                </p>
              </div>
              <div className="font-medium text-slate-950">{user.email}</div>
              <div>
                {user.plan === 0 ? (
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Free
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Premium
                  </span>
                )}
              </div>
              <div>
                {user.emailConfirmed ? (
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Đã xác thực
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Chưa xác thực
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-sm text-slate-500">
            Không tìm thấy tài khoản Manager nào.
          </div>
        )}

        <div className="border-t border-slate-200 px-6 py-4">
          <PaginationControls
            canGoNext={managerPagination.canGoNext}
            canGoPrevious={managerPagination.canGoPrevious}
            currentPage={managerPagination.currentPage}
            onNext={managerPagination.goNext}
            onPrevious={managerPagination.goPrevious}
            totalItems={filteredManagers.length}
            totalPages={managerPagination.totalPages}
          />
        </div>
      </section>
    </div>
  );
};

export default AdminManagersManage;
