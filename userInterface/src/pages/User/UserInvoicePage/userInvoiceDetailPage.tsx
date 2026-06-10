import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CreditCard,
  FileText,
  PawPrint,
  ReceiptText,
  User,
} from "lucide-react";
import invoiceApi from "@/apis/invoiceAPI";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/queryKeys";
import type { GetInvoiceDetailsResponse, Invoice } from "@/types/invoice.type";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";

const NO_DATA = "Chưa có";

const normalizeList = <T,>(value: unknown): T[] => {
  const payload =
    value && typeof value === "object" && "data" in value
      ? (value as { data?: unknown }).data
      : value;

  return Array.isArray(payload) ? (payload as T[]) : [];
};

const getResponseData = <T,>(value: unknown): T | null => {
  if (!value || typeof value !== "object") return null;
  const data = (value as { data?: unknown }).data;
  if (!data) return null;
  if (typeof data === "object" && "data" in data) {
    return ((data as { data?: T }).data ?? null) as T | null;
  }
  return data as T;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\s₫$/, "đ");

const formatDateTime = (value?: string) => {
  if (!value) return NO_DATA;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return NO_DATA;
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadgeClass = (status?: string) => {
  const normalized = String(status ?? "").trim().toLowerCase();
  if (normalized === "pending") return "bg-amber-100 text-amber-800 ring-amber-200";
  if (normalized === "paid" || normalized === "completed") {
    return "bg-emerald-100 text-emerald-800 ring-emerald-200";
  }
  if (normalized === "cancelled" || normalized === "canceled") {
    return "bg-rose-100 text-rose-800 ring-rose-200";
  }
  return "bg-slate-100 text-slate-700 ring-slate-200";
};

const getPayOsOrderCode = (invoice: Invoice) =>
  invoice.payOsOrderCode ? String(invoice.payOsOrderCode) : NO_DATA;

const getDetailName = (detail: GetInvoiceDetailsResponse) =>
  String(detail.itemName || detail.name || detail.id || "Chi tiết hóa đơn");

const getDetailQuantity = (detail: GetInvoiceDetailsResponse) =>
  Number(detail.quantity ?? 0);

const getDetailPrice = (detail: GetInvoiceDetailsResponse) =>
  Number(detail.price ?? 0);

const getDetailSubtotal = (detail: GetInvoiceDetailsResponse) =>
  Number(detail.subtotal ?? detail.total ?? 0);

const InfoCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ReceiptText;
  label: string;
  value?: string | number | null;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <p className="mt-2 break-words font-semibold text-slate-950">
      {value || NO_DATA}
    </p>
  </div>
);

const UserInvoiceDetailPage = () => {
  const { id = "" } = useParams();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.userInvoice(id),
    queryFn: async ({ signal }) => {
      if (!id) {
        throw new Error("Không tìm thấy mã hóa đơn.");
      }

      const [invoiceResponse, detailResponse] = await Promise.all([
        invoiceApi.getInvoiceById(id, { signal }),
        invoiceApi.getInvoiceDetail(id, { signal }),
      ]);

      return {
        details: normalizeList<GetInvoiceDetailsResponse>(detailResponse?.data),
        invoice: getResponseData<Invoice>(invoiceResponse),
      };
    },
    enabled: Boolean(id),
  });

  const invoice = data?.invoice ?? null;
  const details = data?.details ?? [];
  const errorMessage =
    error instanceof Error
      ? error.message
      : getBackendErrorMessage(error) ||
        "Không tải được chi tiết hóa đơn. Vui lòng thử lại sau.";

  return (
    <div className="min-h-[calc(100vh-3rem)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <div>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/user/invoices">
              <ArrowLeft className="h-4 w-4" />
              Quay lại hóa đơn
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="rounded-[30px] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Đang tải chi tiết hóa đơn...
          </div>
        ) : isError || !invoice ? (
          <div className="flex items-start gap-3 rounded-[30px] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm whitespace-pre-line">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{isError ? errorMessage : "Không tìm thấy hóa đơn."}</span>
          </div>
        ) : (
          <>
            <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-[#B24C40]">
                    <ReceiptText className="h-4 w-4" />
                    Chi tiết hóa đơn
                  </div>
                  <h1 className="break-all text-2xl font-semibold text-slate-950">
                    {invoice.id}
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    {invoice.appointmentNote || "Chưa có ghi chú lịch hẹn"}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusBadgeClass(
                    invoice.status,
                  )}`}
                >
                  {invoice.status || "Không rõ"}
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoCard icon={PawPrint} label="Thú cưng" value={invoice.petName} />
                <InfoCard
                  icon={User}
                  label="Khách hàng"
                  value={invoice.customerName}
                />
                <InfoCard
                  icon={CreditCard}
                  label="Tổng tiền"
                  value={formatCurrency(Number(invoice.totalAmount ?? 0))}
                />
                <InfoCard
                  icon={CalendarDays}
                  label="Ngày tạo"
                  value={formatDateTime(invoice.createdAt)}
                />
                <InfoCard
                  icon={ReceiptText}
                  label="Mã PayOS"
                  value={getPayOsOrderCode(invoice)}
                />
                <InfoCard icon={FileText} label="Trạng thái" value={invoice.status} />
              </div>
            </section>

            <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-[1.5fr_0.7fr_1fr_1fr] gap-4 bg-[#F8F1E4] px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                <span>Mục</span>
                <span>SL</span>
                <span>Đơn giá</span>
                <span>Thành tiền</span>
              </div>
              {details.length > 0 ? (
                details.map((detail, index) => (
                  <div
                    key={detail.id || index}
                    className="grid grid-cols-[1.5fr_0.7fr_1fr_1fr] items-center gap-4 border-t border-slate-200 px-5 py-4 text-sm text-slate-700"
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
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default UserInvoiceDetailPage;
