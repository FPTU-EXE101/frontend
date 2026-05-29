import { useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { getCurrentUserRole, setToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import authApi from "@/apis/authAPI";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Email không hợp lệ.")
    .required("Vui lòng nhập email."),
  password: Yup.string().required("Vui lòng nhập mật khẩu."),
});

export function LoginForm({ className, ...props }: ComponentProps<"form">) {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (loading) return;

      setSubmitError(null);
      try {
        setLoading(true);
        const response = await authApi.loginUser(values);
        const token = response?.data?.token;
        if (typeof token === "string" && token) {
          setToken(token);
          const role = getCurrentUserRole() ?? "";

          window.dispatchEvent(new Event("authChanged"));

          if (role?.toLowerCase() === "admin") {
            navigate("/admin");
            return;
          }

          if (role?.toLowerCase() === "manager") {
            navigate("/manager");
            return;
          }
        }
        navigate("/");
      } catch (err) {
        console.error(err);
        setSubmitError(
          "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.",
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={formik.handleSubmit}
      {...props}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          <FieldError
            errors={
              formik.touched.email && formik.errors.email
                ? [{ message: formik.errors.email }]
                : undefined
            }
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
            <Link
              to="/auth/forgot-password"
              className="ml-auto text-sm font-medium text-[#D56756] transition hover:text-[#b34c47]"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          <FieldError
            errors={
              formik.touched.password && formik.errors.password
                ? [{ message: formik.errors.password }]
                : undefined
            }
          />
        </Field>
        {submitError ? (
          <FieldDescription className="text-center text-sm text-red-600">
            {submitError}
          </FieldDescription>
        ) : null}
        <Field>
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#D56756] px-5 py-3 text-base font-semibold text-white hover:bg-[#b34c47] disabled:cursor-not-allowed disabled:bg-[#d89992]"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </Field>
        <FieldSeparator>HOẶC</FieldSeparator>
        <Field>
          <Button
            variant="outline"
            type="button"
            className="w-full rounded-full border border-[#D56756] px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-[#f7e7e2]"
          >
            <svg
              viewBox="0 0 24 24"
              className="mr-3 h-5 w-5"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M23.64 12.204c0-.78-.07-1.53-.2-2.256H12v4.268h6.48c-.28 1.5-1.1 2.774-2.35 3.63v3.02h3.8c2.22-2.04 3.5-5.06 3.5-8.66z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.08 7.95-2.94l-3.8-3.02c-1.05.7-2.4 1.12-4.15 1.12-3.2 0-5.92-2.16-6.9-5.08H1.2v3.18A12 12 0 0 0 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.1 14.96c-.24-.7-.38-1.45-.38-2.24s.14-1.54.38-2.24V7.3H1.2A12 12 0 0 0 0 12.72c0 1.94.47 3.78 1.2 5.42l3.9-3.18z"
              />
              <path
                fill="#EA4335"
                d="M12 4.74c1.76 0 3.33.6 4.57 1.78l3.42-3.42C17.96 1.24 15.24 0 12 0A12 12 0 0 0 1.2 7.3l3.9 3.18C6.08 6.9 8.8 4.74 12 4.74z"
              />
            </svg>
            Tiếp tục với Google
          </Button>
          <FieldDescription className="px-0 text-sm text-center text-slate-500">
            Bằng việc đăng nhập, bạn đồng ý với{" "}
            <Link
              to="/terms"
              className="font-medium text-[#D56756] hover:text-[#b34c47]"
            >
              Điều khoản sử dụng
            </Link>{" "}
            và{" "}
            <Link
              to="/privacy"
              className="font-medium text-[#D56756] hover:text-[#b34c47]"
            >
              Chính sách bảo mật
            </Link>
          </FieldDescription>
          <FieldDescription className="px-0 text-center text-sm text-slate-500">
            Chưa có tài khoản?{" "}
            <Link
              to="/auth/signup"
              className="font-medium text-[#D56756] hover:text-[#b34c47]"
            >
              Tạo tài khoản miễn phí
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
