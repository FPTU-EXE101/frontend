import Mainlayout from "@/layout";
import AdminLayout from "@/pages/Admin/adminLayout";
import Home from "@/pages/home";
import ManagerLayout from "@/pages/Manager/managerLayout";
import StaffLayout from "@/pages/Staff/staffLayout";
import NotFound from "@/pages/NotFound";
// import UserInfoLayout from "@/pages/User/userInfoLayout";
import { Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/Auth/loginPage";
import SignupPage from "@/pages/Auth/signUpPage";
import ConfirmEmailPage from "@/pages/Auth/confirmEmailPage";
import PricingPage from "@/pages/pricing";
import UserInfoLayout from "@/pages/User/userInfoLayout";
import UserHomePage from "@/pages/User/userHomePage";
import UserServicePage from "@/pages/User/userServicePage";
import UserBookingPage from "@/pages/User/userBookingPage";
import UserPetPage from "@/pages/User/userPetPage";

const AppRoutes = () => {
  return (
    // asdfasdf
    <Routes>
      <Route element={<Mainlayout />}>
        <Route path="auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="confirm-email" element={<ConfirmEmailPage />} />
          {/* <Route path="forgot-password" element={<ForgetPassword />} /> */}
        </Route>
        <Route index element={<Home />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="user" element={<UserInfoLayout />}>
          <Route path="home" element={<UserHomePage />} />
          <Route path="service" element={<UserServicePage />} />
          <Route path="booking" element={<UserBookingPage />} />
          <Route path="pet" element={<UserPetPage />} />
        </Route>
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
