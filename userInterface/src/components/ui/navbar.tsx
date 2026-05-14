import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { parseJwt } from "@/lib/utils";
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
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setUserName("");
      setUserEmail("");
      setUserRole("");
      return;
    }

    const payload = parseJwt(token);
    const role =
      (payload?.[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] as string) ||
      (payload?.role as string) ||
      "";

    if (!role) {
      setIsAuthenticated(false);
      setUserName("");
      setUserEmail("");
      setUserRole("");
      return;
    }

    setIsAuthenticated(true);
    setUserRole(role);
    setUserName(
      (payload?.[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
      ] as string) ||
        (payload?.name as string) ||
        "User",
    );
    setUserEmail(
      (payload?.[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ] as string) ||
        (payload?.email as string) ||
        "",
    );
  };

  useEffect(() => {
    updateAuthState();
    const handleAuthChanged = () => updateAuthState();
    window.addEventListener("authChanged", handleAuthChanged);
    return () => window.removeEventListener("authChanged", handleAuthChanged);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChanged"));
    setIsAuthenticated(false);
    setUserName("");
    setUserEmail("");
    setUserRole("");
    setMenuOpen(false);
    navigate("/auth/login");
  };

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logoPethub.png"
            alt="PetHub"
            className="w-auto max-w-none object-contain h-12 sm:h-12"
            decoding="async"
          />
        </Link>

        {isAuthenticated ? (
          <>
            <nav className="hidden items-center gap-8 md:flex">
              <Link
                to="/user/home"
                className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
              >
                Trang chủ
              </Link>
              <Link
                to="/user/service"
                className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
              >
                Dịch vụ
              </Link>
              <Link
                to="/user/booking"
                className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
              >
                Lịch hẹn
              </Link>
              <Link
                to="/user/pet"
                className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
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
                      className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:shadow-sm"
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
                <button className="rounded-full bg-[#D56756] px-5 py-2.5 text-sm font-semibold text-white transition shadow-[0_25px_60px_rgba(213,103,86,0.2)] hover:bg-[#B24C40]">
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
