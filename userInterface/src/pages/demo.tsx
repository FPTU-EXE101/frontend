import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Users,
  PawPrint,
  TrendingUp,
  Clock,
  CheckCircle2,
  QrCode,
  Stethoscope,
  LayoutDashboard,
  Scissors,
  Heart,
  ChevronRight,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const stats = [
  { label: "Tổng thú cưng", value: "128", icon: PawPrint, color: "bg-[#fff1ee] text-[#D56756]" },
  { label: "Lịch hẹn hôm nay", value: "12", icon: CalendarDays, color: "bg-sky-50 text-sky-600" },
  { label: "Khách hàng", value: "86", icon: Users, color: "bg-emerald-50 text-emerald-600" },
  { label: "Doanh thu tháng", value: "24.5M₫", icon: TrendingUp, color: "bg-violet-50 text-violet-600" },
];

const pets = [
  { name: "Milo", breed: "Corgi", status: "Đang chăm sóc", statusColor: "bg-sky-100 text-sky-700", avatar: "🐕" },
  { name: "Miu", breed: "British Shorthair", status: "Lịch hẹn hôm nay", statusColor: "bg-amber-100 text-amber-700", avatar: "🐈" },
  { name: "Rocky", breed: "Poodle", status: "Đã hoàn tất", statusColor: "bg-emerald-100 text-emerald-700", avatar: "🐩" },
];

const bookings = [
  { time: "09:00", service: "Tắm grooming", pet: "Milo", icon: Scissors, color: "bg-sky-50 text-sky-600 border-sky-200" },
  { time: "10:30", service: "Khám sức khỏe", pet: "Miu", icon: Stethoscope, color: "bg-[#fff1ee] text-[#D56756] border-[#f3d3cd]" },
  { time: "14:00", service: "Cắt tỉa lông", pet: "Rocky", icon: Scissors, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: CalendarDays, label: "Lịch hẹn", active: false },
  { icon: PawPrint, label: "Thú cưng", active: false },
  { icon: Users, label: "Khách hàng", active: false },
];

// ─── Component ────────────────────────────────────────────────────────────────

const DemoPage = () => {
  return (
    <div className="min-h-screen bg-[#fffaf8] text-slate-950">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_0%,rgba(213,103,86,0.10),transparent_55%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#f3d3cd] bg-[#fff1ee] px-4 py-2 text-sm font-semibold text-[#D56756]">
            <PawPrint className="h-4 w-4" />
            Demo sản phẩm · PetHub
          </span>
          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Trải nghiệm cách PetHub
            <br />
            <span className="text-[#D56756]">quản lý cửa hàng thú cưng</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Xem nhanh quy trình quản lý thú cưng, lịch hẹn và hồ sơ chăm sóc
            chỉ trong một giao diện.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/auth/signup"
              className="inline-flex items-center gap-2 rounded-full bg-[#D56756] px-7 py-3.5 text-sm font-bold text-white shadow-[0_16px_42px_rgba(213,103,86,0.28)] transition hover:-translate-y-0.5 hover:bg-[#B24C40]"
            >
              Bắt đầu dùng thử
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </section>

      {/* ── Dashboard Preview ── */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D56756]">Dashboard</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">Tổng quan vận hành</h2>
          </div>

          {/* Dashboard frame */}
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
            <div className="flex">

              {/* Sidebar */}
              <aside className="hidden w-52 shrink-0 border-r border-slate-100 bg-slate-50 p-4 sm:block">
                <div className="mb-6 flex items-center gap-2 px-2 pt-1">
                  <img src="/logoPethub.png" alt="PetHub" className="h-8 w-auto object-contain" />
                </div>
                <nav className="space-y-1">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                          item.active
                            ? "bg-[#D56756] text-white shadow-sm"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </div>
                    );
                  })}
                </nav>
              </aside>

              {/* Main content */}
              <div className="flex-1 overflow-hidden p-5 sm:p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Thứ Bảy, 30 tháng 5, 2026</p>
                    <h3 className="text-xl font-black text-slate-950">Vận hành hôm nay</h3>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Live
                  </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={stat.label}
                        className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
                      >
                        <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${stat.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <p className="text-2xl font-black text-slate-950">{stat.value}</p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pet Management + Booking (2 col) ── */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Pet list */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D56756]">Quản lý thú cưng</p>
                  <h3 className="mt-1 text-xl font-black text-slate-950">Danh sách thú cưng</h3>
                </div>
                <button className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#D56756]/40 hover:text-[#D56756]">
                  Xem tất cả <ChevronRight className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-3">
                {pets.map((pet) => (
                  <div
                    key={pet.name}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1ee] text-2xl">
                        {pet.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-slate-950">{pet.name}</p>
                        <p className="text-xs text-slate-500">{pet.breed}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${pet.statusColor}`}>
                      {pet.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking timeline */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D56756]">Lịch hẹn</p>
                <h3 className="mt-1 text-xl font-black text-slate-950">Hôm nay · 30/05/2026</h3>
              </div>
              <div className="relative space-y-4 pl-6">
                <div className="absolute left-2 top-2 h-[calc(100%-1rem)] w-px bg-slate-200" />
                {bookings.map((booking) => {
                  const Icon = booking.icon;
                  return (
                    <div key={booking.time} className="relative flex items-start gap-4">
                      <div className="absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-[#D56756] bg-white" />
                      <div className={`flex items-center gap-3 flex-1 rounded-2xl border px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-sm ${booking.color}`}>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-950">{booking.service}</p>
                          <p className="text-xs text-slate-500">cho {booking.pet}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                          <Clock className="h-3 w-3" />
                          {booking.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Digital Pet Card ── */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D56756]">Digital Pet Card</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">Hồ sơ thú cưng điện tử</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Mỗi thú cưng có một thẻ riêng. Khách hàng quét QR là xem ngay lịch sử chăm sóc.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-sm overflow-hidden rounded-[32px] border border-[#f3d3cd] bg-white shadow-[0_24px_80px_rgba(213,103,86,0.14)]">
              {/* Card header */}
              <div className="bg-gradient-to-br from-[#D56756] to-[#B24C40] px-6 py-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur">
                      🐕
                    </div>
                    <div>
                      <p className="text-xl font-black">Milo</p>
                      <p className="text-sm text-white/75">Corgi · 2 tuổi</p>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                    <QrCode className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#fff8f5] p-3">
                    <p className="text-xs font-semibold text-slate-400">Chủ nuôi</p>
                    <p className="mt-1 font-bold text-slate-900">Nguyễn Văn A</p>
                  </div>
                  <div className="rounded-2xl bg-[#fff8f5] p-3">
                    <p className="text-xs font-semibold text-slate-400">Giống</p>
                    <p className="mt-1 font-bold text-slate-900">Corgi</p>
                  </div>
                  <div className="rounded-2xl bg-[#fff8f5] p-3">
                    <p className="text-xs font-semibold text-slate-400">Tuổi</p>
                    <p className="mt-1 font-bold text-slate-900">2 tuổi</p>
                  </div>
                  <div className="rounded-2xl bg-[#fff8f5] p-3">
                    <p className="text-xs font-semibold text-slate-400">Cân nặng</p>
                    <p className="mt-1 font-bold text-slate-900">12 kg</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-4">
                  {[
                    { label: "Tiêm phòng gần nhất", value: "15/02/2026", ok: true },
                    { label: "Tái chủng tiếp theo", value: "15/05/2026", ok: false },
                    { label: "Tẩy giun gần nhất", value: "01/04/2026", ok: true },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{row.label}</span>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className={`h-3.5 w-3.5 ${row.ok ? "text-emerald-500" : "text-amber-400"}`} />
                        <span className="font-semibold text-slate-800">{row.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* QR placeholder */}
                <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-[#f3d3cd] bg-[#fff8f5] py-5">
                  <div className="text-center">
                    <QrCode className="mx-auto h-10 w-10 text-[#D56756]" />
                    <p className="mt-2 text-xs font-semibold text-slate-400">QR Code · Quét để xem hồ sơ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-[32px] bg-gradient-to-br from-[#D56756] to-[#B24C40] p-10 text-center text-white shadow-[0_24px_80px_rgba(213,103,86,0.28)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <Heart className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Sẵn sàng dùng thử PetHub?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-white/80">
            Đăng ký miễn phí, không cần thẻ tín dụng. Bắt đầu quản lý cửa hàng thú cưng của bạn ngay hôm nay.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/auth/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#D56756] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Dùng thử miễn phí 14 ngày
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/25"
            >
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default DemoPage;
