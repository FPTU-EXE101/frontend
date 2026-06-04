import { CalendarCheck, CreditCard, HelpCircle, Mail, PawPrint } from "lucide-react";

const helpTopics = [
  {
    icon: PawPrint,
    title: "Quản lý thú cưng",
    description:
      "Tạo hồ sơ thú cưng, cập nhật thông tin cơ bản và xem lại dữ liệu chăm sóc.",
  },
  {
    icon: CalendarCheck,
    title: "Đặt lịch hẹn",
    description:
      "Theo dõi lịch hẹn, tạo booking mới và kiểm tra trạng thái lịch đã đặt.",
  },
  {
    icon: CreditCard,
    title: "Thanh toán",
    description:
      "Xem dịch vụ, sản phẩm đã chọn và kiểm tra tổng tiền trước khi thanh toán.",
  },
];

const HelpCenter = () => {
  return (
    <main className="min-h-screen bg-[#fff8f2]">
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#EFB7AF] bg-[#F7E3DF] px-4 py-2 text-sm font-semibold text-[#D56756]">
              <HelpCircle className="h-4 w-4" />
              Trung tâm trợ giúp
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              Hỗ trợ sử dụng PetHub
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Tìm thông tin cơ bản về các luồng chính trong hệ thống và cách
              liên hệ khi cần hỗ trợ thêm.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {helpTopics.map((topic) => {
              const Icon = topic.icon;

              return (
                <article
                  key={topic.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F7E3DF] text-[#D56756]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-5 text-lg font-bold text-slate-950">
                    {topic.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {topic.description}
                  </p>
                </article>
              );
            })}
          </div>

          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Cần hỗ trợ trực tiếp?
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Gửi email cho PetHub để được hỗ trợ về tài khoản, đặt lịch
                  hoặc lỗi giao diện.
                </p>
              </div>
              <a
                href="mailto:pethub0103@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D56756] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b84f41]"
              >
                <Mail className="h-4 w-4" />
                Liên hệ hỗ trợ
              </a>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default HelpCenter;
