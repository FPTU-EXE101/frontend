import { Clock, Info } from "lucide-react";
import type { AppointmentStatus } from "@/types/enum.type";

const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

function isToday(date: Date) {
  const selected = new Date(date);
  const now = new Date();

  return (
    selected.getFullYear() === now.getFullYear() &&
    selected.getMonth() === now.getMonth() &&
    selected.getDate() === now.getDate()
  );
}

export function isPastTimeSlot(date: Date | null, timeSlot: string | null) {
  if (!date || !timeSlot) return false;
  if (!isToday(date)) return false;

  const now = new Date();
  const [hour, minute] = timeSlot.split(":").map(Number);

  const selectedDateTime = new Date(date);
  selectedDateTime.setHours(hour, minute, 0, 0);

  return selectedDateTime <= now;
}

export interface BookedSlot {
  time: string;
  status: AppointmentStatus; // 0 = confirmed, 1 = completed, 2 = cancelled
}

interface TimeSlotPickerProps {
  selected: string | null;
  selectedDate: Date | null;
  onSelect: (t: string) => void;
  bookedSlots?: BookedSlot[];
}

const TimeSlotPicker = ({
  selected,
  selectedDate,
  onSelect,
  bookedSlots = [],
}: TimeSlotPickerProps) => {
  // Only show as booked if status is 0 (confirmed) or 1 (completed)
  // Status 2 (cancelled) should not block the slot
  const isSlotBooked = (slot: string): boolean => {
    const booked = bookedSlots.find((b) => b.time === slot);
    if (!booked) return false;
    // Only confirmed (0) and completed (1) appointments block the slot
    return booked.status === 0 || booked.status === 1;
  };

  const hasSelectedDate = Boolean(selectedDate);

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-[#D56756]" />
        <h3 className="font-semibold text-slate-800">Chọn khung giờ</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Vui lòng chọn ngày khám trước, sau đó chọn khung giờ còn trống phù hợp.
      </p>

      <div className="mt-3 mb-5 flex items-start gap-2 rounded-2xl border border-[#f0c7bd] bg-[#fff8f3] px-4 py-3 text-sm text-slate-600">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#D56756]" />
        <span>
          {hasSelectedDate
            ? "Chọn một khung giờ còn trống phù hợp với lịch của bạn."
            : "Vui lòng chọn ngày khám trước để xem các khung giờ khả dụng."}
        </span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-4 w-4 rounded border border-slate-300 bg-white" />
          Còn trống
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-4 w-4 rounded bg-slate-200" />
          Đã đặt
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-4 w-4 rounded bg-slate-200 opacity-50" />
          Đã qua
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-4 w-4 rounded bg-[#D56756]" />
          Đang chọn
        </span>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {TIME_SLOTS.map((slot) => {
          const booked = isSlotBooked(slot);
          const past = isPastTimeSlot(selectedDate, slot);
          const disabled = !hasSelectedDate || booked || past;
          const isSelected = selected === slot;

          return (
            <button
              key={slot}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (disabled) return;
                onSelect(slot);
              }}
              className={`rounded-full px-2 py-2 text-xs font-medium transition
                ${disabled ? "bg-slate-200 text-slate-400 opacity-50 cursor-not-allowed" : ""}
                ${isSelected ? "bg-[#D56756] text-white shadow-sm" : ""}
                ${!disabled && !isSelected ? "border border-slate-200 bg-white text-slate-700 hover:border-[#D56756] hover:text-[#D56756]" : ""}
              `}
              title={
                !hasSelectedDate
                  ? "Bạn cần chọn ngày khám trước khi chọn giờ"
                  : past
                  ? "Khung giờ này đã trôi qua"
                  : booked
                    ? "Khung giờ này đã có lịch hẹn khác"
                    : ""
              }
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
