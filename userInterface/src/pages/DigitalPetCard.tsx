import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  Clock,
  Download,
  HeartPulse,
  Loader2,
  Mail,
  MapPin,
  PawPrint,
  Phone,
  Pill,
  Stethoscope,
  Syringe,
  User,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";
import petApi from "@/apis/petAPI";
import userApi from "@/apis/userAPI";
import medicalRecordApi from "@/apis/medicalRecordAPI";
import appointmentApi from "@/apis/appointmentAPI";
import { Button } from "@/components/ui/button";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";
import type { GetPetByIdResponse, PetDetail } from "@/types/pet.type";
import type { CustomerProfile } from "@/types/customerProfile.type";
import type { MedicalRecord } from "@/types/medicalRecord.type";
import type { Appointment } from "@/types/appointment.type";

const emptyText = "Chưa cập nhật";

const normalizePetResponse = (payload: PetDetail | GetPetByIdResponse) => {
  if (!payload) return null;
  if ("id" in payload) return payload;
  return payload.data ?? payload.pet ?? null;
};

const unwrapArray = <T,>(value: unknown): T[] => {
  const d = (value as { data?: unknown })?.data;
  if (Array.isArray(d)) return d as T[];
  if (d && typeof d === "object" && Array.isArray((d as { data?: unknown }).data)) {
    return (d as { data: T[] }).data;
  }
  return [];
};

const unwrapObject = <T,>(value: unknown): T | null => {
  const d = (value as { data?: unknown })?.data;
  if (!d) return null;
  if (typeof d === "object" && "data" in (d as object)) {
    return ((d as { data?: T }).data ?? null) as T | null;
  }
  return d as T;
};

const formatDate = (date?: string) => {
  if (!date) return emptyText;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return emptyText;
  return parsed.toLocaleDateString("vi-VN");
};

const formatLongDate = (date?: string) => {
  if (!date) return emptyText;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return emptyText;
  return parsed.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (time?: string) => (time ? time.slice(0, 5) : "");

const calculateAge = (date?: string) => {
  if (!date) return emptyText;
  const birth = new Date(date);
  if (Number.isNaN(birth.getTime())) return emptyText;

  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());

  if (months < 1) return "< 1 tháng";
  if (months < 12) return `${months} tháng`;
  return `${Math.floor(months / 12)} tuổi`;
};

const getPetImage = (pet: PetDetail) =>
  pet.imageUrl || pet.avatarUrl || pet.photoUrl || "";

const getOwnerName = (
  pet: PetDetail,
  owner: CustomerProfile | null,
) => {
  const combined = `${owner?.lastName ?? ""} ${owner?.firstName ?? ""}`.trim();
  return (
    owner?.fullName?.trim() ||
    combined ||
    owner?.userName ||
    pet.ownerName ||
    pet.customerName ||
    pet.customer?.fullName ||
    pet.customer?.name ||
    ""
  );
};

const APPOINTMENT_STATUS: Record<
  number,
  { label: string; className: string }
> = {
  0: { label: "Đã xác nhận", className: "bg-sky-50 text-sky-700" },
  1: { label: "Hoàn thành", className: "bg-emerald-50 text-emerald-700" },
  2: { label: "Đã huỷ", className: "bg-rose-50 text-rose-700" },
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <div className="rounded-2xl bg-[#fff6f2] px-4 py-3">
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className="mt-1 font-semibold text-slate-900">{value || emptyText}</p>
  </div>
);

const SectionCard = ({
  icon,
  title,
  accent,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  accent: string;
  children: React.ReactNode;
}) => (
  <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${accent}`}
      >
        {icon}
      </span>
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
    </div>
    <div className="px-5 py-5 sm:px-6">{children}</div>
  </section>
);

const ContactLine = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) => (
  <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
    <span className="mt-0.5 text-slate-400">{icon}</span>
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-0.5 break-words font-semibold text-slate-900">
        {value || emptyText}
      </p>
    </div>
  </div>
);

const EmptyState = ({ text }: { text: string }) => (
  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center text-sm text-slate-500">
    {text}
  </div>
);

const DigitalPetCard = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState<PetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const [owner, setOwner] = useState<CustomerProfile | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const petCardUrl = useMemo(
    () =>
      typeof window !== "undefined" && petId
        ? `${window.location.origin}/pet-card/${petId}`
        : "",
    [petId],
  );

  useEffect(() => {
    const loadPet = async () => {
      if (!petId) {
        setError("Không tìm thấy mã thú cưng.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await petApi.getPetById(petId);
        const petData = normalizePetResponse(response?.data);

        if (!petData?.id) {
          setPet(null);
          setError("Không tìm thấy thông tin thú cưng.");
          return;
        }

        setPet(petData);
      } catch (err) {
        console.error(err);
        setPet(null);
        setError(getBackendErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadPet();
  }, [petId]);

  // Tải các thông tin liên quan đến pet (chủ nhân, hồ sơ bệnh án, lịch sử khám).
  // Mỗi nguồn fail độc lập (vd thiếu quyền) thì để rỗng, không phá trang.
  useEffect(() => {
    if (!pet?.id) return;
    let active = true;

    const loadDetails = async () => {
      setDetailsLoading(true);

      const tasks: Promise<unknown>[] = [];

      if (pet.customerId) {
        tasks.push(
          userApi
            .getUserById(pet.customerId)
            .then((res) => {
              if (active) setOwner(unwrapObject<CustomerProfile>(res));
            })
            .catch(() => {
              if (active) setOwner(null);
            }),
        );
      }

      tasks.push(
        medicalRecordApi
          .getMedicalRecordsByPetId(pet.id)
          .then((res) => {
            if (!active) return;
            const list = unwrapArray<MedicalRecord>(res).sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );
            setRecords(list);
          })
          .catch(() => {
            if (active) setRecords([]);
          }),
      );

      tasks.push(
        appointmentApi
          .getAppointmentsByPetId(pet.id)
          .then((res) => {
            if (!active) return;
            const list = unwrapArray<Appointment>(res).sort(
              (a, b) =>
                new Date(b.appointmentDate).getTime() -
                new Date(a.appointmentDate).getTime(),
            );
            setAppointments(list);
          })
          .catch(() => {
            if (active) setAppointments([]);
          }),
      );

      await Promise.allSettled(tasks);
      if (active) setDetailsLoading(false);
    };

    loadDetails();
    return () => {
      active = false;
    };
  }, [pet?.id, pet?.customerId]);

  const handleDownloadImage = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#ffffff",
        // Bỏ các phần tử có data-no-export (vd: chính nút tải) khỏi ảnh.
        filter: (node) =>
          !(
            node instanceof HTMLElement &&
            node.hasAttribute("data-no-export")
          ),
      });
      const safeName = (pet?.name || "pet-card").replace(/[^a-z0-9-_]/gi, "-");
      const link = document.createElement("a");
      link.download = `${safeName}-digital-pet-card.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#fff8f3] px-4 py-12">
        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <PawPrint className="mx-auto mb-4 h-10 w-10 animate-pulse text-[#D56756]" />
          <p className="font-medium text-slate-700">
            Đang tải Digital Pet Card...
          </p>
        </div>
      </main>
    );
  }

  if (error || !pet) {
    return (
      <main className="min-h-[70vh] bg-[#fff8f3] px-4 py-12">
        <div className="mx-auto max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-rose-500" />
          <h1 className="text-xl font-semibold text-slate-950">
            Không mở được Pet Card
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 whitespace-pre-line">
            {error || "Không tìm thấy thông tin thú cưng."}
          </p>
          <Button asChild className="mt-6 rounded-full bg-slate-950 text-white">
            <Link to="/">Về trang chủ</Link>
          </Button>
        </div>
      </main>
    );
  }

  const image = getPetImage(pet);
  const species = pet.species || pet.type;
  const ownerName = getOwnerName(pet, owner);
  const ownerPhone = owner?.phoneNumber || owner?.phone || pet.phone;
  const ownerEmail = owner?.email || pet.email;
  const allergy = pet.allergy || pet.allergies;
  const medicalNote = pet.medicalNote || pet.note;
  const vaccineInfo = pet.vaccineInfo || pet.vaccination;

  return (
    <main className="bg-[#fff8f3] px-4 py-6 sm:py-10">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2 lg:items-start">
        {/* Cột 1 — Thẻ chính (điểm nhấn) */}
        <section
          ref={cardRef}
          className="overflow-hidden rounded-[2rem] border border-[#f0d8d0] bg-white shadow-[0_24px_70px_rgba(112,63,48,0.12)] lg:sticky lg:top-6"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-[#E07A66] via-[#D56756] to-[#B24C40] px-5 py-7 text-white sm:px-8">
            <PawPrint className="pointer-events-none absolute -right-3 -top-3 h-24 w-24 rotate-12 text-white/10" />
            <PawPrint className="pointer-events-none absolute bottom-2 right-24 h-12 w-12 -rotate-12 text-white/10" />
            <div className="relative flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
                <PawPrint className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  Digital Pet Card
                </p>
                <h1 className="text-2xl font-extrabold sm:text-3xl">
                  {pet.name || "Thú cưng"}
                </h1>
              </div>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] bg-amber-50 ring-4 ring-[#D56756]/10">
                  {image ? (
                    <img
                      src={image}
                      alt={`Ảnh thú cưng ${pet.name || "PetHub"}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <PawPrint className="h-12 w-12 text-amber-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-3xl font-extrabold text-slate-950">
                    {pet.name}
                  </h2>
                  <p className="mt-2 text-slate-500">
                    {[species, pet.breed].filter(Boolean).join(" • ") ||
                      emptyText}
                  </p>
                  <Button
                    type="button"
                    data-no-export
                    disabled={downloading}
                    className="mt-4 rounded-full bg-[#D56756] text-white hover:bg-[#c25248] disabled:cursor-not-allowed disabled:bg-[#d89992]"
                    onClick={handleDownloadImage}
                  >
                    {downloading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    {downloading ? "Đang tạo ảnh..." : "Tải Digital Pet Card"}
                  </Button>
                </div>
              </div>

              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-2">
                <QRCodeCanvas
                  value={petCardUrl}
                  size={96}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                  level="M"
                />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoRow label="Loài / type" value={species} />
              <InfoRow label="Giống" value={pet.breed} />
              <InfoRow label="Giới tính" value={pet.gender} />
              <InfoRow label="Tuổi" value={calculateAge(pet.dateOfBirth)} />
              <InfoRow label="Cân nặng" value={pet.weight} />
              <InfoRow label="Màu sắc" value={pet.color} />
              <InfoRow label="Ngày sinh" value={formatDate(pet.dateOfBirth)} />
              <InfoRow label="Chủ nuôi" value={ownerName} />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                Cập nhật từ hồ sơ PetHub
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                <span className="break-all">Pet ID: {pet.id}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Cột 2 — các ô thông tin xếp dọc từ trên xuống */}
        <div className="flex flex-col gap-5">
        {/* Chủ nhân */}
        <SectionCard
          icon={<User className="h-5 w-5 text-[#B24C40]" />}
          title="Chủ nhân"
          accent="bg-[#F8DED9]"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <ContactLine
              icon={<User className="h-4 w-4" />}
              label="Họ tên"
              value={ownerName}
            />
            <ContactLine
              icon={<Phone className="h-4 w-4" />}
              label="Số điện thoại"
              value={ownerPhone}
            />
            <ContactLine
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={ownerEmail}
            />
            <ContactLine
              icon={<MapPin className="h-4 w-4" />}
              label="Địa chỉ"
              value={owner?.address}
            />
          </div>
        </SectionCard>

        {/* Hồ sơ sức khoẻ nhanh từ pet */}
        {(medicalNote || allergy || vaccineInfo) && (
          <SectionCard
            icon={<HeartPulse className="h-5 w-5 text-rose-500" />}
            title="Tình trạng sức khoẻ"
            accent="bg-rose-50"
          >
            <div className="grid gap-3">
              {allergy ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                  <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-amber-700">
                    <AlertCircle className="h-4 w-4" /> Dị ứng
                  </p>
                  <p className="text-sm text-slate-700">{allergy}</p>
                </div>
              ) : null}
              {vaccineInfo ? (
                <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
                  <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-sky-700">
                    <Syringe className="h-4 w-4" /> Thông tin vaccine
                  </p>
                  <p className="text-sm text-slate-700">{vaccineInfo}</p>
                </div>
              ) : null}
              {medicalNote ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <HeartPulse className="h-4 w-4 text-rose-500" /> Ghi chú y tế
                  </p>
                  <p className="text-sm text-slate-700">{medicalNote}</p>
                </div>
              ) : null}
            </div>
          </SectionCard>
        )}

        {/* Hồ sơ bệnh án */}
        <SectionCard
          icon={<ClipboardList className="h-5 w-5 text-emerald-600" />}
          title={`Hồ sơ bệnh án${records.length ? ` (${records.length})` : ""}`}
          accent="bg-emerald-50"
        >
          {detailsLoading && records.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-2xl bg-slate-50"
                />
              ))}
            </div>
          ) : records.length === 0 ? (
            <EmptyState text="Chưa có hồ sơ bệnh án nào cho thú cưng này." />
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatLongDate(record.createdAt)}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {record.diagnosis ? (
                      <div className="rounded-xl bg-slate-50 px-3 py-2">
                        <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <Stethoscope className="h-3.5 w-3.5" /> Chẩn đoán
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-slate-900">
                          {record.diagnosis}
                        </p>
                      </div>
                    ) : null}
                    {record.treatment ? (
                      <div className="rounded-xl bg-slate-50 px-3 py-2">
                        <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <HeartPulse className="h-3.5 w-3.5" /> Điều trị
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-slate-900">
                          {record.treatment}
                        </p>
                      </div>
                    ) : null}
                    {record.prescription ? (
                      <div className="rounded-xl bg-slate-50 px-3 py-2">
                        <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <Pill className="h-3.5 w-3.5" /> Đơn thuốc
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-slate-900">
                          {record.prescription}
                        </p>
                      </div>
                    ) : null}
                    {record.medicalRecordNote ? (
                      <div className="rounded-xl bg-slate-50 px-3 py-2">
                        <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <ClipboardList className="h-3.5 w-3.5" /> Ghi chú
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-slate-900">
                          {record.medicalRecordNote}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Lịch sử khám bệnh */}
        <SectionCard
          icon={<CalendarCheck className="h-5 w-5 text-sky-600" />}
          title={`Lịch sử khám bệnh${
            appointments.length ? ` (${appointments.length})` : ""
          }`}
          accent="bg-sky-50"
        >
          {detailsLoading && appointments.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-2xl bg-slate-50"
                />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <EmptyState text="Chưa có lịch sử khám bệnh nào." />
          ) : (
            <div className="space-y-2.5">
              {appointments.map((appt) => {
                const status =
                  APPOINTMENT_STATUS[appt.status] ?? APPOINTMENT_STATUS[0];
                const timeRange = [
                  formatTime(appt.startTime),
                  formatTime(appt.endTime),
                ]
                  .filter(Boolean)
                  .join(" - ");
                return (
                  <div
                    key={appt.id}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {formatLongDate(appt.appointmentDate)}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                        {timeRange ? (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" /> {timeRange}
                          </span>
                        ) : null}
                        {appt.appointmentNote ? (
                          <span className="truncate">
                            {appt.appointmentNote}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <span
                      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
        </div>
      </div>
    </main>
  );
};

export default DigitalPetCard;
