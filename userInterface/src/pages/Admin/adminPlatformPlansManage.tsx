import { useEffect, useState, type FormEvent } from "react";
import { Layers, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import platformPlanApi from "@/apis/platformPlanAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PlatformPlan } from "@/types/platformPlan.type";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";

type PlanFormState = {
  id: string | null;
  name: string;
  price: string;
  durationInDays: string;
  isActive: boolean;
};

const emptyForm: PlanFormState = {
  id: null,
  name: "",
  price: "",
  durationInDays: "",
  isActive: true,
};

const formatVnd = (price: number) => `${price.toLocaleString("vi-VN")}đ`;

const AdminPlatformPlansManage = () => {
  const [plans, setPlans] = useState<PlatformPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<PlanFormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadPlans = async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");

    try {
      const response = await platformPlanApi.getAllPlatformPlans({ signal });
      setPlans(response?.data ?? []);
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
    void loadPlans(controller.signal);
    return () => controller.abort();
  }, []);

  const openCreateModal = () => {
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (plan: PlatformPlan) => {
    setForm({
      id: plan.id,
      name: plan.name ?? "",
      price: String(plan.price ?? 0),
      durationInDays: String(plan.durationInDays ?? 0),
      isActive: plan.isActive,
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }
    setModalOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    const price = Number(form.price);
    const durationInDays = Number(form.durationInDays);

    if (!form.name.trim()) {
      setFormError("Vui lòng nhập tên gói.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setFormError("Giá không hợp lệ.");
      return;
    }
    if (!Number.isInteger(durationInDays) || durationInDays <= 0) {
      setFormError("Thời hạn (ngày) phải là số nguyên dương.");
      return;
    }

    setFormError("");
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      price,
      durationInDays,
      isActive: form.isActive,
    };

    try {
      if (form.id) {
        await platformPlanApi.updatePlatformPlan(form.id, payload);
      } else {
        await platformPlanApi.createPlatformPlan(payload);
      }
      setModalOpen(false);
      await loadPlans();
    } catch (submitError) {
      setFormError(getBackendErrorMessage(submitError));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plan: PlatformPlan) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xoá gói "${plan.name ?? "này"}"?`,
    );
    if (!confirmed) {
      return;
    }

    setDeletingId(plan.id);
    setError("");

    try {
      await platformPlanApi.deletePlatformPlan(plan.id);
      await loadPlans();
    } catch (deleteError) {
      setError(getBackendErrorMessage(deleteError));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#D56756]/10 text-[#B24C40]">
            <Layers className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
            Quản lý gói dịch vụ
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Tạo, chỉnh sửa và xoá các gói nền tảng (Platform Plan).
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-[#D56756] px-5 text-white hover:bg-[#B24C40]"
        >
          <Plus className="h-4 w-4" />
          Thêm gói
        </Button>
      </div>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr] border-b border-slate-200 bg-[#F8F1E4] px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.14em] text-slate-700">
          <span>Tên gói</span>
          <span>Giá</span>
          <span>Thời hạn</span>
          <span>Trạng thái</span>
          <span className="text-right">Thao tác</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Đang tải danh sách gói...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-sm font-semibold text-red-600">
            {error}
          </div>
        ) : plans.length > 0 ? (
          plans.map((plan) => (
            <div
              key={plan.id}
              className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr] items-center border-b border-slate-200 px-6 py-5 text-sm text-slate-700 last:border-b-0"
            >
              <div className="font-semibold text-slate-950">
                {plan.name || "—"}
              </div>
              <div className="font-medium text-slate-950">
                {formatVnd(plan.price)}
              </div>
              <div>{plan.durationInDays} ngày</div>
              <div>
                {plan.isActive ? (
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Đang bật
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Đã tắt
                  </span>
                )}
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(plan)}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(plan)}
                  disabled={deletingId === plan.id}
                  className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                >
                  {deletingId === plan.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Xoá
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-sm text-slate-500">
            Chưa có gói dịch vụ nào.
          </div>
        )}
      </section>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-950">
                {form.id ? "Cập nhật gói" : "Thêm gói mới"}
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
                <Label htmlFor="name">Tên gói</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="Premium"
                  disabled={saving}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Giá (đ)</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, price: event.target.value }))
                    }
                    placeholder="249000"
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="durationInDays">Thời hạn (ngày)</Label>
                  <Input
                    id="durationInDays"
                    type="number"
                    min={1}
                    value={form.durationInDays}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        durationInDays: event.target.value,
                      }))
                    }
                    placeholder="30"
                    disabled={saving}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      isActive: event.target.checked,
                    }))
                  }
                  disabled={saving}
                  className="h-4 w-4 rounded border-slate-300 text-[#D56756] focus:ring-[#D56756]"
                />
                Kích hoạt gói
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
                  ) : form.id ? (
                    "Lưu thay đổi"
                  ) : (
                    "Tạo gói"
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

export default AdminPlatformPlansManage;
