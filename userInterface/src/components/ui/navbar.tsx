import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/public/logoPethub.png"
            alt="PetHub"
            className="w-auto max-w-none object-contain h-12 sm:h-12"
            decoding="async"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/features"
            className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
          >
            Tính năng
          </Link>
          <Link
            to="/pricing"
            className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
          >
            Bảng giá
          </Link>
          <Link
            to="/auth/login"
            className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
          >
            Đăng nhập
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/auth/signup">
            <Button className="rounded-full bg-[#D56756] px-5 py-2.5 text-sm font-semibold text-white transition shadow-[0_25px_60px_rgba(213,103,86,0.2)] hover:bg-[#B24C40]">
              Dùng thử miễn phí
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
