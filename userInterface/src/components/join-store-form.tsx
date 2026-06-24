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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import authApi from "@/apis/authAPI";
import type { JoinStore } from "@/types/auth.type";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { WizardStepper } from "@/components/auth/wizard-stepper";
import { StorePicker } from "@/components/auth/store-picker";

type JoinStoreFormValues = {
  storeId: string;
  email: string;
  password: string;
};

const validationSchema: Yup.ObjectSchema<JoinStoreFormValues> = Yup.object({
  storeId: Yup.string().trim().required("Vui lòng chọn phòng khám."),
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
});

// Không bước nào gửi request — gom dữ liệu và chỉ gửi 1 request join-store ở cuối.
const STEPS: { label: string; fields: (keyof JoinStoreFormValues)[] }[] = [
  { label: "Phòng khám", fields: ["storeId"] },
  { label: "Tài khoản", fields: ["email", "password"] },
];

export function JoinStoreForm({ className, ...props }: ComponentProps<"form">) {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStoreId = searchParams.get("storeId")?.trim() ?? "";
  const prefillEmail = searchParams.get("email")?.trim() ?? "";

  const formik = useFormik<JoinStoreFormValues>({
    initialValues: {
      storeId: initialStoreId,
      email: prefillEmail,
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (loading) return;

      setSubmitError(null);

      const payload: JoinStore = {
        email: values.email,
        password: values.password,
        storeId: values.storeId,
      };

      try {
        setLoading(true);
        await authApi.joinStore(payload);
        // Tài khoản ở cửa hàng mới cần xác nhận email trước khi đăng nhập được.
        navigate("/verify-email-notice");
      } catch (err) {
        console.error(err);
        setSubmitError(getBackendErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
  });

  const isLastStep = stepIndex === STEPS.length - 1;

  const goNext = async () => {
    const stepFields = STEPS[stepIndex].fields;
    const errors = await formik.validateForm();
    formik.setTouched(
      {
        ...formik.touched,
        ...Object.fromEntries(stepFields.map((field) => [field, true])),
      },
      false,
    );
    const hasError = stepFields.some((field) => Boolean(errors[field]));
    if (hasError) return;
    setSubmitError(null);
    setStepIndex((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setSubmitError(null);
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={formik.handleSubmit}
      noValidate
      {...props}
    >
      <WizardStepper steps={STEPS.map((step) => step.label)} current={stepIndex} />

      <div className="rounded-xl border border-[#f0d8d0] bg-[#fff8f3] px-4 py-3 text-sm text-slate-600">
        Dùng <span className="font-semibold text-[#B24C40]">email và mật khẩu
        hiện có</span> để khám ở phòng khám khác — bạn{" "}
        <span className="font-semibold">không cần tạo tài khoản mới</span>.
      </div>

      <FieldGroup>
        {stepIndex === 0 ? (
          <Field>
            <FieldLabel>Chọn phòng khám muốn tham gia</FieldLabel>
            <FieldDescription>
              Mỗi phòng khám quản lý hồ sơ riêng — chọn nơi bạn muốn đặt lịch.
            </FieldDescription>
            <StorePicker
              value={formik.values.storeId}
              onSelect={(storeId) => formik.setFieldValue("storeId", storeId)}
            />
            <FieldError
              errors={
                formik.touched.storeId && formik.errors.storeId
                  ? [{ message: formik.errors.storeId }]
                  : undefined
              }
            />
          </Field>
        ) : null}

        {stepIndex === 1 ? (
          <div className="grid gap-6 sm:grid-cols-2">
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
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-slate-500 transition hover:text-slate-800"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              <FieldError
                errors={
                  formik.touched.password && formik.errors.password
                    ? [{ message: formik.errors.password }]
                    : undefined
                }
              />
            </Field>
          </div>
        ) : null}

        {submitError ? (
          <FieldDescription className="text-center text-sm text-red-600 whitespace-pre-line">
            {submitError}
          </FieldDescription>
        ) : null}

        <Field>
          <div className="flex items-center gap-3">
            {stepIndex > 0 ? (
              <Button
                type="button"
                onClick={goBack}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
            ) : null}
            {isLastStep ? (
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-full bg-[#D56756] px-5 py-3 text-base font-semibold text-white hover:bg-[#b34c47] disabled:cursor-not-allowed disabled:bg-[#d89992]"
              >
                {loading ? "Đang xử lý..." : "Xác nhận tham gia"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => void goNext()}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#D56756] px-5 py-3 text-base font-semibold text-white hover:bg-[#b34c47]"
              >
                Tiếp tục
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Field>

        <FieldDescription className="text-center text-sm text-slate-600">
          Chưa có tài khoản nào?{" "}
          <Link
            to={
              formik.values.storeId
                ? `/auth/signup?${new URLSearchParams({ storeId: formik.values.storeId }).toString()}`
                : "/auth/signup"
            }
            className="font-semibold text-[#D56756] hover:text-[#b34c47]"
          >
            Đăng ký mới
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
