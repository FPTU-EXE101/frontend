import { ArrowLeft } from "lucide-react";

import { SignupForm } from "@/components/signup-form";
import { Link } from "react-router-dom";

export default function SignupPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fff8f3]">
      <style>
        {`
          @keyframes authCardIn {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            .auth-card-in { animation: none !important; }
          }
          .auth-glass [data-slot="field-label"] { color: rgba(255,255,255,0.92); }
          .auth-glass [data-slot="field-description"] { color: rgba(255,255,255,0.65); }
        `}
      </style>

      <video
        className="fixed inset-0 h-full w-full object-cover"
        src="/videos/dogPlay.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      {/* Overlay rất nhạt — video vẫn là nhân vật chính */}
      <div className="fixed inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(15,23,42,0.18)_100%)]" />

      <Link
        to="/"
        className="fixed left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/35 sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay về trang chủ
      </Link>

      {/* Desktop: form bên phải — Mobile: giữa màn hình */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24 sm:px-6 md:justify-end md:pr-[10%]">
        <div className="auth-card-in auth-glass w-full max-w-[460px] rounded-[28px] border border-white/20 bg-white/[0.08] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.22)] backdrop-blur-xl [animation:authCardIn_600ms_ease-out_both] sm:p-8">
          <div className="mb-8 text-center">
            <img
              src="/logoPethub.png"
              alt="PetHub"
              className="mx-auto h-12 w-auto max-w-none object-contain sm:h-14"
              fetchPriority="high"
              decoding="async"
            />

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl" style={{textShadow:"0 1px 8px rgba(0,0,0,0.35)"}}>
              Tạo tài khoản miễn phí
            </h1>
            <p className="mt-3 text-sm leading-7 text-white/80">
              Bắt đầu miễn phí - Không cần thẻ tín dụng
            </p>
          </div>
          <SignupForm className="[&_[data-slot=field-label]]:text-white/90 [&_[data-slot=field-description]]:text-white/65" />
        </div>
      </main>
    </div>
  );
}
