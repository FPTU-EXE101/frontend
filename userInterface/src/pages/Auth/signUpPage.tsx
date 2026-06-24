import { SignupForm } from "@/components/signup-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function SignupPage() {
  return (
    <AuthShell
      title="Tạo tài khoản miễn phí"
      subtitle="Bắt đầu miễn phí — không cần thẻ tín dụng."
    >
      <SignupForm />
    </AuthShell>
  );
}
