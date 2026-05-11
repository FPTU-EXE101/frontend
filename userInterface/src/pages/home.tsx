import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Bell,
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

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#f5eadf] py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-[#EFB7AF] bg-[#F7E3DF] px-4 py-2 text-sm font-semibold text-[#D56756] shadow-sm">
                Giải pháp quản lý thú cưng toàn diện
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                  Quản lý Pet Shop & Phòng khám thú y
                </h1>
                <p className="text-5xl font-bold tracking-tight text-[#D56756] sm:text-6xl">
                  Dễ dàng hơn bao giờ hết
                </p>
                <p className="max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
                  PetHub giúp bạn quản lý khách hàng, lịch hẹn, hồ sơ thú cưng
                  và tăng doanh thu với Digital Pet Card - “vũ khí bí mật” giữ
                  chân khách hàng của bạn.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/auth/register"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#D56756] px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-[#B24C40] sm:w-auto"
                >
                  Dùng thử miễn phí 14 ngày
                </Link>
                <Link
                  to="/demo"
                  className="inline-flex w-full items-center justify-center rounded-full border border-[#D56756] bg-white px-6 py-3 text-base font-semibold text-[#D56756] transition hover:bg-[#F7E3DF] sm:w-auto"
                >
                  Xem Demo
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm">
                  <CheckCircle className="h-5 w-5 text-[#D56756]" />
                  <span className="text-sm font-medium text-slate-700">
                    Không cần thẻ tín dụng
                  </span>
                </div>
                <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm">
                  <CheckCircle className="h-5 w-5 text-[#D56756]" />
                  <span className="text-sm font-medium text-slate-700">
                    Hỗ trợ 24/7
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[32px] border border-[#F4D2CA] bg-white shadow-[0_24px_80px_rgba(213,103,86,0.22)]">
                <img
                  src="https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=80"
                  alt="Happy dog"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm">
                Tối ưu vận hành
              </div>
              <div className="absolute bottom-4 left-6 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm">
                Đồng hành cùng PetHub
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Mọi tính năng bạn cần, trong một hệ thống
            </h2>
            <p className="text-xl text-gray-600">
              PetHub được thiết kế đặc biệt cho Pet Shop & Phòng khám thú y, với
              đầy đủ tính năng từ A-Z
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                >
                  <div className="bg-[#D56756] w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#B24C40] via-[#D56756] to-[#EFA29A] px-4 py-20 text-white">
        <div className="absolute -right-32 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-3xl"></div>
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                <QrCode className="h-4 w-4 text-white" />
                Tính năng độc quyền
              </span>
              <div className="space-y-5">
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
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
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-medium text-white shadow-sm">
                  <Heart className="h-4 w-4 text-[#F1C2BA]" />
                  Tăng lòng trung thành
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-medium text-white shadow-sm">
                  <TrendingUp className="h-4 w-4 text-[#F1C2BA]" />
                  Tăng doanh thu
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-medium text-white shadow-sm">
                  <Bell className="h-4 w-4 text-[#F1C2BA]" />
                  Nhắc nhở tự động
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[32px] border border-white/10 bg-white/10"></div>
              <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between gap-4 rounded-[26px] bg-[#F7E3DF] px-4 py-4">
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

                <div className="mt-5 overflow-hidden rounded-[28px] bg-[#F7E3DF] p-6">
                  <div className="aspect-[4/3] rounded-[26px] bg-[#F2D0CA]">
                    <img
                      className="rounded-[28px]"
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

      {/* Pricing Section */}
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
};

export default Home;
