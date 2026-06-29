import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Loader2, Pencil, Search, Store, X } from "lucide-react";
import storeApi from "@/apis/storeAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import type { Store as StoreType, UpdateStore } from "@/types/store.type";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";

type StoreFormState = {
  id: string;
  managerId: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
};

const AdminStoresManage = () => {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [editing, setEditing] = useState<StoreFormState | null>(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadStores = async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");

    try {
      const response = await storeApi.getAllStores({ signal });
      setStores(response?.data ?? []);
    } catch (loadError) {
      if (signal?.aborted) {
        return;
      }
      setError(getBackendErrorMessage(loadError));
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadStores(controller.signal);
    return () => controller.abort();
  }, []);

  const filteredStores = useMemo(() => {
    const query = debouncedSearchTerm.trim().toLowerCase();
    if (!query) {
      return stores;
    }
    return stores.filter((store) =>
      [store.name, store.address, store.phone, store.email]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(query)),
    );
  }, [debouncedSearchTerm, stores]);

  const pagination = usePagination(filteredStores, 10);

  const openEditModal = (store: StoreType) => {
    setEditing({
      id: store.id,
      managerId: store.managerId,
      name: store.name ?? "",
      address: store.address ?? "",
      phone: store.phone ?? "",
      email: store.email ?? "",
      isActive: store.isActive,
    });
    setFormError("");
  };

  const closeModal = () => {
    if (saving) {
      return;
    }
    setEditing(null);
  };

  const updateField = <K extends keyof StoreFormState>(
    field: K,
    value: StoreFormState[K],
  ) => {
    setEditing((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing || saving) {
      return;
    }

    if (!editing.name.trim()) {
      setFormError("Vui lòng nhập tên cửa hàng.");
      return;
    }

    setFormError("");
    setSaving(true);

    const payload: UpdateStore = {
      managerId: editing.managerId,
      name: editing.name.trim(),
      address: editing.address.trim(),
      phone: editing.phone.trim(),
      email: editing.email.trim(),
      isActive: editing.isActive,
    };

    try {
      await storeApi.updateStore(editing.id, payload);
      setEditing(null);
      await loadStores();
    } catch (submitError) {
      setFormError(getBackendErrorMessage(submitError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#D56756]/10 text-[#B24C40]">
          <Store className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
          Quản lý cửa hàng
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Xem và cập nhật thông tin các cửa hàng (phòng khám) trên hệ thống.
        </p>
      </div>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-slate-950">Danh sách cửa hàng</h2>
            <p className="mt-1 text-sm text-slate-500">
              Tổng số {filteredStores.length} cửa hàng.
            </p>
          </div>
          <div className="relative w-full md:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên, địa chỉ, SĐT, email"
              value={searchTerm}
            />
          </div>
        </div>

        <div className="grid grid-cols-[1.6fr_2fr_1.2fr_1fr_0.8fr] border-b border-slate-200 bg-[#F8F1E4] px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.14em] text-slate-700">
          <span>Tên cửa hàng</span>
          <span>Địa chỉ</span>
          <span>Liên hệ</span>
          <span>Trạng thái</span>
          <span className="text-right">Thao tác</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Đang tải danh sách cửa hàng...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-sm font-semibold text-red-600">
            {error}
          </div>
        ) : filteredStores.length > 0 ? (
          pagination.pageItems.map((store) => (
            <div
              key={store.id}
              className="grid grid-cols-[1.6fr_2fr_1.2fr_1fr_0.8fr] items-center border-b border-slate-200 px-6 py-5 text-sm text-slate-700 last:border-b-0"
            >
              <div className="font-semibold text-slate-950">
                {store.name || "—"}
              </div>
              <div className="pr-3 text-slate-600">{store.address || "—"}</div>
              <div className="pr-3">
                <p className="text-slate-900">{store.phone || "—"}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {store.email || "—"}
                </p>
              </div>
              <div>
                {store.isActive ? (
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Đang hoạt động
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Tạm ngưng
                  </span>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => openEditModal(store)}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Sửa
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-sm text-slate-500">
            Không tìm thấy cửa hàng nào.
          </div>
        )}

        {!loading && !error && filteredStores.length > 0 ? (
          <div className="border-t border-slate-200 px-6 py-4">
            <PaginationControls
              canGoNext={pagination.canGoNext}
              canGoPrevious={pagination.canGoPrevious}
              currentPage={pagination.currentPage}
              onNext={pagination.goNext}
              onPrevious={pagination.goPrevious}
              totalItems={filteredStores.length}
              totalPages={pagination.totalPages}
            />
          </div>
        ) : null}
      </section>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-950">
                Cập nhật cửa hàng
              </h2>
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
              {formError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {formError}
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="name">Tên cửa hàng</Label>
                <Input
                  id="name"
                  value={editing.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Pet Hub Quận 1"
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={editing.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  placeholder="123 Nguyễn Huệ, Quận 1, TP.HCM"
                  disabled={saving}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={editing.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="0901234567"
                    disabled={saving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editing.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="store@email.com"
                    disabled={saving}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={editing.isActive}
                  onChange={(event) =>
                    updateField("isActive", event.target.checked)
                  }
                  disabled={saving}
                  className="h-4 w-4 rounded border-slate-300 text-[#D56756] focus:ring-[#D56756]"
                />
                Cửa hàng đang hoạt động
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Huỷ
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#D56756] px-5 text-white hover:bg-[#B24C40]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    "Lưu thay đổi"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminStoresManage;
