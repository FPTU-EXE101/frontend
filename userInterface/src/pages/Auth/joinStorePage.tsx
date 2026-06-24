import { JoinStoreForm } from "@/components/join-store-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function JoinStorePage() {
  return (
    <AuthShell
      title="Thêm phòng khám vào tài khoản"
      subtitle="Dùng tài khoản hiện có để khám ở phòng khám khác — không cần tạo tài khoản mới."
    >
      <JoinStoreForm />
    </AuthShell>
  );
}
