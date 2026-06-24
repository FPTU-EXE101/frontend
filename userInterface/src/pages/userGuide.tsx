import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarClock,
  CreditCard,
  FileText,
  LayoutDashboard,
  LightbulbIcon,
  LogIn,
  Mail,
  PawPrint,
  Stethoscope,
  Store,
  UserPlus,
  UserRound,
  UserRoundCog,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─── DATA ──────────────────────────────────────────────────────────── */

type GuideStep = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type GuideNote = {
  mistake: string;
  fix: string;
};

const customerSteps: GuideStep[] = [
  {
    icon: Store,
    title: "1. Chọn phòng khám",
    description:
      "Vào mục “Phòng khám”, tìm và chọn phòng khám thú y đối tác mà bạn muốn sử dụng. Mọi lịch hẹn, thú cưng và hóa đơn sẽ gắn với phòng khám này.",
  },
  {
    icon: UserPlus,
    title: "2. Tạo tài khoản",
    description:
      "Bấm “Tạo tài khoản”, điền họ tên, email và mật khẩu. Nếu bạn đã có tài khoản ở phòng khám khác, hãy dùng “Thêm tài khoản vào cửa hàng mới” ở trang đăng nhập.",
  },
  {
    icon: Mail,
    title: "3. Xác nhận email",
    description:
      "Mở email được gửi tới và bấm vào liên kết xác nhận. Sau khi xác nhận thành công, bạn có thể đăng nhập vào hệ thống.",
  },
  {
    icon: LogIn,
    title: "4. Đăng nhập",
    description:
      "Chọn loại tài khoản “Customer”, chọn đúng phòng khám, nhập email và mật khẩu để đăng nhập.",
  },
  {
    icon: PawPrint,
    title: "5. Thêm thú cưng",
    description:
      "Vào mục “Thú cưng” để thêm hồ sơ thú cưng của bạn: tên, giống loài, màu sắc và ngày sinh.",
  },
  {
    icon: CalendarClock,
    title: "6. Đặt lịch hẹn",
    description:
      "Vào mục “Lịch hẹn” để đặt lịch khám cho thú cưng. Chọn ngày, giờ và ghi chú nếu cần. Bạn sẽ nhận được nhắc nhở tự động.",
  },
  {
    icon: Stethoscope,
    title: "7. Xem dịch vụ & hồ sơ y tế",
    description:
      "Khám phá các dịch vụ của phòng khám trong mục “Dịch vụ” và theo dõi lịch sử khám bệnh của thú cưng.",
  },
  {
    icon: FileText,
    title: "8. Theo dõi hóa đơn",
    description:
      "Vào mục “Hóa đơn” để xem chi tiết các giao dịch, dịch vụ đã sử dụng và trạng thái thanh toán.",
  },
];

const managerSteps: GuideStep[] = [
  {
    icon: LogIn,
    title: "1. Đăng nhập Manager",
    description:
      "Tài khoản Manager do quản trị viên tạo và gửi qua email. Ở trang đăng nhập, chọn loại tài khoản “Manager”, để trống phòng khám, nhập email và mật khẩu được cấp.",
  },
  {
    icon: LayoutDashboard,
    title: "2. Tổng quan Dashboard",
    description:
      "Sau khi đăng nhập, bạn vào Dashboard để xem nhanh doanh thu, lịch hẹn, hóa đơn và các chỉ số vận hành của phòng khám.",
  },
  {
    icon: Users,
    title: "3. Quản lý khách hàng & thú cưng",
    description:
      "Trong mục “Khách hàng” và “Thú cưng”, xem danh sách, thêm thú cưng mới và quản lý hồ sơ chi tiết của từng khách.",
  },
  {
    icon: Stethoscope,
    title: "4. Hồ sơ y tế",
    description:
      "Tạo và cập nhật hồ sơ y tế cho từng thú cưng: chẩn đoán, điều trị, đơn thuốc và ghi chú khám bệnh.",
  },
  {
    icon: CalendarClock,
    title: "5. Quản lý lịch hẹn",
    description:
      "Vào mục “Lịch hẹn” để xem, xác nhận hoặc cập nhật trạng thái các lịch hẹn của khách hàng.",
  },
  {
    icon: Store,
    title: "6. Dịch vụ & sản phẩm",
    description:
      "Quản lý danh mục dịch vụ và sản phẩm: thêm mới, chỉnh sửa giá và phân loại để khách hàng dễ lựa chọn.",
  },
  {
    icon: CreditCard,
    title: "7. Thanh toán & hóa đơn",
    description:
      "Tạo hóa đơn, xử lý thanh toán và theo dõi trạng thái giao dịch trong mục “Hóa đơn” và “Thanh toán”.",
  },
  {
    icon: LayoutDashboard,
    title: "8. Tự động hóa & cài đặt",
    description:
      "Thiết lập nhắc nhở tự động cho khách hàng và tùy chỉnh thông tin phòng khám trong mục “Tự động hóa” và “Cài đặt”.",
  },
];

const customerNotes: GuideNote[] = [
  {
    mistake: "Đăng ký/đăng nhập mà chưa chọn phòng khám.",
    fix: "Luôn vào mục “Phòng khám” và chọn đúng phòng khám trước. Dữ liệu của bạn gắn với từng phòng khám, chọn sai sẽ không thấy thú cưng, lịch hẹn hay hóa đơn.",
  },
  {
    mistake: "Đăng nhập ngay sau khi đăng ký nhưng chưa xác nhận email.",
    fix: "Hãy mở email và bấm liên kết xác nhận trước. Tài khoản chưa xác nhận sẽ bị từ chối đăng nhập.",
  },
  {
    mistake: "Đăng ký mới nhưng báo “Email đã tồn tại”.",
    fix: "Email của bạn đã có tài khoản. Nếu muốn dùng thêm phòng khám khác, dùng “Thêm tài khoản vào cửa hàng mới” ở trang đăng nhập thay vì tạo tài khoản mới.",
  },
  {
    mistake: "Thêm tài khoản vào cửa hàng mới nhưng báo “Sai mật khẩu”.",
    fix: "Hãy nhập đúng mật khẩu của lần đăng ký đầu tiên — đây là mật khẩu chung cho mọi phòng khám của bạn.",
  },
  {
    mistake: "Tham gia cửa hàng nhưng báo “Tài khoản không tồn tại”.",
    fix: "Email này chưa có tài khoản nào. Hãy bấm “Đăng ký mới” để tạo tài khoản trước.",
  },
  {
    mistake: "Đăng nhập đúng nhưng không thấy thú cưng/lịch hẹn của mình.",
    fix: "Có thể bạn đang đăng nhập nhầm phòng khám. Đăng xuất và chọn lại đúng phòng khám đã tạo dữ liệu.",
  },
];

const managerNotes: GuideNote[] = [
  {
    mistake: "Chọn loại tài khoản “Customer” khi đăng nhập Manager.",
    fix: "Ở trang đăng nhập, hãy chọn loại tài khoản “Manager” và để trống phần phòng khám.",
  },
  {
    mistake: "Cố chọn một phòng khám khi đăng nhập Manager.",
    fix: "Mỗi Manager chỉ gắn với một phòng khám duy nhất. Không cần và không nên chọn phòng khám khi đăng nhập.",
  },
  {
    mistake: "Tự đăng ký tài khoản Manager.",
    fix: "Tài khoản Manager do quản trị viên tạo và gửi qua email. Hãy dùng đúng email và mật khẩu được cấp.",
  },
  {
    mistake: "Dùng email Manager để tạo thêm phòng khám khác.",
    fix: "Một email Manager chỉ tạo được một phòng khám. Chỉ tài khoản khách hàng mới tham gia được nhiều phòng khám.",
  },
  {
    mistake: "Tạo hồ sơ y tế hoặc hóa đơn nhưng chưa chọn đúng thú cưng/khách hàng.",
    fix: "Kiểm tra kỹ thông tin khách hàng và thú cưng trước khi lưu để tránh gắn nhầm dữ liệu.",
  },
];

type RoleKey = "customer" | "manager";

const roleTabs: {
  key: RoleKey;
  label: string;
  icon: LucideIcon;
  steps: GuideStep[];
  notes: GuideNote[];
}[] = [
  {
    key: "customer",
    label: "Khách hàng",
    icon: UserRound,
    steps: customerSteps,
    notes: customerNotes,
  },
  {
    key: "manager",
    label: "Quản lý phòng khám",
    icon: UserRoundCog,
    steps: managerSteps,
    notes: managerNotes,
  },
];

/* ─── COMPONENT ─────────────────────────────────────────────────────── */

const StepCard = ({ step }: { step: GuideStep }) => {
  const Icon = step.icon;

  return (
    <div className="group relative rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D56756]/35 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7E3DF] text-[#D56756] transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-900">{step.title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-500">
        {step.description}
      </p>
    </div>
  );
};

const UserGuide = () => {
  const [activeRole, setActiveRole] = useState<RoleKey>("customer");
  const activeTab =
    roleTabs.find((tab) => tab.key === activeRole) ?? roleTabs[0];

  return (
    <div className="min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f5eadf] px-4 py-24">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#EFB7AF]/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#F4D2CA]/40 blur-3xl" />

        <div className="container relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#EFB7AF] bg-[#F7E3DF] px-4 py-2 text-sm font-semibold text-[#D56756] shadow-sm">
            <BookOpen className="h-4 w-4" />
            Hướng dẫn sử dụng
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">
            Bắt đầu với <span className="text-[#D56756]">PetHub</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Hướng dẫn từng bước dành cho khách hàng và phòng khám đối tác. Chọn
            vai trò của bạn bên dưới để xem các bước sử dụng phù hợp.
          </p>
        </div>
      </section>

      {/* ── ROLE TABS + STEPS ────────────────────────────────────── */}
      <section className="bg-[#fff8f3] px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          {/* Tabs */}
          <div className="mx-auto mb-12 flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm">
            {roleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.key === activeRole;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveRole(tab.key)}
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition sm:px-6 sm:py-3",
                    isActive
                      ? "bg-[#D56756] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Steps grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeTab.steps.map((step) => (
              <StepCard key={step.title} step={step} />
            ))}
          </div>

          {/* Common mistakes / notes */}
          <div className="mt-16">
            <div className="mb-8 flex items-center justify-center gap-2 text-center">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="text-2xl font-bold text-slate-950">
                Lưu ý khi làm sai
              </h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {activeTab.notes.map((note) => (
                <div
                  key={note.mistake}
                  className="rounded-[20px] border border-amber-200 bg-amber-50/70 p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-slate-900">
                      {note.mistake}
                    </p>
                  </div>
                  <div className="mt-3 flex items-start gap-3 rounded-[14px] bg-white px-4 py-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F7E3DF] text-[#D56756]">
                      <LightbulbIcon className="h-4 w-4" />
                    </span>
                    <p className="text-sm leading-7 text-slate-600">
                      {note.fix}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#B24C40] via-[#D56756] to-[#EFA29A] px-4 py-24 text-white">
        <div className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="container relative mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/85">
            Chọn phòng khám đối tác và tạo tài khoản để trải nghiệm PetHub ngay
            hôm nay.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/stores"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-[#D56756] shadow-lg transition hover:bg-[#F7E3DF]"
            >
              Tìm phòng khám
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/20"
            >
              Xem tính năng
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserGuide;
