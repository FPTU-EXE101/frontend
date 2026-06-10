import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarClock,
  CircleDollarSign,
  Eye,
  FileText,
  LoaderCircle,
  ReceiptText,
  Search,
  X,
} from "lucide-react";
import invoiceApi from "@/apis/invoiceAPI";
import userApi from "@/apis/userAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GetInvoiceDetailsResponse, Invoice } from "@/types/invoice.type";
import type { User } from "@/types/user.type";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";

const ALL_STATUSES = "Tất cả";
const NO_CUSTOMER_EMAIL = "Chưa có email khách hàng";

const normalizeList = <T,>(value: unknown): T[] => {
  const payload =
    value && typeof value === "object" && "data" in value
      ? (value as { data?: unknown }).data
      : value;

  return Array.isArray(payload) ? (payload as T[]) : [];
};

const normalizeText = (value?: string | number | null) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\s₫$/, "đ");

const formatDateTime = (value?: string) => {
  if (!value) return "Chưa có";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa có";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getStatusBadgeClass = (status?: string) => {
  const normalized = normalizeText(status);

  if (normalized === "pending") {
    return "bg-amber-100 text-amber-800 ring-amber-200";
  }

  if (normalized === "paid" || normalized === "completed") {
    return "bg-emerald-100 text-emerald-800 ring-emerald-200";
  }

  if (normalized === "cancelled" || normalized === "canceled") {
    return "bg-rose-100 text-rose-800 ring-rose-200";
  }

  return "bg-slate-100 text-slate-700 ring-slate-200";
};

const getPayOsOrderCode = (invoice: Invoice) =>
  invoice.payOsOrderCode ? String(invoice.payOsOrderCode) : "Chưa có";

const getInvoiceCustomerEmail = (invoice: Invoice) =>
  invoice.customerEmail || invoice.customer?.email || "";

const getInvoiceCustomerId = (invoice: Invoice) =>
  invoice.customerId || invoice.customer?.id || "";

const getUserFullName = (user: User) => {
  const fullName = [user.lastName, user.firstName].filter(Boolean).join(" ");
  return fullName || user.userName;
};

const getInvoiceIdPreview = (id: string) => {
  if (!id) return "Chưa có";
  if (id.length <= 13) return id;
  return `${id.slice(0, 8)}...${id.slice(-4)}`;
};

const getDetailName = (detail: GetInvoiceDetailsResponse) =>
  String(detail.itemName || detail.name || detail.id || "Chi tiết hóa đơn");

const getDetailQuantity = (detail: GetInvoiceDetailsResponse) =>
  Number(detail.quantity ?? 0);

const getDetailPrice = (detail: GetInvoiceDetailsResponse) =>
  Number(detail.price ?? 0);

const getDetailSubtotal = (detail: GetInvoiceDetailsResponse) =>
  Number(detail.subtotal ?? detail.total ?? 0);

const LoadingRows = () => (
  <>
    {Array.from({ length: 5 }, (_, index) => (
      <div
        key={index}
        className="grid grid-cols-[0.9fr_0.9fr_1.45fr_1.45fr_0.95fr_0.8fr_0.9fr] items-center gap-4 border-b border-slate-200 px-5 py-5 last:border-b-0"
      >
        {Array.from({ length: 7 }, (_unused, cellIndex) => (
          <div
            key={cellIndex}
            className="h-4 animate-pulse rounded-full bg-slate-100"
          />
        ))}
      </div>
    ))}
  </>
);

type InvoiceDetailModalProps = {
  detailError: string;
  detailItems: GetInvoiceDetailsResponse[];
  detailLoading: boolean;
  invoice: Invoice;
  onClose: () => void;
};

const InvoiceDetailModal = ({
  detailError,
  detailItems,
  detailLoading,
  invoice,
  onClose,
}: InvoiceDetailModalProps) => {
  const customerEmail = getInvoiceCustomerEmail(invoice);
  const customerId = getInvoiceCustomerId(invoice);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
              <ReceiptText className="h-4 w-4" />
              Chi tiết hóa đơn
            </div>
            <h2 className="text-2xl font-semibold text-slate-950">
              {invoice.id}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {invoice.customerName || "Chưa có khách hàng"} •{" "}
              {formatDateTime(invoice.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
            aria-label="Đóng chi tiết hóa đơn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-8rem)] overflow-y-auto p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Khách hàng
              </p>
              <p className="mt-2 font-semibold text-slate-950">
                {invoice.customerName || "Chưa có"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {customerEmail || NO_CUSTOMER_EMAIL}
              </p>
              {customerId && (
                <p className="mt-1 break-all text-xs text-slate-500">
                  ID: {customerId}
                </p>
              )}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Trạng thái
              </p>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusBadgeClass(
                  invoice.status,
                )}`}
              >
                {invoice.status || "Không rõ"}
              </span>
              <p className="mt-3 text-xs text-slate-500">
                PayOS: {getPayOsOrderCode(invoice)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Tổng tiền
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {formatCurrency(Number(invoice.totalAmount ?? 0))}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Thú cưng: {invoice.petName || "Chưa có"}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Ghi chú lịch hẹn
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {invoice.appointmentNote || "Chưa có"}
            </p>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-[1.6fr_0.7fr_1fr_1fr] gap-4 bg-[#F8F1E4] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
              <span>Mục</span>
              <span>SL</span>
              <span>Đơn giá</span>
              <span>Thành tiền</span>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center gap-2 p-8 text-sm text-slate-500">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Đang tải chi tiết hóa đơn...
              </div>
            ) : detailError ? (
              <div className="flex items-center justify-center gap-2 p-8 text-sm font-semibold text-rose-700">
                <AlertCircle className="h-5 w-5" />
                {detailError}
              </div>
            ) : detailItems.length > 0 ? (
              detailItems.map((detail, index) => (
                <div
                  key={detail.id || index}
                  className="grid grid-cols-[1.6fr_0.7fr_1fr_1fr] items-center gap-4 border-t border-slate-200 px-5 py-4 text-sm text-slate-700"
                >
                  <span className="font-semibold text-slate-950">
                    {getDetailName(detail)}
                  </span>
                  <span>{getDetailQuantity(detail).toLocaleString("vi-VN")}</span>
                  <span>{formatCurrency(getDetailPrice(detail))}</span>
                  <span className="font-semibold text-slate-950">
                    {formatCurrency(getDetailSubtotal(detail))}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-slate-500">
                Chưa có chi tiết hóa đơn.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ManagerInvoicesManage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(ALL_STATUSES);
  const [customerEmailSearch, setCustomerEmailSearch] = useState("");
  const [customerIdSearch, setCustomerIdSearch] = useState("");
  const [customerIdToLoad, setCustomerIdToLoad] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [detailItems, setDetailItems] = useState<GetInvoiceDetailsResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailError, setDetailError] = useState("");

  const loadAllInvoices = async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");

    try {
      const [invoiceResponse, userResponse] = await Promise.all([
        invoiceApi.getAllInvoices({ signal }),
        userApi.getAllUsers({ signal }),
      ]);
      setInvoices(normalizeList<Invoice>(invoiceResponse?.data));
      setUsers(normalizeList<User>(userResponse?.data));
      setSelectedStatus(ALL_STATUSES);
      setCustomerIdSearch("");
      setCustomerEmailSearch("");
    } catch (loadError) {
      if (signal?.aborted) return;
      setError(getBackendErrorMessage(loadError));
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  const usersById = useMemo(
    () =>
      users.reduce<Record<string, User>>((map, user) => {
        map[user.id] = user;
        return map;
      }, {}),
    [users],
  );

  const usersByName = useMemo(
    () =>
      users.reduce<Record<string, User>>((map, user) => {
        const names = [
          user.userName,
          getUserFullName(user),
          user.email,
          user.email?.split("@")[0],
        ];

        names.forEach((name) => {
          const key = normalizeText(name);
          if (key && !map[key]) {
            map[key] = user;
          }
        });

        return map;
      }, {}),
    [users],
  );

  const getMatchedCustomer = (invoice: Invoice) => {
    const customerId = getInvoiceCustomerId(invoice);
    const directMatch = customerId ? usersById[customerId] : undefined;

    if (directMatch) {
      return directMatch;
    }

    const customerNameKey = normalizeText(invoice.customerName);
    return customerNameKey ? usersByName[customerNameKey] : undefined;
  };

  const getResolvedCustomerEmail = (invoice: Invoice) =>
    getInvoiceCustomerEmail(invoice) || getMatchedCustomer(invoice)?.email || "";

  const getResolvedCustomerId = (invoice: Invoice) =>
    getInvoiceCustomerId(invoice) || getMatchedCustomer(invoice)?.id || "";

  const getInvoiceWithResolvedCustomer = (invoice: Invoice): Invoice => {
    const customer = getMatchedCustomer(invoice);

    if (!customer) {
      return invoice;
    }

    return {
      ...invoice,
      customerId: getInvoiceCustomerId(invoice) || customer.id,
      customerEmail: getInvoiceCustomerEmail(invoice) || customer.email,
      customerName: invoice.customerName || customer.userName,
    };
  };

  useEffect(() => {
    const controller = new AbortController();

    void loadAllInvoices(controller.signal);
    return () => controller.abort();
  }, []);

  const handleLoadByCustomerId = async () => {
    const customerId = customerIdToLoad.trim();

    if (!customerId) {
      setError("Vui lòng nhập Customer ID để tải hóa đơn.");
      return;
    }

    setCustomerLoading(true);
    setError("");

    try {
      const response = await invoiceApi.getInvoicesByCustomerId(customerId);
      setInvoices(normalizeList<Invoice>(response?.data));
      setSelectedStatus(ALL_STATUSES);
      setCustomerIdSearch("");
      setCustomerEmailSearch("");
    } catch (loadError) {
      setError(getBackendErrorMessage(loadError));
    } finally {
      setCustomerLoading(false);
    }
  };

  const handleViewDetail = async (invoice: Invoice) => {
    setSelectedInvoice(getInvoiceWithResolvedCustomer(invoice));
    setDetailItems([]);
    setDetailError("");
    setDetailLoading(true);

    try {
      const response = await invoiceApi.getInvoiceDetail(invoice.id);
      setDetailItems(normalizeList<GetInvoiceDetailsResponse>(response?.data));
    } catch (loadError) {
      setDetailError(getBackendErrorMessage(loadError));
    } finally {
      setDetailLoading(false);
    }
  };

  const statuses = useMemo(() => {
    const uniqueStatuses = Array.from(
      new Set(invoices.map((invoice) => invoice.status).filter(Boolean)),
    );

    return [ALL_STATUSES, ...uniqueStatuses];
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    const normalizedEmailSearch = normalizeText(customerEmailSearch);
    const normalizedCustomerIdSearch = normalizeText(customerIdSearch);

    return invoices.filter((invoice) => {
      const customerEmail = getResolvedCustomerEmail(invoice);
      const customerId = getResolvedCustomerId(invoice);
      const matchesStatus =
        selectedStatus === ALL_STATUSES || invoice.status === selectedStatus;
      const matchesEmail =
        !normalizedEmailSearch ||
        (customerEmail &&
          normalizeText(customerEmail).includes(normalizedEmailSearch));
      const matchesCustomerId =
        !normalizedCustomerIdSearch ||
        (customerId &&
          normalizeText(customerId).includes(normalizedCustomerIdSearch));

      return matchesStatus && matchesEmail && matchesCustomerId;
    });
  }, [
    customerEmailSearch,
    customerIdSearch,
    invoices,
    selectedStatus,
    usersById,
    usersByName,
  ]);

  const totalRevenue = useMemo(
    () =>
      filteredInvoices.reduce(
        (total, invoice) => total + Number(invoice.totalAmount ?? 0),
        0,
      ),
    [filteredInvoices],
  );

  const latestInvoice = filteredInvoices[0];

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                <ReceiptText className="h-4 w-4" />
              </span>
              <span>Hóa đơn</span>
            </div>
            <h1 className="text-3xl font-semibold text-slate-950">
              Quản lý hóa đơn
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Theo dõi toàn bộ hóa đơn, trạng thái thanh toán và mã PayOS.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[36rem]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                <FileText className="h-4 w-4" />
                Hóa đơn
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {filteredInvoices.length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                <CircleDollarSign className="h-4 w-4" />
                Tổng tiền
              </div>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                <CalendarClock className="h-4 w-4" />
                Mới nhất
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {latestInvoice
                  ? formatDateTime(latestInvoice.createdAt)
                  : "Chưa có"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={
                "rounded-full border px-4 py-2 text-sm font-semibold transition " +
                (selectedStatus === status
                  ? "border-[#D56756] bg-[#F5D7D2] text-[#9B2F25]"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")
              }
            >
              {status}
            </button>
          ))}
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1.35fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              value={customerEmailSearch}
              onChange={(event) => setCustomerEmailSearch(event.target.value)}
              placeholder="Lọc theo email khách hàng"
              className="pl-12"
            />
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              value={customerIdSearch}
              onChange={(event) => setCustomerIdSearch(event.target.value)}
              placeholder="Lọc theo customerId"
              className="pl-12"
            />
          </div>
          <Input
            value={customerIdToLoad}
            onChange={(event) => setCustomerIdToLoad(event.target.value)}
            placeholder="Customer ID để tải hóa đơn"
          />
          <Button
            type="button"
            onClick={handleLoadByCustomerId}
            disabled={customerLoading}
            className="h-11 whitespace-nowrap bg-[#D56756] text-white hover:bg-[#b2483c]"
          >
            {customerLoading ? "Đang tải..." : "Tải hóa đơn theo Customer ID"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => void loadAllInvoices()}
            disabled={loading}
            className="h-11 whitespace-nowrap"
          >
            Tải tất cả
          </Button>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[0.9fr_0.9fr_1.45fr_1.45fr_0.95fr_0.8fr_0.9fr] gap-4 border-b border-slate-200 bg-[#F8F1E4] px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
          <span>Mã</span>
          <span>Thú cưng</span>
          <span>Ghi chú</span>
          <span>Khách hàng</span>
          <span>Tổng tiền</span>
          <span>Trạng thái</span>
          <span>Hành động</span>
        </div>

        {loading ? (
          <LoadingRows />
        ) : error ? (
          <div className="flex items-center justify-center gap-3 p-10 text-sm font-semibold text-rose-700">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        ) : filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice) => {
            const customerEmail = getResolvedCustomerEmail(invoice);
            const customerId = getResolvedCustomerId(invoice);

            return (
              <div
                key={invoice.id}
                className="grid grid-cols-[0.9fr_0.9fr_1.45fr_1.45fr_0.95fr_0.8fr_0.9fr] items-center gap-4 border-b border-slate-200 px-5 py-5 text-sm text-slate-700 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs font-semibold text-slate-950">
                    {getInvoiceIdPreview(invoice.id)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDateTime(invoice.createdAt)}
                  </p>
                </div>
                <span className="min-w-0 truncate font-semibold text-slate-950">
                  {invoice.petName || "Chưa có"}
                </span>
                <span className="line-clamp-2 min-w-0">
                  {invoice.appointmentNote || "Chưa có"}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-950">
                    {invoice.customerName || "Chưa có"}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {customerEmail || NO_CUSTOMER_EMAIL}
                  </p>
                  <p className="mt-1 truncate font-mono text-[11px] text-slate-400">
                    ID: {customerId || "Chưa có"}
                  </p>
                </div>
                <span className="whitespace-nowrap font-semibold text-slate-950">
                  {formatCurrency(Number(invoice.totalAmount ?? 0))}
                </span>
                <span>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusBadgeClass(
                      invoice.status,
                    )}`}
                  >
                    {invoice.status || "Không rõ"}
                  </span>
                </span>
                <span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void handleViewDetail(invoice)}
                    className="h-9 rounded-full px-3 text-xs font-semibold"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Chi tiết
                  </Button>
                </span>
              </div>
            );
          })
        ) : (
          <div className="p-10 text-center text-sm text-slate-500">
            Chưa có hóa đơn nào phù hợp với bộ lọc hiện tại.
          </div>
        )}
      </section>

      {selectedInvoice && (
        <InvoiceDetailModal
          detailError={detailError}
          detailItems={detailItems}
          detailLoading={detailLoading}
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default ManagerInvoicesManage;
