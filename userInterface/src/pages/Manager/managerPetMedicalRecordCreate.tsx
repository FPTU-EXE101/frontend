import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import petApi from "@/apis/petAPI";
import medicalRecordApi from "@/apis/medicalRecordAPI";
import type { Pet } from "@/types/pet.type";
import type { CreateMedicalRecordRequest } from "@/types/medicalRecord.type";

const ManagerPetMedicalRecordCreate = () => {
  const params = useParams();
  const petId = params.id ?? "";
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [appointmentId, setAppointmentId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [prescription, setPrescription] = useState("");
  const [medicalRecordNote, setMedicalRecordNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadPet = async () => {
      if (!petId) {
        setError("Không xác định thú cưng.");
        return;
      }

      try {
        const response = await petApi.getPetById(petId);
        setPet(response?.data ?? null);
      } catch (err) {
        console.error(err);
        setError("Không tải được thông tin thú cưng.");
      }
    };

    loadPet();
  }, [petId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");

    if (!petId) {
      setError("Không xác định thú cưng.");
      return;
    }

    if (!appointmentId.trim()) {
      setError("Vui lòng nhập mã cuộc hẹn.");
      return;
    }

    if (!diagnosis.trim()) {
      setError("Vui lòng nhập chẩn đoán.");
      return;
    }

    const payload: CreateMedicalRecordRequest = {
      petId,
      appointmentId: appointmentId.trim(),
      diagnosis: diagnosis.trim(),
      treatment: treatment.trim(),
      prescription: prescription.trim(),
      medicalRecordNote: medicalRecordNote.trim(),
      createAt: new Date(date).toISOString(),
    };

    try {
      setLoading(true);
      await medicalRecordApi.createMedicalRecord(payload);
      setSuccess("Thêm hồ sơ y tế thành công.");
      setAppointmentId("");
      setDiagnosis("");
      setTreatment("");
      setPrescription("");
      setMedicalRecordNote("");
      setTimeout(() => {
        navigate(`/manager/pets/${petId}/medical-record`);
      }, 500);
    } catch (err) {
      console.error(err);
      setError("Không tạo được hồ sơ y tế. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

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
                <Link to={`/manager/pets/${petId}/medical-record`}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                </Link>
              </Button>
              <div className="rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                Thêm hồ sơ y tế mới
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-950">
                Thêm hồ sơ y tế cho {pet?.name ?? "thú cưng"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Nhập đầy đủ thông tin khám bệnh và ghi chú y tế.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <div className="text-sm uppercase tracking-[0.16em] text-slate-500">
              Thông tin thú cưng
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p className="font-semibold text-slate-950">
                {pet?.name || "..."}
              </p>
              <p>{pet?.color || "Chưa rõ giống"}</p>
              <p className="text-xs text-slate-500">
                Mã thú cưng: {pet?.id || "---"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="appointmentId">Mã cuộc hẹn</FieldLabel>
              <Input
                id="appointmentId"
                name="appointmentId"
                value={appointmentId}
                onChange={(event) => setAppointmentId(event.target.value)}
                placeholder="Nhập mã cuộc hẹn"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="createAt">Ngày khám</FieldLabel>
              <Input
                id="createAt"
                name="createAt"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="diagnosis">Chẩn đoán</FieldLabel>
              <textarea
                id="diagnosis"
                name="diagnosis"
                value={diagnosis}
                onChange={(event) => setDiagnosis(event.target.value)}
                placeholder="Nhập chẩn đoán"
                className="min-h-[120px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-950 shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="treatment">Điều trị</FieldLabel>
              <textarea
                id="treatment"
                name="treatment"
                value={treatment}
                onChange={(event) => setTreatment(event.target.value)}
                placeholder="Nhập phác đồ điều trị"
                className="min-h-[120px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-950 shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="prescription">Đơn thuốc</FieldLabel>
              <textarea
                id="prescription"
                name="prescription"
                value={prescription}
                onChange={(event) => setPrescription(event.target.value)}
                placeholder="Nhập đơn thuốc"
                className="min-h-[120px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-950 shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="medicalRecordNote">Ghi chú y tế</FieldLabel>
              <textarea
                id="medicalRecordNote"
                name="medicalRecordNote"
                value={medicalRecordNote}
                onChange={(event) => setMedicalRecordNote(event.target.value)}
                placeholder="Nhập ghi chú bổ sung"
                className="min-h-[120px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-950 shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
            </Field>

            {error ? (
              <FieldDescription className="text-sm text-rose-700">
                {error}
              </FieldDescription>
            ) : null}
            {success ? (
              <FieldDescription className="text-sm text-emerald-700">
                {success}
              </FieldDescription>
            ) : null}

            <Field>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  type="submit"
                  className="rounded-full bg-[#D56756] px-5 py-3 text-base font-semibold text-white hover:bg-[#b2483c]"
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : "Lưu hồ sơ"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border border-slate-300 px-5 py-3 text-base font-semibold text-slate-700 hover:bg-slate-100"
                  onClick={() =>
                    navigate(`/manager/pets/${petId}/medical-record`)
                  }
                >
                  Hủy
                </Button>
              </div>
            </Field>
          </FieldGroup>
        </form>
      </section>
    </div>
  );
};

export default ManagerPetMedicalRecordCreate;
