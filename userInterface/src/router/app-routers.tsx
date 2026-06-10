import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const Mainlayout = lazy(() => import("@/layout"));
const AdminLayout = lazy(() => import("@/pages/Admin/adminLayout"));
const AdminCreateManager = lazy(
  () => import("@/pages/Admin/adminCreateManager"),
);
const AdminDashboard = lazy(() => import("@/pages/Admin/adminDashboard"));
const AdminManagersManage = lazy(
  () => import("@/pages/Admin/adminManagersManage"),
);
const Home = lazy(() => import("@/pages/home"));
const ManagerLayout = lazy(() => import("@/pages/Manager/managerLayout"));
const StaffLayout = lazy(() => import("@/pages/Staff/staffLayout"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const LoginPage = lazy(() => import("@/pages/Auth/loginPage"));
const SignupPage = lazy(() => import("@/pages/Auth/signUpPage"));
const ConfirmEmailPage = lazy(() => import("@/pages/Auth/confirmEmailPage"));
const VerifyEmailNotice = lazy(() => import("@/pages/Auth/verifyEmailNotice"));
const PricingPage = lazy(() => import("@/pages/pricing"));
const UserInfoLayout = lazy(
  () => import("@/pages/User/userInfoLayout/userInfoLayout"),
);
const CustomerProfilePage = lazy(
  () => import("@/pages/User/customerProfilePage"),
);
const UserHomePage = lazy(
  () => import("@/pages/User/UserHomePage/userHomePage"),
);
const UserServicePage = lazy(
  () => import("@/pages/User/userServicePage/userServicePage"),
);
const UserBookingPage = lazy(
  () => import("@/pages/User/UserBookingPage/userBookingPage"),
);
const UserCreateBookingPage = lazy(
  () =>
    import("@/pages/User/UserBookingPage/UserCreateBooking/userCreateBookingPage"),
);
const UserPetPage = lazy(() => import("@/pages/User/userPetPage/userPetPage"));
const CreatePetPage = lazy(() => import("@/pages/User/CreatePetPage"));
const DigitalPetCard = lazy(() => import("@/pages/DigitalPetCard"));
const AboutUs = lazy(() => import("@/pages/aboutUs"));
const Features = lazy(() => import("@/pages/features"));
const DemoPage = lazy(() => import("@/pages/demo"));
const HelpCenter = lazy(() => import("@/pages/helpCenter"));
const Terms = lazy(() => import("@/pages/terms"));
const Privacy = lazy(() => import("@/pages/privacy"));
const ManagerDashboard = lazy(() => import("@/pages/Manager/managerDashboard"));
const ManagerCustomersManage = lazy(
  () => import("@/pages/Manager/managerCustomersManage"),
);
const ManagerPetsManage = lazy(
  () => import("@/pages/Manager/managerPetsManage"),
);
const ManagerPetCardManagement = lazy(
  () => import("@/pages/Manager/managerPetCardManagement"),
);
const ManagerPetCreatePage = lazy(
  () => import("@/pages/Manager/managerPetCreate"),
);
const ManagerPetMedicalRecord = lazy(
  () => import("@/pages/Manager/managerPetMedicalRecord"),
);
const ManagerPetMedicalRecordCreate = lazy(
  () => import("@/pages/Manager/managerPetMedicalRecordCreate"),
);
const ManagerAppointmentsManage = lazy(
  () =>
    import("@/pages/Manager/managerAppointmentsManage/managerAppointmentsManage"),
);
const ManagerServicesManage = lazy(
  () => import("@/pages/Manager/managerServicesManage"),
);
const ManagerCategoriesManage = lazy(
  () => import("@/pages/Manager/managerCategoriesManage"),
);
const ManagerProductsMange = lazy(
  () => import("@/pages/Manager/managerProductsMange"),
);
const ManagerServiceCreate = lazy(() =>
  import("@/pages/Manager/managerItemCreate").then((module) => ({
    default: module.ManagerServiceCreate,
  })),
);
const ManagerServiceEdit = lazy(() =>
  import("@/pages/Manager/managerItemCreate").then((module) => ({
    default: module.ManagerServiceEdit,
  })),
);
const ManagerProductCreate = lazy(() =>
  import("@/pages/Manager/managerItemCreate").then((module) => ({
    default: module.ManagerProductCreate,
  })),
);
const ManagerProductEdit = lazy(() =>
  import("@/pages/Manager/managerItemCreate").then((module) => ({
    default: module.ManagerProductEdit,
  })),
);
const ManagerCRMManage = lazy(() => import("@/pages/Manager/managerCRMManage"));
const ManagerPaymentManage = lazy(
  () => import("@/pages/Manager/managerPaymentManage"),
);
const ManagerInvoicesManage = lazy(
  () => import("@/pages/Manager/managerInvoicesManage"),
);
const ManagerAutomationManage = lazy(
  () => import("@/pages/Manager/managerAutomationManage"),
);
const ManagerSettingManage = lazy(
  () => import("@/pages/Manager/managerSettingManage"),
);
const PaymentSuccessPage = lazy(
  () => import("@/pages/payment/PaymentSuccessPage"),
);

const RouteLoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#fff8f2] px-4">
    <div className="rounded-[30px] border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow-sm">
      Đang tải...
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
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
          <Route path="demo" element={<DemoPage />} />
          <Route path="help" element={<HelpCenter />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="payment/success" element={<PaymentSuccessPage />} />
          <Route path="confirm-email" element={<ConfirmEmailPage />} />
          <Route path="verify-email-notice" element={<VerifyEmailNotice />} />
          <Route path="pet-card/:petId" element={<DigitalPetCard />} />
          <Route path="user" element={<UserInfoLayout />}>
            <Route path="profile" element={<CustomerProfilePage />} />
            <Route path="home" element={<UserHomePage />} />
            <Route path="pet" element={<UserPetPage />} />
            <Route path="pet/new" element={<CreatePetPage />} />
            <Route path="service" element={<UserServicePage />} />
            <Route path="booking" element={<UserBookingPage />} />
            <Route path="booking/new" element={<UserCreateBookingPage />} />
          </Route>
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="managers/new" element={<AdminCreateManager />} />
          <Route path="managers" element={<AdminManagersManage />} />
          <Route path="petcards" element={<ManagerPetCardManagement />} />
        </Route>
        <Route path="/staff" element={<StaffLayout />}></Route>
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="customers" element={<ManagerCustomersManage />} />
          <Route path="petcards" element={<ManagerPetCardManagement />} />
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
          <Route path="payments" element={<ManagerPaymentManage />} />
          <Route path="invoices" element={<ManagerInvoicesManage />} />
          <Route path="automation" element={<ManagerAutomationManage />} />
          <Route path="settings" element={<ManagerSettingManage />} />
        </Route>
        {/* 404 Page - must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
