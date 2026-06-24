import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Mail,
  PawPrint,
  ReceiptText,
  Search,
  Scissors,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { User } from "@/types/user.type";
import type { Pet } from "@/types/pet.type";
import type { Appointment } from "@/types/appointment.type";
import type { AppointmentStatus } from "@/types/enum.type";
import type { GetInvoiceByCustomerIdResponse } from "@/types/invoice.type";
import userApi from "@/apis/userAPI";
import petApi from "@/apis/petAPI";
import invoiceApi from "@/apis/invoiceAPI";
import appointmentApi from "@/apis/appointmentAPI";
import { useDebounce } from "@/hooks/useDebounce";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { usePagination } from "@/hooks/usePagination";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";

type CustomerStats = {
  petCount: number;
  totalSpent: number;
};

type AppointmentStatusFilter = AppointmentStatus | "all";

const PAID_STATUSES = new Set(["completed", "paid", "1", "2"]);
const APPOINTMENT_STATUS_META: Record<
  AppointmentStatus,
  { label: string; badge: string }
> = {
  0: {
    label: "Đã xác nhận",
    badge: "bg-sky-50 text-sky-700 border-sky-100",
  },
  1: {
    label: "Hoàn thành",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  2: {
    label: "Đã hủy",
    badge: "bg-zinc-100 text-zinc-700 border-zinc-200",
  },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const normalizeList = <T,>(value: unknown): T[] => {
  const payload =
    value && typeof value === "object" && "data" in value
      ? (value as { data?: unknown }).data
      : value;

  return Array.isArray(payload) ? (payload as T[]) : [];
};

const isPaidInvoice = (invoice: GetInvoiceByCustomerIdResponse) => {
  const status = String(invoice.status ?? "").trim().toLowerCase();
  return PAID_STATUSES.has(status);
};

const getFullName = (user: User) => {
  const fullName = [user.lastName, user.firstName].filter(Boolean).join(" ");
  return fullName || user.userName;
};

const toTimeLabel = (value: string) => (value ? value.substring(0, 5) : "--:--");

const formatDate = (value: string) => {
  if (!value) return "Chưa rõ ngày";
  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ManagerCustomersManage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [customerStats, setCustomerStats] = useState<
    Record<string, CustomerStats>
  >({});
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [selectedPetCustomer, setSelectedPetCustomer] = useState<User | null>(
    null,
  );
  const [customerAppointments, setCustomerAppointments] = useState<
    Appointment[]
  >([]);
  const [appointmentStatusFilter, setAppointmentStatusFilter] =
    useState<AppointmentStatusFilter>("all");
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);

  useEffect(() => {
    const controller = new AbortController();

    const loadCustomers = async () => {
      setLoading(true);
      setError("");

      try {
        const [usersResponse, petsResponse] = await Promise.all([
          userApi.getStoreCustomers({
            signal: controller.signal,
          }),
          petApi.getAllPets({
            signal: controller.signal,
          }),
        ]);

        const userData = normalizeList<User>(usersResponse?.data);
        const petData = normalizeList<Pet>(petsResponse?.data);
        const invoiceGroups = await Promise.all(
          userData.map(async (user) => {
            try {
              const response = await invoiceApi.getInvoiceByCustomerId(user.id, {
                signal: controller.signal,
              });

              return {
                customerId: user.id,
                invoices: normalizeList<GetInvoiceByCustomerIdResponse>(
                  response?.data,
                ),
              };
            } catch (invoiceError) {
              if (controller.signal.aborted) {
                throw invoiceError;
              }

              return {
                customerId: user.id,
                invoices: [],
              };
            }
          }),
        );

        const stats = userData.reduce<Record<string, CustomerStats>>(
          (acc, user) => {
            const invoices =
              invoiceGroups.find((group) => group.customerId === user.id)
                ?.invoices ?? [];

            acc[user.id] = {
              petCount: petData.filter((pet) => pet.customerId === user.id)
                .length,
              totalSpent: invoices
                .filter(isPaidInvoice)
                .reduce(
                  (total, invoice) => total + Number(invoice.totalAmount ?? 0),
                  0,
                ),
            };

            return acc;
          },
          {},
        );

        setUsers(userData);
        setPets(petData);
        setCustomerStats(stats);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(getBackendErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadCustomers();
    return () => controller.abort();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = debouncedSearchTerm.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.userName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        getFullName(user).toLowerCase().includes(query)
      );
    });
  }, [debouncedSearchTerm, users]);

  const customerPagination = usePagination(filteredCustomers, 10);
  const petNamesById = useMemo(
    () =>
      pets.reduce<Record<string, string>>((map, pet) => {
        map[pet.id] = pet.name;
        return map;
      }, {}),
    [pets],
  );

  const selectedCustomerPets = useMemo(() => {
    if (!selectedPetCustomer) {
      return [];
    }

    return pets.filter((pet) => pet.customerId === selectedPetCustomer.id);
  }, [pets, selectedPetCustomer]);

  const filteredAppointments = useMemo(() => {
    if (appointmentStatusFilter === "all") {
      return customerAppointments;
    }

    return customerAppointments.filter(
      (appointment) => appointment.status === appointmentStatusFilter,
    );
  }, [appointmentStatusFilter, customerAppointments]);

  const appointmentStats = useMemo(
    () =>
      customerAppointments.reduce<Record<AppointmentStatus, number>>(
        (acc, appointment) => {
          acc[appointment.status] += 1;
          return acc;
        },
        { 0: 0, 1: 0, 2: 0 },
      ),
    [customerAppointments],
  );

  const handleOpenAppointments = async (user: User) => {
    setSelectedCustomer(user);
    setAppointmentStatusFilter("all");
    setCustomerAppointments([]);
    setAppointmentsError("");
    setAppointmentsLoading(true);

    try {
      const response = await appointmentApi.getAppointmentsByCustomerId(user.id);
      setCustomerAppointments(normalizeList<Appointment>(response?.data));
    } catch (err) {
      setAppointmentsError(getBackendErrorMessage(err));
    } finally {
      setAppointmentsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                <Scissors className="h-4 w-4" />
              </span>
              <span>Danh mục</span>
            </div>
            <h1 className="text-3xl font-semibold text-slate-950">
              Quản lý Khách hàng
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Tổng số {filteredCustomers.length} Khách hàng
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[24rem]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm Khách hàng theo tên..."
                className="pl-12"
              />
            </div>
            <Button className="h-11 whitespace-nowrap bg-[#D56756] text-white hover:bg-[#b2483c]">
              <Link to="/manager/services/new">+ Thêm Khách hàng mới</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1.4fr_1.8fr_0.8fr_0.8fr_1fr_1.8fr] gap-0 border-b border-slate-200 bg-[#F8F1E4] px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.14em] text-slate-700">
          <span>Tên Khách hàng</span>
          <span>Liên lạc</span>
          <span>Plan</span>
          <span>Thú cưng</span>
          <span>Tổng chi tiêu</span>
          <span>Hành động</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Đang tải Khách hàng...
          </div>
        ) : filteredCustomers.length > 0 ? (
          customerPagination.pageItems.map((user) => {
            const stats = customerStats[user.id] ?? {
              petCount: 0,
              totalSpent: 0,
            };

            return (
              <div
                key={user.id}
                className="grid grid-cols-[1.4fr_1.8fr_0.8fr_0.8fr_1fr_1.8fr] items-center gap-0 border-b border-slate-200 px-6 py-5 text-sm text-slate-700 last:border-b-0"
              >
                <div>
                  <p className="font-semibold text-slate-950">
                    {user.userName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {getFullName(user)}
                  </p>
                </div>
                <div className="font-medium text-slate-950">{user.email}</div>
                <div>
                  {user.plan === 0 ? (
                    <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                      Normal
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Premium
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 font-semibold text-slate-950">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <PawPrint className="h-4 w-4" />
                  </span>
                  <span>{stats.petCount}</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-slate-950">
                  <ReceiptText className="h-4 w-4 text-slate-400" />
                  <span>{formatCurrency(stats.totalSpent)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void handleOpenAppointments(user)}
                    className="h-9 rounded-full px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <CalendarDays className="h-4 w-4" />
                    Lịch hẹn
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedPetCustomer(user)}
                    className="h-9 rounded-full px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <PawPrint className="h-4 w-4" />
                    Thú cưng
                  </Button>
                  <Button
                    asChild
                    className="h-9 rounded-full bg-slate-950 px-3 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    <a
                      href={`mailto:${user.email}`}
                      aria-label={`Gửi email cho ${user.userName}`}
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-10 text-center text-slate-500">
            Không có Khách hàng nào phù hợp.
          </div>
        )}
      </section>

      <PaginationControls
        canGoNext={customerPagination.canGoNext}
        canGoPrevious={customerPagination.canGoPrevious}
        currentPage={customerPagination.currentPage}
        onNext={customerPagination.goNext}
        onPrevious={customerPagination.goPrevious}
        totalItems={customerPagination.totalItems}
        totalPages={customerPagination.totalPages}
      />

      {error && (
        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 whitespace-pre-line">
          {error}
        </div>
      )}

      {selectedPetCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                  <PawPrint className="h-4 w-4" />
                  Thú cưng của khách hàng
                </div>
                <h2 className="text-2xl font-semibold text-slate-950">
                  {selectedPetCustomer.userName}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {selectedPetCustomer.email} • {selectedCustomerPets.length} thú
                  cưng
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPetCustomer(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
                aria-label="Đóng danh sách thú cưng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-8rem)] overflow-y-auto p-6">
              {selectedCustomerPets.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {selectedCustomerPets.map((pet) => (
                    <article
                      key={pet.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                          <PawPrint className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-lg font-semibold text-slate-950">
                            {pet.name || "Chưa có tên"}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {[pet.species || pet.type, pet.breed, pet.color]
                              .filter(Boolean)
                              .join(" • ") || "Chưa có mô tả"}
                          </p>
                          <div className="mt-4 grid gap-2 text-sm text-slate-600">
                            <span>
                              Ngày sinh:{" "}
                              <strong className="text-slate-900">
                                {formatDate(pet.dateOfBirth)}
                              </strong>
                            </span>
                            {pet.gender && (
                              <span>
                                Giới tính:{" "}
                                <strong className="text-slate-900">
                                  {pet.gender}
                                </strong>
                              </span>
                            )}
                            {pet.weight && (
                              <span>
                                Cân nặng:{" "}
                                <strong className="text-slate-900">
                                  {pet.weight} kg
                                </strong>
                              </span>
                            )}
                            <span className="break-all text-xs text-slate-500">
                              Pet ID: {pet.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  Khách hàng này chưa có thú cưng nào.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                  <CalendarDays className="h-4 w-4" />
                  Lịch hẹn theo thú cưng
                </div>
                <h2 className="text-2xl font-semibold text-slate-950">
                  {selectedCustomer.userName}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {selectedCustomer.email} • {getFullName(selectedCustomer)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
                aria-label="Đóng lịch hẹn khách hàng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-8rem)] overflow-y-auto p-6">
              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Tổng lịch hẹn
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {customerAppointments.length}
                  </p>
                </div>
                {([0, 1, 2] as AppointmentStatus[]).map((status) => (
                  <div
                    key={status}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {APPOINTMENT_STATUS_META[status].label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {appointmentStats[status]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAppointmentStatusFilter("all")}
                  className={
                    "rounded-full border px-4 py-2 text-sm font-semibold transition " +
                    (appointmentStatusFilter === "all"
                      ? "border-[#D56756] bg-[#F5D7D2] text-[#9B2F25]"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")
                  }
                >
                  Tất cả
                </button>
                {([0, 1, 2] as AppointmentStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setAppointmentStatusFilter(status)}
                    className={
                      "rounded-full border px-4 py-2 text-sm font-semibold transition " +
                      (appointmentStatusFilter === status
                        ? "border-[#D56756] bg-[#F5D7D2] text-[#9B2F25]"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")
                    }
                  >
                    {APPOINTMENT_STATUS_META[status].label}
                  </button>
                ))}
              </div>

              <div className="mt-5 space-y-3">
                {appointmentsLoading ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                    Đang tải lịch hẹn...
                  </div>
                ) : appointmentsError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                    {appointmentsError}
                  </div>
                ) : filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <article
                      key={appointment.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="space-y-3">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${APPOINTMENT_STATUS_META[appointment.status].badge}`}
                        >
                          {APPOINTMENT_STATUS_META[appointment.status].label}
                        </span>
                        <h3 className="text-lg font-semibold text-slate-950">
                          {appointment.appointmentNote ||
                            "Lịch hẹn khách hàng"}
                        </h3>
                        <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                          <span className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-[#D56756]" />
                            {formatDate(appointment.appointmentDate)}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-[#D56756]" />
                            {toTimeLabel(appointment.startTime)} -{" "}
                            {toTimeLabel(appointment.endTime)}
                          </span>
                          <span>
                            Thú cưng:{" "}
                            <strong className="text-slate-900">
                              {petNamesById[appointment.petId] ||
                                appointment.petId}
                            </strong>
                          </span>
                          <span className="break-all">
                            Mã lịch hẹn: {appointment.id}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                    Chưa có lịch hẹn phù hợp với bộ lọc hiện tại.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerCustomersManage;
