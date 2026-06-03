import { Link } from "react-router-dom";
import {
  Bell,
  Heart,
  QrCode,
  TrendingUp,
  Users,
  Shield,
  Stethoscope,
  File,
  CreditCard,
  ArrowRight,
  CheckCircle,
  Zap,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─── DATA ──────────────────────────────────────────────────────────── */

const features = [
  {
    icon: Users,
    title: "Quản lý khách hàng thông minh",
    description:
      "Lưu trữ thông tin khách hàng & thú cưng chi tiết. Theo dõi lịch sử dịch vụ và tổng chi tiêu.",
    details: [
      "Hồ sơ khách hàng & thú cưng tập trung",
      "Lịch sử dịch vụ & chi tiêu đầy đủ",
      "Phân loại khách hàng VIP tự động",
      "Tìm kiếm & lọc nhanh",
    ],
    color: "#D56756",
    bgColor: "#F7E3DF",
    tag: "CRM",
  },
  {
    icon: Shield,
    title: "Lịch hẹn tự động",
    description:
      "Đặt lịch nhanh, nhắc nhở tự động qua SMS/Zalo. Không bao giờ bỏ lỡ khách hàng.",
    details: [
      "Đặt lịch online 24/7",
      "Nhắc nhở tự động qua SMS & Zalo",
      "Quản lý slot theo nhân viên",
      "Xem lịch theo ngày / tuần / tháng",
    ],
    color: "#2E7D4F",
    bgColor: "#E8F5EE",
    tag: "Lịch hẹn",
  },
  {
    icon: QrCode,
    title: "Digital Pet Card",
    description:
      "Thẻ thú cưng điện tử với QR code. Khách hàng quét là thấy ngay lịch sử tiêm phòng, tẩy giun.",
    details: [
      "Thẻ kỹ thuật số với QR Code riêng",
      "Lịch sử tiêm phòng & tẩy giun",
      "Chia sẻ dễ dàng với bác sĩ",
      "Nhắc lịch tái chủng tự động",
    ],
    color: "#7C3AED",
    bgColor: "#EDE9FE",
    tag: "Độc quyền",
    highlight: true,
  },
  {
    icon: Stethoscope,
    title: "Hồ sơ Y tế chi tiết",
    description:
      "Lưu trữ đầy đủ lịch sử khám bệnh, tiêm phòng, thuốc men. Timeline rõ ràng, dễ theo dõi.",
    details: [
      "Timeline khám bệnh đầy đủ",
      "Quản lý đơn thuốc & liều dùng",
      "Ảnh chụp & tài liệu đính kèm",
      "Xuất hồ sơ PDF chuyên nghiệp",
    ],
    color: "#0369A1",
    bgColor: "#E0F2FE",
    tag: "Y tế",
  },
  {
    icon: CreditCard,
    title: "Giao diện tổng đơn hàng chuyên nghiệp ",
    description:
      "Tính tiền chuyên nghiệp, quan sát trực quan dịch vụ, sản phẩm đã chọn.",
    details: [
      "Giao diện đơn hàng đơn giản, nhanh",
      "Tính tiền tự động theo dịch vụ & sản phẩm",
    ],
    color: "#B45309",
    bgColor: "#FEF3C7",
    tag: "Thanh toán",
  },
  {
    icon: Bell,
    title: "Nhắc nhở thông minh",
    description:
      "Tự động nhắc lịch tái chủng, sinh nhật thú cưng. Tăng tỷ lệ khách quay lại 3x.",
    details: [
      "Nhắc lịch tái chủng & tẩy giun",
      "Chúc mừng sinh nhật thú cưng",
      "Gửi qua Zalo, SMS, Email",
      "Cá nhân hóa nội dung tin nhắn",
    ],
    color: "#D56756",
    bgColor: "#F7E3DF",
    tag: "Automation",
  },
  {
    icon: TrendingUp,
    title: "Báo cáo doanh thu",
    description:
      "Thống kê chi tiết doanh thu theo ngày/tháng. Phân tích xu hướng và tăng trưởng.",
    details: [
      "Dashboard doanh thu trực quan",
      "Báo cáo theo ngày / tuần / tháng",
      "Top dịch vụ & sản phẩm bán chạy",
      "Xuất Excel & PDF",
    ],
    color: "#2E7D4F",
    bgColor: "#E8F5EE",
    tag: "Phân tích",
  },
  {
    icon: Heart,
    title: "CRM giữ chân khách",
    description:
      "Chăm sóc khách hàng chu đáo. Gửi ưu đãi cá nhân hóa, xây dựng lòng trung thành.",
    details: [
      "Phân nhóm khách theo mức chi tiêu",
      "Gửi ưu đãi & voucher cá nhân hóa",
      "Chương trình khách hàng thân thiết",
      "Đánh giá mức độ hài lòng",
    ],
    color: "#BE185D",
    bgColor: "#FCE7F3",
    tag: "Loyalty",
  },
  {
    icon: File,
    title: "Quản lý dịch vụ",
    description: "Danh mục dịch vụ linh hoạt. Cập nhật giá, combo dễ dàng.",
    details: [
      "Danh mục dịch vụ & sản phẩm",
      "Tạo combo & gói dịch vụ",
      "Quản lý giá theo thời điểm",
      "Kiểm soát tồn kho sản phẩm",
    ],
    color: "#0369A1",
    bgColor: "#E0F2FE",
    tag: "Quản lý",
  },
];

const highlights = [
  { value: "9+", label: "Tính năng tích hợp" },
  { value: "500+", label: "Cửa hàng tin dùng" },
  { value: "3x", label: "Tăng khách quay lại" },
  { value: "98%", label: "Hài lòng sau 30 ngày" },
];

/* ─── COMPONENT ─────────────────────────────────────────────────────── */

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
  color: string;
  bgColor: string;
  tag: string;
  highlight?: boolean;
};

const FeatureCard = ({ feature }: { feature: Feature }) => {
  const Icon = feature.icon;

  return (
    <div className="group relative h-full w-[280px] shrink-0 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] sm:w-[340px] sm:p-6 lg:w-[380px]">
      <span
        className="absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold sm:right-5 sm:top-5"
        style={{ backgroundColor: feature.bgColor, color: feature.color }}
      >
        {feature.tag}
      </span>

      <div
        className="inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:h-13 sm:w-13"
        style={{ backgroundColor: feature.bgColor, color: feature.color }}
      >
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-5 pr-16 text-lg font-bold text-slate-900 sm:text-xl">
        {feature.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
        {feature.description}
      </p>

      <ul className="mt-5 space-y-2">
        {feature.details.map((detail) => (
          <li key={detail} className="flex items-start gap-2 text-sm text-slate-600">
            <CheckCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: feature.color }}
            />
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FeatureMarqueeRow = ({
  items,
  direction,
}: {
  items: Feature[];
  direction: "left" | "right";
}) => {
  const duplicatedItems = [...items, ...items];
  const animationClass =
    direction === "right" ? "features-marquee-right" : "features-marquee-left";

  return (
    <div className="features-marquee-row overflow-hidden py-2">
      <div className={`flex w-max gap-4 sm:gap-5 lg:gap-6 ${animationClass}`}>
        {duplicatedItems.map((feature, index) => (
          <FeatureCard
            key={`${feature.title}-${index}`}
            feature={feature}
          />
        ))}
      </div>
    </div>
  );
};

const Features = () => {
  const midpoint = Math.ceil(features.length / 2);
  const firstFeatureRow = features.slice(0, midpoint);
  const secondFeatureRow = features.slice(midpoint);

  return (
    <div className="min-h-screen">
      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f5eadf] px-4 py-24">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#EFB7AF]/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#F4D2CA]/40 blur-3xl" />

        <div className="container relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#EFB7AF] bg-[#F7E3DF] px-4 py-2 text-sm font-semibold text-[#D56756] shadow-sm">
              <Zap className="h-4 w-4" />
              Tính năng
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">
              Mọi tính năng bạn cần,{" "}
              <span className="text-[#D56756]">trong một hệ thống</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              PetHub được thiết kế đặc biệt cho Pet Shop & Phòng khám thú y Việt
              Nam. Từ quản lý khách hàng, lịch hẹn đến thanh toán — tất cả trong
              một nền tảng duy nhất.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/auth/signup"
                className="inline-flex items-center gap-2 rounded-full bg-[#D56756] px-7 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[#B24C40]"
              >
                Dùng thử miễn phí
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-[#D56756] bg-white px-7 py-3.5 text-base font-semibold text-[#D56756] transition hover:bg-[#F7E3DF]"
              >
                Xem bảng giá
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {highlights.map((h, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#F4D2CA] bg-white px-6 py-5 text-center shadow-sm"
              >
                <p className="text-3xl font-bold text-[#D56756]">{h.value}</p>
                <p className="mt-1 text-sm text-slate-600">{h.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── 3. ALL FEATURES MARQUEE ─────────────────────────────── */}
      <section className="features-marquee-section overflow-hidden bg-[#f9f2e8] px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D56756]">
              Toàn bộ tính năng
            </p>
            <h2 className="mt-3 text-4xl font-bold text-slate-950">
              Tất cả những gì bạn cần, đã có sẵn
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
              Không cần ghép nhiều phần mềm. PetHub gộp tất cả vào một nơi, dễ
              dùng cho cả người không rành công nghệ.
            </p>
          </div>

          <div className="relative -mx-4 space-y-4 sm:space-y-5 lg:space-y-6">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f9f2e8] to-transparent sm:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f9f2e8] to-transparent sm:w-24" />
            <FeatureMarqueeRow items={firstFeatureRow} direction="right" />
            <FeatureMarqueeRow items={secondFeatureRow} direction="left" />
          </div>
        </div>
      </section>
      {/* ── 2. FEATURED CARD (Digital Pet Card - highlight) ─────── */}
      <section className="bg-white px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#80421C] to-[#D56756] p-10 text-white shadow-2xl lg:p-14">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-white">
                  <Star className="h-4 w-4" fill="currentColor" />
                  Tính năng độc quyền
                </span>
                <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                  Digital Pet Card — Thẻ thú cưng điện tử
                </h2>
                <p className="max-w-lg text-lg leading-8 text-white/85">
                  Mỗi thú cưng có một thẻ kỹ thuật số riêng với QR Code. Chủ vật
                  nuôi chỉ cần quét là xem ngay toàn bộ lịch sử y tế — tiêm
                  phòng, tẩy giun, khám bệnh.
                </p>
                <ul className="space-y-3">
                  {[
                    "QR Code riêng cho từng thú cưng",
                    "Chia sẻ với bác sĩ & cửa hàng khác",
                    "Nhắc lịch tái chủng tự động",
                    "Tăng tỷ lệ khách quay lại 3x",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle
                        className="h-5 w-5 shrink-0 text-white"
                        fill="rgba(255,255,255,0.25)"
                      />
                      <span className="text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mock card UI */}
              <div className="relative">
                <div className="absolute inset-4 rounded-[28px] bg-white/10 blur-xl" />
                <div className="relative rounded-[28px] border border-white/20 bg-white p-6 shadow-2xl">
                  <div className="flex items-center justify-between gap-4 rounded-[20px] bg-[#EDE9FE] px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#B45309] text-white">
                        <QrCode className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Mochi</p>
                        <p className="text-xs text-slate-500">
                          Pomeranian • 2 tuổi
                        </p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-[#7C3AED] shadow-sm">
                      QR
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    {[
                      {
                        label: "Tiêm phòng dại",
                        date: "10/03/2026",
                        status: "Đã tiêm",
                        ok: true,
                      },
                      {
                        label: "Tẩy giun",
                        date: "01/04/2026",
                        status: "Đã làm",
                        ok: true,
                      },
                      {
                        label: "Tái chủng tiếp theo",
                        date: "10/06/2026",
                        status: "Sắp tới",
                        ok: false,
                      },
                    ].map((row, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                      >
                        <span className="font-medium text-slate-700">
                          {row.label}
                        </span>
                        <div className="text-right">
                          <p
                            className={`text-xs font-bold ${row.ok ? "text-emerald-600" : "text-amber-500"}`}
                          >
                            {row.status}
                          </p>
                          <p className="text-xs text-slate-400">{row.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. COMPARISON TABLE ─────────────────────────────────── */}
      <section className="bg-white px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D56756]">
              So sánh
            </p>
            <h2 className="mt-3 text-4xl font-bold text-slate-950">
              PetHub vs. cách làm cũ
            </h2>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-slate-200 shadow-sm">
            {/* header */}
            <div className="grid grid-cols-3 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-700">
              <div>Tính năng</div>
              <div className="text-center text-[#D56756]">PetHub</div>
              <div className="text-center text-slate-400">
                Cách cũ (sổ / Excel)
              </div>
            </div>

            {[
              "Đặt lịch online 24/7",
              "Nhắc nhở tự động",
              "Hồ sơ thú cưng có QR",
              "Báo cáo doanh thu thời gian thực",
              "Gửi ưu đãi cá nhân hóa",
              "Quản lý nhiều chi nhánh",
              "Sao lưu dữ liệu tự động",
            ].map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 items-center px-6 py-4 text-sm ${
                  i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                }`}
              >
                <span className="font-medium text-slate-700">{row}</span>
                <div className="flex justify-center">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="flex justify-center">
                  <span className="text-xl text-slate-300">✕</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#B24C40] via-[#D56756] to-[#EFA29A] px-4 py-24 text-white">
        <div className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="container relative mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Trải nghiệm miễn phí 14 ngày
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/85">
            Không cần thẻ tín dụng. Không cần cài đặt phức tạp. Bắt đầu trong
            vài phút và thấy sự khác biệt ngay hôm nay.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/auth/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-[#D56756] shadow-lg transition hover:bg-[#F7E3DF]"
            >
              Bắt đầu miễn phí
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about-us"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/20"
            >
              Tìm hiểu thêm
            </Link>
          </div>

          <p className="mt-6 text-sm text-white/70">
            Không cần thẻ tín dụng · Hủy bất cứ lúc nào · Hỗ trợ 24/7
          </p>
        </div>
      </section>
    </div>
  );
};

export default Features;
