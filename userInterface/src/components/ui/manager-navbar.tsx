import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUserName } from "@/lib/auth";

const formatDateLabel = () => {
  const now = new Date();
  const weekday = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
  }).format(now);
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${now.getDate()} tháng ${now.getMonth() + 1}, ${now.getFullYear()}`;
};
const ManagerNavbar = () => {
  const name = getCurrentUserName() || "Admin";

  return (
    <div className="mb-6 rounded-[2rem] border border-slate-200 bg-white px-6 py-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          {/* <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
            Chào buổi sáng, Admin!
          </p> */}
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            Chào buổi sáng, {name}! 👋
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Hôm nay là {formatDateLabel()}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start rounded-full border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm sm:self-auto">
          <Button
            variant="ghost"
            className="h-11 w-11 rounded-full p-0 text-slate-600 hover:bg-slate-100"
          >
            <BellRing className="h-5 w-5" />
          </Button>
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#D56756] text-sm font-semibold text-white">
            {name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerNavbar;
