import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, MailCheck, Store, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StorePicker } from "@/components/auth/store-picker";
import { getCurrentUserEmail } from "@/lib/auth";
import { switchStore } from "@/lib/storeSession";

type StoreSwitcherProps = {
  open: boolean;
  onClose: () => void;
  currentStoreId?: string;
  currentStoreName?: string;
};

/**
 * Hộp thoại "Đổi cửa hàng" kiểu đổi server trong game: người dùng chỉ chọn cửa
 * hàng, FE tự đăng nhập/tham gia ngầm (xem switchStore) rồi nạp lại phiên mới.
 */
export function StoreSwitcher({
  open,
  onClose,
  currentStoreId,
  currentStoreName,
}: StoreSwitcherProps) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Khi cửa hàng mới cần xác nhận email mới đăng nhập được.
  const [needsConfirm, setNeedsConfirm] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, busy, onClose]);

  if (!open) return null;

  const isSameStore = Boolean(selectedId) && selectedId === currentStoreId;

  const handleConfirm = async () => {
    if (!selectedId || busy || isSameStore) return;
    setBusy(true);
    setError(null);

    const result = await switchStore(selectedId);

    if (result.ok) {
      // Nạp lại để mọi dữ liệu (navbar, lịch hẹn, thú cưng...) theo cửa hàng mới.
      window.location.assign("/user/service");
      return;
    }

    if (result.reason === "no-credentials") {
      // Mất thông tin phiên (vd: mở tab mới) → quay về đăng nhập, điền sẵn.
      const email = getCurrentUserEmail() ?? "";
      const params = new URLSearchParams({
        switch: "1",
        storeId: selectedId,
        ...(email ? { email } : {}),
      });
      onClose();
      navigate(`/auth/login?${params.toString()}`);
      return;
    }

    if (result.reason === "needs-confirmation") {
      // Đã thêm cửa hàng nhưng tài khoản mới chưa xác nhận email.
      setNeedsConfirm(true);
      setBusy(false);
      return;
    }

    setError(result.message);
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Đóng"
        disabled={busy}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-[#f0d8d0] bg-white shadow-[0_30px_80px_rgba(112,63,48,0.22)]">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D56756] text-white">
              <Store className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-slate-950">
                Đổi cửa hàng
              </h2>
              <p className="text-xs text-slate-500">
                Hiện tại:{" "}
                <span className="font-semibold text-[#B24C40]">
                  {currentStoreName || "Chưa xác định"}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Đóng"
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {needsConfirm ? (
          <>
            <div className="px-6 py-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <MailCheck className="h-7 w-7" />
              </div>
              <h3 className="text-center text-base font-bold text-slate-900">
                Cần xác nhận email cho cửa hàng mới
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-6 text-slate-600">
                Đã thêm cửa hàng vào tài khoản của bạn. Vì đây là cửa hàng mới,
                vui lòng kiểm tra hộp thư{" "}
                <span className="font-semibold text-slate-800">
                  {getCurrentUserEmail() || "email của bạn"}
                </span>{" "}
                và bấm liên kết xác nhận. Sau khi xác nhận, mở lại "Đổi cửa
                hàng" để chuyển sang cửa hàng này.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <Button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Đóng
              </Button>
              <Link
                to="/verify-email-notice"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full bg-[#D56756] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b34c47]"
              >
                Hướng dẫn xác nhận
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="px-6 py-5">
              <p className="mb-3 text-sm text-slate-600">
                Chọn cửa hàng bạn muốn chuyển tới. Nếu chưa có tài khoản ở đó, hệ
                thống sẽ tự tạo giúp bạn —{" "}
                <span className="font-semibold">không cần đăng ký lại</span>{" "}
                (cửa hàng mới sẽ cần xác nhận email).
              </p>

              <StorePicker value={selectedId} onSelect={setSelectedId} />

              {isSameStore ? (
                <p className="mt-3 text-sm text-amber-600">
                  Đây là cửa hàng bạn đang dùng. Hãy chọn một cửa hàng khác.
                </p>
              ) : null}

              {error ? (
                <p className="mt-3 text-sm text-red-600">{error}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <Button
                type="button"
                onClick={onClose}
                disabled={busy}
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Huỷ
              </Button>
              <Button
                type="button"
                onClick={() => void handleConfirm()}
                disabled={!selectedId || isSameStore || busy}
                className="inline-flex items-center gap-2 rounded-full bg-[#D56756] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b34c47] disabled:cursor-not-allowed disabled:bg-[#d89992]"
              >
                {busy ? "Đang chuyển..." : "Chuyển tới cửa hàng này"}
                {busy ? null : <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
