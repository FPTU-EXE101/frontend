import { ArrowLeft, CheckCircle} from "lucide-react";

import { SignupForm } from "@/components/signup-form";
import { Link } from "react-router-dom";

const benefits = [
  {
    title: "Dùng thử 14 ngày miễn phí",
    description: "Không cần thẻ tín dụng, hủy bất cứ lúc nào",
  },
  {
    title: "Setup trong 5 phút",
    description: "Hướng dẫn từng bước, dễ dàng cho người mới",
  },
  {
    title: "Hỗ trợ nhiệt tình 24/7",
    description: "Đội ngũ support luôn sẵn sàng giúp đỡ bạn",
  },
  {
    title: "Digital Pet Card miễn phí",
    description: "Tính năng độc quyền giúp giữ chân khách hàng",
  },
];

export default function SignupPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
      <div className="flex flex-col gap-6  bg-white px-6 py-8 md:px-12 md:py-12">
        <div className="flex flex-col gap-8 ml-15">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-900">
                <ArrowLeft className="h-4 w-4" />
              </span>
              Quay về trang chủ
            </Link>
          </div>

          <div className="max-w-xl space-y-6  ">
            {/* <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D56756]/10 text-[#D56756] shadow-sm">
                <GalleryVerticalEnd className="h-6 w-6" />
              </div>
              <span className="text-xl font-semibold text-[#D56756]">
                PetHub
              </span>
            </div> */}
            <div className="mb-5">
              <div className="inline-flex items-center">
                <img
                  src="/logoPethub.png"
                  alt="PetHub"
                  className="w-auto max-w-none object-contain h-12 sm:h-14"
                  decoding="async"
                />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-slate-950">
                Tạo tài khoản miễn phí
              </h1>
              <p className="text-sm text-slate-600">
                Bắt đầu miễn phí - Không cần thẻ tín dụng
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <SignupForm />
          </div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-[#D56756] text-white lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.12),_transparent_30%)]" />
        <div className="relative mx-auto flex h-full max-w-xl flex-col justify-center gap-8 px-10 py-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Bắt đầu ngay hôm nay!</h2>
            <p className="max-w-lg text-base leading-7 text-white/85">
              Tham gia cùng PetHub để quản lý Pet Shop chuyên nghiệp và hiệu quả
              hơn.
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-3xl bg-white/10 px-5 py-4 shadow-sm backdrop-blur"
              >
                <div className="flex items-center gap-3 text-sm font-semibold text-white">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  {benefit.title}
                </div>
                <p className="mt-2 text-sm text-white/80">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
