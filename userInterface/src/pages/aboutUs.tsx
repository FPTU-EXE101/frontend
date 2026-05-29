import { Link } from "react-router-dom";
import {
  Shield,
  Heart,
  Sparkles,
  Target,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Quote,
} from "lucide-react";

/* ─── DATA ──────────────────────────────────────────────────────────── */

const coreValues = [
  {
    icon: Shield,
    title: "Vận hành chuẩn hóa",
    description:
      "Từ tiếp nhận khách, đặt lịch, chăm sóc đến thanh toán đều theo một luồng rõ ràng và dễ kiểm soát.",
  },
  {
    icon: Heart,
    title: "Giữ chân khách hàng",
    description:
      "Nhắc lịch thông minh, dữ liệu khách hàng tập trung và trải nghiệm liền mạch giúp khách quay lại đều đặn hơn.",
  },
  {
    icon: Sparkles,
    title: "Sẵn sàng mở rộng",
    description:
      "Phù hợp cho cả cửa hàng đơn lẻ lẫn mô hình nhiều chi nhánh, giữ chuẩn dịch vụ đồng nhất khi tăng trưởng.",
  },
];

const stats = [
  { value: "500+", label: "Cửa hàng tin dùng" },
  { value: "50.000+", label: "Thú cưng được quản lý" },
  { value: "98%", label: "Khách hàng hài lòng" },
  { value: "3x", label: "Tỷ lệ khách quay lại" },
];

const teamMembers = [
  {
    name: "Nguyễn Gia Huy",
    role: "Front-End Developer",
    avatar: "/teamMemberAvt/teachLead.png",
    color: "#D56756",
    quote: "Mỗi thú cưng đều xứng đáng được chăm sóc tốt nhất.",
  },
  {
    name: "Nguyễn Đức Huy",
    role: "Back-End Developer",
    avatar: "/teamMemberAvt/be-dev1.png",
    color: "#B24C40",
    quote: "Công nghệ đơn giản nhất là công nghệ mà ai cũng dùng được.",
  },
  {
    name: "Dương Tuấn Kiệt",
    role: "Back-End Developer",
    avatar: "/teamMemberAvt/be-dev2.png",
    color: "#9B3A2F",
    quote: "Sản phẩm tốt là sản phẩm giải quyết đúng vấn đề thực tế.",
  },
  {
    name: "Dương Thị Thảo Quyên ",
    role: "UI/UX Designer",
    avatar: "/teamMemberAvt/UX.png",
    color: "#6F3D36",
    quote: "Thấu hiểu khách hàng là chìa khóa thành công.",
  },
  {
    name: "Nguyễn Thị Mai Phương",
    role: "Head Of Product / Marketing Specialist",
    avatar: "/teamMemberAvt/HeadProduct.png",
    color: "#6F3D36",
    quote: "Phát triển bền vững vì cộng đồng.",
  },

  {
    name: "Nguyễn Ngọc Ánh",
    role: "Marketing Specialist",
    avatar: "/teamMemberAvt/MC.png",
    color: "#6F3D36",
    quote: "Làm việc hiệu quả - tận hưởng cuộc sống",
  },
];

const milestones = [
  {
    year: "1/2026",
    title: "Khởi đầu hành trình",
    description:
      "PetHub được thành lập với mong muốn giúp các cửa hàng thú cưng Việt Nam vận hành chuyên nghiệp hơn.",
  },
  {
    year: "3/2026",
    title: "Ra mắt phiên bản Beta",
    description:
      "Phiên bản đầu tiên với tính năng quản lý lịch hẹn và hồ sơ thú cưng được 20 cửa hàng đón nhận.",
  },
  {
    year: "4/2026",
    title: "Digital Pet Card",
    description:
      "Ra mắt tính năng độc quyền Digital Pet Card với QR Code, tăng tỷ lệ khách quay lại lên 3x.",
  },
  {
    year: "6/2026",
    title: "Mở rộng toàn quốc",
    description:
      "Phục vụ hơn 500 cửa hàng trên khắp Việt Nam với hệ sinh thái quản lý toàn diện từ A-Z.",
  },
];

/* ─── COMPONENT ─────────────────────────────────────────────────────── */

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f5eadf] px-4 py-24">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#EFB7AF]/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#F4D2CA]/40 blur-3xl" />

        <div className="container relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#EFB7AF] bg-[#F7E3DF] px-4 py-2 text-sm font-semibold text-[#D56756] shadow-sm">
              <Target className="h-4 w-4" />
              Về chúng tôi
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">
              Được xây dựng vì <span className="text-[#D56756]">thú cưng</span>{" "}
              và <span className="text-[#D56756]">người yêu chúng</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              PetHub được xây dựng để giúp chủ pet clinic và pet store vận hành
              tự tin hơn mỗi ngày: lịch hẹn rõ ràng, chăm sóc khách hàng nhất
              quán và tăng trưởng doanh thu dựa trên dữ liệu thực tế.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/auth/register"
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
        </div>
      </section>
      {/* ── 6. TEAM ─────────────────────────────────────────────── */}
      <section className="bg-[#f9f2e8] px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D56756]">
              Đội ngũ sáng lập
            </p>
            <h2 className="mt-3 text-4xl font-bold text-slate-950">
              Những người đứng sau PetHub
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="group rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(213,103,86,0.12)]"
              >
                {/* avatar */}
                <img
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white shadow-lg"
                  style={{ backgroundColor: member.color }}
                  src={member.avatar}
                  alt={member.name}
                />

                <div className="mt-5 text-center">
                  <h3 className="text-lg font-bold text-slate-900">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-[#D56756]">
                    {member.role}
                  </p>
                </div>

                <div className="mt-5 rounded-2xl bg-[#F7E3DF] p-4">
                  <Quote className="mb-2 h-4 w-4 text-[#D56756]" />
                  <p className="text-sm italic leading-6 text-slate-700">
                    "{member.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── 2. CORE VALUES (từ ảnh mockup) ─────────────────────── */}
      <section className="bg-white px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D56756]">
              Giá trị cốt lõi
            </p>
            <h2 className="mt-3 text-4xl font-bold text-slate-950">
              Tại sao chọn PetHub?
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {coreValues.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="group rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#EFB7AF] hover:shadow-[0_16px_48px_rgba(213,103,86,0.12)]"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7E3DF] text-[#D56756] transition-colors group-hover:bg-[#F2D0CA]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. STATS BANNER ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#B24C40] via-[#D56756] to-[#EFA29A] px-4 py-16 text-white">
        <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="container relative mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-bold tracking-tight">{s.value}</p>
                <p className="mt-2 text-sm font-medium text-white/80">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. OUR STORY / MISSION ──────────────────────────────── */}
      <section className="bg-[#f9f2e8] px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* text */}
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D56756]">
                Câu chuyện của chúng tôi
              </p>
              <h2 className="text-4xl font-bold leading-tight text-slate-950">
                Chúng tôi hiểu bạn — vì chúng tôi từng ở vị trí đó
              </h2>
              <div className="space-y-4 text-slate-600 leading-8">
                <p>
                  Nhóm sáng lập PetHub bắt đầu từ việc quan sát các chủ pet
                  store và phòng khám thú y vật lộn với sổ sách, cuộc gọi nhắc
                  lịch thủ công và hồ sơ bệnh án giấy chồng chất.
                </p>
                <p>
                  Chúng tôi nhận ra: ngành thú cưng đang tăng trưởng mạnh mẽ,
                  nhưng công cụ quản lý thì vẫn còn rất lạc hậu. Đó là lý do
                  PetHub ra đời — một nền tảng được thiết kế riêng cho người
                  Việt, giải quyết đúng vấn đề thực tế của ngành.
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  "Không cần kỹ năng IT, bất kỳ ai cũng dùng được",
                  "Hỗ trợ người Việt, hiểu văn hóa kinh doanh Việt",
                  "Cập nhật liên tục theo phản hồi của cộng đồng",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#D56756]" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* visual card */}
            <div className="relative">
              <div className="absolute inset-4 rounded-[32px] bg-[#EFB7AF]/20 blur-xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-[#F4D2CA] bg-white p-8 shadow-[0_24px_80px_rgba(213,103,86,0.15)]">
                <div className="flex items-center gap-3 rounded-2xl bg-[#F7E3DF] px-5 py-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#D56756] text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Cộng đồng PetHub</p>
                    <p className="text-sm text-slate-500">
                      500+ cửa hàng đang dùng
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    {
                      label: "Khách hàng mới / tháng",
                      value: "+127",
                      trend: "up",
                    },
                    {
                      label: "Tỷ lệ lịch hẹn thành công",
                      value: "94%",
                      trend: "up",
                    },
                    {
                      label: "Doanh thu tháng này",
                      value: "32.4M ₫",
                      trend: "up",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm"
                    >
                      <span className="text-slate-600">{row.label}</span>
                      <span className="flex items-center gap-1 font-bold text-[#D56756]">
                        <TrendingUp className="h-4 w-4" />
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#D56756] to-[#EFA29A] p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
                    Sứ mệnh
                  </p>
                  <p className="mt-2 font-semibold leading-7">
                    "Mọi cửa hàng thú cưng đều có thể vận hành chuyên nghiệp —
                    dù lớn hay nhỏ."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. TIMELINE / MILESTONES ────────────────────────────── */}
      <section className="bg-white px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D56756]">
              Hành trình phát triển
            </p>
            <h2 className="mt-3 text-4xl font-bold text-slate-950">
              Từng bước vì ngành thú cưng Việt
            </h2>
          </div>

          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-6 top-0 h-full w-px bg-[#F4D2CA] sm:left-1/2" />

            <div className="space-y-12">
              {milestones.map((m, i) => (
                <div
                  key={i}
                  className={`relative flex gap-8 sm:items-center ${
                    i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* dot */}
                  <div className="absolute left-6 top-2 z-10 sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2">
                    <div className="h-4 w-4 rounded-full border-4 border-[#D56756] bg-white shadow-md" />
                  </div>

                  {/* year badge */}
                  <div
                    className={`hidden w-[calc(50%-2rem)] sm:flex ${
                      i % 2 === 0 ? "justify-end pr-8" : "justify-start pl-8"
                    }`}
                  >
                    <span className="rounded-full bg-[#F7E3DF] px-4 py-2 text-sm font-bold text-[#D56756]">
                      {m.year}
                    </span>
                  </div>

                  {/* card */}
                  <div className="ml-16 w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:ml-0 sm:w-[calc(50%-2rem)]">
                    <span className="mb-2 inline-block rounded-full bg-[#F7E3DF] px-3 py-1 text-xs font-bold text-[#D56756] sm:hidden">
                      {m.year}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      {m.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#B24C40] via-[#D56756] to-[#EFA29A] px-4 py-24 text-white">
        <div className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="container relative mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Sẵn sàng nâng cấp cửa hàng của bạn?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/85 leading-8">
            Tham gia cùng hơn 500 cửa hàng đang sử dụng PetHub để vận hành
            chuyên nghiệp và phát triển bền vững.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-[#D56756] shadow-lg transition hover:bg-[#F7E3DF]"
            >
              Dùng thử miễn phí 14 ngày
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/20"
            >
              Xem bảng giá
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

export default AboutUs;
