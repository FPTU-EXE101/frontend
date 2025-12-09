import Mainlayout from "@/layout";
import AdminLayout from "@/pages/Admin/adminLayout";
import Home from "@/pages/home";
import ManagerLayout from "@/pages/Manager/managerLayout";
import StaffLayout from "@/pages/Staff/staffLayout";
import NotFound from "@/pages/NotFound";
// import UserInfoLayout from "@/pages/User/userInfoLayout";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route path="auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgetPassword />} />
      </Route> */}
      <Route element={<Mainlayout />}>
        <Route index element={<Home />} />
        {/* <Route path="/user" element={<UserInfoLayout />}></Route> */}
      </Route>
      <Route path="/admin" element={<AdminLayout />}></Route>
      <Route path="/staff" element={<StaffLayout />}></Route>
      <Route path="/manager" element={<ManagerLayout />}></Route>
      {/* 404 Page - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
