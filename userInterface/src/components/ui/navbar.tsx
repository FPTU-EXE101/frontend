import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  isAuthenticated as checkIsAuthenticated,
  logout,
} from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const updateAuthState = () => {
    if (!checkIsAuthenticated()) {
      setIsAuthenticated(false);
      setUserName("");
      setUserEmail("");
      setUserRole("");
      return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser) {
      setIsAuthenticated(false);
      setUserName("");
      setUserEmail("");
      setUserRole("");
      return;
    }

    setIsAuthenticated(true);
    setUserRole(currentUser.role);
    setUserName(currentUser.name || "User");
    setUserEmail(currentUser.email);
  };

  useEffect(() => {
    updateAuthState();
    const handleAuthChanged = () => updateAuthState();
    window.addEventListener("authChanged", handleAuthChanged);
    return () => window.removeEventListener("authChanged", handleAuthChanged);
  }, []);

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event("authChanged"));
    setIsAuthenticated(false);
    setUserName("");
    setUserEmail("");
    setUserRole("");
    setMenuOpen(false);
    navigate("/auth/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/82 shadow-sm shadow-slate-200/40 backdrop-blur-xl supports-[backdrop-filter]:bg-white/72">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logoPethub.png"
            alt="PetHub"
            className="h-11 w-auto max-w-none object-contain sm:h-12"
            decoding="async"
          />
        </Link>

        {isAuthenticated ? (
          <>
            <nav className="hidden items-center gap-8 md:flex">
              <Link
                to="/"
                className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Trang chủ
              </Link>
              <Link
                to="/user/service"
                className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Dịch vụ
              </Link>
              <Link
                to="/user/booking"
                className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Lịch hẹn
              </Link>
              <Link
                to="/user/pet"
                className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Thú cưng
              </Link>
            </nav>
            <div className="hidden items-center gap-3 md:flex">
              <div
                className="relative"
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm transition hover:-translate-y-0.5 hover:border-[#D56756]/30 hover:shadow-md"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D56756] text-sm font-semibold text-white">
                        {userName?.charAt(0).toUpperCase() ||
                          userEmail?.charAt(0).toUpperCase() ||
                          "U"}
                      </span>
                      <div className="text-left">
                        <p className="font-semibold text-slate-950">
                          {userName}
                        </p>
                        <p className="text-xs text-slate-500">{userEmail}</p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    sideOffset={8}
                    align="end"
                    className="min-w-[12rem]"
                  >
                    {(userRole?.toLowerCase() === "admin" ||
                      userRole?.toLowerCase() === "manager") && (
                      <DropdownMenuItem asChild>
                        <Link
                          to={
                            userRole?.toLowerCase() === "admin"
                              ? "/admin"
                              : "/manager"
                          }
                          className="w-full"
                        >
                          Quản lý
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/user/profile" className="w-full">
                        Hồ sơ
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(event) => {
                        event.preventDefault();
                        handleLogout();
                      }}
                      className="text-red-600"
                    >
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </>
        ) : (
          <>
            <nav className="hidden items-center gap-8 md:flex">
              <Link
                to="/features"
                className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Tính năng
              </Link>
              <Link
                to="/pricing"
                className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Bảng giá
              </Link>
              <Link
                to="/about-us"
                className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Về chúng tôi
              </Link>
              <Link
                to="/auth/login"
                className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Đăng nhập
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link to="/auth/signup">
                <button className="rounded-full bg-[#D56756] px-5 py-2.5 text-sm font-bold text-white shadow-[0_16px_42px_rgba(213,103,86,0.28)] transition hover:-translate-y-0.5 hover:bg-[#B24C40] hover:shadow-[0_20px_55px_rgba(213,103,86,0.36)]">
                  Dùng thử miễn phí
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
