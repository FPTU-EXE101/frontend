import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CalendarDays, Clock, PawPrint, FileText, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import petApi from "@/apis/petAPI";
import appointmentApi from "@/apis/appointmentAPI";
import type { Pet } from "@/types/pet.type";
import type { CreateAppointmentRequest } from "@/types/appoinment";

// ─── constants ────────────────────────────────────────────────────────────────

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00",
];

const WEEKDAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const MONTH_NAMES = [
  "tháng 1", "tháng 2", "tháng 3", "tháng 4", "tháng 5", "tháng 6",
  "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12",
];

// Add 30 minutes to get endTime
const addThirtyMin = (time: string): string => {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + 30;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}:00`;
};

const toTimeString = (t: string) => `${t}:00`;

const formatDateVN = (date: Date) =>
  date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const toISO = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// ─── Calendar ─────────────────────────────────────────────────────────────────

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
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
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
        {WEEKDAY_LABELS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">
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
          <p className="text-sm font-bold text-rose-700">{formatDateVN(selected)}</p>
        </div>
      )}
    </div>
  );
};

// ─── Time Slot Picker ─────────────────────────────────────────────────────────

interface TimeSlotPickerProps {
  selected: string | null;
  onSelect: (t: string) => void;
  bookedSlots?: string[];
}

const TimeSlotPicker = ({ selected, onSelect, bookedSlots = [] }: TimeSlotPickerProps) => (
  <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-2 mb-3">
      <Clock className="h-4 w-4 text-[#D56756]" />
      <h3 className="font-semibold text-slate-800">Chọn khung giờ</h3>
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
        <span className="inline-block h-4 w-4 rounded bg-[#D56756]" />
        Đang chọn
      </span>
    </div>

    <div className="grid grid-cols-6 gap-2">
      {TIME_SLOTS.map(slot => {
        const isBooked = bookedSlots.includes(slot);
        const isSelected = selected === slot;

        return (
          <button
            key={slot}
            disabled={isBooked}
            onClick={() => onSelect(slot)}
            className={`rounded-full px-2 py-2 text-xs font-medium transition
              ${isBooked ? "bg-slate-200 text-slate-400 cursor-not-allowed" : ""}
              ${isSelected ? "bg-[#D56756] text-white shadow-sm" : ""}
              ${!isBooked && !isSelected ? "border border-slate-200 bg-white text-slate-700 hover:border-[#D56756] hover:text-[#D56756]" : ""}
            `}
          >
            {slot}
          </button>
        );
      })}
    </div>
  </div>
);

// ─── Step indicator ───────────────────────────────────────────────────────────

const steps = [
  { label: "Chọn thú cưng", icon: PawPrint },
  { label: "Chọn ngày & giờ", icon: CalendarDays },
  { label: "Ghi chú", icon: FileText },
  { label: "Xác nhận", icon: CheckCircle },
];

interface StepBarProps { current: number }
const StepBar = ({ current }: StepBarProps) => (
  <div className="flex items-center gap-0">
    {steps.map((s, i) => {
      const Icon = s.icon;
      const done = i < current;
      const active = i === current;
      return (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition
              ${done ? "border-[#D56756] bg-[#D56756] text-white" : ""}
              ${active ? "border-[#D56756] bg-white text-[#D56756]" : ""}
              ${!done && !active ? "border-slate-200 bg-white text-slate-400" : ""}
            `}>
              <Icon className="h-4 w-4" />
            </div>
            <span className={`mt-1 text-xs font-medium whitespace-nowrap
              ${active ? "text-[#D56756]" : done ? "text-slate-600" : "text-slate-400"}
            `}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-12 mb-5 mx-1 ${i < current ? "bg-[#D56756]" : "bg-slate-200"}`} />
          )}
        </div>
      );
    })}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const UserCreateBookingPage = () => {
  const navigate = useNavigate();

  // data
  const [pets, setPets] = useState<Pet[]>([]);
  const [petsLoading, setPetsLoading] = useState(true);

  // form state
  const [step, setStep] = useState(0);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [note, setNote] = useState("");

  // submit
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // fetch pets owned by this customer
  useEffect(() => {
    const userId = localStorage.getItem("userId") || "";
    if (!userId) return;

    petApi.getPetByCustomerId(userId)
      .then(res => setPets(res?.data ?? []))
      .catch(console.error)
      .finally(() => setPetsLoading(false));
  }, []);

  // ── step navigation ─────────────────────────────────────────────────────
  const canNext = () => {
    if (step === 0) return !!selectedPet;
    if (step === 1) return !!selectedDate && !!selectedTime;
    if (step === 2) return true;
    return false;
  };

  const handleNext = () => { if (canNext()) setStep(s => s + 1); };
  const handleBack = () => setStep(s => s - 1);

  // ── submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId") || "";
    if (!userId || !selectedPet || !selectedDate || !selectedTime) return;

    setSubmitting(true);
    setError("");

    const payload: CreateAppointmentRequest = {
      customerId: userId,
      petId: selectedPet.id,
      appointmentDate: toISO(selectedDate),
      startTime: toTimeString(selectedTime),
      endTime: addThirtyMin(selectedTime),
      appointmentNote: note.trim() || "Không có ghi chú",
    };

    // 🔍 DEBUG: log exact payload and userId
    console.log("[DEBUG] userId from localStorage:", userId);
    console.log("[DEBUG] payload gửi lên:", JSON.stringify(payload, null, 2));

    try {
      await appointmentApi.createAppointment(payload);
      setSuccess(true);
    } catch (err: any) {
      console.error("[DEBUG] Lỗi response:", err?.response?.status, err?.response?.data);
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.response?.data ||
        "Đặt lịch thất bại. Vui lòng thử lại sau.";
      setError(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));
    } finally {
      setSubmitting(false);
    }
  };

  // ── success screen ──────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-5">
          <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Đặt lịch thành công!</h2>
          <p className="text-slate-500 text-sm">
            Lịch hẹn của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ xác nhận sớm nhất có thể.
          </p>
          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-5 py-4 text-sm text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Thú cưng</span>
              <span className="font-semibold">{selectedPet?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ngày</span>
              <span className="font-semibold">{selectedDate && formatDateVN(selectedDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Giờ</span>
              <span className="font-semibold">{selectedTime}</span>
            </div>
          </div>
          <Button
            onClick={() => navigate("/user/booking")}
            className="w-full rounded-full bg-[#172554] text-white hover:bg-[#1e3a8a]"
          >
            Xem lịch hẹn của tôi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3rem)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/user/booking")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="h-4 w-4 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Đặt lịch hẹn mới</h1>
            <p className="text-sm text-slate-500 mt-0.5">Đặt lịch khám cho bé cưng của bạn</p>
          </div>
        </div>

        {/* Step bar */}
        <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-5 shadow-sm flex justify-center overflow-x-auto">
          <StepBar current={step} />
        </div>

        {/* ── Step 0: Chọn thú cưng ─────────────────────────────────────── */}
        {step === 0 && (
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <PawPrint className="h-4 w-4 text-[#D56756]" />
              Chọn thú cưng
            </h2>

            {petsLoading ? (
              <div className="py-8 text-center text-slate-400">Đang tải danh sách thú cưng...</div>
            ) : pets.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                <p className="text-4xl mb-3">🐾</p>
                <p>Bạn chưa có thú cưng nào được đăng ký.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {pets.map(pet => (
                  <button
                    key={pet.id}
                    onClick={() => setSelectedPet(pet)}
                    className={`flex items-center gap-4 rounded-2xl border-2 px-4 py-4 text-left transition
                      ${selectedPet?.id === pet.id
                        ? "border-[#D56756] bg-rose-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                      }
                    `}
                  >
                    <span className="text-3xl">🐾</span>
                    <div>
                      <p className="font-semibold text-slate-900">{pet.name}</p>
                      {(pet as any).species && (
                        <p className="text-xs text-slate-500">{(pet as any).species}</p>
                      )}
                      {pet.color && (
                        <p className="text-xs text-slate-400">Màu: {pet.color}</p>
                      )}
                    </div>
                    {selectedPet?.id === pet.id && (
                      <CheckCircle className="ml-auto h-5 w-5 text-[#D56756] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Step 1: Chọn ngày & giờ ──────────────────────────────────── */}
        {step === 1 && (
          <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
            <Calendar selected={selectedDate} onSelect={setSelectedDate} />
            <TimeSlotPicker
              selected={selectedTime}
              onSelect={setSelectedTime}
            />
          </div>
        )}

        {/* ── Step 2: Ghi chú ──────────────────────────────────────────── */}
        {step === 2 && (
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#D56756]" />
              Ghi chú cho lịch hẹn
            </h2>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ví dụ: Bé cần kiểm tra sức khỏe định kỳ, có triệu chứng ho nhẹ..."
              rows={5}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D56756]/30 focus:border-[#D56756] transition resize-none"
            />
            <p className="text-xs text-slate-400">
              Ghi chú không bắt buộc. Nếu không có ghi chú, chúng tôi sẽ đặt là &quot;Không có ghi chú&quot;.
            </p>
          </div>
        )}

        {/* ── Step 3: Xác nhận ─────────────────────────────────────────── */}
        {step === 3 && (
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#D56756]" />
              Xác nhận thông tin lịch hẹn
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#F5F0E8] px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">Thú cưng</p>
                <p className="font-semibold text-slate-800">{selectedPet?.name}</p>
                {(selectedPet as any)?.species && (
                  <p className="text-xs text-slate-500">{(selectedPet as any).species}</p>
                )}
              </div>
              <div className="rounded-2xl bg-[#F5F0E8] px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">Ngày hẹn</p>
                <p className="font-semibold text-slate-800">
                  {selectedDate && formatDateVN(selectedDate)}
                </p>
              </div>
              <div className="rounded-2xl bg-[#F5F0E8] px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">Giờ bắt đầu</p>
                <p className="font-semibold text-slate-800">{selectedTime}</p>
              </div>
              <div className="rounded-2xl bg-[#F5F0E8] px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">Giờ kết thúc</p>
                <p className="font-semibold text-slate-800">
                  {selectedTime && addThirtyMin(selectedTime).slice(0, 5)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-sky-50 border border-sky-100 px-4 py-3">
              <p className="text-xs text-sky-400 font-semibold mb-1">Ghi chú</p>
              <p className="text-sm text-sky-700">
                {note.trim() || "Không có ghi chú"}
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}
          </div>
        )}

        {/* ── Navigation buttons ────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={step === 0 ? () => navigate("/user/booking") : handleBack}
            className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 px-6"
          >
            {step === 0 ? "Hủy" : "Quay lại"}
          </Button>

          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={!canNext()}
              className="rounded-full bg-[#D56756] text-white hover:bg-[#c25248] px-8 disabled:opacity-40"
            >
              Tiếp theo
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-full bg-[#172554] text-white hover:bg-[#1e3a8a] px-8 min-w-[140px]"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang đặt lịch...
                </span>
              ) : (
                "Xác nhận đặt lịch"
              )}
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserCreateBookingPage;