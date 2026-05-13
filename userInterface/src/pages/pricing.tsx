import { CheckCircle, Rocket, Zap } from 'lucide-react';
import React from 'react';
import { Button } from "@/components/ui/button";

const PricingPage = () => {
  return (
    <div className="min-h-screen">
      <section className="bg-[#f9f2e8] py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D56756]">
              Bảng giá minh bạch
            </p>
            <h2 className="mt-4 text-4xl font-bold text-slate-950 sm:text-5xl">
              Chọn gói phù hợp với quy mô cửa hàng của bạn.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Nâng cấp hoặc hạ cấp bất cứ lúc nào.
            </p>
            <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                ✓
              </span>
              Bắt đầu miễn phí - Không cần thẻ tín dụng
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#F2D0CA] text-[#D56756] shadow-sm">
                <Zap className="h-6 w-6" />
              </div>
              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Starter
                </p>
                <h3 className="mt-2 text-3xl font-bold text-slate-950">0đ</h3>
                <p className="mt-1 text-sm text-slate-500">/tháng</p>
                <p className="mt-4 text-sm text-slate-600">Dùng thử miễn phí</p>
              </div>

              <ul className="mt-8 space-y-4 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                  Quản lý tối đa 50 thú cưng
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                  Digital Pet Card cơ bản
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                  Lịch hẹn thủ công
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                  Lưu trữ hồ sơ y tế
                </li>
                <li className="flex items-start gap-3 text-slate-400">
                  <span className="mt-1 inline-block h-5 w-5 rounded-full border border-slate-300" />
                  Nhắc nhở thông minh (Email)
                </li>
                <li className="flex items-start gap-3 text-slate-400">
                  <span className="mt-1 inline-block h-5 w-5 rounded-full border border-slate-300" />
                  CRM & Phân loại khách hàng
                </li>
                <li className="flex items-start gap-3 text-slate-400">
                  <span className="mt-1 inline-block h-5 w-5 rounded-full border border-slate-300" />
                  Báo cáo doanh thu
                </li>
                <li className="flex items-start gap-3 text-slate-400">
                  <span className="mt-1 inline-block h-5 w-5 rounded-full border border-slate-300" />
                  Hỗ trợ ưu tiên 24/7
                </li>
              </ul>

              <Button className="mt-8 w-full rounded-full border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                Gói mặc định
              </Button>
            </div>

            <div className="relative rounded-[28px] border border-[#E9B0A7] bg-white p-8 shadow-[0_25px_60px_rgba(213,103,86,0.12)]">
              <div className="absolute -top-4 left-1/2 hidden -translate-x-1/2 rounded-full bg-[#D56756] px-4 py-2 text-sm font-semibold text-white shadow-sm md:block">
                Phổ biến nhất
              </div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#F2D0CA] text-[#D56756] shadow-sm">
                <Rocket className="h-6 w-6" />
              </div>
              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Premium
                </p>
                <h3 className="mt-2 text-3xl font-bold text-slate-950">
                  249.000đ
                </h3>
                <p className="mt-1 text-sm text-slate-500">/tháng</p>
                <p className="mt-4 text-sm text-slate-600">
                  Pet store nhỏ, Phòng khám nhỏ—vừa
                </p>
              </div>

              <ul className="mt-8 space-y-4 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                  Quản lý KHÔNG GIỚI HẠN thú cưng
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                  Digital Pet Card cao cấp + QR Code
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                  Lịch hẹn tự động + Booking online
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                  Lưu trữ Cloud không giới hạn
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                  Nhắc nhở thông minh (Email)
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                  CRM & Phân loại khách hàng VIP
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                  Báo cáo doanh thu chi tiết
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                  Hỗ trợ ưu tiên 24/7
                </li>
              </ul>

              <Button className="mt-8 w-full rounded-full bg-[#D56756] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[0_25px_60px_rgba(213,103,86,0.2)] hover:bg-[#B24C40]">
                Gói Premium
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PricingPage;
