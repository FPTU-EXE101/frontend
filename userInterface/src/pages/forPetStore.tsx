import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CalendarX2,
  CheckCircle2,
  ClipboardX,
  Mail,
  PhoneCall,
  Sparkles,
  TrendingDown,
  UserX,
} from "lucide-react";

const BUSINESS_EMAIL = "pethub0103@gmail.com";
const MAILTO = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(
  "Đăng ký tài khoản doanh nghiệp PetHub",
)}&body=${encodeURIComponent(
  "Xin chào PetHub,\n\nTôi muốn mở tài khoản cho cửa hàng của mình.\n\n- Tên cửa hàng: \n- Địa chỉ: \n- Số điện thoại: \n- Loại hình (pet shop / phòng khám): \n\nMong được tư vấn. Cảm ơn!",
)}`;

// Nỗi đau khi vận hành mà KHÔNG có một nền tảng quản lý.
const painPoints = [
  {
    icon: UserX,
    title: "Khách đến một lần rồi… biến mất",
    description:
      "Không có cách nhắc tái khám, tái chủng hay chăm sóc sau dịch vụ — khách quên bạn, và quay lại tiệm khác.",
  },
  {
    icon: ClipboardX,
    title: "Sổ sách, giấy tờ chồng chất",
    description:
      "Thông tin khách, hồ sơ thú cưng, lịch hẹn nằm rải rác trên giấy và điện thoại — tra cứu chậm, dễ thất lạc.",
  },
  {
    icon: CalendarX2,
    title: "Quên lịch hẹn, lỡ hẹn với khách",
    description:
      "Lịch ghi tay dễ trùng, dễ sót. Một lần lỡ hẹn là một lần mất uy tín trong mắt khách hàng.",
  },
  {
    icon: TrendingDown,
    title: "Mù mờ về doanh thu",
    description:
      "Không biết dịch vụ nào ra tiền, tháng này hơn kém tháng trước ra sao — quyết định dựa trên cảm tính.",
  },
];

// Kết quả nhận được — nói về GIÁ TRỊ, không liệt kê tính năng.
const outcomes = [
  "Khách quay lại nhiều hơn nhờ được chăm sóc & nhắc lịch đúng lúc",
  "Tiết kiệm hàng giờ mỗi ngày vì mọi thứ gọn trong một nơi",
  "Hình ảnh chuyên nghiệp hơn trong mắt khách hàng",
  "Nắm rõ con số để ra quyết định kinh doanh tự tin hơn",
];

const steps = [
  {
    step: "01",
    title: "Gửi email liên hệ",
    description: "Cho chúng tôi biết đôi nét về cửa hàng của bạn.",
  },
  {
    step: "02",
    title: "PetHub tư vấn",
    description: "Đội ngũ PetHub liên hệ lại, tư vấn và xác minh thông tin.",
  },
  {
    step: "03",
    title: "Mở tài khoản",
    description: "Chúng tôi khởi tạo tài khoản quản lý riêng cho cửa hàng.",
  },
  {
    step: "04",
    title: "Bắt đầu vận hành",
    description: "Đăng nhập và đưa cửa hàng của bạn lên PetHub ngay.",
  },
];

const ForPetStore = () => {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fff1ec_0%,#fff8f3_100%)] px-4 py-24">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#EFB7AF]/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[#F4D2CA]/40 blur-3xl" />
        <Building2 className="pointer-events-none absolute right-[8%] top-24 hidden h-40 w-40 rotate-6 text-[#D56756]/10 lg:block" />

        <div className="container relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#EFB7AF] bg-white/80 px-4 py-2 text-sm font-semibold text-[#D56756] shadow-sm">
            <Sparkles className="h-4 w-4" />
            Dành cho chủ pet shop & phòng khám thú y
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Đưa cửa hàng của bạn{" "}
            <span className="text-[#D56756]">lên một tầm mới</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Mỗi ngày trôi qua mà không có hệ thống là một ngày bạn để khách hàng
            trượt khỏi tay. PetHub giúp cửa hàng của bạn giữ chân khách, vận hành
            gọn gàng và trông thật chuyên nghiệp — bắt đầu chỉ với một email.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={MAILTO}
              className="inline-flex items-center gap-2 rounded-full bg-[#D56756] px-8 py-4 text-base font-bold text-white shadow-[0_20px_50px_rgba(213,103,86,0.3)] transition hover:-translate-y-0.5 hover:bg-[#B24C40]"
            >
              <Mail className="h-5 w-5" />
              Liên hệ tạo tài khoản
            </a>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-[#D56756]/40 bg-white px-8 py-4 text-base font-semibold text-[#B24C40] transition hover:bg-[#F7E3DF]"
            >
              Xem bảng giá
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Không cần cài đặt phức tạp · PetHub phản hồi trong 24 giờ làm việc
          </p>
        </div>
      </section>

      {/* Pain points — nếu không dùng PetHub */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Vận hành theo cách cũ đang âm thầm{" "}
              <span className="text-[#D56756]">lấy đi lợi nhuận</span> của bạn
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Những vấn đề quen thuộc khi cửa hàng chưa có một nền tảng quản lý
              đúng nghĩa:
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {painPoints.map((pain) => {
              const Icon = pain.icon;
              return (
                <div
                  key={pain.title}
                  className="rounded-[24px] border border-rose-100 bg-rose-50/40 p-6 transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(190,18,60,0.08)]"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {pain.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {pain.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Outcomes — giá trị nhận được */}
      <section className="bg-[#f9f2e8] px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Với PetHub, bạn được{" "}
                <span className="text-[#D56756]">gì?</span>
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Không chỉ là một phần mềm — đó là cách để cửa hàng của bạn lớn
                lên một cách bền vững.
              </p>
              <ul className="mt-8 space-y-4">
                {outcomes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" />
                    <span className="text-base leading-7 text-slate-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[32px] border border-[#f0d8d0] bg-white p-8 shadow-[0_24px_70px_rgba(112,63,48,0.12)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D56756]">
                Cảm nhận của chủ cửa hàng
              </p>
              <blockquote className="mt-4 text-xl font-semibold leading-8 text-slate-900">
                “Từ ngày dùng PetHub, khách quay lại đều hơn hẳn và mình không
                còn phải lục sổ tìm thông tin từng con thú cưng nữa.”
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D56756] font-bold text-white">
                  P
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    Chủ một pet shop tại TP.HCM
                  </p>
                  <p className="text-sm text-slate-500">Đối tác PetHub</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding steps */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Bắt đầu chỉ với 4 bước
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Tài khoản doanh nghiệp được PetHub khởi tạo riêng để đảm bảo an
              toàn và đúng nhu cầu của bạn.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.step}
                className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="text-3xl font-black text-[#D56756]/30">
                  {step.step}
                </span>
                <h3 className="mt-3 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-24">
        <div className="container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#B24C40] via-[#D56756] to-[#EFA29A] p-10 text-center text-white shadow-2xl sm:p-14">
            <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Sẵn sàng đưa cửa hàng lên PetHub?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-white/90">
                Gửi cho chúng tôi một email — phần còn lại để PetHub lo. Càng bắt
                đầu sớm, bạn càng sớm giữ được nhiều khách hàng hơn.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href={MAILTO}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-[#B24C40] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#fff1ec]"
                >
                  <Mail className="h-5 w-5" />
                  {BUSINESS_EMAIL}
                </a>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-white/85">
                  <PhoneCall className="h-4 w-4" />
                  Phản hồi trong 24 giờ làm việc
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForPetStore;
