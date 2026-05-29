import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CalendarCheck,
  CheckCircle,
  Heart,
  QrCode,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Rocket,
  Stethoscope,
  File,
  CreditCard,
  PawPrint,
  ReceiptText,
  Sparkles,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Quản lý khách hàng thông minh",
    description:
      "Lưu trữ thông tin khách hàng & thú cưng chi tiết. Theo dõi lịch sử dịch vụ và tổng chi tiêu.",
  },
  {
    icon: Shield,
    title: "Lịch hẹn tự động",
    description:
      "Đặt lịch nhanh, nhắc nhở tự động qua SMS/Zalo. Không bao giờ bỏ lỡ khách hàng.",
  },
  {
    icon: QrCode,
    title: "Digital Pet Card",
    description:
      "Thẻ thú cưng điện tử với QR code. Khách hàng quét là thấy ngay lịch sử tiêm phòng, tẩy giun.",
  },
  {
    icon: Stethoscope,
    title: "Hồ sơ Y tế chi tiết",
    description:
      "Lưu trữ đầy đủ lịch sử khám bệnh, tiêm phòng, thuốc men. Timeline rõ ràng, dễ theo dõi.",
  },
  {
    icon: CreditCard,
    title: "POS thanh toán nhanh",
    description:
      "Tính tiền chuyên nghiệp, in hóa đơn ngay. Hỗ trợ nhiều hình thức thanh toán.",
  },
  {
    icon: Bell,
    title: "Nhắc nhở thông minh",
    description:
      "Tự động nhắc lịch tái chủng, sinh nhật thú cưng. Tăng tỷ lệ khách quay lại 3x.",
  },
  {
    icon: TrendingUp,
    title: "Báo cáo doanh thu",
    description:
      "Thống kê chi tiết doanh thu theo ngày/tháng. Phân tích xu hướng và tăng trưởng.",
  },
  {
    icon: Heart,
    title: "CRM giữ chân khách",
    description:
      "Chăm sóc khách hàng chu đáo. Gửi ưu đãi cá nhân hóa, xây dựng lòng trung thành.",
  },
  {
    icon: File,
    title: "Quản lý dịch vụ",
    description: "Danh mục dịch vụ linh hoạt. Cập nhật giá, combo dễ dàng.",
  },
];

const trustHighlights = [
  { value: "Booking", label: "Quản lý lịch hẹn rõ ràng" },
  { value: "Pet Card", label: "Hồ sơ thú cưng bằng QR" },
  { value: "POS", label: "Thanh toán và hóa đơn nhanh" },
];

const workflowSteps = [
  {
    icon: CalendarCheck,
    title: "Đặt lịch & tiếp nhận",
    description: "Tạo lịch hẹn, gắn khách hàng và thú cưng vào một luồng rõ ràng.",
  },
  {
    icon: Stethoscope,
    title: "Chăm sóc & ghi nhận",
    description: "Cập nhật hồ sơ y tế, dịch vụ đã dùng và nhắc lịch tái chăm sóc.",
  },
  {
    icon: ReceiptText,
    title: "Thanh toán & giữ chân",
    description: "Tạo hóa đơn, gửi nhắc nhở và duy trì trải nghiệm sau dịch vụ.",
  },
];

const careJourney = [
  {
    icon: CalendarCheck,
    label: "Lịch hẹn",
    title: "Tiếp nhận lịch hẹn rõ ràng",
    description:
      "Cửa hàng theo dõi lịch đặt, thời gian chăm sóc và ghi chú dịch vụ trong cùng một luồng.",
  },
  {
    icon: PawPrint,
    label: "Thú cưng",
    title: "Lưu hồ sơ thú cưng có ngữ cảnh",
    description:
      "Thông tin thú cưng, chủ nuôi và lịch sử chăm sóc được lưu lại để dễ tra cứu khi cần.",
  },
  {
    icon: Stethoscope,
    label: "Y tế",
    title: "Theo dõi hồ sơ khám và tiêm phòng",
    description:
      "Lịch sử khám bệnh, tiêm phòng, thuốc men và nhắc lịch được trình bày rõ ràng hơn.",
  },
  {
    icon: CreditCard,
    label: "Thanh toán",
    title: "Tính tiền và tạo hóa đơn tại POS",
    description:
      "Dịch vụ và sản phẩm được gom vào đơn hàng để thanh toán nhanh, chuyên nghiệp hơn.",
  },
  {
    icon: QrCode,
    label: "Pet Card",
    title: "Khách hàng quay lại bằng Digital Pet Card",
    description:
      "QR code giúp khách xem lại thông tin thú cưng và lịch sử chăm sóc thuận tiện hơn.",
  },
];

const storeValueCards = [
  {
    icon: File,
    title: "Giảm phụ thuộc giấy tờ",
    description:
      "Thông tin khách hàng, thú cưng, hồ sơ và dịch vụ được gom về hệ thống số.",
  },
  {
    icon: Bell,
    title: "Theo dõi lịch chăm sóc",
    description:
      "Lịch hẹn và nhắc lịch giúp cửa hàng chủ động hơn trong vận hành hằng ngày.",
  },
  {
    icon: Users,
    title: "Nhìn rõ khách hàng",
    description:
      "Dữ liệu khách hàng và thú cưng giúp đội ngũ chăm sóc cá nhân hóa hơn.",
  },
  {
    icon: ReceiptText,
    title: "Thanh toán gọn hơn",
    description:
      "POS hỗ trợ tính tiền dịch vụ, sản phẩm và in hóa đơn ngay tại cửa hàng.",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden px-4 py-20 text-white sm:py-24">
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/dog_car.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-slate-950/25" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(213,103,86,0.28),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(20,184,166,0.22),transparent_28%)]" />
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-slate-950/10 backdrop-blur">
                Giải pháp quản lý thú cưng toàn diện
              </div>

              <div className="space-y-6">
                <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
                  Quản lý Pet Shop & Phòng khám thú y
                </h1>
                <p className="bg-linear-to-r from-[#F7C5BD] via-white to-[#8FF1E5] bg-clip-text text-5xl font-black leading-none tracking-tight text-transparent drop-shadow-sm sm:text-7xl">
                  Dễ dàng hơn bao giờ hết
                </p>
                <p className="max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
                  PetHub giúp bạn quản lý khách hàng, lịch hẹn, hồ sơ thú cưng
                  và tăng doanh thu với Digital Pet Card - “vũ khí bí mật” giữ
                  chân khách hàng của bạn.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/auth/register"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#D56756] px-7 py-3.5 text-base font-bold text-white shadow-[0_18px_45px_rgba(213,103,86,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#B24C40] hover:shadow-[0_22px_60px_rgba(213,103,86,0.42)] sm:w-auto"
                >
                  Dùng thử miễn phí 14 ngày
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/demo"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/25 bg-white/15 px-7 py-3.5 text-base font-bold text-white shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#B24C40] sm:w-auto"
                >
                  Xem Demo
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/12 px-4 py-3 shadow-sm shadow-slate-950/10 backdrop-blur">
                  <CheckCircle className="h-5 w-5 text-[#F7C5BD]" />
                  <span className="text-sm font-medium text-white/90">
                    Không cần thẻ tín dụng
                  </span>
                </div>
                <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/12 px-4 py-3 shadow-sm shadow-slate-950/10 backdrop-blur">
                  <CheckCircle className="h-5 w-5 text-[#F7C5BD]" />
                  <span className="text-sm font-medium text-white/90">
                    Hỗ trợ 24/7
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-slate-200/70 bg-white px-4 py-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-4 md:grid-cols-3">
            {trustHighlights.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-slate-200 bg-slate-50/70 px-6 py-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
              >
                <p className="text-2xl font-black tracking-tight text-slate-950">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Journey Timeline */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fff8f5_100%)] px-4 py-20 sm:py-24">
        <div className="absolute left-1/2 top-24 hidden h-[calc(100%-12rem)] w-px -translate-x-1/2 bg-linear-to-b from-transparent via-[#D56756]/25 to-transparent lg:block" />
        <div className="container mx-auto max-w-6xl">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#D56756]">
              Hành trình chăm sóc thú cưng
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Từ lịch hẹn đầu tiên đến lần khách quay lại tiếp theo.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              PetHub kết nối các thao tác quen thuộc của cửa hàng thành một câu
              chuyện vận hành liền mạch hơn.
            </p>
          </div>

          <div className="space-y-6 lg:space-y-0">
            {careJourney.map((item, index) => {
              const Icon = item.icon;
              const alignRight = index % 2 === 1;

              return (
                <div
                  key={item.title}
                  className={`relative grid items-center gap-6 lg:grid-cols-[1fr_5rem_1fr] ${
                    index > 0 ? "lg:-mt-4" : ""
                  }`}
                >
                  <div className={alignRight ? "lg:col-start-3" : ""}>
                    <div className="group rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 transition duration-300 hover:-translate-y-1 hover:border-[#D56756]/30 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
                      <div className="flex items-start gap-4">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fff1ee] text-[#D56756] ring-1 ring-[#f3d3cd] transition group-hover:bg-[#D56756] group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                            {item.label}
                          </span>
                          <h3 className="mt-3 text-xl font-black text-slate-950">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-slate-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative hidden lg:col-start-2 lg:flex lg:justify-center">
                    <div className="grid h-12 w-12 place-items-center rounded-full border border-[#f3d3cd] bg-white text-sm font-black text-[#D56756] shadow-lg shadow-[#D56756]/10">
                      {index + 1}
                    </div>
                  </div>

                  <div className="hidden lg:block" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-4 py-20 sm:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-[#D56756]">
              Nền tảng quản lý toàn diện
            </p>
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Mọi tính năng bạn cần, trong một hệ thống
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              PetHub được thiết kế đặc biệt cho Pet Shop & Phòng khám thú y, với
              đầy đủ tính năng từ A-Z
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group rounded-[28px] border border-slate-200/80 bg-white p-7 shadow-sm shadow-slate-200/70 transition duration-300 hover:-translate-y-1 hover:border-[#D56756]/30 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1ee] text-[#D56756] ring-1 ring-[#f3d3cd] transition duration-300 group-hover:scale-105 group-hover:bg-[#D56756] group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold tracking-tight text-slate-950">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Workflow Section */}
      <section className="bg-slate-950 px-4 py-20 text-white sm:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white/90">
                <Sparkles className="h-4 w-4 text-[#F1C2BA]" />
                Product workflow
              </div>
              <h2 className="mt-6 max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                Một luồng vận hành mượt từ lịch hẹn đến chăm sóc lại.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/65">
                PetHub gom dữ liệu khách hàng, thú cưng, dịch vụ, hồ sơ và thanh
                toán vào cùng một trải nghiệm để đội ngũ vận hành ít thao tác hơn.
              </p>

              <div className="mt-8 space-y-4">
                {workflowSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className="group flex gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/20 hover:bg-white/[0.07]"
                    >
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-white/10 transition group-hover:bg-[#D56756]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
                          Bước {index + 1}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-white">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-white/60">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[34px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur">
              <div className="rounded-[28px] bg-white p-5 text-slate-950">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      PetHub Dashboard
                    </p>
                    <h3 className="mt-1 text-2xl font-black">Vận hành hôm nay</h3>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    Live
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ["18", "Lịch hẹn"],
                    ["42", "Khách hàng"],
                    ["7.8M", "Doanh thu"],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="text-2xl font-black text-slate-950">
                        {value}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-bold text-slate-950">Lịch sắp tới</p>
                    <span className="text-xs font-bold text-[#D56756]">
                      Xem tất cả
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      ["Milo", "Khám tổng quát", "09:30"],
                      ["Bông", "Tắm + cắt tỉa", "10:45"],
                      ["Lucky", "Tiêm phòng", "14:00"],
                    ].map(([name, service, time]) => (
                      <div
                        key={name}
                        className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#fff1ee] text-[#D56756]">
                            <PawPrint className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-950">{name}</p>
                            <p className="text-xs font-medium text-slate-500">
                              {service}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-slate-600">
                          {time}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Value Bento */}
      <section className="bg-white px-4 py-20 sm:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#D56756]">
                PetHub giúp gì cho cửa hàng
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Ít rời rạc hơn, nhiều ngữ cảnh hơn trong mỗi lần chăm sóc.
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-slate-600">
              Những việc cửa hàng đang làm hằng ngày được sắp xếp lại thành các
              màn hình dễ theo dõi hơn.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-4">
            <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-slate-950 p-7 text-white shadow-[0_28px_80px_rgba(15,23,42,0.16)] lg:col-span-2 lg:row-span-2">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(213,103,86,0.35),transparent_32%)]" />
              <div className="relative">
                <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
                  Digital workspace
                </div>
                <h3 className="mt-5 text-3xl font-black tracking-tight">
                  Quản lý khách hàng, thú cưng và lịch sử chăm sóc trong một nơi.
                </h3>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/65">
                  Từ hồ sơ thú cưng, lịch hẹn, dịch vụ đến thanh toán, PetHub giúp
                  đội ngũ có thêm ngữ cảnh trước mỗi lần phục vụ.
                </p>

                <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#D56756]">
                        <PawPrint className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold">Hồ sơ thú cưng</p>
                        <p className="text-xs text-white/55">
                          Lịch sử dịch vụ, tiêm phòng, ghi chú
                        </p>
                      </div>
                    </div>
                    <QrCode className="h-5 w-5 text-white/60" />
                  </div>
                </div>
              </div>
            </div>

            {storeValueCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 transition duration-300 hover:-translate-y-1 hover:border-[#D56756]/30 hover:shadow-[0_20px_60px_rgba(15,23,42,0.09)]"
                >
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#fff1ee] text-[#D56756] ring-1 ring-[#f3d3cd] transition group-hover:bg-[#D56756] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-950">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#7c2419_0%,#B24C40_42%,#D56756_100%)] px-4 py-20 text-white sm:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] opacity-30 [background-size:52px_52px]"></div>
        <div className="container mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur">
                <QrCode className="h-4 w-4 text-white" />
                Tính năng độc quyền
              </span>
              <div className="space-y-5">
                <h2 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                  Digital Pet Card - Vũ khí bí mật giữ chân khách hàng
                </h2>
                <p className="max-w-xl text-base leading-8 text-white/85 sm:text-lg">
                  Mỗi thú cưng sẽ có một thẻ điện tử riêng với QR Code. Khách
                  hàng chỉ cần quét là xem ngay lịch sử tiêm phòng, tẩy giun,
                  khám bệnh. Chuyên nghiệp, tiện lợi, và quan trọng nhất - khách
                  sẽ luôn nhớ đến shop bạn!
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur">
                  <Heart className="h-4 w-4 text-[#F1C2BA]" />
                  Tăng lòng trung thành
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur">
                  <TrendingUp className="h-4 w-4 text-[#F1C2BA]" />
                  Tăng doanh thu
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur">
                  <Bell className="h-4 w-4 text-[#F1C2BA]" />
                  Nhắc nhở tự động
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/95 p-6 shadow-[0_35px_100px_rgba(0,0,0,0.25)] backdrop-blur">
                <div className="flex items-center justify-between gap-4 rounded-[26px] bg-[#fff1ee] px-4 py-4 ring-1 ring-[#f3d3cd]">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-3xl bg-[#D56756] text-white">
                      <QrCode className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-950">
                        Buddy
                      </p>
                      <p className="text-xs text-slate-500">Golden Retriever</p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                    QR Code
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-[28px] bg-[#fff1ee] p-5 ring-1 ring-[#f3d3cd]">
                  <div className="aspect-[4/3] overflow-hidden rounded-[26px] bg-[#F2D0CA]">
                    <img
                      className="h-full w-full rounded-[26px] object-cover"
                      src="https://images.ctfassets.net/nx3pzsky0bc9/1fEtKqdrdowlwjnwdVEd1R/0246ea0fc7e61c2a4d56c59d3910c603/Untitled_design-40.jpg?q=65&w=804"
                      alt=""
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between border-t border-slate-200/80 pt-4">
                    <span>Tiêm phòng gần nhất</span>
                    <span className="font-semibold text-[#D56756]">
                      15/02/2026
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200/80 pt-4">
                    <span>Tái chủng tiếp theo</span>
                    <span className="font-semibold text-[#D56756]">
                      15/05/2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="bg-white px-4 py-20 sm:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#fff7f2,#ffffff)] p-8 shadow-sm">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D56756]">
                    Pet care experience
                  </p>
                  <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    Trải nghiệm đủ thân thiện cho khách hàng, đủ mạnh cho đội vận hành.
                  </h2>
                </div>
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#D56756] text-white shadow-lg shadow-[#D56756]/25">
                  <Heart className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  ["Booking", "Khách đặt lịch nhanh, đội ngũ nắm rõ lịch trong ngày."],
                  ["Pet Card", "Mỗi thú cưng có hồ sơ riêng, dễ tra cứu bằng QR."],
                  ["CRM", "Nhắc lịch và chăm sóc lại đúng thời điểm."],
                ].map(([title, description]) => (
                  <div
                    key={title}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <p className="text-lg font-black text-slate-950">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.20)]">
              <div className="flex items-center gap-1 text-[#F7C5BD]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="mt-8 text-2xl font-black leading-snug">
                “PetHub giúp cửa hàng kiểm soát lịch hẹn, hồ sơ thú cưng và thanh
                toán trong một màn hình gọn gàng hơn rất nhiều.”
              </p>
              <div className="mt-8 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">Đội ngũ vận hành Pet Shop</p>
                  <p className="text-sm text-white/55">
                    Quản lý khách hàng & chăm sóc định kỳ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-[linear-gradient(180deg,#fff7f2_0%,#ffffff_100%)] px-4 py-20 sm:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D56756]">
              Bảng giá minh bạch
            </p>
            <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
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
            <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
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

            <div className="relative rounded-[30px] border border-[#E9B0A7] bg-white p-8 shadow-[0_30px_90px_rgba(213,103,86,0.18)] transition duration-300 hover:-translate-y-1">
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
};

export default Home;
