import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import authApi from "@/apis/authAPI";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";

type ConfirmStatus = "loading" | "success" | "error" | "idle";

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<ConfirmStatus>("idle");
  const [message, setMessage] = useState<string>("");

  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  useEffect(() => {
    const confirmEmail = async () => {
      // Validate parameters
      if (!userId || !token) {
        setStatus("error");
        setMessage(
          "Tham số không hợp lệ. Vui lòng kiểm tra lại link xác nhận.",
        );
        return;
      }

      try {
        setStatus("loading");
        await authApi.confirmEmail({ userId, token });
        setStatus("success");
        setMessage("Email của bạn đã được xác nhận thành công!");
      } catch (error: any) {
        setStatus("error");
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Không thể xác nhận email. Vui lòng thử lại hoặc liên hệ hỗ trợ.";
        setMessage(errorMessage);
      }
    };

    confirmEmail();
  }, [userId, token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff8f2] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8 text-center">
            <img
              src="/logoPethub.png"
              alt="PetHub"
              className="mx-auto mb-6 h-14 w-auto object-contain"
            />
            <h1 className="text-2xl font-bold text-slate-950">
              Xác nhận Email
            </h1>
          </div>

          {/* Status Content */}
          <div className="flex flex-col items-center gap-4">
            {status === "loading" && (
              <>
                <Loader className="h-12 w-12 animate-spin text-blue-500" />
                <p className="text-center text-slate-600">
                  Đang xác nhận email của bạn...
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p className="text-center text-slate-900 font-semibold">
                  {message}
                </p>
                <p className="text-center text-sm text-slate-600">
                  Bạn có thể đăng nhập ngay bây giờ để bắt đầu sử dụng dịch vụ
                  của chúng tôi.
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <AlertCircle className="h-12 w-12 text-red-500" />
                <p className="text-center text-slate-900 font-semibold">
                  Xác nhận thất bại
                </p>
                <p className="text-center text-sm text-slate-600">{message}</p>
              </>
            )}

            {status === "idle" && (
              <>
                <Loader className="h-12 w-12 animate-spin text-slate-400" />
                <p className="text-center text-slate-600">
                  Đang kiểm tra thông tin...
                </p>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            {status === "success" && (
              <Link
                to="/auth/login"
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white transition hover:bg-blue-700"
              >
                Đăng nhập
              </Link>
            )}

            {status === "error" && (
              <>
                <Link
                  to="/auth/signup"
                  className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white transition hover:bg-blue-700"
                >
                  Đăng ký lại
                </Link>
                <Link
                  to="/"
                  className="inline-block rounded-lg border border-slate-300 px-6 py-3 text-center font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Quay về trang chủ
                </Link>
              </>
            )}

            {(status === "loading" || status === "idle") && (
              <Link
                to="/"
                className="inline-block rounded-lg border border-slate-300 px-6 py-3 text-center font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Quay về trang chủ
              </Link>
            )}
          </div>
        </div>

        {/* Support Text */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Nếu bạn gặp vấn đề, vui lòng liên hệ với{" "}
          <a
            href="mailto:support@pethub.com"
            className="text-blue-600 hover:underline"
          >
            support@pethub.com
          </a>
        </p>
      </div>
    </div>
  );
}
