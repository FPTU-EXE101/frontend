import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  CalendarCheck,
  CalendarDays,
  Check,
  ClipboardList,
  Clock,
  Download,
  HeartPulse,
  Loader2,
  Mail,
  MapPin,
  Palette,
  PawPrint,
  Phone,
  Pill,
  Scale,
  Share2,
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

const getSpeciesEmoji = (species?: string) => {
  const s = (species || "").toLowerCase();
  if (s.includes("mèo") || s.includes("cat")) return "🐈";
  if (s.includes("chó") || s.includes("dog")) return "🐕";
  if (s.includes("chim") || s.includes("bird")) return "🐦";
  if (s.includes("cá") || s.includes("fish")) return "🐟";
  if (s.includes("thỏ") || s.includes("rabbit")) return "🐇";
  if (s.includes("hamster") || s.includes("chuột")) return "🐹";
  return "🐾";
};

// Một trường thông tin trên thẻ Pet Card (nhãn nhỏ + giá trị đậm).
const CardField = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <div className="min-w-0">
    <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
      {label}
    </dt>
    <dd className="mt-1 truncate text-base font-bold text-[#2b3350]">
      {value || emptyText}
    </dd>
  </div>
);

// Huy hiệu chỉ số (Tuổi / Cân nặng / Màu) ở chân thẻ.
const CardBadge = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
}) => (
  <div className="inline-flex items-center gap-2 rounded-full bg-[#fbe7e0] px-4 py-2 text-sm">
    <span className="text-[#D56756]">{icon}</span>
    <span className="text-slate-500">{label}:</span>
    <span className="font-bold text-[#2b3350]">{value || emptyText}</span>
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
  const [copied, setCopied] = useState(false);
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

  const handleShare = async () => {
    if (!petCardUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Digital Pet Card - ${pet?.name ?? "PetHub"}`,
          url: petCardUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(petCardUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Người dùng huỷ chia sẻ hoặc trình duyệt chặn — bỏ qua.
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
  const petIdNumber = `PET-${pet.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  const issueDate = new Date().toLocaleDateString("vi-VN");
  const speciesEmoji = getSpeciesEmoji(species);

  return (
    <main className="bg-[#fff8f3] px-4 py-6 sm:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {/* Hàng 1 — Thẻ Pet Card */}
        <div className="flex flex-col items-center gap-4">
          <section
            ref={cardRef}
            className="relative w-full overflow-hidden rounded-[2rem] border border-[#f0d8d0] bg-[#fdf6ef] shadow-[0_24px_70px_rgba(112,63,48,0.14)]"
          >
            {/* Thanh tiêu đề */}
            <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-[#D56756] via-[#9c4a55] to-[#2b3350] px-6 py-5 text-white sm:px-9 sm:py-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
                  <PawPrint className="h-6 w-6" />
                </span>
                <div>
                  <h1 className="text-xl font-extrabold leading-tight tracking-wide sm:text-2xl">
                    THẺ THÚ CƯNG
                  </h1>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
                    Digital Pet Card
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
                  ID Number
                </p>
                <p className="text-sm font-bold sm:text-base">{petIdNumber}</p>
              </div>
            </div>

            {/* Thân thẻ */}
            <div className="grid gap-7 px-6 py-7 sm:px-9 sm:py-8 lg:grid-cols-[auto_1fr_15rem] lg:gap-9">
              {/* Ảnh + QR */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-[#D56756]/45 bg-white shadow-sm">
                  {image ? (
                    <img
                      src={image}
                      alt={`Ảnh thú cưng ${pet.name || "PetHub"}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="text-6xl leading-none" aria-hidden="true">
                      {speciesEmoji}
                    </span>
                  )}
                </div>
                <div className="rounded-[1.25rem] border border-[#f0d8d0] bg-white p-2.5 shadow-sm">
                  <QRCodeCanvas
                    value={petCardUrl}
                    size={108}
                    bgColor="#ffffff"
                    fgColor="#2b3350"
                    level="M"
                  />
                </div>
              </div>

              {/* Tên + thông tin chính */}
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Tên thú cưng
                </p>
                <h2 className="mt-1 text-3xl font-extrabold text-[#2b3350] sm:text-4xl">
                  {pet.name || "Thú cưng"}
                </h2>
                <div className="mt-5 h-px w-full bg-gradient-to-r from-[#D56756]/40 via-[#D56756]/15 to-transparent" />
                <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  <CardField label="Ngày sinh" value={formatDate(pet.dateOfBirth)} />
                  <CardField label="Giới tính" value={pet.gender} />
                  <CardField label="Loài / type" value={species} />
                  <CardField label="Giống" value={pet.breed} />
                </dl>
              </div>

              {/* Chủ sở hữu */}
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/70 p-5">
                <p className="flex items-center gap-2 text-sm font-bold text-[#2b3350]">
                  <User className="h-4 w-4 text-[#D56756]" />
                  THÔNG TIN CHỦ SỞ HỮU
                </p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Họ và tên
                    </p>
                    <p className="mt-1 font-bold text-[#2b3350]">
                      {ownerName || emptyText}
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      <Phone className="h-3.5 w-3.5" /> Số điện thoại
                    </p>
                    <p className="mt-1 font-bold text-[#2b3350]">
                      {ownerPhone || emptyText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Huy hiệu chỉ số */}
            <div className="flex flex-wrap justify-center gap-3 px-6 sm:px-9">
              <CardBadge
                icon={<CalendarDays className="h-4 w-4" />}
                label="Tuổi"
                value={calculateAge(pet.dateOfBirth)}
              />
              <CardBadge
                icon={<Scale className="h-4 w-4" />}
                label="Cân nặng"
                value={pet.weight}
              />
              <CardBadge
                icon={<Palette className="h-4 w-4" />}
                label="Màu"
                value={pet.color}
              />
            </div>

            {/* Chân thẻ */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#f0d8d0] px-6 py-4 text-xs text-slate-500 sm:px-9">
              <span>
                Thẻ được phát hành bởi{" "}
                <span className="font-semibold text-[#D56756]">
                  PetHub Vietnam
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                Ngày phát hành: {issueDate}
              </span>
            </div>
          </section>

          {/* Nút thao tác (nằm ngoài thẻ nên không lọt vào ảnh tải về) */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              type="button"
              disabled={downloading}
              onClick={handleDownloadImage}
              className="rounded-full bg-[#2b3350] px-6 py-5 text-sm font-semibold text-white hover:bg-[#1f2740] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {downloading ? "Đang tạo ảnh..." : "Tải xuống thẻ"}
            </Button>
            <Button
              type="button"
              onClick={handleShare}
              className="rounded-full bg-[#D56756] px-6 py-5 text-sm font-semibold text-white hover:bg-[#B24C40]"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              {copied ? "Đã sao chép liên kết" : "Chia sẻ"}
            </Button>
          </div>
        </div>

        {/* Hàng 2 — 3 box nằm ngang */}
        <div className="grid gap-5 lg:grid-cols-3 lg:items-start">
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

        {/* Hồ sơ sức khoẻ nhanh từ pet — chiếm trọn hàng để không phá bố cục 3 box */}
        {(medicalNote || allergy || vaccineInfo) && (
          <div className="lg:col-span-3">
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
          </div>
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
