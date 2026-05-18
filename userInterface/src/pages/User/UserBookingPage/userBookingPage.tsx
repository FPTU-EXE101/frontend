import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import appointmentApi from "@/apis/appointmentAPI";
import petApi from "@/apis/petAPI";
import {
  CalendarDays,
  Heart,
  Phone,
  Info,
  XCircle,
  CheckCircle,
} from "lucide-react";
import type { Appointment } from "@/types/appointment";
import type { Pet } from "@/types/pet.type";
import { Link } from "react-router-dom";

type CancelTarget = {
  id: string;
  title: string;
  dateLabel: string;
  time: string;
};

type BookingStatusKey = Appointment["status"] | "all";

const statusFilters: {
  key: BookingStatusKey;
  label: string;
  color: string;
}[] = [
  { key: "all", label: "Tất cả", color: "bg-rose-50 text-rose-600" },
  { key: 0, label: "Đã xác nhận", color: "bg-sky-50 text-sky-700" },
  { key: 1, label: "Hoàn thành", color: "bg-emerald-50 text-emerald-700" },
  { key: 2, label: "Đã hủy", color: "bg-zinc-100 text-zinc-800" },
];

const statusLabel: Record<Exclude<BookingStatusKey, "all">, string> = {
  0: "Đã xác nhận",
  1: "Hoàn thành",
  2: "Đã hủy",
};

const statusBadgeStyle: Record<Exclude<BookingStatusKey, "all">, string> = {
  0: "bg-sky-100 text-sky-700",
  1: "bg-emerald-100 text-emerald-800",
  2: "bg-zinc-100 text-zinc-800",
};

const formatDateLabel = (value: string) => {
  if (!value) return "Chưa rõ";
  const date = new Date(value);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const UserBookingPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [petNames, setPetNames] = useState<Record<string, string>>({});
  const [activeFilter, setActiveFilter] = useState<BookingStatusKey>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<CancelTarget | null>(null);

  useEffect(() => {
    const loadAppointments = async () => {
      const userId = localStorage.getItem("userId") || "";

      if (!userId) {
        setError(
          "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response =
          await appointmentApi.getAppointmentsByCustomerId(userId);
        const appointmentsData: Appointment[] = response?.data ?? [];
        setAppointments(appointmentsData);

        const petIds = Array.from(
          new Set(appointmentsData.map((appointment) => appointment.petId)),
        ).filter(Boolean);

        if (petIds.length > 0) {
          const petResponses = await Promise.all(
            petIds.map((petId) => petApi.getPetById(petId)),
          );

          const petMap = petResponses.reduce<Record<string, string>>(
            (acc, petResponse) => {
              const pet = petResponse?.data as Pet | null;
              if (pet?.id) {
                acc[pet.id] = pet.name || "Thú cưng";
              }
              return acc;
            },
            {},
          );

          setPetNames(petMap);
        }
      } catch (err) {
        console.error(err);
        setError("Không tải được lịch hẹn. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const openCancelModal = (booking: CancelTarget) => {
    setCancelTarget(booking);
  };

  const closeCancelModal = () => {
    setCancelTarget(null);
  };

  const handleCancelAppointment = async () => {
    if (!cancelTarget) return;

    const appointmentId = cancelTarget.id;
    setCancelingId(appointmentId);
    setCancelSuccess(null);
    closeCancelModal();

    try {
      await appointmentApi.deleteAppointment(appointmentId);
      setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));

      setCancelSuccess("Hủy lịch hẹn thành công!");
      setTimeout(() => setCancelSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      alert("Hủy lịch hẹn thất bại. Vui lòng thử lại sau.");
    } finally {
      setCancelingId(null);
    }
  };

  const bookings = useMemo(() => {
    return appointments.map((appointment) => ({
      ...appointment,
      title: appointment.appointmentNote || "Lịch hẹn của bạn",
      dateLabel: formatDateLabel(appointment.appointmentDate),
      time: appointment.startTime || appointment.endTime || "Chưa rõ",
      petName: petNames[appointment.petId] || appointment.petId || "Thú cưng",
      phone: localStorage.getItem("phone") || "Chưa rõ",
    }));
  }, [appointments, petNames]);

  const currentBookings = useMemo(() => {
    if (activeFilter === "all") return bookings;
    return bookings.filter((booking) => booking.status === activeFilter);
  }, [activeFilter, bookings]);

  const counts = useMemo(() => {
    const result: Record<BookingStatusKey, number> = {
      all: bookings.length,
      0: 0,
      1: 0,
      2: 0,
    };

    bookings.forEach((booking) => {
      if (booking.status in result) {
        result[booking.status] += 1;
      }
    });

    return result;
  }, [bookings]);

  return (
    <div className="min-h-[calc(100vh-3rem)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Lịch hẹn của tôi
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Quản lý tất cả lịch hẹn của bạn
            </p>
          </div>
          <Button className="inline-flex  items-center rounded-full bg-[#D56756] px-5 py-3 text-sm font-semibold text-white hover:bg-[#c25248]">
            <Link to={`new`}>Đặt lịch mới</Link>
          </Button>
        </div>

        {cancelSuccess && (
          <div className="rounded-[30px] border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 shadow-sm flex items-center gap-3">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>{cancelSuccess}</span>
          </div>
        )}

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-3">
            {statusFilters.map((status) => (
              <button
                key={status.key}
                type="button"
                onClick={() => setActiveFilter(status.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeFilter === status.key
                    ? "bg-[#D56756] text-white shadow-sm"
                    : `${status.color} hover:bg-slate-100`
                }`}
              >
                {status.label} (
                {status.key === "all" ? counts.all : counts[status.key]})
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="rounded-[30px] border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            Đang tải lịch hẹn...
          </div>
        ) : error ? (
          <div className="rounded-[30px] border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
            {error}
          </div>
        ) : (
          <div className="grid gap-6">
            {currentBookings.length > 0 ? (
              currentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold text-slate-900">
                        {booking.title}
                      </h2>
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="flex items-center gap-3 rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                          <CalendarDays className="h-4 w-4 text-[#D56756]" />
                          <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                              Ngày
                            </div>
                            <div className="font-medium">
                              {booking.dateLabel}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FEE2E2] text-[#B91C1C]">
                            ⏰
                          </span>
                          <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                              Giờ
                            </div>
                            <div className="font-medium">{booking.time}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                          <Heart className="h-4 w-4 text-[#D56756]" />
                          <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                              Thú cưng
                            </div>
                            <div className="font-medium">{booking.petName}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                          <Phone className="h-4 w-4 text-[#D56756]" />
                          <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                              Liên hệ
                            </div>
                            <div className="font-medium">{booking.phone}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700 shadow-sm sm:w-[320px]">
                      {/* Header dùng chung */}
                      <div className="inline-flex items-center justify-between gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm">
                        <span className="inline-flex items-center gap-2 text-slate-700">
                          <Info className="h-4 w-4 text-[#D56756]" />
                          {statusLabel[booking.status]}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${statusBadgeStyle[booking.status]}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      {/* Nội dung thay đổi theo status */}
                      <div className="text-sm leading-6 text-slate-600">
                        {booking.status !== 2 ? (
                          <p>Quý khách có thể hủy lịch nếu cần thay đổi.</p>
                        ) : (
                          <p>Lịch hẹn đã bị huỷ</p>
                        )}
                        <p className="mt-2 text-xs text-slate-500">
                          Nếu cần hỗ trợ, gọi hotline 028-1234-567.
                        </p>
                      </div>

                      {/* Chỉ hiện button khi status !== 2 */}
                      {booking.status === 0  && (
                        <Button
                          onClick={() =>
                            openCancelModal({
                              id: booking.id,
                              title: booking.title,
                              dateLabel: booking.dateLabel,
                              time: booking.time,
                            })
                          }
                          disabled={cancelingId === booking.id}
                          variant="outline"
                          className="rounded-full border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4" />
                          {cancelingId === booking.id
                            ? "Đang hủy..."
                            : "Hủy lịch hẹn"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[30px] border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
                Bạn chưa có lịch hẹn nào.
              </div>
            )}
          </div>
        )}

        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-gradient-to-r from-[#172554] via-[#334155] to-[#D56756] p-6 shadow-sm text-white sm:p-8">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Lưu ý quan trọng</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-100">
                <li>• Vui lòng đến đúng giờ để được phục vụ tốt nhất.</li>
                <li>
                  • Nếu cần hủy lịch, vui lòng thông báo trước ít nhất 2 giờ.
                </li>
                <li>• Liên hệ hotline 028-1234-567 nếu cần hỗ trợ.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeCancelModal}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-9 w-9 text-red-500" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-center text-2xl font-bold text-slate-900 mb-2">
              Xác nhận hủy lịch hẹn?
            </h2>
            <p className="text-center text-sm text-slate-500 mb-6 leading-6">
              Bạn có chắc chắn muốn hủy lịch hẹn này không?
              <br />
              Hành động này không thể hoàn tác.
            </p>

            {/* Appointment info */}
            <div className="rounded-2xl bg-[#FAF5F0] px-5 py-4 mb-7 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Dịch vụ:</span>
                <span className="font-semibold text-slate-800 text-right max-w-[60%]">
                  {cancelTarget.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ngày:</span>
                <span className="font-semibold text-slate-800 text-right max-w-[60%]">
                  {cancelTarget.dateLabel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Giờ:</span>
                <span className="font-semibold text-slate-800">
                  {cancelTarget.time}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeCancelModal}
                className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Không, giữ lại
              </button>
              <button
                onClick={handleCancelAppointment}
                className="flex-1 rounded-full bg-red-500 py-3 text-sm font-bold text-white hover:bg-red-600 transition"
              >
                Có, hủy lịch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookingPage;
