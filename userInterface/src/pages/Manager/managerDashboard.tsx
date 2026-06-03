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
  WalletCards,
  XCircle,
} from "lucide-react";
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
import invoiceApi from "@/apis/invoiceAPI";
import { Button } from "@/components/ui/button";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";

type InvoiceStatus = "Pending" | "Completed" | "Paid" | "Cancelled";
type RevenueFilter = "day" | "week" | "month";
type RevenueChartType = "bar" | "line";

type DashboardInvoice = {
  id: string;
  petName: string;
  appointmentNote: string;
  customerName: string;
  totalAmount: number;
  status: InvoiceStatus;
  createdAt: string;
};

type RevenueChartItem = {
  key: string;
  label: string;
  revenue: number;
};

type DashboardStats = {
  actualRevenue: number;
  expectedRevenue: number;
  totalInvoices: number;
  pendingInvoices: number;
  paidInvoices: number;
  cancelledInvoices: number;
  averageOrderValue: number;
};

type RevenueTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
};

const PAID_STATUSES = new Set<InvoiceStatus>(["Completed", "Paid"]);
const PENDING_STATUS: InvoiceStatus = "Pending";
const CANCELLED_STATUS: InvoiceStatus = "Cancelled";

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
  new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value) + " ₫";

const formatDateTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Không rõ" : dateTimeFormatter.format(date);
};

const normalizeStatus = (status: unknown): InvoiceStatus => {
  const normalized = String(status ?? "").trim().toLowerCase();

  if (normalized === "completed") return "Completed";
  if (normalized === "paid") return "Paid";
  if (normalized === "cancelled" || normalized === "canceled") return "Cancelled";
  return "Pending";
};

const normalizeInvoice = (invoice: unknown): DashboardInvoice | null => {
  if (!invoice || typeof invoice !== "object") return null;

  const data = invoice as {
    id?: unknown;
    petName?: unknown;
    appointmentNote?: unknown;
    customerName?: unknown;
    totalAmount?: unknown;
    status?: unknown;
    createdAt?: unknown;
  };

  const id = String(data.id ?? "");
  if (!id) return null;

  return {
    id,
    petName: String(data.petName ?? "Chưa có tên thú cưng"),
    appointmentNote: String(data.appointmentNote ?? "Không có ghi chú"),
    customerName: String(data.customerName ?? "Khách hàng chưa rõ"),
    totalAmount: Number(data.totalAmount ?? 0),
    status: normalizeStatus(data.status),
    createdAt: String(data.createdAt ?? ""),
  };
};

const normalizeInvoiceList = (value: unknown): DashboardInvoice[] => {
  const payload =
    value && typeof value === "object" && "data" in value
      ? (value as { data?: unknown }).data
      : value;

  if (!Array.isArray(payload)) return [];

  return payload
    .map(normalizeInvoice)
    .filter((invoice): invoice is DashboardInvoice => invoice !== null);
};

const getInvoiceDate = (value: string) => {
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
  invoices: DashboardInvoice[],
  filter: RevenueFilter,
): RevenueChartItem[] => {
  if (filter === "month") {
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = buildMonthlyRevenueData();

    invoices.forEach((invoice) => {
      if (!PAID_STATUSES.has(invoice.status)) return;

      const invoiceDate = getInvoiceDate(invoice.createdAt);
      if (!invoiceDate || invoiceDate.getFullYear() !== currentYear) return;

      monthlyRevenue[invoiceDate.getMonth()].revenue += invoice.totalAmount;
    });

    return monthlyRevenue;
  }

  if (filter === "week") {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const weeklyRevenue = buildWeeklyRevenueData();

    invoices.forEach((invoice) => {
      if (!PAID_STATUSES.has(invoice.status)) return;

      const invoiceDate = getInvoiceDate(invoice.createdAt);
      if (
        !invoiceDate ||
        invoiceDate.getFullYear() !== currentYear ||
        invoiceDate.getMonth() !== currentMonth
      ) {
        return;
      }

      weeklyRevenue[getWeekOfMonth(invoiceDate) - 1].revenue += invoice.totalAmount;
    });

    return weeklyRevenue;
  }

  const dailyRevenue = buildDailyRevenueData();
  const dailyRevenueByKey = new Map(
    dailyRevenue.map((item) => [item.key, item]),
  );

  invoices.forEach((invoice) => {
    if (!PAID_STATUSES.has(invoice.status)) return;

    const invoiceDate = getInvoiceDate(invoice.createdAt);
    if (!invoiceDate) return;

    const group = getRevenueGroup(invoiceDate);
    const current = dailyRevenueByKey.get(group.key);
    if (!current) return;

    current.revenue += invoice.totalAmount;
  });

  return dailyRevenue;
};

const calculateDashboardStats = (invoices: DashboardInvoice[]): DashboardStats => {
  const paidInvoices = invoices.filter((invoice) =>
    PAID_STATUSES.has(invoice.status),
  );
  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status === PENDING_STATUS,
  );
  const cancelledInvoices = invoices.filter(
    (invoice) => invoice.status === CANCELLED_STATUS,
  );

  const actualRevenue = paidInvoices.reduce(
    (total, invoice) => total + invoice.totalAmount,
    0,
  );
  const expectedRevenue = pendingInvoices.reduce(
    (total, invoice) => total + invoice.totalAmount,
    0,
  );

  return {
    actualRevenue,
    expectedRevenue,
    totalInvoices: invoices.length,
    pendingInvoices: pendingInvoices.length,
    paidInvoices: paidInvoices.length,
    cancelledInvoices: cancelledInvoices.length,
    averageOrderValue:
      paidInvoices.length > 0 ? actualRevenue / paidInvoices.length : 0,
  };
};

const getStatusBadgeClass = (status: InvoiceStatus) => {
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
        Chưa có doanh thu Completed/Paid để hiển thị biểu đồ.
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

const ManagerDashboard = () => {
  const [invoices, setInvoices] = useState<DashboardInvoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRevenueFilter, setSelectedRevenueFilter] =
    useState<RevenueFilter>("day");
  const [revenueChartType, setRevenueChartType] =
    useState<RevenueChartType>("line");

  const loadInvoices = async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");

    try {
      const response = await invoiceApi.getAllInvoices({ signal });
      setInvoices(normalizeInvoiceList(response?.data));
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
    loadInvoices(controller.signal);
    return () => controller.abort();
  }, []);

  const stats = useMemo(() => calculateDashboardStats(invoices), [invoices]);
  const revenueChartData = useMemo(
    () => buildRevenueChartData(invoices, selectedRevenueFilter),
    [invoices, selectedRevenueFilter],
  );

  const recentInvoices = useMemo(
    () =>
      [...invoices]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 8),
    [invoices],
  );

  const statCards = [
    {
      title: "Tổng doanh thu thực tế",
      value: formatCurrency(stats.actualRevenue),
      description: "Chỉ tính Completed/Paid",
      icon: WalletCards,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
    {
      title: "Doanh thu dự kiến",
      value: formatCurrency(stats.expectedRevenue),
      description: "Chỉ tính Pending",
      icon: Clock3,
      tone: "bg-amber-50 text-amber-700 ring-amber-100",
    },
    {
      title: "Tổng số hóa đơn",
      value: stats.totalInvoices.toLocaleString("vi-VN"),
      description: "Tất cả trạng thái",
      icon: FileText,
      tone: "bg-slate-100 text-slate-700 ring-slate-200",
    },
    {
      title: "Giá trị đơn trung bình",
      value: formatCurrency(stats.averageOrderValue),
      description: "Trên hóa đơn đã thu",
      icon: TrendingUp,
      tone: "bg-[#fff1ee] text-[#D56756] ring-[#f3d3cd]",
    },
    {
      title: "Hóa đơn Pending",
      value: stats.pendingInvoices.toLocaleString("vi-VN"),
      description: "Chờ xử lý",
      icon: Clock3,
      tone: "bg-amber-50 text-amber-700 ring-amber-100",
    },
    {
      title: "Completed/Paid",
      value: stats.paidInvoices.toLocaleString("vi-VN"),
      description: "Đã hoàn tất hoặc đã thanh toán",
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
    {
      title: "Hóa đơn Cancelled",
      value: stats.cancelledInvoices.toLocaleString("vi-VN"),
      description: "Đã hủy",
      icon: XCircle,
      tone: "bg-rose-50 text-rose-700 ring-rose-100",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#fff1ee] text-[#D56756]">
                <BarChart3 className="h-4 w-4" />
              </span>
              <span>Tổng quan doanh thu</span>
            </div>
            <h1 className="text-3xl font-semibold text-slate-950">
              Dashboard Manager
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Theo dõi doanh thu thực tế, doanh thu dự kiến và tình trạng hóa đơn
              từ dữ liệu invoice hiện tại.
            </p>
          </div>
          <Button
            className="h-11 w-full gap-2 bg-[#D56756] text-white hover:bg-[#b2483c] sm:w-auto"
            onClick={() => loadInvoices()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới dữ liệu
          </Button>
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
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                <TrendingUp className="h-4 w-4" />
              </span>
              <span>Biểu đồ doanh thu</span>
            </div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Doanh thu thực tế
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Pending không được tính vào biểu đồ doanh thu thực tế.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
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
              {revenueChartData.length} mốc có doanh thu
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[18rem] items-center justify-center rounded-[1.5rem] bg-slate-50 text-sm text-slate-500">
            Đang tải biểu đồ doanh thu...
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
              <span>Invoice gần đây</span>
            </div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Danh sách hóa đơn
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            Hiển thị {recentInvoices.length} hóa đơn mới nhất
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Đang tải danh sách invoice...
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            Chưa có invoice nào để thống kê.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[58rem] w-full text-left text-sm">
              <thead className="bg-[#F8F1E4] text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                <tr>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Thú cưng</th>
                  <th className="px-6 py-4">Ghi chú lịch hẹn</th>
                  <th className="px-6 py-4">Tổng tiền</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-slate-200 text-slate-700 last:border-b-0"
                  >
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-950">
                        {invoice.customerName}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        #{invoice.id.slice(0, 8)}
                      </p>
                    </td>
                    <td className="px-6 py-5 font-medium text-slate-950">
                      {invoice.petName}
                    </td>
                    <td className="max-w-[18rem] px-6 py-5">
                      <p className="line-clamp-2 text-slate-600">
                        {invoice.appointmentNote}
                      </p>
                    </td>
                    <td className="px-6 py-5 font-semibold text-slate-950">
                      {formatCurrency(invoice.totalAmount)}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusBadgeClass(
                          invoice.status,
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-500">
                      {formatDateTime(invoice.createdAt)}
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

export default ManagerDashboard;
