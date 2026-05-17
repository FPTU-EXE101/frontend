import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PawPrint,
  FileText,
  CheckCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import petApi from "@/apis/petAPI";
import appointmentApi from "@/apis/appointmentAPI";
import type { Pet } from "@/types/pet.type";
import type { CreateAppointmentRequest, Appointment } from "@/types/appoinment";
import Calendar from "./Calendar";
import TimeSlotPicker, { type BookedSlot } from "./TimeSlotPicker";
import StepBar from "./StepBar";

// ─── constants ────────────────────────────────────────────────────────────────

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

// ─── Main Page ────────────────────────────────────────────────────────────────

const UserCreateBookingPage = () => {
  const navigate = useNavigate();

  // data
  const [pets, setPets] = useState<Pet[]>([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

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

    petApi
      .getPetByCustomerId(userId)
      .then((res) => setPets(res?.data ?? []))
      .catch(console.error)
      .finally(() => setPetsLoading(false));
  }, []);

  // fetch appointments for the selected pet
  useEffect(() => {
    if (!selectedPet?.id) {
      setAppointments([]);
      return;
    }

    appointmentApi
      .getAppointmentsByPetId(selectedPet.id)
      .then((res) => setAppointments(res?.data ?? []))
      .catch(console.error);
  }, [selectedPet?.id]);

  // Get booked slots for the selected date based on appointment status
  const getBookedSlotsForDate = (): BookedSlot[] => {
    if (!selectedDate) return [];

    const selectedDateISO = toISO(selectedDate);
    return appointments
      .filter((apt) => apt.appointmentDate === selectedDateISO)
      .map((apt) => ({
        time: apt.startTime.substring(0, 5), // Convert "HH:MM:SS" to "HH:MM"
        status: apt.status,
      }));
  };

  // ── step navigation ─────────────────────────────────────────────────────
  const canNext = () => {
    if (step === 0) return !!selectedPet;
    if (step === 1) return !!selectedDate && !!selectedTime;
    if (step === 2) return true;
    return false;
  };

  const handleNext = () => {
    if (canNext()) setStep((s) => s + 1);
  };
  const handleBack = () => setStep((s) => s - 1);

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

    

    try {
      await appointmentApi.createAppointment(payload);
      setSuccess(true);
    } catch (err: any) {
      console.error(
        "[DEBUG] Lỗi response:",
        err?.response?.status,
        err?.response?.data,
      );
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.response?.data ||
        "Đặt lịch thất bại. Vui lòng thử lại sau.";
      setError(
        typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg),
      );
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
          <h2 className="text-2xl font-bold text-slate-900">
            Đặt lịch thành công!
          </h2>
          <p className="text-slate-500 text-sm">
            Lịch hẹn của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ xác nhận sớm
            nhất có thể.
          </p>
          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-5 py-4 text-sm text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Thú cưng</span>
              <span className="font-semibold">{selectedPet?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ngày</span>
              <span className="font-semibold">
                {selectedDate && formatDateVN(selectedDate)}
              </span>
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
            <h1 className="text-2xl font-bold text-slate-900">
              Đặt lịch hẹn mới
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Đặt lịch khám cho bé cưng của bạn
            </p>
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
              <div className="py-8 text-center text-slate-400">
                Đang tải danh sách thú cưng...
              </div>
            ) : pets.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                <p className="text-4xl mb-3">🐾</p>
                <p>Bạn chưa có thú cưng nào được đăng ký.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {pets.map((pet) => (
                  <button
                    key={pet.id}
                    onClick={() => setSelectedPet(pet)}
                    className={`flex items-center gap-4 rounded-2xl border-2 px-4 py-4 text-left transition
                      ${
                        selectedPet?.id === pet.id
                          ? "border-[#D56756] bg-rose-50"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }
                    `}
                  >
                    <span className="text-3xl">🐾</span>
                    <div>
                      <p className="font-semibold text-slate-900">{pet.name}</p>
                      {(pet as any).species && (
                        <p className="text-xs text-slate-500">
                          {(pet as any).species}
                        </p>
                      )}
                      {pet.color && (
                        <p className="text-xs text-slate-400">
                          Màu: {pet.color}
                        </p>
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
              bookedSlots={getBookedSlotsForDate()}
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
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Bé cần kiểm tra sức khỏe định kỳ, có triệu chứng ho nhẹ..."
              rows={5}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D56756]/30 focus:border-[#D56756] transition resize-none"
            />
            <p className="text-xs text-slate-400">
              Ghi chú không bắt buộc. Nếu không có ghi chú, chúng tôi sẽ đặt là
              &quot;Không có ghi chú&quot;.
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
                <p className="font-semibold text-slate-800">
                  {selectedPet?.name}
                </p>
                {(selectedPet as any)?.species && (
                  <p className="text-xs text-slate-500">
                    {(selectedPet as any).species}
                  </p>
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
