import { Link } from "react-router-dom";
import { ArrowLeft, ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#fff8f3] px-4 py-16">
      <div className="w-full max-w-xl rounded-[30px] border border-slate-200 bg-white p-8 text-center shadow-sm shadow-slate-200/70">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#fff1ee] text-[#D56756] ring-1 ring-[#f3d3cd]">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950">
          Bạn không có quyền truy cập trang này.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
          Tài khoản hiện tại không thuộc vai trò được phép sử dụng khu vực này.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#D56756] px-6 py-3 text-sm font-bold text-white shadow-[0_16px_42px_rgba(213,103,86,0.24)] transition hover:-translate-y-0.5 hover:bg-[#B24C40]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
