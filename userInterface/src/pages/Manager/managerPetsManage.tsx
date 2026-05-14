import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, PawPrint, FileText, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import petApi from "@/apis/petAPI";
import type { Pet } from "@/types/pet.type";

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

const ManagerPetsManage = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPets = async () => {
      setLoading(true);
      try {
        const response = await petApi.getAllPets();
        setPets(response?.data ?? []);
      } catch {
        setError("Không tải được danh sách thú cưng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  const filteredPets = useMemo(
    () =>
      pets.filter((pet) => {
        const query = searchTerm.toLowerCase();
        return (
          pet.name.toLowerCase().includes(query) ||
          pet.color.toLowerCase().includes(query) ||
          pet.custoemrId?.toLowerCase().includes(query)
        );
      }),
    [pets, searchTerm],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                🏠
              </span>
              <span>Thú cưng</span>
            </div>
            <h2 className="text-3xl font-semibold text-slate-950">
              Quản lý thú cưng
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Tổng số {pets.length} thú cưng
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[28rem]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm theo tên thú cưng, giống, chủ nhân..."
                className="pl-12"
              />
            </div>
            <Button className="h-11 whitespace-nowrap bg-[#D56756] text-white hover:bg-[#b2483c]">
              <Link to="/manager/pets/new">+ Thêm thú cưng mới</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-slate-500 shadow-sm">
              Đang tải danh sách thú cưng...
            </div>
          ) : filteredPets.length > 0 ? (
            filteredPets.map((pet) => (
              <article
                key={pet.id}
                className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-sm"
              >
                <div className="flex h-48 items-center justify-center bg-[#F4E8D8]">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                    <PawPrint className="h-12 w-12 text-amber-500" />
                  </div>
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">
                        {pet.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {pet.color || "Golden Retriever"}
                      </p>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
                      {calculateAge(pet.dateOfBirth)}
                    </div>
                  </div>

                  <div className="grid gap-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-rose-500" />
                      <span>Chủ: {pet.custoemrId || "Chưa rõ"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span>
                        Hồ sơ y tế{" "}
                        {pet.dateOfBirth
                          ? `- sinh ${new Date(pet.dateOfBirth).getFullYear()}`
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button variant="outline" className="w-full">
                      Xem Digital Pet Card
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-slate-950 text-white hover:bg-slate-800"
                    >
                      <Link to={`/manager/pets/${pet.id}/medical-record`}>
                        Hồ sơ y tế
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              Không tìm thấy thú cưng nào với từ khóa hiện tại.
            </div>
          )}
        </div>
      </section>

      {error && (
        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}
    </div>
  );
};

export default ManagerPetsManage;
