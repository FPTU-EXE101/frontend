import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CreditCard,
  Eye,
  FileText,
  ReceiptText,
} from "lucide-react";
import invoiceApi from "@/apis/invoiceAPI";
import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/auth";
import { queryKeys } from "@/lib/queryKeys";
import type { Invoice } from "@/types/invoice.type";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";

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
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getShortId = (id: string) => {
  if (!id) return "Chưa có";
  if (id.length <= 14) return id;
  return `${id.slice(0, 8)}...${id.slice(-4)}`;
};

const getPayOsOrderCode = (invoice: Invoice) =>
  invoice.payOsOrderCode ? String(invoice.payOsOrderCode) : "Chưa có";

const getStatusBadgeClass = (status?: string) => {
  const normalized = String(status ?? "").trim().toLowerCase();

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

const normalizeList = <T,>(value: unknown): T[] => {
  const payload =
    value && typeof value === "object" && "data" in value
      ? (value as { data?: unknown }).data
      : value;

  return Array.isArray(payload) ? (payload as T[]) : [];
};

const UserInvoicePage = () => {
  const userId = getCurrentUserId();

  const {
    data: invoices = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.userInvoices(userId ?? ""),
    queryFn: async ({ signal }) => {
      if (!userId) {
        throw new Error(
          "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        );
      }

      const response = await invoiceApi.getInvoicesByCustomerId(userId, {
        signal,
      });
      return normalizeList<Invoice>(response?.data);
    },
    enabled: Boolean(userId),
  });

  const totalAmount = useMemo(
    () =>
      invoices.reduce(
        (total, invoice) => total + Number(invoice.totalAmount ?? 0),
        0,
      ),
    [invoices],
  );

  const errorMessage =
    error instanceof Error
      ? error.message
      : getBackendErrorMessage(error) ||
        "Không tải được danh sách hóa đơn. Vui lòng thử lại sau.";

  return (
    <div className="min-h-[calc(100vh-3rem)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-[#B24C40]">
                <ReceiptText className="h-4 w-4" />
                Hóa đơn
              </div>
              <h1 className="text-3xl font-semibold text-slate-950">
                Hóa đơn của tôi
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Theo dõi các hóa đơn dịch vụ, trạng thái thanh toán và mã PayOS.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Tổng hóa đơn
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {invoices.length}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Tổng tiền
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-950">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-[30px] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Đang tải hóa đơn...
          </div>
        ) : !userId ? (
          <div className="rounded-[30px] border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
            Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.
          </div>
        ) : isError ? (
          <div className="flex items-start gap-3 rounded-[30px] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm whitespace-pre-line">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : invoices.length === 0 ? (
          <div className="rounded-[30px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <FileText className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 font-semibold text-slate-900">
              Bạn chưa có hóa đơn nào.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Các hóa đơn phát sinh từ lịch hẹn và dịch vụ sẽ hiển thị tại đây.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {invoices.map((invoice) => (
              <article
                key={invoice.id}
                className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-semibold text-slate-700">
                        {getShortId(invoice.id)}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusBadgeClass(
                          invoice.status,
                        )}`}
                      >
                        {invoice.status || "Không rõ"}
                      </span>
                    </div>
                    <h2 className="mt-4 text-xl font-semibold text-slate-950">
                      {invoice.petName || "Chưa có tên thú cưng"}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {invoice.appointmentNote || "Chưa có ghi chú lịch hẹn"}
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                          Tổng tiền
                        </p>
                        <p className="mt-1 font-semibold text-slate-950">
                          {formatCurrency(Number(invoice.totalAmount ?? 0))}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                          Ngày tạo
                        </p>
                        <p className="mt-1 font-semibold text-slate-950">
                          {formatDateTime(invoice.createdAt)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                          PayOS
                        </p>
                        <p className="mt-1 break-all font-semibold text-slate-950">
                          {getPayOsOrderCode(invoice)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
                  >
                    <Link to={`/user/invoices/${invoice.id}`}>
                      <Eye className="h-4 w-4" />
                      Xem chi tiết
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-gradient-to-r from-[#172554] via-[#334155] to-[#D56756] p-6 text-white shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Thông tin thanh toán</h3>
              <p className="mt-3 text-sm leading-7 text-slate-100">
                Nếu hóa đơn chưa cập nhật trạng thái sau khi thanh toán, vui
                lòng liên hệ PetHub để được kiểm tra và hỗ trợ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInvoicePage;
