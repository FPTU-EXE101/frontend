import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bone,
  Cat,
  Dog,
  Fish,
  Heart,
  PawPrint,
  Stethoscope,
  Syringe,
} from "lucide-react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

// Các icon thú cưng rải mờ quanh mép màn hình cho nền đỡ trống.
const DECOR_ICONS = [
  { Icon: PawPrint, className: "left-[6%] top-[14%] h-16 w-16", rotate: "-12deg", delay: "0s" },
  { Icon: Cat, className: "left-[12%] top-[58%] h-20 w-20 hidden sm:block", rotate: "6deg", delay: "1.2s" },
  { Icon: Bone, className: "left-[4%] bottom-[12%] h-14 w-14", rotate: "12deg", delay: "2.1s" },
  { Icon: Heart, className: "left-[24%] top-[26%] h-9 w-9 hidden lg:block", rotate: "12deg", delay: "0.6s" },
  { Icon: Dog, className: "right-[7%] top-[16%] h-20 w-20", rotate: "6deg", delay: "0.9s" },
  { Icon: Syringe, className: "right-[14%] top-[60%] h-12 w-12 hidden sm:block", rotate: "-12deg", delay: "1.8s" },
  { Icon: Stethoscope, className: "right-[5%] bottom-[14%] h-16 w-16", rotate: "6deg", delay: "0.3s" },
  { Icon: Fish, className: "right-[26%] bottom-[24%] h-9 w-9 hidden lg:block", rotate: "-6deg", delay: "2.6s" },
  { Icon: PawPrint, className: "right-[22%] top-[24%] h-10 w-10 hidden lg:block", rotate: "45deg", delay: "1.5s" },
];

/**
 * Khung layout dùng chung cho các trang xác thực (đăng nhập / đăng ký).
 * Card chữ nhật căn giữa màn hình trên nền gradient kem ấm — gọn, cân đối,
 * không phụ thuộc video nền để tải nhẹ.
 */
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fff8f3] px-4 py-10 sm:px-6">
      <style>
        {`
          @keyframes authFloat {
            0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
            50% { transform: translateY(-14px) rotate(var(--r, 0deg)); }
          }
          @media (prefers-reduced-motion: reduce) {
            .auth-decor { animation: none !important; }
          }
        `}
      </style>

      {/* Nền trang trí mờ theo tông thương hiệu */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(213,103,86,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(213,103,86,0.14),transparent_40%)]" />

      {/* Khối màu lớn mờ ở các góc */}
      <div className="pointer-events-none absolute -left-32 -top-24 h-[26rem] w-[26rem] rounded-full bg-[#f3b6a8]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-[28rem] w-[28rem] rounded-full bg-[#f6c9bd]/35 blur-3xl" />

      {/* Icon thú cưng rải mờ quanh mép */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {DECOR_ICONS.map(({ Icon, className, rotate, delay }, index) => (
          <Icon
            key={index}
            aria-hidden="true"
            style={
              { animationDelay: delay, "--r": rotate } as CSSProperties
            }
            className={`auth-decor absolute text-[#D56756]/15 [animation:authFloat_7s_ease-in-out_infinite] ${className}`}
          />
        ))}
      </div>

      <Link
        to="/"
        className="fixed left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-[#D56756]/40 hover:text-[#B24C40] sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay về trang chủ
      </Link>

      <main className="relative z-10 w-full max-w-[940px] lg:w-[60%]">
        <div className="rounded-[28px] border border-[#f0d8d0] bg-white p-6 shadow-[0_24px_70px_rgba(112,63,48,0.12)] sm:p-8 lg:p-10">
          <div className="mb-7 text-center">
            <img
              src="/Artboard 5.svg"
              alt="PetHub"
              className="mx-auto h-9 w-auto object-contain"
              fetchPriority="high"
              decoding="async"
            />
            <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-[1.75rem]">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-7 text-slate-500">{subtitle}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
