import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  CalendarDays,
  Check,
  Copy,
  HeartPulse,
  Mail,
  PawPrint,
  Phone,
  ShieldCheck,
  Syringe,
  User,
} from "lucide-react";
import petApi from "@/apis/petAPI";
import { Button } from "@/components/ui/button";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";
import type { GetPetByIdResponse, PetDetail } from "@/types/pet.type";

const emptyText = "Chưa cập nhật";

const normalizePetResponse = (payload: PetDetail | GetPetByIdResponse) => {
  if (!payload) return null;
  if ("id" in payload) return payload;
  return payload.data ?? payload.pet ?? null;
};

const formatDate = (date?: string) => {
  if (!date) return emptyText;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return emptyText;
  return parsed.toLocaleDateString("vi-VN");
};

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

const getOwnerName = (pet: PetDetail) =>
  pet.ownerName ||
  pet.customerName ||
  pet.customer?.fullName ||
  pet.customer?.name ||
  "";

const getContactInfo = (pet: PetDetail) =>
  pet.contactInfo ||
  pet.phone ||
  pet.customer?.phone ||
  pet.email ||
  pet.customer?.email ||
  "";

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => {
  if (!value) return null;

  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
};

const NoteBlock = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
}) => {
  if (!value) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
        {icon}
        {label}
      </div>
      <p className="text-sm leading-6 text-slate-600">{value}</p>
    </div>
  );
};

const DigitalPetCard = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState<PetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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

  const handleCopyLink = async () => {
    if (!petCardUrl) return;
    try {
      await navigator.clipboard.writeText(petCardUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#F8FAFC] px-4 py-12">
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
      <main className="min-h-[70vh] bg-[#F8FAFC] px-4 py-12">
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
  const ownerName = getOwnerName(pet);
  const contactInfo = getContactInfo(pet);
  const allergy = pet.allergy || pet.allergies;
  const medicalNote = pet.medicalNote || pet.note;
  const vaccineInfo = pet.vaccineInfo || pet.vaccination;

  return (
    <main className="bg-[#F8FAFC] px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 px-5 py-6 text-white sm:px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                  Digital Pet Card
                </p>
                <h1 className="text-2xl font-semibold sm:text-3xl">
                  {pet.name || "Thú cưng"}
                </h1>
              </div>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-amber-50">
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
                <h2 className="text-3xl font-bold text-slate-950">
                  {pet.name}
                </h2>
                <p className="mt-2 text-slate-500">
                  {[species, pet.breed].filter(Boolean).join(" • ") ||
                    emptyText}
                </p>
                <Button
                  type="button"
                  className="mt-4 rounded-full bg-[#D56756] text-white hover:bg-[#c25248]"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copied ? "Đã copy link" : "Copy Pet Card Link"}
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoRow label="Loài / type" value={species || emptyText} />
              <InfoRow label="Giống" value={pet.breed || emptyText} />
              <InfoRow label="Giới tính" value={pet.gender || emptyText} />
              <InfoRow label="Tuổi" value={calculateAge(pet.dateOfBirth)} />
              <InfoRow label="Ngày sinh" value={formatDate(pet.dateOfBirth)} />
              <InfoRow label="Chủ nuôi" value={ownerName || emptyText} />
            </div>

            <div className="mt-6 grid gap-3">
              <NoteBlock
                icon={<HeartPulse className="h-4 w-4 text-rose-500" />}
                label="Ghi chú y tế"
                value={medicalNote}
              />
              <NoteBlock
                icon={<AlertCircle className="h-4 w-4 text-amber-500" />}
                label="Dị ứng"
                value={allergy}
              />
              <NoteBlock
                icon={<Syringe className="h-4 w-4 text-sky-500" />}
                label="Thông tin vaccine"
                value={vaccineInfo}
              />
            </div>

            {contactInfo && (
              <div className="mt-6 rounded-2xl bg-slate-950 p-4 text-white">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  {contactInfo.includes("@") ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <Phone className="h-4 w-4" />
                  )}
                  Liên hệ
                </div>
                <p className="break-all text-sm text-slate-100">
                  {contactInfo}
                </p>
              </div>
            )}

            <div className="mt-6 grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                Cập nhật từ hồ sơ PetHub
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <User className="h-4 w-4 text-slate-400" />
                Pet ID: {pet.id}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DigitalPetCard;
