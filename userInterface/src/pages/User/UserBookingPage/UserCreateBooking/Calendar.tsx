import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const WEEKDAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const MONTH_NAMES = [
  "tháng 1",
  "tháng 2",
  "tháng 3",
  "tháng 4",
  "tháng 5",
  "tháng 6",
  "tháng 7",
  "tháng 8",
  "tháng 9",
  "tháng 10",
  "tháng 11",
  "tháng 12",
];

const formatDateVN = (date: Date) =>
  date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

interface CalendarProps {
  selected: Date | null;
  onSelect: (d: Date) => void;
}

const Calendar = ({ selected, onSelect }: CalendarProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      {/* Nav */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-slate-800">
          {MONTH_NAMES[viewMonth]} năm {viewYear}
        </span>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
          >
            <ChevronLeft className="h-4 w-4 text-slate-500" />
          </button>
          <button
            onClick={nextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
          >
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-slate-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;

          const cellDate = new Date(viewYear, viewMonth, day);
          cellDate.setHours(0, 0, 0, 0);
          const isToday = cellDate.getTime() === today.getTime();
          const isPast = cellDate < today;
          const isSelected =
            selected &&
            selected.getFullYear() === viewYear &&
            selected.getMonth() === viewMonth &&
            selected.getDate() === day;

          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => onSelect(cellDate)}
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition
                ${isPast ? "text-slate-300 cursor-not-allowed" : "hover:bg-slate-100 cursor-pointer"}
                ${isToday && !isSelected ? "border-2 border-[#172554] text-[#172554] font-bold" : ""}
                ${isSelected ? "bg-[#D56756] text-white hover:bg-[#c25248] font-bold" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Selected date label */}
      {selected && (
        <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3">
          <p className="text-xs text-rose-400 font-semibold mb-0.5 flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            Đã chọn:
          </p>
          <p className="text-sm font-bold text-rose-700">
            {formatDateVN(selected)}
          </p>
        </div>
      )}
    </div>
  );
};

export default Calendar;
