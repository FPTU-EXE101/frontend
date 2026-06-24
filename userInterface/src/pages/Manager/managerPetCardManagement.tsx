import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Check,
  Copy,
  Eye,
  ExternalLink,
  QrCode,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import appointmentApi from "@/apis/appointmentAPI";
import invoiceApi from "@/apis/invoiceAPI";
import petApi from "@/apis/petAPI";
import userApi from "@/apis/userAPI";
import PetQRCode from "@/components/pets/PetQRCode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Appointment } from "@/types/appointment.type";
import type { Invoice } from "@/types/invoice.type";
import type { Pet } from "@/types/pet.type";
import type { User } from "@/types/user.type";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";

type Customer = User & {
  phone?: string;
  phoneNumber?: string;
};

type PetCardStatus = "active" | "inactive" | "unknown";

const NO_DATA = "Chưa có dữ liệu";
const ALL_STATUSES = "all";

const normalizeList = <T,>(value: unknown): T[] => {
  const payload =
    value && typeof value === "object" && "data" in value
      ? (value as { data?: unknown }).data
      : value;

  return Array.isArray(payload) ? (payload as T[]) : [];
};

const normalizeText = (value?: string | number | boolean | null) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const formatDate = (value?: string) => {
  if (!value) return NO_DATA;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return NO_DATA;

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getPetCardUrl = (petId: string) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/pet-card/${petId}`;
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
    NO_DATA
  );
};

const getCustomerEmail = (customer?: Customer, pet?: Pet) =>
  customer?.email || pet?.customer?.email || pet?.email || "";

const getCustomerPhone = (customer?: Customer, pet?: Pet) =>
  customer?.phoneNumber || customer?.phone || pet?.customer?.phone || pet?.phone || "";

const getPetCreatedAt = (pet: Pet) => {
  const data = pet as Pet & { createdAt?: string; createAt?: string };
  return data.createdAt || data.createAt || "";
};

const getPetUpdatedAt = (pet: Pet) => {
  const data = pet as Pet & { updatedAt?: string; updateAt?: string };
  return data.updatedAt || data.updateAt || "";
};

const getPetCardStatus = (pet: Pet): PetCardStatus => {
  const data = pet as Pet & {
    petCardStatus?: string;
    status?: string | number | boolean;
    isActive?: boolean;
    disabled?: boolean;
  };

  if (data.disabled === true || data.isActive === false) return "inactive";
  if (data.disabled === false || data.isActive === true) return "active";

  const status = normalizeText(data.petCardStatus ?? data.status);
  if (["inactive", "disabled", "disable", "0", "false"].includes(status)) {
    return "inactive";
  }
  if (["active", "enabled", "enable", "1", "true"].includes(status)) {
    return "active";
  }

  return "active";
};

const getStatusLabel = (status: PetCardStatus) => {
  if (status === "active") return "Active";
  if (status === "inactive") return "Disabled";
  return "Unknown";
};

const getStatusClass = (status: PetCardStatus) => {
  if (status === "active") {
    return "bg-emerald-100 text-emerald-800 ring-emerald-200";
  }
  if (status === "inactive") {
    return "bg-rose-100 text-rose-800 ring-rose-200";
  }
  return "bg-slate-100 text-slate-700 ring-slate-200";
};

const isRecentlyCreated = (pet: Pet) => {
  const createdAt = getPetCreatedAt(pet);
  if (!createdAt) return false;

  const createdDate = new Date(createdAt);
  if (Number.isNaN(createdDate.getTime())) return false;

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return createdDate.getTime() >= thirtyDaysAgo;
};

const ManagerPetCardManagement = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_STATUSES);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [copiedPetId, setCopiedPetId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadPetCards = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          petsResponse,
          usersResponse,
          appointmentsResponse,
          invoicesResponse,
        ] = await Promise.all([
          petApi.getAllPets({ signal: controller.signal }),
          userApi.getStoreCustomers({ signal: controller.signal }),
          appointmentApi.getAllAppointments({ signal: controller.signal }),
          invoiceApi.getAllInvoices({ signal: controller.signal }),
        ]);

        setPets(normalizeList<Pet>(petsResponse?.data));
        setCustomers(normalizeList<Customer>(usersResponse?.data));
        setAppointments(normalizeList<Appointment>(appointmentsResponse?.data));
        setInvoices(normalizeList<Invoice>(invoicesResponse?.data));
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(getBackendErrorMessage(loadError));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadPetCards();
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

  const filteredPets = useMemo(() => {
    const query = normalizeText(searchTerm);

    return pets.filter((pet) => {
      const customer = customersById[pet.customerId];
      const status = getPetCardStatus(pet);
      const matchesStatus = statusFilter === ALL_STATUSES || status === statusFilter;
      const searchable = [
        pet.id,
        pet.name,
        getCustomerName(customer, pet),
        getCustomerEmail(customer, pet),
        getCustomerPhone(customer, pet),
      ];

      const matchesSearch =
        !query || searchable.some((value) => normalizeText(value).includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [customersById, pets, searchTerm, statusFilter]);

  const summary = useMemo(() => {
    const active = pets.filter((pet) => getPetCardStatus(pet) === "active").length;
    const inactive = pets.filter(
      (pet) => getPetCardStatus(pet) === "inactive",
    ).length;
    const recent = pets.filter(isRecentlyCreated).length;

    return {
      active,
      inactive,
      recent,
      total: pets.length,
    };
  }, [pets]);

  const selectedCustomer = selectedPet
    ? customersById[selectedPet.customerId]
    : undefined;

  const selectedAppointments = useMemo(() => {
    if (!selectedPet) return [];
    return appointments.filter((appointment) => appointment.petId === selectedPet.id);
  }, [appointments, selectedPet]);

  const selectedInvoices = useMemo(() => {
    if (!selectedPet) return [];
    const petName = normalizeText(selectedPet.name);
    const ownerName = normalizeText(getCustomerName(selectedCustomer, selectedPet));

    return invoices.filter((invoice) => {
      const matchesPet = petName && normalizeText(invoice.petName).includes(petName);
      const matchesCustomer =
        ownerName && normalizeText(invoice.customerName).includes(ownerName);
      return matchesPet || matchesCustomer;
    });
  }, [invoices, selectedCustomer, selectedPet]);

  const handleCopyLink = async (petId: string) => {
    try {
      await navigator.clipboard.writeText(getPetCardUrl(petId));
      setCopiedPetId(petId);
      window.setTimeout(() => setCopiedPetId(""), 1800);
    } catch {
      setCopiedPetId("");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F5D7D2] px-3 py-1 text-sm font-semibold text-[#9B2F25]">
              <QrCode className="h-4 w-4" />
              PetCard Core
            </div>
            <h1 className="text-3xl font-semibold text-slate-950">
              PetCard Management
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              PetCard là hồ sơ định danh số cho thú cưng, giúp chủ nuôi lưu trữ
              thông tin, chia sẻ hồ sơ qua QR và hỗ trợ cửa hàng quản lý chăm
              sóc thú cưng hiệu quả hơn.
            </p>
          </div>
          <Button asChild className="h-11 bg-[#D56756] text-white hover:bg-[#b2483c]">
            <Link to="/manager/pets/new">Tạo PetCard từ thú cưng mới</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Total PetCards", summary.total.toLocaleString("vi-VN")],
          ["Active PetCards", summary.active.toLocaleString("vi-VN")],
          ["Inactive/Disabled", summary.inactive.toLocaleString("vi-VN")],
          ["Recently Created", summary.recent.toLocaleString("vi-VN")],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên thú cưng, chủ nuôi, email hoặc số điện thoại..."
              className="pl-12"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              [ALL_STATUSES, "Tất cả"],
              ["active", "Active"],
              ["inactive", "Disabled"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value)}
                className={
                  "rounded-full border px-4 py-2 text-sm font-semibold transition " +
                  (statusFilter === value
                    ? "border-[#D56756] bg-[#F5D7D2] text-[#9B2F25]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[0.95fr_1fr_1.4fr_1.6fr_0.8fr_0.9fr_1.4fr] gap-4 border-b border-slate-200 bg-[#F8F1E4] px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
          <span>PetCard ID</span>
          <span>Pet</span>
          <span>Owner</span>
          <span>Public Link</span>
          <span>Status</span>
          <span>Updated</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Đang tải PetCard...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-3 p-10 text-sm font-semibold text-rose-700">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        ) : filteredPets.length > 0 ? (
          filteredPets.map((pet) => {
            const customer = customersById[pet.customerId];
            const status = getPetCardStatus(pet);
            const publicLink = getPetCardUrl(pet.id);
            const customerEmail = getCustomerEmail(customer, pet);
            const customerPhone = getCustomerPhone(customer, pet);

            return (
              <div
                key={pet.id}
                className="grid grid-cols-[0.95fr_1fr_1.4fr_1.6fr_0.8fr_0.9fr_1.4fr] items-center gap-4 border-b border-slate-200 px-5 py-5 text-sm text-slate-700 last:border-b-0"
              >
                <span className="truncate font-mono text-xs font-semibold text-slate-950">
                  {pet.id}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-950">
                    {pet.name || NO_DATA}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {[pet.species || pet.type, pet.breed, pet.color]
                      .filter(Boolean)
                      .join(" • ") || NO_DATA}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-950">
                    {getCustomerName(customer, pet)}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {customerEmail || customerPhone || NO_DATA}
                  </p>
                </div>
                <span className="truncate text-xs text-slate-500">{publicLink}</span>
                <span>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusClass(
                      status,
                    )}`}
                  >
                    {getStatusLabel(status)}
                  </span>
                </span>
                <span className="text-xs text-slate-500">
                  {formatDate(getPetUpdatedAt(pet) || getPetCreatedAt(pet))}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedPet(pet)}
                    className="h-9 rounded-full px-3 text-xs font-semibold"
                  >
                    <Eye className="h-4 w-4" />
                    Detail
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void handleCopyLink(pet.id)}
                    className="h-9 rounded-full px-3 text-xs font-semibold"
                  >
                    {copiedPetId === pet.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    asChild
                    className="h-9 rounded-full bg-slate-950 px-3 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    <Link to={`/pet-card/${pet.id}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-10 text-center text-sm text-slate-500">
            Chưa có PetCard nào phù hợp với bộ lọc hiện tại.
          </div>
        )}
      </section>

      <p className="text-xs text-slate-500">
        TODO: Backend chưa có API bật/tắt PetCard riêng, nên thao tác
        enable/disable chưa được hiển thị.
      </p>

      {selectedPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                  <ShieldCheck className="h-4 w-4" />
                  PetCard Detail
                </div>
                <h2 className="text-2xl font-semibold text-slate-950">
                  {selectedPet.name || NO_DATA}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {getPetCardUrl(selectedPet.id)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPet(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
                aria-label="Đóng chi tiết PetCard"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid max-h-[calc(90vh-8rem)] gap-6 overflow-y-auto p-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["Pet ID", selectedPet.id],
                    ["Loài / Type", selectedPet.species || selectedPet.type],
                    ["Giống", selectedPet.breed],
                    ["Màu sắc", selectedPet.color],
                    ["Giới tính", selectedPet.gender],
                    ["Ngày sinh", formatDate(selectedPet.dateOfBirth)],
                    ["Chủ nuôi", getCustomerName(selectedCustomer, selectedPet)],
                    [
                      "Liên hệ",
                      getCustomerEmail(selectedCustomer, selectedPet) ||
                        getCustomerPhone(selectedCustomer, selectedPet),
                    ],
                    ["Created", formatDate(getPetCreatedAt(selectedPet))],
                    ["Updated", formatDate(getPetUpdatedAt(selectedPet))],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {label}
                      </p>
                      <p className="mt-2 break-words font-semibold text-slate-950">
                        {value || NO_DATA}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="font-semibold text-slate-950">
                    Medical/basic info
                  </h3>
                  <div className="mt-3 grid gap-3 text-sm text-slate-600">
                    <p>Ghi chú: {selectedPet.note || selectedPet.medicalNote || NO_DATA}</p>
                    <p>Dị ứng: {selectedPet.allergy || selectedPet.allergies || NO_DATA}</p>
                    <p>
                      Vaccine:{" "}
                      {selectedPet.vaccineInfo || selectedPet.vaccination || NO_DATA}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="font-semibold text-slate-950">
                    Related appointments
                  </h3>
                  <div className="mt-3 space-y-2">
                    {selectedAppointments.length > 0 ? (
                      selectedAppointments.slice(0, 5).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
                        >
                          <p className="font-semibold text-slate-950">
                            {appointment.appointmentNote || NO_DATA}
                          </p>
                          <p className="mt-1">
                            {formatDate(appointment.appointmentDate)} •{" "}
                            {appointment.startTime?.substring(0, 5)} -{" "}
                            {appointment.endTime?.substring(0, 5)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">{NO_DATA}</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="font-semibold text-slate-950">
                    Related invoices
                  </h3>
                  <div className="mt-3 space-y-2">
                    {selectedInvoices.length > 0 ? (
                      selectedInvoices.slice(0, 5).map((invoice) => (
                        <div
                          key={invoice.id}
                          className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
                        >
                          <p className="font-semibold text-slate-950">
                            {invoice.petName || NO_DATA}
                          </p>
                          <p className="mt-1">
                            {invoice.status || NO_DATA} •{" "}
                            {Number(invoice.totalAmount ?? 0).toLocaleString(
                              "vi-VN",
                            )}
                            đ
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">{NO_DATA}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <PetQRCode petId={selectedPet.id} petName={selectedPet.name} />
                <Button asChild variant="outline" className="w-full rounded-full">
                  <Link to={`/manager/pets/${selectedPet.id}/medical-record`}>
                    Open related pet profile
                  </Link>
                </Button>
                <Button asChild className="w-full rounded-full bg-slate-950 text-white">
                  <Link to={`/pet-card/${selectedPet.id}`} target="_blank">
                    Open public PetCard
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerPetCardManagement;
