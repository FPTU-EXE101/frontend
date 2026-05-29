import type { FormEvent } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ReminderStatus } from "@/types/enum.type";
import type { Pet } from "@/types/pet.type";
import type { UserProfileValues } from "@/types/userProfile.type";
import { TIME_SLOTS } from "../appointment.constants";
import type { AppointmentFormState } from "../types";

type CustomerInputMode = "manual" | "email";

interface AppointmentFormModalProps {
  bookedSlots: string[];
  customerInputMode: CustomerInputMode;
  form: AppointmentFormState;
  ownerOptions: UserProfileValues[];
  ownerPets: Pet[];
  ownerPetsLoading: boolean;
  saving: boolean;
  selectedOwner: UserProfileValues | null;
  userSearch: string;
  onClose: () => void;
  onCustomerInputModeChange: (mode: CustomerInputMode) => void;
  onOwnerSelect: (owner: UserProfileValues) => void;
  onOwnerSearchChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdateForm: (field: keyof AppointmentFormState, value: string) => void;
  onUpdateReminderStatus: (status: ReminderStatus) => void;
}

const AppointmentFormModal = ({
  bookedSlots,
  customerInputMode,
  form,
  ownerOptions,
  ownerPets,
  ownerPetsLoading,
  saving,
  selectedOwner,
  userSearch,
  onClose,
  onCustomerInputModeChange,
  onOwnerSelect,
  onOwnerSearchChange,
  onSubmit,
  onUpdateForm,
  onUpdateReminderStatus,
}: AppointmentFormModalProps) => {
  const isEditMode = Boolean(form.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              {form.id ? "Cập nhật lịch hẹn" : "Thêm lịch hẹn mới"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Nhập thông tin lịch hẹn và nhắc lịch nếu cần.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 p-6">
          {!isEditMode && (
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 text-sm font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => onCustomerInputModeChange("manual")}
                disabled={saving}
                className={`rounded-xl px-3 py-2 transition ${
                  customerInputMode === "manual"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "hover:text-slate-900"
                }`}
              >
                Nhập ID thủ công
              </button>
              <button
                type="button"
                onClick={() => onCustomerInputModeChange("email")}
                disabled={saving}
                className={`rounded-xl px-3 py-2 transition ${
                  customerInputMode === "email"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "hover:text-slate-900"
                }`}
              >
                Tìm bằng email
              </button>
            </div>
          )}

          {customerInputMode === "manual" || isEditMode ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Customer ID
                <Input
                  required
                  value={form.customerId}
                  disabled={saving}
                  onChange={(event) =>
                    onUpdateForm("customerId", event.target.value)
                  }
                  placeholder="Nhập customerId"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Pet ID
                <Input
                  required
                  value={form.petId}
                  disabled={saving}
                  onChange={(event) => onUpdateForm("petId", event.target.value)}
                  placeholder="Nhập petId"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Email khách hàng
                <Input
                  value={userSearch}
                  disabled={saving}
                  onChange={(event) => onOwnerSearchChange(event.target.value)}
                  placeholder="Tìm theo email hoặc username"
                  autoComplete="off"
                />
              </label>

              {ownerOptions.length > 0 && !selectedOwner && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  {ownerOptions.map((owner) => (
                    <button
                      key={owner.id || owner.email}
                      type="button"
                      onClick={() => onOwnerSelect(owner)}
                      disabled={saving || ownerPetsLoading}
                      className="mb-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100 last:mb-0"
                    >
                      <div className="font-semibold text-slate-900">
                        {owner.userName || owner.email}
                      </div>
                      <div className="text-slate-500">{owner.email}</div>
                    </button>
                  ))}
                </div>
              )}

              {selectedOwner && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-medium text-slate-900">Khách đã chọn</div>
                  <div>
                    {selectedOwner.userName || selectedOwner.email} -{" "}
                    {selectedOwner.email}
                  </div>
                </div>
              )}

              <label className="space-y-2 text-sm font-medium text-slate-700">
                Thú cưng của khách
                <select
                  required
                  disabled={!selectedOwner || ownerPetsLoading || saving}
                  value={form.petId}
                  onChange={(event) => onUpdateForm("petId", event.target.value)}
                  className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm shadow-xs outline-none focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">
                    {ownerPetsLoading
                      ? "Đang tải thú cưng..."
                      : "Chọn thú cưng"}
                  </option>
                  {ownerPets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} {pet.color ? `- ${pet.color}` : ""}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Ngày hẹn
              <Input
                required
                type="date"
                value={form.appointmentDate}
                disabled={saving}
                onChange={(event) =>
                  onUpdateForm("appointmentDate", event.target.value)
                }
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Khung giờ
              <select
                required
                value={form.startTime}
                disabled={saving}
                onChange={(event) => onUpdateForm("startTime", event.target.value)}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm shadow-xs outline-none focus:border-slate-400"
              >
                <option value="">Chọn khung giờ</option>
                {TIME_SLOTS.map((slot) => {
                  const isCurrentSlot = form.id && form.startTime === slot;
                  const isBooked = bookedSlots.includes(slot) && !isCurrentSlot;

                  return (
                    <option key={slot} value={slot} disabled={isBooked}>
                      {slot}
                      {isBooked ? " - Đã có lịch" : ""}
                    </option>
                  );
                })}
              </select>
              {form.endTime && (
                <span className="text-xs font-normal text-slate-500">
                  Kết thúc tự động: {form.endTime}
                </span>
              )}
            </label>
          </div>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Ghi chú
            <textarea
              value={form.appointmentNote}
              disabled={saving}
              onChange={(event) =>
                onUpdateForm("appointmentNote", event.target.value)
              }
              placeholder="Nội dung lịch hẹn, dịch vụ cần thực hiện..."
              className="min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-xs outline-none focus:border-slate-400"
            />
          </label>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Nhắc lịch</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Thời gian nhắc
                <Input
                  type="datetime-local"
                  value={form.reminderTime}
                  disabled={saving}
                  onChange={(event) =>
                    onUpdateForm("reminderTime", event.target.value)
                  }
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Trạng thái nhắc
                <select
                  value={form.reminderStatus}
                  disabled={saving}
                  onChange={(event) =>
                    onUpdateReminderStatus(
                      Number(event.target.value) as ReminderStatus,
                    )
                  }
                  className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm shadow-xs outline-none focus:border-slate-400"
                >
                  <option value={0}>Đang chờ</option>
                  <option value={1}>Đã gửi</option>
                  <option value={2}>Thất bại</option>
                </select>
              </label>
            </div>
          </div>
               
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#D56756] text-white hover:bg-[#b2483c]"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving
                ? "Đang xử lý..."
                : form.id
                  ? "Lưu thay đổi"
                  : "Tạo lịch hẹn"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentFormModal;
