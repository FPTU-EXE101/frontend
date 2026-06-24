import { Navigate, Outlet, useSearchParams } from "react-router-dom";
import { getCurrentUserRole, isAuthenticated } from "@/lib/auth";

type GuestRouteProps = {
  /**
   * Cho phép người ĐANG đăng nhập vào trang khi đang ở chế độ đổi cửa hàng
   * (`?switch=1`) — dùng cho luồng đổi cửa hàng cần đăng nhập lại.
   */
  allowWhenSwitching?: boolean;
};

const defaultPathByRole = (role: string) => {
  switch (role.trim().toLowerCase()) {
    case "admin":
      return "/admin/dashboard";
    case "manager":
      return "/manager/dashboard";
    case "customer":
    case "user":
      return "/user/service";
    default:
      return "/";
  }
};

/**
 * Chặn người đã đăng nhập vào các trang chỉ dành cho khách (đăng nhập / đăng ký)
 * và đưa họ về trang mặc định theo vai trò.
 */
function GuestRoute({ allowWhenSwitching = false }: GuestRouteProps) {
  const [searchParams] = useSearchParams();
  const isSwitching = searchParams.get("switch") === "1";

  if (isAuthenticated() && !(allowWhenSwitching && isSwitching)) {
    return <Navigate to={defaultPathByRole(getCurrentUserRole() ?? "")} replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
