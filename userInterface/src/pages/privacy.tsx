import { Database, LockKeyhole, Shield } from "lucide-react";

const privacyItems = [
  {
    icon: Database,
    title: "Thông tin được lưu trữ",
    content:
      "PetHub lưu các thông tin cần thiết như tài khoản, hồ sơ khách hàng, thú cưng, lịch hẹn và giao dịch.",
  },
  {
    icon: LockKeyhole,
    title: "Mục đích sử dụng",
    content:
      "Dữ liệu được dùng để vận hành hệ thống, hiển thị thông tin chính xác và hỗ trợ trải nghiệm người dùng.",
  },
  {
    icon: Shield,
    title: "Bảo vệ dữ liệu",
    content:
      "PetHub giới hạn quyền truy cập theo vai trò và ưu tiên bảo vệ dữ liệu trong quá trình sử dụng hệ thống.",
  },
];

const Privacy = () => {
  return (
    <main className="min-h-screen bg-[#fff8f2]">
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#EFB7AF] bg-[#F7E3DF] px-4 py-2 text-sm font-semibold text-[#D56756]">
            <Shield className="h-4 w-4" />
            Bảo mật
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            Chính sách bảo mật
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
            Chính sách này giải thích cách PetHub xử lý thông tin trong quá
            trình người dùng sử dụng các tính năng của hệ thống.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {privacyItems.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F7E3DF] text-[#D56756]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-5 text-lg font-bold text-slate-950">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.content}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Privacy;
