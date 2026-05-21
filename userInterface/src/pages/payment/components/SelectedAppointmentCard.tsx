import { AlertCircle } from "lucide-react";
import type { AppointmentPOS } from "../types/payment.type";
import { formatAppointmentDate } from "../utils/payment.utils";

interface SelectedAppointmentCardProps {
  appointment: AppointmentPOS | null;
  compact?: boolean;
}

const SelectedAppointmentCard = ({
  appointment,
  compact = false,
}: SelectedAppointmentCardProps) => {
  if (!appointment) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-700">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Vui lòng chọn lịch hẹn
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-slate-50 ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        Đang thanh toán cho
      </p>
      <div className="mt-3 space-y-1">
        <p className="text-base font-bold text-slate-950">
          {appointment.petName}
        </p>
        <p className="text-sm font-semibold text-slate-700">
          {appointment.customerName}
        </p>
        <p className="text-sm text-slate-500">
          {formatAppointmentDate(appointment.appointmentDate)}
        </p>
        <p className="text-xs font-medium text-slate-500">
          Appointment #{appointment.id}
        </p>
      </div>
    </div>
  );
};

export default SelectedAppointmentCard;
