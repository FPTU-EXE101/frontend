import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, FileText, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import petApi from "@/apis/petAPI";
import medicalRecordApi from "@/apis/medicalRecordAPI";
import type { Pet } from "@/types/pet.type";
import type { MedicalRecord } from "@/types/medicalRecord.type";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";

const calculateAge = (dateOfBirth: string) => {
  if (!dateOfBirth) return "Chưa rõ";
  const birth = new Date(dateOfBirth);
  const now = new Date();
  const diff = now.getTime() - birth.getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor((diff / (1000 * 60 * 60 * 24 * 30.44)) % 12);

  if (years > 0) {
    return `${years} tuổi${months > 0 ? ` ${months} tháng` : ""}`;
  }
  if (months > 0) {
    return `${months} tháng`;
  }
  return "< 1 tháng";
};

const formatDate = (value: string) => {
  if (!value) return "Chưa rõ";
  const date = new Date(value);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const ManagerPetMedicalRecord = () => {
  const params = useParams();
  const petId = params.id ?? "";
  const [pet, setPet] = useState<Pet | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!petId) {
        setError("Không xác định thú cưng.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [petResponse, recordsResponse] = await Promise.all([
          petApi.getPetById(petId),
          medicalRecordApi.getAllMedicalRecords(),
        ]);

        setPet(petResponse?.data ?? null);
        const allRecords = recordsResponse?.data ?? [];
        const filteredRecords = (allRecords as MedicalRecord[])
          .filter((record) => record.petId === petId)
          .sort(
            (a, b) =>
              new Date(b.createAt).getTime() - new Date(a.createAt).getTime(),
          );
        setRecords(filteredRecords);
      } catch (err) {
        console.error(err);
        setError(getBackendErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [petId]);

  const currentNote = records[0]?.medicalRecordNote || "Chưa có ghi chú cụ thể";

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full px-4 py-3"
              >
                <Link to="/manager/pets">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                </Link>
              </Button>
              <div className="rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                Hồ sơ y tế
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-950">
                Hồ sơ y tế - {pet?.name ?? "..."}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {pet?.color ?? "Chưa rõ giống"} •{" "}
                {pet ? calculateAge(pet.dateOfBirth) : "..."}
              </p>
            </div>
          </div>

          <Button
            asChild
            className="h-11 rounded-full bg-[#D56756] px-5 py-3 text-base font-semibold text-white hover:bg-[#b2483c]"
          >
            <Link to={`/manager/pets/${petId}/medical-record/new`}>
              <Plus className="mr-2 h-4 w-4" /> Thêm hồ sơ mới
            </Link>
          </Button>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                      <FileText className="h-8 w-8 text-amber-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">
                        {pet?.name ?? "---"}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {pet?.color ?? "Không rõ giống"} •{" "}
                        {pet ? calculateAge(pet.dateOfBirth) : "..."}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      <div className="text-xs uppercase tracking-[0.16em] text-rose-700/80">
                        Dị ứng
                      </div>
                      <div className="mt-2 font-semibold">Không có</div>
                    </div>
                    <div className="rounded-[1.5rem] border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-slate-700">
                      <div className="text-xs uppercase tracking-[0.16em] text-sky-700/80">
                        Ghi chú
                      </div>
                      <div className="mt-2 font-semibold">{currentNote}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-sm uppercase tracking-[0.16em] text-slate-500">
                    Chủ nhân
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-700">
                    <p>{pet?.customerId || "Chưa rõ"}</p>
                    <p className="text-xs text-slate-500">Thông tin liên hệ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              <CalendarDays className="h-4 w-4" />
              <span>Thông tin chung</span>
            </div>
            <div className="mt-5 grid gap-4 text-sm text-slate-600">
              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <div className="text-[0.75rem] uppercase tracking-[0.24em] text-slate-500">
                  Mã thú cưng
                </div>
                <div className="mt-2 font-semibold text-slate-950">
                  {pet?.id || "---"}
                </div>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <div className="text-[0.75rem] uppercase tracking-[0.24em] text-slate-500">
                  Ngày sinh
                </div>
                <div className="mt-2 font-semibold text-slate-950">
                  {pet?.dateOfBirth
                    ? new Date(pet.dateOfBirth).toLocaleDateString("vi-VN")
                    : "Chưa rõ"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Lịch sử khám bệnh ({records.length})
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Hoạt động y tế
            </h2>
          </div>
          {records.length > 0 ? (
            <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Cập nhật mới nhất: {formatDate(records[0].createAt)}
            </div>
          ) : null}
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
            Đang tải hồ sơ y tế...
          </div>
        ) : records.length > 0 ? (
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <Heart className="h-5 w-5 text-rose-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">
                        {record.diagnosis || "Khám bệnh"}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {formatDate(record.createAt)}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 shadow-sm">
                    {record.appointmentId
                      ? `Phiên ${record.appointmentId}`
                      : "Không có mã"}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      Chẩn đoán
                    </div>
                    <p className="mt-2 font-semibold text-slate-950">
                      {record.diagnosis || "Không có"}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      Điều trị
                    </div>
                    <p className="mt-2 font-semibold text-slate-950">
                      {record.treatment || "Không có"}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      Đơn thuốc
                    </div>
                    <p className="mt-2 font-semibold text-slate-950">
                      {record.prescription || "Không có"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Ghi chú
                  </div>
                  <p className="mt-2">
                    {record.medicalRecordNote || "Không có ghi chú bổ sung."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
            Chưa có hồ sơ khám bệnh cho thú cưng này.
          </div>
        )}
      </section>

      {error ? (
        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 whitespace-pre-line">
          {error}
        </div>
      ) : null}
    </div>
  );
};

export default ManagerPetMedicalRecord;
