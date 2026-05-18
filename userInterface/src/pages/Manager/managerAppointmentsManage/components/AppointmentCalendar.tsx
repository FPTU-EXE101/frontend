import { Button } from "@/components/ui/button";
import type { Appointment } from "@/types/appointment.type";
import type { AppointmentStatus } from "@/types/enum.type";
import { statusMeta, WEEKDAY_LABELS } from "../appointment.constants";
import { buildCalendarCells, formatMonthTitle, toDateKey } from "../utils";

interface AppointmentCalendarProps {
  appointmentsByDate: Record<string, Appointment[]>;
  selectedDate: string;
  statusCounts: Record<AppointmentStatus, number>;
  viewDate: Date;
  onMoveMonth: (step: number) => void;
  onSelectDate: (date: string) => void;
}

const AppointmentCalendar = ({
  appointmentsByDate,
  selectedDate,
  statusCounts,
  viewDate,
  onMoveMonth,
  onSelectDate,
}: AppointmentCalendarProps) => {
  const calendarCells = buildCalendarCells(viewDate);

  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-semibold text-slate-950">
          {formatMonthTitle(viewDate)}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon-sm" onClick={() => onMoveMonth(-1)}>
            ‹
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => onMoveMonth(1)}>
            ›
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-3 text-center text-xs font-semibold text-slate-500">
        {WEEKDAY_LABELS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-7 gap-y-3">
        {calendarCells.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="h-12" />;

          const dateKey = toDateKey(
            new Date(viewDate.getFullYear(), viewDate.getMonth(), day),
          );
          const dayAppointments = appointmentsByDate[dateKey] ?? [];
          const isSelected = selectedDate === dateKey;

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(dateKey)}
              className={`mx-auto flex h-12 w-12 flex-col items-center justify-center rounded-full text-sm font-medium transition ${
                isSelected
                  ? "bg-[#D56756] text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>{day}</span>
              {dayAppointments.length > 0 && (
                <span className="mt-1 flex gap-0.5">
                  {([0, 1, 2] as AppointmentStatus[]).map((status) =>
                    dayAppointments.some(
                      (appointment) => appointment.status === status,
                    ) ? (
                      <span
                        key={status}
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? "bg-white" : statusMeta[status].dot
                        }`}
                      />
                    ) : null,
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 space-y-3 text-sm text-slate-600">
        {([0, 1, 2] as AppointmentStatus[]).map((status) => (
          <div key={status} className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${statusMeta[status].dot}`} />
              {statusMeta[status].label}
            </span>
            <span className="font-semibold text-slate-900">
              {statusCounts[status]}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AppointmentCalendar;

