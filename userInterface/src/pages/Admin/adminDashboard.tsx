import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
  ReceiptText,
  RefreshCw,
  TrendingUp,
  UserPlus,
  Users,
  WalletCards,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import storePackageApi from "@/apis/storePackageAPI";
import { Button } from "@/components/ui/button";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";

type PackageStatus = "Pending" | "Completed" | "Paid" | "Cancelled";
type RevenueFilter = "day" | "week" | "month";
type RevenueChartType = "bar" | "line";

type StorePackageRevenue = {
  id: string;
  managerName: string;
  packageName: string;
  amount: number;
  status: PackageStatus;
  payOsOrderCode: string | null;
  createdAt: string;
  paidAt: string | null;
};

type RevenueChartItem = {
  key: string;
  label: string;
  revenue: number;
};

type DashboardStats = {
  actualRevenue: number;
  expectedRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
};

type RevenueTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
};

const PAID_STATUSES = new Set<PackageStatus>(["Completed", "Paid"]);
const PENDING_STATUS: PackageStatus = "Pending";
const CANCELLED_STATUS: PackageStatus = "Cancelled";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

const formatCompactCurrency = (value: number) =>
  `${new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)} ₫`;

const formatDateTime = (value: string | null) => {
  if (!value) return "Chưa có";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Không rõ"
    : dateTimeFormatter.format(date);
};

const normalizeStatus = (status: unknown): PackageStatus => {
  const normalized = String(status ?? "").trim().toLowerCase();

  if (normalized === "completed") return "Completed";
  if (normalized === "paid") return "Paid";
  if (normalized === "cancelled" || normalized === "canceled") {
    return "Cancelled";
  }

  return "Pending";
};

const normalizeText = (value: unknown, fallback: string) => {
  const text = String(value ?? "").trim();
  return text || fallback;
};

const normalizeStorePackage = (item: unknown): StorePackageRevenue | null => {
  if (!item || typeof item !== "object") return null;

  const data = item as {
    id?: unknown;
    managerName?: unknown;
    customerName?: unknown;
    packageType?: unknown;
    appointmentNote?: unknown;
    itemName?: unknown;
    price?: unknown;
    totalAmount?: unknown;
    amount?: unknown;
    status?: unknown;
    payOsOrderCode?: unknown;
    createdAt?: unknown;
    paidAt?: unknown;
  };

  const id = normalizeText(data.id, "");
  if (!id) return null;

  return {
    id,
    managerName: normalizeText(
      data.managerName ?? data.customerName,
      "Chưa có người mua",
    ),
    packageName: normalizeText(
      data.packageType ?? data.itemName ?? data.appointmentNote,
      "Gói nâng cấp",
    ),
    amount: Number(data.price ?? data.totalAmount ?? data.amount ?? 0),
    status: normalizeStatus(data.status),
    payOsOrderCode:
      data.payOsOrderCode === null || data.payOsOrderCode === undefined
        ? null
        : String(data.payOsOrderCode),
    createdAt: normalizeText(data.createdAt, ""),
    paidAt:
      data.paidAt === null || data.paidAt === undefined
        ? null
        : String(data.paidAt),
  };
};

const normalizeStorePackageList = (value: unknown): StorePackageRevenue[] => {
  const payload =
    value && typeof value === "object" && "data" in value
      ? (value as { data?: unknown }).data
      : value;

  if (!Array.isArray(payload)) return [];

  return payload
    .map(normalizeStorePackage)
    .filter((item): item is StorePackageRevenue => item !== null);
};

const getRecordDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getWeekOfMonth = (date: Date) => Math.min(Math.ceil(date.getDate() / 7), 4);

const getRevenueGroup = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return {
    key: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0",
    )}`,
    label: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`,
  };
};

const buildMonthlyRevenueData = () =>
  Array.from({ length: 12 }, (_, index) => ({
    key: String(index),
    label: `Tháng ${index + 1}`,
    revenue: 0,
  }));

const buildWeeklyRevenueData = () =>
  Array.from({ length: 4 }, (_, index) => ({
    key: String(index),
    label: `Tuần ${index + 1}`,
    revenue: 0,
  }));

const buildDailyRevenueData = () => {
  const today = new Date();
  const monday = new Date(today);
  const dayOfWeek = monday.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  monday.setDate(today.getDate() - daysSinceMonday);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    const day = date.getDate();
    const month = date.getMonth() + 1;

    return {
      key: `${date.getFullYear()}-${String(month).padStart(2, "0")}-${String(
        day,
      ).padStart(2, "0")}`,
      label: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`,
      revenue: 0,
    };
  });
};

const buildRevenueChartData = (
  packages: StorePackageRevenue[],
  filter: RevenueFilter,
): RevenueChartItem[] => {
  if (filter === "month") {
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = buildMonthlyRevenueData();

    packages.forEach((item) => {
      if (!PAID_STATUSES.has(item.status)) return;

      const recordDate = getRecordDate(item.paidAt ?? item.createdAt);
      if (!recordDate || recordDate.getFullYear() !== currentYear) return;

      monthlyRevenue[recordDate.getMonth()].revenue += item.amount;
    });

    return monthlyRevenue;
  }

  if (filter === "week") {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const weeklyRevenue = buildWeeklyRevenueData();

    packages.forEach((item) => {
      if (!PAID_STATUSES.has(item.status)) return;

      const recordDate = getRecordDate(item.paidAt ?? item.createdAt);
      if (
        !recordDate ||
        recordDate.getFullYear() !== currentYear ||
        recordDate.getMonth() !== currentMonth
      ) {
        return;
      }

      weeklyRevenue[getWeekOfMonth(recordDate) - 1].revenue += item.amount;
    });

    return weeklyRevenue;
  }

  const dailyRevenue = buildDailyRevenueData();
  const dailyRevenueByKey = new Map(
    dailyRevenue.map((item) => [item.key, item]),
  );

  packages.forEach((item) => {
    if (!PAID_STATUSES.has(item.status)) return;

    const recordDate = getRecordDate(item.paidAt ?? item.createdAt);
    if (!recordDate) return;

    const group = getRevenueGroup(recordDate);
    const current = dailyRevenueByKey.get(group.key);
    if (!current) return;

    current.revenue += item.amount;
  });

  return dailyRevenue;
};

const calculateDashboardStats = (
  packages: StorePackageRevenue[],
): DashboardStats => {
  const paidOrders = packages.filter((item) => PAID_STATUSES.has(item.status));
  const pendingOrders = packages.filter((item) => item.status === PENDING_STATUS);
  const cancelledOrders = packages.filter(
    (item) => item.status === CANCELLED_STATUS,
  );

  const actualRevenue = paidOrders.reduce(
    (total, item) => total + item.amount,
    0,
  );
  const expectedRevenue = pendingOrders.reduce(
    (total, item) => total + item.amount,
    0,
  );

  return {
    actualRevenue,
    expectedRevenue,
    totalOrders: packages.length,
    pendingOrders: pendingOrders.length,
    paidOrders: paidOrders.length,
    cancelledOrders: cancelledOrders.length,
    averageOrderValue:
      paidOrders.length > 0 ? actualRevenue / paidOrders.length : 0,
  };
};

const getStatusBadgeClass = (status: PackageStatus) => {
  if (PAID_STATUSES.has(status)) {
    return "bg-emerald-100 text-emerald-700 ring-emerald-200";
  }

  if (status === CANCELLED_STATUS) {
    return "bg-rose-100 text-rose-700 ring-rose-200";
  }

  return "bg-amber-100 text-amber-700 ring-amber-200";
};

const revenueFilterOptions: Array<{ value: RevenueFilter; label: string }> = [
  { value: "day", label: "Ngày" },
  { value: "week", label: "Tuần" },
  { value: "month", label: "Tháng" },
];

const revenueChartTypeOptions: Array<{
  value: RevenueChartType;
  label: string;
}> = [
  { value: "line", label: "Đường" },
  { value: "bar", label: "Cột" },
];

const RevenueTooltip = ({ active, payload, label }: RevenueTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-slate-950">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#D56756]">
        {formatCurrency(Number(payload[0]?.value ?? 0))}
      </p>
    </div>
  );
};

const RevenueChart = ({
  data,
  chartType,
}: {
  data: RevenueChartItem[];
  chartType: RevenueChartType;
}) => {
  const hasRevenue = data.some((item) => item.revenue > 0);

  if (data.length === 0 || !hasRevenue) {
    return (
      <div className="flex min-h-[18rem] items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 text-center text-sm text-slate-500">
        Chưa có doanh thu nâng cấp gói Paid/Completed để hiển thị biểu đồ.
      </div>
    );
  }

  return (
    <div className="h-[22rem] rounded-[1.5rem] bg-slate-50 p-4">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "bar" ? (
          <BarChart data={data} margin={{ top: 16, right: 12, bottom: 8, left: 8 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickFormatter={(value) => formatCompactCurrency(Number(value))}
              width={76}
            />
            <Tooltip content={<RevenueTooltip />} cursor={{ fill: "#f8e6e2" }} />
            <Bar
              dataKey="revenue"
              fill="#D56756"
              name="Doanh thu"
              radius={[12, 12, 0, 0]}
            />
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 16, right: 18, bottom: 8, left: 8 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickFormatter={(value) => formatCompactCurrency(Number(value))}
              width={76}
            />
            <Tooltip content={<RevenueTooltip />} cursor={{ stroke: "#F1B2A8" }} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#D56756"
              strokeWidth={3}
              dot={{ r: 4, fill: "#D56756", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#B24C40", stroke: "#fff", strokeWidth: 2 }}
              name="Doanh thu"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

const AdminDashboard = () => {
  const [storePackages, setStorePackages] = useState<StorePackageRevenue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRevenueFilter, setSelectedRevenueFilter] =
    useState<RevenueFilter>("day");
  const [revenueChartType, setRevenueChartType] =
    useState<RevenueChartType>("line");

  const loadStorePackages = async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");

    try {
      const response = await storePackageApi.getAllStorePackage({ signal });
      setStorePackages(normalizeStorePackageList(response?.data));
    } catch (err) {
      if (signal?.aborted) return;
      setError(getBackendErrorMessage(err));
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadStorePackages(controller.signal);
    return () => controller.abort();
  }, []);

  const stats = useMemo(
    () => calculateDashboardStats(storePackages),
    [storePackages],
  );
  const revenueChartData = useMemo(
    () => buildRevenueChartData(storePackages, selectedRevenueFilter),
    [storePackages, selectedRevenueFilter],
  );

  const recentPackages = useMemo(
    () =>
      [...storePackages]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 8),
    [storePackages],
  );

  const statCards = [
    {
      title: "Tổng tiền nâng cấp thực tế",
      value: formatCurrency(stats.actualRevenue),
      description: "Chỉ tính Completed/Paid",
      icon: WalletCards,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
    {
      title: "Doanh thu nâng cấp dự kiến",
      value: formatCurrency(stats.expectedRevenue),
      description: "Chỉ tính Pending",
      icon: Clock3,
      tone: "bg-amber-50 text-amber-700 ring-amber-100",
    },
    {
      title: "Tổng số đơn nâng cấp",
      value: stats.totalOrders.toLocaleString("vi-VN"),
      description: "Tất cả trạng thái",
      icon: FileText,
      tone: "bg-slate-100 text-slate-700 ring-slate-200",
    },
    {
      title: "Giá trị đơn trung bình",
      value: formatCurrency(stats.averageOrderValue),
      description: "Trên đơn đã thu",
      icon: TrendingUp,
      tone: "bg-[#fff1ee] text-[#D56756] ring-[#f3d3cd]",
    },
    {
      title: "Đơn chờ xử lý",
      value: stats.pendingOrders.toLocaleString("vi-VN"),
      description: "Chưa thanh toán",
      icon: Clock3,
      tone: "bg-amber-50 text-amber-700 ring-amber-100",
    },
    {
      title: "Đơn đã thu",
      value: stats.paidOrders.toLocaleString("vi-VN"),
      description: "Đã hoàn tất hoặc đã thanh toán",
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
    {
      title: "Đơn đã hủy",
      value: stats.cancelledOrders.toLocaleString("vi-VN"),
      description: "Đã hủy",
      icon: XCircle,
      tone: "bg-rose-50 text-rose-700 ring-rose-100",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#fff1ee] text-[#D56756]">
                <BarChart3 className="h-4 w-4" />
              </span>
              <span>Tổng quan doanh thu nâng cấp gói</span>
            </div>
            <h1 className="text-3xl font-semibold text-slate-950">
              Dashboard Admin
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Theo dõi tổng số tiền nâng cấp gói theo thời gian, trạng thái giao
              dịch và bảng doanh thu từ dữ liệu StorePackage.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            >
              <Link to="/admin/managers">
                <Users className="h-4 w-4" />
                Manager
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            >
              <Link to="/admin/managers/new">
                <UserPlus className="h-4 w-4" />
                Tạo Manager
              </Link>
            </Button>
            <Button
              className="h-11 rounded-full bg-[#D56756] text-white hover:bg-[#b2483c]"
              onClick={() => loadStorePackages()}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Làm mới dữ liệu
            </Button>
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

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                <TrendingUp className="h-4 w-4" />
              </span>
              <span>Biểu đồ doanh thu</span>
            </div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Doanh thu nâng cấp gói
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Pending không được tính vào biểu đồ doanh thu thực tế.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
                {revenueFilterOptions.map((option) => {
                  const isSelected = selectedRevenueFilter === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedRevenueFilter(option.value)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
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
              <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
                {revenueChartTypeOptions.map((option) => {
                  const isSelected = revenueChartType === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRevenueChartType(option.value)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
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
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
              {revenueChartData.length} mốc doanh thu
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[18rem] items-center justify-center rounded-[1.5rem] bg-slate-50 text-sm text-slate-500">
            Đang tải biểu đồ doanh thu nâng cấp...
          </div>
        ) : (
          <RevenueChart data={revenueChartData} chartType={revenueChartType} />
        )}
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <ReceiptText className="h-4 w-4 text-[#D56756]" />
              <span>Bảng doanh thu</span>
            </div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Doanh thu nâng cấp gần đây
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            Hiển thị {recentPackages.length} giao dịch mới nhất
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Đang tải bảng doanh thu...
          </div>
        ) : storePackages.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            Chưa có dữ liệu nâng cấp gói để thống kê.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[62rem] w-full text-left text-sm">
              <thead className="bg-[#F8F1E4] text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                <tr>
                  <th className="px-6 py-4">Người mua/Manager</th>
                  <th className="px-6 py-4">Gói nâng cấp</th>
                  <th className="px-6 py-4">Tổng tiền</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">PayOS</th>
                  <th className="px-6 py-4">Ngày tạo</th>
                  <th className="px-6 py-4">Ngày thanh toán</th>
                </tr>
              </thead>
              <tbody>
                {recentPackages.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-200 text-slate-700 last:border-b-0"
                  >
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-950">
                        {item.managerName}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        #{item.id.slice(0, 8)}
                      </p>
                    </td>
                    <td className="max-w-[18rem] px-6 py-5">
                      <p className="line-clamp-2 font-medium text-slate-950">
                        {item.packageName}
                      </p>
                    </td>
                    <td className="px-6 py-5 font-semibold text-slate-950">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusBadgeClass(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-500">
                      {item.payOsOrderCode ?? "Chưa có"}
                    </td>
                    <td className="px-6 py-5 text-slate-500">
                      {formatDateTime(item.createdAt)}
                    </td>
                    <td className="px-6 py-5 text-slate-500">
                      {formatDateTime(item.paidAt)}
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

export default AdminDashboard;
