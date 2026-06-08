import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Home, LayoutDashboard, LoaderCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getPaymentReturn,
  type PaymentReturnParams,
  type PaymentReturnResponse,
} from "@/apis/paymentAPI";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";

const getRequiredParams = (
  searchParams: URLSearchParams,
): PaymentReturnParams | null => {
  const code = searchParams.get("code");
  const id = searchParams.get("id");
  const cancel = searchParams.get("cancel");
  const status = searchParams.get("status");
  const orderCode = searchParams.get("orderCode");

  if (!code || !id || !cancel || !status || !orderCode) {
    return null;
  }

  return {
    code,
    id,
    cancel,
    status,
    orderCode,
  };
};

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentReturn, setPaymentReturn] =
    useState<PaymentReturnResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const confirmPayment = async () => {
      const params = getRequiredParams(searchParams);

      if (!params) {
        setError("Thiếu thông tin thanh toán.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getPaymentReturn(params);

        if (!ignore) {
          setPaymentReturn(response);
        }
      } catch (paymentError) {
        if (!ignore) {
          setError(getBackendErrorMessage(paymentError));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void confirmPayment();

    return () => {
      ignore = true;
    };
  }, [searchParams]);

  const isSuccess = paymentReturn?.status === "success";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#fff8f3] px-4 py-16">
      <section className="mx-auto flex max-w-2xl flex-col items-center text-center">
        {loading ? (
          <>
            <div className="grid h-16 w-16 place-items-center rounded-full bg-[#D56756]/10 text-[#B24C40]">
              <LoaderCircle className="h-8 w-8 animate-spin" />
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Đang xác nhận thanh toán
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Vui lòng chờ trong giây lát.
            </p>
          </>
        ) : isSuccess ? (
          <>
            <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Thanh toán thành công
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Gói của bạn đã được nâng cấp lên Premium.
            </p>

            <div className="mt-6 space-y-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm">
              <p>
                Mã đơn hàng:{" "}
                <span className="text-slate-950">
                  {paymentReturn.orderCode}
                </span>
              </p>
              <p>
                Mã giao dịch:{" "}
                <span className="text-slate-950">
                  {paymentReturn.paymentId}
                </span>
              </p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="rounded-full bg-[#D56756] px-6 py-5 text-sm font-semibold text-white hover:bg-[#B24C40]"
              >
                <Link to="/manager/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  Về Dashboard
                </Link>
              </Button>
              <Button
                asChild
                className="rounded-full border border-slate-200 bg-white px-6 py-5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Link to="/">
                  <Home className="h-4 w-4" />
                  Về Trang Chủ
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="grid h-16 w-16 place-items-center rounded-full bg-red-100 text-red-700">
              <XCircle className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Thanh toán thất bại hoặc chưa được xác nhận.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {error || "Giao dịch đã bị hủy hoặc chưa được xác nhận."}
            </p>
            <Button
              asChild
              className="mt-8 rounded-full bg-[#D56756] px-6 py-5 text-sm font-semibold text-white hover:bg-[#B24C40]"
            >
              <Link to="/pricing">Quay lại trang nâng cấp gói</Link>
            </Button>
          </>
        )}
      </section>
    </main>
  );
};

export default PaymentSuccessPage;
