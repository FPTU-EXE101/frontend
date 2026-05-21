import { Clock, Edit3, Loader2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Appointment } from "@/types/appointment.type";
import type { AppointmentRemind } from "@/types/appointmentRemind.type";
import { reminderStatusLabel, statusMeta } from "../appointment.constants";
import { formatReminderTime, toTimeInput } from "../utils";

interface AppointmentListItemProps {
  appointment: Appointment;
  canceling: boolean;
  customerName: string;
  petName: string;
  reminder?: AppointmentRemind;
  onCancelAppointment: (appointment: Appointment) => void;
  onCancelReminder: (reminder: AppointmentRemind) => void;
  onEdit: (appointment: Appointment) => void;
}

const AppointmentListItem = ({
  appointment,
  canceling,
  customerName,
  petName,
  reminder,
  onCancelAppointment,
  onCancelReminder,
  onEdit,
}: AppointmentListItemProps) => {
  const isPending = canceling;

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusMeta[appointment.status].badge}`}
            >
              {statusMeta[appointment.status].label}
            </span>
            {
              appointment.status === 0 && reminder && (
                <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Nhắc lịch: {reminderStatusLabel[reminder.status]}
                </span>
              )
            }
            {/* {reminder && (
              <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Nhắc lịch: {reminderStatusLabel[reminder.status]}
              </span>
            )} */}
          </div>

          <h3 className="text-lg font-semibold text-slate-950">
            {appointment.appointmentNote || "Lịch hẹn khách hàng"}
          </h3>

          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#D56756]" />
              {toTimeInput(appointment.startTime)} -{" "}
              {toTimeInput(appointment.endTime)}
            </span>
            <span>
              Khách: <strong className="text-slate-900">{customerName}</strong>
            </span>
            <span>
              Thú cưng: <strong className="text-slate-900">{petName}</strong>
            </span>
            <span>Nhắc lịch: {formatReminderTime(reminder?.reminderTime)}</span>
          </div>
        </div>

        {appointment.status === 0 ? (
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Button
              variant="outline"
              className="h-9 rounded-full"
              disabled={isPending}
              onClick={() => onEdit(appointment)}
            >
              <Edit3 className="h-4 w-4" />
              Sửa
            </Button>
            {reminder && (
              <Button
                variant="outline"
                className="h-9 rounded-full text-amber-700 hover:bg-amber-50"
                disabled={isPending}
                onClick={() => onCancelReminder(reminder)}
              >
                <X className="h-4 w-4" />
                Xóa nhắc
              </Button>
            )}
            <Button
              variant="outline"
              className="h-9 rounded-full text-rose-600 hover:bg-rose-50"
              disabled={isPending}
              onClick={() => onCancelAppointment(appointment)}
            >
              {canceling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Huỷ lịch
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default AppointmentListItem;
