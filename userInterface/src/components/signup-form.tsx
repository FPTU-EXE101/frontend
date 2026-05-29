import { useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import authApi from "@/apis/authAPI";
import type { Register } from "@/types/auth.type";
import { generateUsername } from "@/lib/auth";
import { useFormik } from "formik";
import * as Yup from "yup";

type SignupFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const validationSchema: Yup.ObjectSchema<SignupFormValues> = Yup.object({
  firstName: Yup.string().trim().required("Vui lòng nhập tên."),
  lastName: Yup.string().trim().required("Vui lòng nhập họ."),
  email: Yup.string()
    .trim()
    .email("Email không hợp lệ.")
    .test(
      "contains-at",
      "Email không hợp lệ.",
      (value) => !value || value.includes("@"),
    )
    .required("Vui lòng nhập email."),
  password: Yup.string().required("Vui lòng nhập mật khẩu."),
  confirmPassword: Yup.string()
    .required("Vui lòng xác nhận mật khẩu.")
    .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp."),
});

export function SignupForm({ className, ...props }: ComponentProps<"form">) {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const formik = useFormik<SignupFormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (loading) return;

      setSubmitError(null);
      const payload: Register = {
        userName: generateUsername(values.email),
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      };

      try {
        setLoading(true);
        await authApi.registerUser(payload);
        navigate("/auth/login");
      } catch (err) {
        console.error(err);
        setSubmitError("Đăng ký thất bại. Vui lòng thử lại.");
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
          <FieldLabel htmlFor="firstName">First Name</FieldLabel>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Nguyễn"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          <FieldError
            errors={
              formik.touched.firstName && formik.errors.firstName
                ? [{ message: formik.errors.firstName }]
                : undefined
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Văn A"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          <FieldError
            errors={
              formik.touched.lastName && formik.errors.lastName
                ? [{ message: formik.errors.lastName }]
                : undefined
            }
          />
        </Field>
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
          <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
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
        <Field>
          <FieldLabel htmlFor="confirmPassword">Xác nhận mật khẩu</FieldLabel>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          <FieldError
            errors={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? [{ message: formik.errors.confirmPassword }]
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
            {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản miễn phí"}
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
