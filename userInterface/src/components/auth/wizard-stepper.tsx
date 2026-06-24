import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type WizardStepperProps = {
  steps: string[];
  current: number;
  className?: string;
};

/**
 * Thanh tiến trình hiển thị các bước của wizard đăng ký/đăng nhập.
 * Hoàn toàn ở front-end, không gọi request — chỉ phản ánh bước hiện tại.
 */
export function WizardStepper({ steps, current, className }: WizardStepperProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {steps.map((label, index) => {
        const isDone = index < current;
        const isActive = index === current;
        return (
          <div
            key={label}
            className={cn(
              "flex items-center",
              index < steps.length - 1 ? "flex-1" : "flex-none",
            )}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition",
                  isDone && "border-[#D56756] bg-[#D56756] text-white",
                  isActive &&
                    "border-[#D56756] bg-white text-[#D56756] ring-2 ring-[#D56756]/20",
                  !isDone &&
                    !isActive &&
                    "border-slate-200 bg-slate-50 text-slate-400",
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:block",
                  isActive
                    ? "text-slate-900"
                    : isDone
                      ? "text-slate-600"
                      : "text-slate-400",
                )}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1 rounded-full transition",
                  isDone ? "bg-[#D56756]" : "bg-slate-200",
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
