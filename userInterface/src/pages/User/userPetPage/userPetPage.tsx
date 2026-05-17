import { useEffect, useState } from "react";
import petApi from "@/apis/petAPI";
import medicalRecordApi from "@/apis/medicalRecordAPI";
import type { Pet } from "@/types/pet.type";
import type { MedicalRecord } from "@/types/medicalRecord.type";
import { Heart, Info } from "lucide-react";
import PetCard from "./PetCard";
import PetDetailModal from "./PetDetailModal";

const UserPetPage = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // modal state
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);

  // ── fetch pets ────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadPets = async () => {
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
        const response = await petApi.getPetByCustomerId(userId);
        const petsData: Pet[] = response?.data ?? [];
        setPets(petsData);
      } catch (err) {
        console.error(err);
        setError("Không tải được danh sách thú cưng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  // ── "Chi tiết" handler: mở PetDetailModal + fetch hồ sơ bệnh án ──────────
  const handleViewDetail = async (pet: Pet) => {
    setSelectedPet(pet);
    setMedicalRecords([]);
    setRecordsLoading(true);

    try {
      const response = await medicalRecordApi.getAllMedicalRecords();
      const all: MedicalRecord[] = response?.data ?? [];
      setMedicalRecords(all.filter((r) => r.petId === pet.id));
    } catch (err) {
      console.error(err);
      setMedicalRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  };

  // ── "Xem thẻ" handler (placeholder) ──────────────────────────────────────
  const handleViewPetCard = (pet: Pet) => {
    // TODO: implement Digital PetCard modal
    alert(`Digital Card cho ${pet.name} – coming soon!`);
  };

  const handleCloseModal = () => setSelectedPet(null);

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-3rem)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Thú cưng của tôi
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Xem thông tin và lịch sử khám bệnh của bé cưng
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm text-[#D56756] font-medium border border-rose-100">
            <Heart className="h-4 w-4 fill-rose-200 text-[#D56756]" />
            {pets.length} thú cưng
          </div>
        </div>

        {/* Notice */}
        <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 px-5 py-4 text-sm text-sky-800">
          <Info className="h-5 w-5 mt-0.5 shrink-0 text-sky-500" />
          <p>
            <span className="font-semibold">Lưu ý quan trọng: </span>
            Thông tin thú cưng được quản lý bởi cửa hàng. Nếu cần cập nhật
            thông tin, vui lòng liên hệ với chúng tôi qua hotline{" "}
            <span className="font-semibold">028-1234-567</span>.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="rounded-[30px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            <span className="inline-block animate-spin text-3xl mb-3">🐾</span>
            <p>Đang tải danh sách thú cưng...</p>
          </div>
        ) : error ? (
          <div className="rounded-[30px] border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
            {error}
          </div>
        ) : pets.length === 0 ? (
          <div className="rounded-[30px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-5xl mb-4">🐾</p>
            <p className="text-slate-600 font-medium">
              Bạn chưa có thú cưng nào được đăng ký.
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Liên hệ cửa hàng để thêm bé cưng của bạn.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onViewDetail={handleViewDetail}
                onViewPetCard={handleViewPetCard}
              />
            ))}
          </div>
        )}

        {/* Bottom banner */}
        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-gradient-to-r from-[#172554] via-[#334155] to-[#D56756] p-6 shadow-sm text-white sm:p-8">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white shrink-0">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                Chăm sóc thú cưng tốt hơn
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-100">
                <li>
                  • Đưa thú cưng đi khám định kỳ 6 tháng/lần để phát hiện bệnh sớm.
                </li>
                <li>
                  • Giữ lịch tiêm phòng đầy đủ để bảo vệ sức khỏe bé cưng.
                </li>
                <li>
                  • Liên hệ hotline{" "}
                  <span className="font-semibold">028-1234-567</span> nếu cần
                  tư vấn khẩn cấp.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pet Detail Modal */}
      {selectedPet && (
        <PetDetailModal
          pet={selectedPet}
          records={medicalRecords}
          loading={recordsLoading}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default UserPetPage;
