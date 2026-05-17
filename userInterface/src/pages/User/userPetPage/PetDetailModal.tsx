import type { Pet } from "@/types/pet.type";
import type { MedicalRecord } from "@/types/medicalRecord.type";
import { X, CalendarDays, ClipboardList, QrCode, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calcAge, getPetEmoji } from "./petHelpers";

export interface PetDetailModalProps {
  pet: Pet;
  records: MedicalRecord[];
  loading: boolean;
  onClose: () => void;
}

const PetDetailModal = ({
  pet,
  records,
  loading,
  onClose,
}: PetDetailModalProps) => {
  const emoji = getPetEmoji((pet as any).species);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-hidden rounded-[28px] bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-4xl shadow-sm">
              {emoji}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{pet.name}</h2>
              <p className="text-sm text-slate-500">
                {(pet as any).species || "Thú cưng"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 pb-2 space-y-4">
          {/* Info grid 2×2 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#F5F0E8] px-4 py-3">
              <p className="text-xs text-slate-500 mb-1">Tuổi</p>
              <p className="font-semibold text-slate-800">
                {calcAge(pet.dateOfBirth)}
              </p>
            </div>
            <div className="rounded-2xl bg-[#F5F0E8] px-4 py-3">
              <p className="text-xs text-slate-500 mb-1">Cân nặng</p>
              <p className="font-semibold text-slate-800">
                {(pet as any).weight ? `${(pet as any).weight}kg` : "Chưa rõ"}
              </p>
            </div>
            <div className="rounded-2xl bg-[#F5F0E8] px-4 py-3">
              <p className="text-xs text-slate-500 mb-1">Màu sắc</p>
              <p className="font-semibold text-slate-800">
                {pet.color || "Chưa rõ"}
              </p>
            </div>
            <div className="rounded-2xl bg-[#F5F0E8] px-4 py-3">
              <p className="text-xs text-slate-500 mb-1">Ngày sinh</p>
              <p className="font-semibold text-slate-800">
                {pet.dateOfBirth
                  ? new Date(pet.dateOfBirth).toLocaleDateString("vi-VN")
                  : "Chưa rõ"}
              </p>
            </div>
          </div>

          {/* Dị ứng */}
          <div className="rounded-2xl bg-rose-50 px-4 py-3">
            <p className="text-xs font-semibold text-rose-400 mb-1">Dị ứng</p>
            <p className="text-sm font-medium text-rose-700">
              {(pet as any).allergy || "Không có"}
            </p>
          </div>

          {/* Ghi chú */}
          <div className="rounded-2xl bg-sky-50 px-4 py-3">
            <p className="text-xs font-semibold text-sky-400 mb-1">Ghi chú</p>
            <p className="text-sm font-medium text-sky-700">
              {(pet as any).note || "Không có ghi chú"}
            </p>
          </div>

          {/* Lịch sử khám bệnh */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="h-4 w-4 text-[#D56756]" />
              <h3 className="font-semibold text-slate-800">
                Lịch sử khám bệnh
              </h3>
            </div>

            {loading ? (
              <div className="py-6 text-center text-slate-400 text-sm">
                Đang tải...
              </div>
            ) : records.length === 0 ? (
              <div className="py-6 text-center">
                <ClipboardList className="mx-auto h-10 w-10 text-slate-200 mb-2" />
                <p className="text-sm text-slate-400">
                  Chưa có lịch sử khám bệnh.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {records.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-start gap-3 rounded-2xl bg-[#F5F0E8] px-4 py-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                      <Stethoscope className="h-4 w-4 text-[#D56756]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-800 leading-tight">
                          {rec.diagnosis || "Khám tổng quát"}
                        </p>
                        <span className="shrink-0 text-xs text-slate-400">
                          {rec.createAt
                            ? new Date(rec.createAt).toLocaleDateString("vi-VN")
                            : ""}
                        </span>
                      </div>
                      {rec.treatment && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {rec.treatment}
                        </p>
                      )}
                      {rec.medicalRecordNote && (
                        <p className="text-xs text-slate-400 italic mt-0.5">
                          {rec.medicalRecordNote}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <Button className="flex-1 rounded-full bg-[#D56756] text-white hover:bg-[#c25248] transition">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            Đặt lịch khám
          </Button>
          <Button className="flex-1 rounded-full bg-[#172554] text-white hover:bg-[#1e3a8a] transition">
            <QrCode className="h-4 w-4 mr-1.5" />
            Xem Digital Card
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PetDetailModal;
