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
import UserInfoLayout from "@/pages/User/userInfoLayout/userInfoLayout";
import UserHomePage from "@/pages/User/UserHomePage/userHomePage";
import UserServicePage from "@/pages/User/userServicePage/userServicePage";
import UserBookingPage from "@/pages/User/UserBookingPage/userBookingPage";
import ManagerPetsManage from "@/pages/Manager/managerPetsManage";
import ManagerPetMedicalRecord from "@/pages/Manager/managerPetMedicalRecord";
import ManagerPetMedicalRecordCreate from "@/pages/Manager/managerPetMedicalRecordCreate";
import ManagerDashboard from "@/pages/Manager/managerDashboard";
import ManagerCustomersManage from "@/pages/Manager/managerCustomersManage";
import ManagerAppointmentsManage from "@/pages/Manager/managerAppointmentsManage/managerAppointmentsManage";
import ManagerServicesManage from "@/pages/Manager/managerServicesManage";
import ManagerCategoriesManage from "@/pages/Manager/managerCategoriesManage";
import ManagerProductsMange from "@/pages/Manager/managerProductsMange";
import {
  ManagerProductCreate,
  ManagerProductEdit,
  ManagerServiceCreate,
  ManagerServiceEdit,
} from "@/pages/Manager/managerItemCreate";
import ManagerCRMManage from "@/pages/Manager/managerCRMManage";
import ManagerPaymentManage from "@/pages/Manager/managerPaymentManage";
import ManagerAutomationManage from "@/pages/Manager/managerAutomationManage";
import ManagerSettingManage from "@/pages/Manager/managerSettingManage";
import ManagerPetCreatePage from "@/pages/Manager/managerPetCreate";
import AboutUs from "@/pages/aboutUs";
import Features from "@/pages/features";
import UserPetPage from "@/pages/User/userPetPage/userPetPage";
import UserCreateBookingPage from "@/pages/User/UserBookingPage/UserCreateBooking/userCreateBookingPage";

const AppRoutes = () => {
  return (
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
        <Route path="about-us" element={<AboutUs />} />
        <Route path="features" element={<Features />} />
        <Route path="user" element={<UserInfoLayout />}>
          <Route path="home" element={<UserHomePage />} />
          <Route path="pet" element={<UserPetPage />} />
          <Route path="service" element={<UserServicePage />} />
          <Route path="booking" element={<UserBookingPage />} />
          <Route path="booking/new" element={<UserCreateBookingPage />} />
        </Route>
      </Route>
      <Route path="/admin" element={<AdminLayout />}></Route>
      <Route path="/staff" element={<StaffLayout />}></Route>
      <Route path="/manager" element={<ManagerLayout />}>
        <Route index path="dashboard" element={<ManagerDashboard />} />
        <Route path="customers" element={<ManagerCustomersManage />} />
        <Route path="pets" element={<ManagerPetsManage />} />
        <Route path="pets/new" element={<ManagerPetCreatePage />} />
        <Route
          path="pets/:id/medical-record"
          element={<ManagerPetMedicalRecord />}
        />
        <Route
          path="pets/:id/medical-record/new"
          element={<ManagerPetMedicalRecordCreate />}
        />
        <Route path="appointments" element={<ManagerAppointmentsManage />} />
        <Route path="services" element={<ManagerServicesManage />} />
        <Route path="services/new" element={<ManagerServiceCreate />} />
        <Route path="services/:id/edit" element={<ManagerServiceEdit />} />
        <Route path="categories" element={<ManagerCategoriesManage />} />
        <Route path="products" element={<ManagerProductsMange />} />
        <Route path="products/new" element={<ManagerProductCreate />} />
        <Route path="products/:id/edit" element={<ManagerProductEdit />} />
        <Route path="crm" element={<ManagerCRMManage />} />
        <Route path="payment" element={<ManagerPaymentManage />} />
        <Route path="automation" element={<ManagerAutomationManage />} />
        <Route path="settings" element={<ManagerSettingManage />} />
      </Route>
      {/* 404 Page - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
