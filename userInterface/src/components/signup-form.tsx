import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Họ và tên</FieldLabel>
          <Input id="name" type="text" placeholder="Nguyễn Văn A" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="shop">Tên Pet Shop / Phòng khám</FieldLabel>
          <Input
            id="shop"
            type="text"
            placeholder="Happy Pets Clinic"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
          <Input id="password" type="password" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Xác nhận mật khẩu</FieldLabel>
          <Input id="confirm-password" type="password" required />
        </Field>
        <Field>
          <Button
            type="submit"
            className="w-full rounded-full bg-[#D56756] px-5 py-3 text-base font-semibold text-white hover:bg-[#b34c47]"
          >
            Tạo tài khoản miễn phí
          </Button>
        </Field>
        <FieldDescription className="text-center text-sm text-slate-600">
          Đã có tài khoản?{" "}
          <Link
            to="/auth/login"
            className="font-semibold text-[#D56756] hover:text-[#b34c47]"
          >
            Đăng nhập
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
