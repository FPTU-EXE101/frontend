import { LoginForm } from "@/components/login-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      title="Chào mừng trở lại!"
      subtitle="Đăng nhập để quản lý lịch hẹn, hồ sơ và vận hành PetHub."
    >
      <LoginForm />
    </AuthShell>
  );
}
