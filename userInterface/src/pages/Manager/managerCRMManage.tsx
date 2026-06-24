import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Crown,
  HeartHandshake,
  Mail,
  PawPrint,
  Search,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import invoiceApi from "@/apis/invoiceAPI";
import petApi from "@/apis/petAPI";
import userApi from "@/apis/userAPI";
import { Input } from "@/components/ui/input";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";

type CustomerTier = "VIP" | "Thân thiết" | "Mới";
type TierFilter = "all" | CustomerTier;

type ApiUser = {
  id?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  userName?: unknown;
  email?: unknown;
  phone?: unknown;
  phoneNumber?: unknown;
};

type ApiPet = {
  customerId?: unknown;
};

type ApiInvoice = {
  customerId?: unknown;
  customer?: {
    id?: unknown;
    firstName?: unknown;
    lastName?: unknown;
    userName?: unknown;
    name?: unknown;
    email?: unknown;
  };
  customerName?: unknown;
  totalAmount?: unknown;
  status?: unknown;
  createdAt?: unknown;
  createAt?: unknown;
};

type CustomerInvoiceRecord = {
  customerId: string;
  invoice: ApiInvoice;
};

type InvoiceStatus = "Pending" | "Paid" | "Completed" | "Cancelled" | "Unknown";

type CustomerBase = {
  id: string;
  name: string;
  phone: string;
  email: string;
  petCount: number;
};

type CustomerStats = CustomerBase & {
  totalAppointments: number;
  totalSpent: number;
  lastVisit?: string;
};

type CustomerRow = CustomerStats & {
  tier: CustomerTier;
};

const PAID_STATUSES = new Set<InvoiceStatus>(["Completed", "Paid"]);
const NO_DATA = "Chưa có dữ liệu";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const normalizeText = (value: string) =>
  value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const normalizeList = <T,>(value: unknown): T[] => {
  const payload =
    value && typeof value === "object" && "data" in value
      ? (value as { data?: unknown }).data
      : value;

  return Array.isArray(payload) ? (payload as T[]) : [];
};

const getString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const getUserName = (user: ApiUser) => {
  const fullName = [getString(user.firstName), getString(user.lastName)]
    .filter(Boolean)
    .join(" ");

  return fullName || getString(user.userName) || NO_DATA;
};

const getUserPhone = (user: ApiUser) =>
  getString(user.phone) || getString(user.phoneNumber) || NO_DATA;

const getInvoiceCustomerId = (invoice: ApiInvoice) =>
  getString(invoice.customer?.id) || getString(invoice.customerId);

const getInvoiceCustomerName = (invoice: ApiInvoice) => {
  const customer = invoice.customer;
  const customerFullName = customer
    ? [
        getString(customer.firstName),
        getString(customer.lastName),
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    customerFullName ||
    getString(customer?.name) ||
    getString(customer?.userName) ||
    getString(invoice.customerName)
  );
};

const normalizeInvoiceStatus = (status: unknown): InvoiceStatus => {
  if (typeof status === "number") {
    if (status === 0) return "Pending";
    if (status === 1) return "Completed";
    if (status === 2) return "Paid";
    if (status === 3) return "Cancelled";
    return "Unknown";
  }

  const normalized = getString(status).toLowerCase();

  if (normalized === "0" || normalized === "pending") return "Pending";
  if (normalized === "1" || normalized === "completed") return "Completed";
  if (normalized === "2" || normalized === "paid") return "Paid";
  if (
    normalized === "3" ||
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    return "Cancelled";
  }

  return "Unknown";
};

const getCustomerTier = ({
  totalSpent,
  totalAppointments,
}: Pick<CustomerStats, "totalSpent" | "totalAppointments">): CustomerTier => {
  if (totalSpent >= 5_000_000 || totalAppointments >= 10) {
    return "VIP";
  }

  if (
    (totalSpent >= 2_000_000 && totalSpent < 5_000_000) ||
    (totalAppointments >= 5 && totalAppointments <= 9)
  ) {
    return "Thân thiết";
  }

  return "Mới";
};

const getDaysAgo = (value?: string) => {
  if (!value) return NO_DATA;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return NO_DATA;

  const diffInDays = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 86_400_000),
  );

  if (diffInDays === 0) return "Hôm nay";
  if (diffInDays === 1) return "1 ngày trước";
  return `${diffInDays.toLocaleString("vi-VN")} ngày trước`;
};

const isPaidInvoice = (invoice: ApiInvoice) =>
  PAID_STATUSES.has(normalizeInvoiceStatus(invoice.status));

const getInvoiceDate = (invoice: ApiInvoice) =>
  getString(invoice.createdAt) || getString(invoice.createAt);

const isDateAfter = (next?: string, current?: string) => {
  if (!next) return false;
  if (!current) return true;

  const nextDate = new Date(next);
  const currentDate = new Date(current);

  if (Number.isNaN(nextDate.getTime())) return false;
  if (Number.isNaN(currentDate.getTime())) return true;

  return nextDate.getTime() > currentDate.getTime();
};

const buildCustomerStats = (
  customers: CustomerBase[],
  invoices: CustomerInvoiceRecord[],
): CustomerRow[] => {
  const paidInvoiceStatsByCustomerId = new Map<
    string,
    { totalSpent: number; totalVisits: number; lastVisit?: string }
  >();
  const paidInvoiceStatsByCustomerName = new Map<
    string,
    { totalSpent: number; totalVisits: number; lastVisit?: string }
  >();

  invoices.forEach(({ customerId, invoice }) => {
    if (!isPaidInvoice(invoice)) return;

    const invoiceCustomerId = getInvoiceCustomerId(invoice) || customerId;
    const invoiceCustomerName = normalizeText(getInvoiceCustomerName(invoice));
    const invoiceDate = getInvoiceDate(invoice);
    const totalAmount = Number(invoice.totalAmount ?? 0);

    const addInvoiceStats = (
      map: Map<string, { totalSpent: number; totalVisits: number; lastVisit?: string }>,
      key: string,
    ) => {
      if (!key) return;

      const current = map.get(key) ?? {
        totalSpent: 0,
        totalVisits: 0,
      };

      map.set(key, {
        totalSpent: current.totalSpent + totalAmount,
        totalVisits: current.totalVisits + 1,
        lastVisit: isDateAfter(invoiceDate, current.lastVisit)
          ? invoiceDate
          : current.lastVisit,
      });
    };

    addInvoiceStats(paidInvoiceStatsByCustomerId, invoiceCustomerId);
    addInvoiceStats(paidInvoiceStatsByCustomerName, invoiceCustomerName);
  });

  return customers.map((customer) => {
    const invoiceStats =
      paidInvoiceStatsByCustomerId.get(customer.id) ??
      paidInvoiceStatsByCustomerName.get(normalizeText(customer.name));

    const stats: CustomerStats = {
      ...customer,
      totalAppointments: invoiceStats?.totalVisits ?? 0,
      totalSpent: invoiceStats?.totalSpent ?? 0,
      lastVisit: invoiceStats?.lastVisit,
    };

    return {
      ...stats,
      tier: getCustomerTier(stats),
    };
  });
};

const getTierBadgeClass = (tier: CustomerTier) => {
  if (tier === "VIP") {
    return "bg-[#F7E3DF] text-[#9B2F25] ring-[#EFB7AF]";
  }

  if (tier === "Thân thiết") {
    return "bg-emerald-100 text-emerald-800 ring-emerald-200";
  }

  return "bg-amber-100 text-amber-800 ring-amber-200";
};

const ManagerCRMManage = () => {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [pets, setPets] = useState<ApiPet[]>([]);
  const [invoices, setInvoices] = useState<CustomerInvoiceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadCrmData = async () => {
      setLoading(true);
      setError("");

      try {
        const [usersResponse, petsResponse] = await Promise.all([
          userApi.getStoreCustomers({ signal: controller.signal }),
          petApi.getAllPets({ signal: controller.signal }),
        ]);

        const userData = normalizeList<ApiUser>(usersResponse?.data);
        const invoiceGroups = await Promise.all(
          userData.map(async (user) => {
            const customerId = getString(user.id);
            if (!customerId) return [];

            const response = await invoiceApi.getInvoiceByCustomerId(customerId, {
              signal: controller.signal,
            });
            const invoicesByCustomer = normalizeList<ApiInvoice>(response?.data);

            return invoicesByCustomer.map((invoice) => ({
              customerId,
              invoice,
            }));
          }),
        );
        const invoiceData = invoiceGroups.flat();
        const firstInvoice = invoiceData[0]?.invoice;
        console.log("[CRM] invoice/customer sample", invoiceData[0]);
        console.log(
          "[CRM] invoice fields",
          firstInvoice ? Object.keys(firstInvoice as object) : [],
        );

        setUsers(userData);
        setPets(normalizeList<ApiPet>(petsResponse?.data));
        setInvoices(invoiceData);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(getBackendErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadCrmData();
    return () => controller.abort();
  }, []);

  const customers = useMemo<CustomerRow[]>(() => {
    const petCountByCustomerId = pets.reduce<Map<string, number>>((map, pet) => {
      const customerId = getString(pet.customerId);
      if (!customerId) return map;

      map.set(customerId, (map.get(customerId) ?? 0) + 1);
      return map;
    }, new Map());

    const customerBases = users.map<CustomerBase>((user) => {
      const id = getString(user.id);

      return {
        id,
        name: getUserName(user),
        phone: getUserPhone(user),
        email: getString(user.email) || NO_DATA,
        petCount: petCountByCustomerId.get(id) ?? 0,
      };
    });

    return buildCustomerStats(customerBases, invoices);
  }, [invoices, pets, users]);

  const crmStats = useMemo(() => {
    const vipCustomers = customers.filter((customer) => customer.tier === "VIP");
    const loyalCustomers = customers.filter(
      (customer) => customer.tier === "Thân thiết",
    );
    const newCustomers = customers.filter((customer) => customer.tier === "Mới");

    return {
      vip: vipCustomers.length,
      loyal: loyalCustomers.length,
      new: newCustomers.length,
      totalRevenue: customers.reduce(
        (total, customer) => total + customer.totalSpent,
        0,
      ),
    };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm);

    return customers.filter((customer) => {
      const matchesSearch =
        !normalizedSearch ||
        normalizeText(customer.name).includes(normalizedSearch) ||
        normalizeText(customer.phone).includes(normalizedSearch) ||
        normalizeText(customer.email).includes(normalizedSearch);

      const matchesTier = tierFilter === "all" || customer.tier === tierFilter;

      return matchesSearch && matchesTier;
    });
  }, [customers, searchTerm, tierFilter]);

  const statCards = [
    {
      title: "Tổng khách VIP",
      value: crmStats.vip.toLocaleString("vi-VN"),
      description: "Doanh thu cao hoặc quay lại nhiều",
      icon: Crown,
      tone: "bg-[#F7E3DF] text-[#9B2F25] ring-[#EFB7AF]",
    },
    {
      title: "Khách thân thiết",
      value: crmStats.loyal.toLocaleString("vi-VN"),
      description: "Nhóm khách có tần suất ổn định",
      icon: HeartHandshake,
      tone: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    },
    {
      title: "Khách mới",
      value: crmStats.new.toLocaleString("vi-VN"),
      description: "Cần chăm sóc để tăng quay lại",
      icon: UserPlus,
      tone: "bg-amber-100 text-amber-800 ring-amber-200",
    },
    {
      title: "Tổng doanh thu",
      value: formatCurrency(crmStats.totalRevenue),
      description: "Chỉ tính invoice Paid/Completed",
      icon: TrendingUp,
      tone: "bg-slate-100 text-slate-700 ring-slate-200",
    },
  ];

  const tierFilterOptions: Array<{ value: TierFilter; label: string }> = [
    { value: "all", label: "Tất cả" },
    { value: "VIP", label: "VIP" },
    { value: "Thân thiết", label: "Thân thiết" },
    { value: "Mới", label: "Mới" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#fff1ee] text-[#D56756]">
              <Users className="h-4 w-4" />
            </span>
            <span>CRM</span>
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              CRM & Khách hàng thân thiết
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Quản lý số lượng khách hàng
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-[2rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span className="whitespace-pre-line">{error}</span>
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>
                  <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                    {loading ? "..." : card.value}
                  </p>
                </div>
                <span
                  className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${card.tone}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-xs font-medium text-slate-400">
                {card.description}
              </p>
            </div>
          );
        })}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên, số điện thoại, email..."
              className="h-12 rounded-2xl pl-12"
            />
          </div>

          <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1">
            {tierFilterOptions.map((option) => {
              const isSelected = tierFilter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTierFilter(option.value)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    isSelected
                      ? "bg-white text-[#D56756] shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Sparkles className="h-4 w-4 text-[#D56756]" />
              <span>Danh sách CRM</span>
            </div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Khách hàng
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            {filteredCustomers.length.toLocaleString("vi-VN")} khách hàng
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Đang tải dữ liệu CRM...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            Không có khách hàng phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[72rem] w-full text-left text-sm">
              <thead className="bg-[#F8F1E4] text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                <tr>
                  <th className="px-6 py-4">Tên khách hàng</th>
                  <th className="px-6 py-4">Số điện thoại</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Số thú cưng</th>
                  <th className="px-6 py-4">Hạng</th>
                  <th className="px-6 py-4">Số lần đến</th>
                  <th className="px-6 py-4">Tổng chi tiêu</th>
                  <th className="px-6 py-4">Lần cuối</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id || customer.email || customer.name}
                    className="border-b border-slate-200 text-slate-700 transition last:border-b-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff1ee] text-sm font-bold text-[#D56756]">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-950">
                            {customer.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            ID: {customer.id || NO_DATA}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      {customer.phone}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>{customer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        <PawPrint className="h-3.5 w-3.5" />
                        {customer.petCount.toLocaleString("vi-VN")}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getTierBadgeClass(
                          customer.tier,
                        )}`}
                      >
                        {customer.tier}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-semibold text-slate-950">
                      {customer.totalAppointments.toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-5 font-semibold text-slate-950">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                    <td className="px-6 py-5 text-slate-500">
                      {getDaysAgo(customer.lastVisit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default ManagerCRMManage;
