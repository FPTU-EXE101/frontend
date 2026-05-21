import { CalendarDays, Loader2, Search } from "lucide-react";
import type { AppointmentPOS } from "../types/payment.type";
import {
  formatAppointmentDate,
  getStatusLabel,
} from "../utils/payment.utils";

interface AppointmentSelectorProps {
  appointments: AppointmentPOS[];
  loading: boolean;
  searchTerm: string;
  selectedAppointment: AppointmentPOS | null;
  onSearchChange: (value: string) => void;
  onSelectAppointment: (appointment: AppointmentPOS) => void;
}

const AppointmentSelector = ({
  appointments,
  loading,
  searchTerm,
  selectedAppointment,
  onSearchChange,
  onSelectAppointment,
}: AppointmentSelectorProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-950">
            Chọn lịch hẹn thanh toán
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Chỉ chọn appointment hợp lệ để tránh tạo nhầm invoice.
          </p>
        </div>
        <span className="text-xs font-medium text-slate-500">
          {appointments.length} lịch hẹn
        </span>
      </div>

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Tìm appointment, khách hàng, thú cưng..."
          className="h-11 w-full rounded-full border border-slate-300 bg-white pl-11 pr-5 text-sm text-slate-700 outline-none transition focus:border-[#D56756] focus:ring-2 focus:ring-[#D56756]/15"
        />
      </div>

      {loading ? (
        <div className="flex min-h-32 items-center justify-center gap-3 text-sm font-medium text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-[#D56756]" />
          Đang tải lịch hẹn...
        </div>
      ) : appointments.length > 0 ? (
        <div className="grid max-h-80 gap-3 overflow-y-auto pr-1 lg:grid-cols-2">
          {appointments.map((appointment) => {
            const selected = selectedAppointment?.id === appointment.id;

            return (
              <button
                key={appointment.id}
                type="button"
                onClick={() => onSelectAppointment(appointment)}
                className={`rounded-2xl border p-4 text-left transition ${
                  selected
                    ? "border-[#D56756] bg-[#D56756]/5 shadow-sm"
                    : "border-slate-200 bg-white hover:border-[#D56756]/40 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-950">
                      Appointment #{appointment.id}
                    </p>
                    <p className="mt-2 truncate text-sm font-semibold text-slate-700">
                      {appointment.petName} - {appointment.customerName}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <CalendarDays className="h-4 w-4 text-[#D56756]" />
                  {formatAppointmentDate(appointment.appointmentDate)}
                </p>
                {appointment.appointmentNote ? (
                  <p className="mt-2 line-clamp-2 text-xs font-medium text-slate-500">
                    {appointment.appointmentNote}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-32 items-center justify-center text-center text-sm font-medium text-slate-500">
          Không có lịch hẹn hợp lệ.
        </div>
      )}
    </section>
  );
};

export default AppointmentSelector;
