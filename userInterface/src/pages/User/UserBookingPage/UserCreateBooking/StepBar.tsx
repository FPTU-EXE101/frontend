import { PawPrint, CalendarDays, FileText, CheckCircle } from "lucide-react";

const steps = [
  { label: "Chọn thú cưng", icon: PawPrint },
  { label: "Chọn ngày & giờ", icon: CalendarDays },
  { label: "Ghi chú", icon: FileText },
  { label: "Xác nhận", icon: CheckCircle },
];

interface StepBarProps {
  current: number;
}

const StepBar = ({ current }: StepBarProps) => (
  <div className="flex items-center gap-0">
    {steps.map((s, i) => {
      const Icon = s.icon;
      const done = i < current;
      const active = i === current;
      return (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition
              ${done ? "border-[#D56756] bg-[#D56756] text-white" : ""}
              ${active ? "border-[#D56756] bg-white text-[#D56756]" : ""}
              ${!done && !active ? "border-slate-200 bg-white text-slate-400" : ""}
            `}
            >
              <Icon className="h-4 w-4" />
            </div>
            <span
              className={`mt-1 text-xs font-medium whitespace-nowrap
              ${active ? "text-[#D56756]" : done ? "text-slate-600" : "text-slate-400"}
            `}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-0.5 w-12 mb-5 mx-1 ${i < current ? "bg-[#D56756]" : "bg-slate-200"}`}
            />
          )}
        </div>
      );
    })}
  </div>
);

export default StepBar;
