import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  isAuthenticated as checkIsAuthenticated,
  logout,
} from "@/lib/auth";
import { ChevronsUpDown, Store } from "lucide-react";
import { useAuthenticatedStore } from "@/hooks/useAuthenticatedStore";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { StoreSwitcher } from "@/components/auth/store-switcher";
import { clearSwitchCredentials } from "@/lib/storeSession";

const getAuthSnapshot = () => {
  if (!checkIsAuthenticated()) {
    return {
      isAuthenticated: false,
      userName: "",
      userEmail: "",
      userRole: "",
    };
  }

  const currentUser = getCurrentUser();

  if (!currentUser) {
    return {
      isAuthenticated: false,
      userName: "",
      userEmail: "",
      userRole: "",
    };
  }

  return {
    isAuthenticated: true,
    userName: currentUser.name || "User",
    userEmail: currentUser.email,
    userRole: currentUser.role,
  };
};

const Navbar = () => {
  const [authState, setAuthState] = useState(getAuthSnapshot);
  const [menuOpen, setMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const navigate = useNavigate();
  const { data: authenticatedStore, isLoading: storeLoading } =
    useAuthenticatedStore();

  const updateAuthState = () => {
    setAuthState(getAuthSnapshot());
  };

  useEffect(() => {
    const handleAuthChanged = () => updateAuthState();
    window.addEventListener("authChanged", handleAuthChanged);
    return () => window.removeEventListener("authChanged", handleAuthChanged);
  }, []);

  const handleLogout = () => {
    logout();
    clearSwitchCredentials();
    window.dispatchEvent(new Event("authChanged"));
    setAuthState(getAuthSnapshot());
    setMenuOpen(false);
    navigate("/auth/login");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "rounded-full border px-4 py-2 text-sm font-semibold transition",
      isActive
        ? "border-[#D56756]/45 bg-[#F8DED9] text-[#B24C40] shadow-sm"
        : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-950",
    ].join(" ");
  const { isAuthenticated, userName, userEmail, userRole } = authState;
  const normalizedRole = userRole.toLowerCase();
  const isCustomer = normalizedRole === "customer" || normalizedRole === "user";
  const roleDashboardPath =
    normalizedRole === "admin"
      ? "/admin/dashboard"
      : normalizedRole === "manager"
        ? "/manager/dashboard"
        : "";

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/82 shadow-sm shadow-slate-200/40 backdrop-blur-xl supports-[backdrop-filter]:bg-white/72">
      <div className="mx-auto flex max-w-full items-center justify-around px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/Artboard 5.svg"
            alt="PetHub"
            className="h-auto w-[180px] object-contain sm:w-[220px]"
            fetchPriority="high"
            decoding="async"
          />
        </Link>

        {isAuthenticated ? (
          <>
            <nav className="hidden items-center gap-8 md:flex">
              <NavLink
                to="/"
                end
                className={navLinkClass}
              >
                Trang chủ
              </NavLink>
              {isCustomer ? (
                <>
                  <NavLink to="/user/service" className={navLinkClass}>
                    Dịch vụ
                  </NavLink>
                  <NavLink to="/user/booking" className={navLinkClass}>
                    Lịch hẹn
                  </NavLink>
                  <NavLink to="/user/pet" className={navLinkClass}>
                    Thú cưng
                  </NavLink>
                  <NavLink to="/user/invoices" className={navLinkClass}>
                    Hóa đơn
                  </NavLink>
                  <NavLink to="/user/profile" className={navLinkClass}>
                    Hồ sơ
                  </NavLink>
                </>
              ) : null}
              {roleDashboardPath ? (
                <NavLink to={roleDashboardPath} className={navLinkClass}>
                  Dashboard
                </NavLink>
              ) : null}
            </nav>
            <div className="hidden items-center gap-3 md:flex">
              {isCustomer ? (
                <button
                  type="button"
                  onClick={() => setSwitcherOpen(true)}
                  title="Đổi cửa hàng"
                  className="flex max-w-56 items-center gap-2 rounded-lg border border-[#D56756]/25 bg-[#F8DED9]/60 px-3 py-2 text-[#8F3F36] transition hover:border-[#D56756]/50 hover:bg-[#F8DED9]"
                >
                  <Store className="h-4 w-4 shrink-0" />
                  <div className="min-w-0 text-left">
                    <p className="text-[11px] font-semibold uppercase text-[#B24C40]">
                      Cửa hàng của bạn
                    </p>
                    <p className="truncate text-sm font-bold">
                      {storeLoading
                        ? "Đang tải..."
                        : authenticatedStore?.name || "Chưa xác định"}
                    </p>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 text-[#B24C40]/70" />
                </button>
              ) : null}
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
                    {roleDashboardPath && (
                      <DropdownMenuItem asChild>
                        {/* <Link
                          to={roleDashboardPath}
                          className="w-full"
                        >
                          Dashboard
                        </Link> */}
                      </DropdownMenuItem>
                    )}
                    {/* <DropdownMenuItem asChild>
                      <Link to="/user/profile" className="w-full">
                        Hồ sơ
                      </Link>
                    </DropdownMenuItem> */}
                    {isCustomer ? (
                      <DropdownMenuItem
                        onSelect={(event) => {
                          event.preventDefault();
                          setMenuOpen(false);
                          setSwitcherOpen(true);
                        }}
                      >
                        Đổi cửa hàng
                      </DropdownMenuItem>
                    ) : null}
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
              <NavLink
                to="/features"
                className={navLinkClass}
              >
                Tính năng
              </NavLink><NavLink
                to="/stores"
                className={navLinkClass}
              >
                Phòng khám
              </NavLink>
              <NavLink
                to="/pricing"
                className={navLinkClass}
              >
                Bảng giá
              </NavLink>
              <NavLink
                to="/user-guide"
                className={navLinkClass}
              >
                Hướng dẫn sử dụng
              </NavLink>
              <NavLink
                to="/about-us"
                className={navLinkClass}
              >
                Về chúng tôi
              </NavLink>
              <NavLink
                to="/auth/login"
                className={navLinkClass}
              >
                Đăng nhập
              </NavLink>
            </nav>

            <div className="flex items-center gap-3">
              <Link to="/stores">
                <button className="rounded-full bg-[#D56756] px-5 py-2.5 text-sm font-bold text-white shadow-[0_16px_42px_rgba(213,103,86,0.28)] transition hover:-translate-y-0.5 hover:bg-[#B24C40] hover:shadow-[0_20px_55px_rgba(213,103,86,0.36)]">
                  Tìm phòng khám
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
    {isAuthenticated && isCustomer ? (
      <StoreSwitcher
        key={switcherOpen ? "open" : "closed"}
        open={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
        currentStoreId={authenticatedStore?.id}
        currentStoreName={authenticatedStore?.name ?? undefined}
      />
    ) : null}
    </>
  );
};

export default Navbar;
