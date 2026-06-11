import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, PawPrint, FileText, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import petApi from "@/apis/petAPI";
import userApi from "@/apis/userAPI";
import type { Pet } from "@/types/pet.type";
import type { User } from "@/types/user.type";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";
import PetQRCode from "@/components/pets/PetQRCode";
import { useDebounce } from "@/hooks/useDebounce";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { usePagination } from "@/hooks/usePagination";

type Customer = User & {
  phone?: string;
  phoneNumber?: string;
};

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

const normalizeText = (value?: string | number | null) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const normalizeList = <T,>(value: unknown): T[] => {
  const payload =
    value && typeof value === "object" && "data" in value
      ? (value as { data?: unknown }).data
      : value;

  return Array.isArray(payload) ? (payload as T[]) : [];
};

const getCustomerName = (customer?: Customer, pet?: Pet) => {
  const fullName = [customer?.lastName, customer?.firstName]
    .filter(Boolean)
    .join(" ");

  return (
    fullName ||
    customer?.userName ||
    pet?.customer?.fullName ||
    pet?.customer?.name ||
    pet?.customerName ||
    pet?.ownerName ||
    "Chưa rõ"
  );
};

const getCustomerEmail = (customer?: Customer, pet?: Pet) =>
  customer?.email || pet?.customer?.email || pet?.email || "";

const getCustomerPhone = (customer?: Customer, pet?: Pet) =>
  customer?.phoneNumber || customer?.phone || pet?.customer?.phone || pet?.phone || "";

const getPetType = (pet: Pet) => pet.species || pet.type || "Chưa phân loại";

const getDateTime = (value?: string) => {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const formatDate = (value?: string) => {
  if (!value) return "Chưa rõ";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa rõ";
  return date.toLocaleDateString("vi-VN");
};

const ManagerPetsManage = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [petTypeFilter, setPetTypeFilter] = useState("all");
  const [createdSort, setCreatedSort] = useState<"newest" | "oldest">(
    "newest",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);

  useEffect(() => {
    const controller = new AbortController();

    const loadPets = async () => {
      setLoading(true);
      setError("");

      try {
        const [petsResponse, usersResponse] = await Promise.all([
          petApi.getAllPets({
            signal: controller.signal,
          }),
          userApi.getAllUsers({
            signal: controller.signal,
          }),
        ]);

        setPets(normalizeList<Pet>(petsResponse?.data));
        setCustomers(normalizeList<Customer>(usersResponse?.data));
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(getBackendErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadPets();
    return () => controller.abort();
  }, []);

  const customersById = useMemo(
    () =>
      customers.reduce<Record<string, Customer>>((map, customer) => {
        map[customer.id] = customer;
        return map;
      }, {}),
    [customers],
  );

  const petTypeOptions = useMemo(() => {
    const typeMap = new Map<string, string>();

    pets.forEach((pet) => {
      const type = getPetType(pet);
      const normalizedType = normalizeText(type);

      if (normalizedType && normalizedType !== normalizeText("Chưa phân loại")) {
        typeMap.set(normalizedType, type);
      }
    });

    return Array.from(typeMap.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "vi"));
  }, [pets]);

  const filteredPets = useMemo(() => {
    const query = normalizeText(debouncedSearchTerm);
    const selectedType = normalizeText(petTypeFilter);

    return pets
      .filter((pet) => {
        if (selectedType !== "all" && normalizeText(getPetType(pet)) !== selectedType) {
          return false;
        }

        if (!query) {
          return true;
        }

        const customer = customersById[pet.customerId];
        const searchableValues = [
          pet.name,
          pet.id,
          getPetType(pet),
          getCustomerName(customer, pet),
          getCustomerEmail(customer, pet),
          getCustomerPhone(customer, pet),
        ];

        return searchableValues.some((value) =>
          normalizeText(value).includes(query),
        );
      })
      .sort((firstPet, secondPet) => {
        const firstBirthTime = getDateTime(firstPet.dateOfBirth);
        const secondBirthTime = getDateTime(secondPet.dateOfBirth);
        const dateDiff =
          createdSort === "newest"
            ? secondBirthTime - firstBirthTime
            : firstBirthTime - secondBirthTime;

        if (dateDiff !== 0) {
          return dateDiff;
        }

        return firstPet.name.localeCompare(secondPet.name, "vi");
      });
  }, [createdSort, customersById, debouncedSearchTerm, petTypeFilter, pets]);

  const petPagination = usePagination(filteredPets, 12);

  return (
    <div className="space-y-6">
      <section className=" rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className=" mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative w-full xl:w-[24rem]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm theo tên/id thú cưng, tên/email/sđt chủ..."
                className="pl-12"
              />
            </div>
            <select
              value={petTypeFilter}
              onChange={(event) => setPetTypeFilter(event.target.value)}
              className="h-11 rounded-md border border-input bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring xl:w-44"
            >
              <option value="all">Tất cả loại</option>
              {petTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={createdSort}
              onChange={(event) =>
                setCreatedSort(event.target.value === "oldest" ? "oldest" : "newest")
              }
              className="h-11 rounded-md border border-input bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring xl:w-48"
            >
              <option value="newest">Ngày sinh mới nhất</option>
              <option value="oldest">Ngày sinh cũ nhất</option>
            </select>
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
            petPagination.pageItems.map((pet) => {
              const customer = customersById[pet.customerId];
              const customerName = getCustomerName(customer, pet);
              const customerEmail = getCustomerEmail(customer, pet);

              return (
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
                          {[getPetType(pet), pet.breed, pet.color]
                            .filter(Boolean)
                            .join(" • ")}
                        </p>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
                        {calculateAge(pet.dateOfBirth)}
                      </div>
                    </div>

                    <div className="grid gap-3 text-sm text-slate-600">
                      <div className="flex items-start gap-2">
                        <Heart className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                        <span className="min-w-0">
                          Chủ:{" "}
                          <span className="font-medium text-slate-800">
                            {customerName}
                          </span>
                          {customerEmail && (
                            <span className="block truncate text-xs text-slate-500">
                              {customerEmail}
                            </span>
                          )}
                        </span>
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
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span>
                          Ngày sinh: {formatDate(pet.dateOfBirth)}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Button asChild variant="outline" className="w-full">
                        <Link to={`/pet-card/${pet.id}`} target="_blank">
                          Xem Digital Pet Card
                        </Link>
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

                    <PetQRCode petId={pet.id} petName={pet.name} />
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              Không tìm thấy thú cưng nào với bộ lọc hiện tại.
            </div>
          )}
        </div>

        <div className="mt-6">
          <PaginationControls
            canGoNext={petPagination.canGoNext}
            canGoPrevious={petPagination.canGoPrevious}
            currentPage={petPagination.currentPage}
            onNext={petPagination.goNext}
            onPrevious={petPagination.goPrevious}
            totalItems={petPagination.totalItems}
            totalPages={petPagination.totalPages}
          />
        </div>
      </section>

      {error && (
        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 whitespace-pre-line">
          {error}
        </div>
      )}
    </div>
  );
};

export default ManagerPetsManage;
