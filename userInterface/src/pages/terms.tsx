import { FileText, ShieldCheck } from "lucide-react";

const terms = [
  {
    title: "Sử dụng tài khoản",
    content:
      "Người dùng cần cung cấp thông tin chính xác khi đăng ký và tự bảo mật thông tin đăng nhập của mình.",
  },
  {
    title: "Dữ liệu trong hệ thống",
    content:
      "Thông tin thú cưng, lịch hẹn, dịch vụ và thanh toán được dùng để hỗ trợ quá trình vận hành trên PetHub.",
  },
  {
    title: "Trách nhiệm sử dụng",
    content:
      "Người dùng không được nhập dữ liệu sai lệch, gây ảnh hưởng đến hoạt động của cửa hàng hoặc người dùng khác.",
  },
  {
    title: "Thay đổi điều khoản",
    content:
      "PetHub có thể cập nhật điều khoản khi cần thiết để phù hợp với tính năng và quy trình vận hành mới.",
  },
];

const Terms = () => {
  return (
    <main className="min-h-screen bg-[#fff8f2]">
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#EFB7AF] bg-[#F7E3DF] px-4 py-2 text-sm font-semibold text-[#D56756]">
            <FileText className="h-4 w-4" />
            Điều khoản
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            Điều khoản sử dụng PetHub
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600">
            Các điều khoản này mô tả nguyên tắc cơ bản khi sử dụng nền tảng
            PetHub cho việc quản lý thú cưng, lịch hẹn và dịch vụ.
          </p>

          <div className="mt-10 space-y-5">
            {terms.map((item) => (
              <section
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F7E3DF] text-[#D56756]">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.content}
                    </p>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Terms;
