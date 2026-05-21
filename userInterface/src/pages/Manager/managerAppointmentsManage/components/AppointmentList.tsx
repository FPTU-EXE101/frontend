import {
  CalendarDays,
  Loader2,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Appointment } from "@/types/appointment.type";
import type { AppointmentRemind } from "@/types/appointmentRemind.type";
import type { AppointmentStatus } from "@/types/enum.type";
import type { StatusFilter } from "../types";
import AppointmentListItem from "./AppointmentListItem";

interface AppointmentListProps {
  customerNames: Record<string, string>;
  cancelingId: string | null;
  loading: boolean;
  petNames: Record<string, string>;
  reminderByAppointmentId: Record<string, AppointmentRemind>;
  searchTerm: string;
  selectedDayTitle: string;
  statusFilter: StatusFilter;
  visibleAppointments: Appointment[];
  onCreate: () => void;
  onCancelAppointment: (appointment: Appointment) => void;
  onCancelReminder: (reminder: AppointmentRemind) => void;
  onEdit: (appointment: Appointment) => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
}

const AppointmentList = ({
  customerNames,
  cancelingId,
  loading,
  petNames,
  reminderByAppointmentId,
  searchTerm,
  selectedDayTitle,
  statusFilter,
  visibleAppointments,
  onCreate,
  onCancelAppointment,
  onCancelReminder,
  onEdit,
  onSearchChange,
  onStatusFilterChange,
}: AppointmentListProps) => {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-semibold text-slate-950">
            Lịch hẹn {selectedDayTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {visibleAppointments.length} lịch hẹn
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Tìm khách, thú cưng, ghi chú..."
              className="h-10 pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(
                event.target.value === "all"
                  ? "all"
                  : (Number(event.target.value) as AppointmentStatus),
              )
            }
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-xs outline-none focus:border-slate-400"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value={0}>Đã xác nhận</option>
            <option value={1}>Hoàn thành</option>
            <option value={2}>Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="min-h-[18rem] p-6">
        {loading ? (
          <div className="flex min-h-[16rem] flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-[#D56756]" />
            Đang tải lịch hẹn...
          </div>
        ) : visibleAppointments.length > 0 ? (
          <div className="space-y-4">
            {visibleAppointments.map((appointment) => {
              const reminder = reminderByAppointmentId[appointment.id];

              return (
                <AppointmentListItem
                  key={appointment.id}
                  appointment={appointment}
                  canceling={cancelingId === appointment.id}
                  customerName={
                    customerNames[appointment.customerId] ||
                    appointment.customerId
                  }
                  petName={petNames[appointment.petId] || appointment.petId}
                  reminder={reminder}
                  onCancelAppointment={onCancelAppointment}
                  onCancelReminder={onCancelReminder}
                  onEdit={onEdit}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[16rem] flex-col items-center justify-center gap-4 text-center text-slate-500">
            <CalendarDays className="h-14 w-14 text-slate-300" />
            <div>
              <p className="font-medium text-slate-700">
                Không có lịch hẹn nào trong ngày này
              </p>
              <button
                type="button"
                onClick={onCreate}
                className="mt-3 text-sm font-semibold text-[#D56756] hover:text-[#b2483c]"
              >
                + Thêm lịch hẹn mới
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AppointmentList;
