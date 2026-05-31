import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function VerifyEmailNotice() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fff8f3] px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(213,103,86,0.14),transparent_32%),linear-gradient(135deg,#fff8f3_0%,#ffffff_48%,#f7e7e2_100%)]" />

      <Link
        to="/"
        className="fixed left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-[#D56756]/20 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Trang chủ
      </Link>

      <main className="relative z-10 w-full max-w-[520px]">
        <div className="rounded-[28px] border border-[#f0c7bd] bg-white/90 p-6 text-center shadow-[0_24px_70px_rgba(112,63,48,0.14)] backdrop-blur sm:p-8">
          <img
            src="/logoPethub.png"
            alt="PetHub"
            className="mx-auto h-12 w-auto object-contain sm:h-14"
            fetchPriority="high"
            decoding="async"
          />

          <div className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#D56756]/10 text-[#D56756]">
            <div className="relative">
              <Mail className="h-10 w-10" aria-hidden="true" />
              <CheckCircle2
                className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-white text-emerald-500"
                aria-hidden="true"
              />
            </div>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-slate-950 sm:text-4xl">
            Đăng ký thành công!
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
            Vui lòng kiểm tra email của bạn và bấm vào liên kết xác nhận để
            kích hoạt tài khoản.
          </p>

          <p className="mx-auto mt-3 max-w-md rounded-2xl bg-[#fff8f3] px-4 py-3 text-sm leading-6 text-slate-600">
            Nếu không thấy email, hãy kiểm tra thêm hộp thư Spam/Junk.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              to="/auth/login"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#D56756] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b34c47]"
            >
              Về trang đăng nhập
            </Link>
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#D56756] bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-[#f7e7e2]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Mở Gmail
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
