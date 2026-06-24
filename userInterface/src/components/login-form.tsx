import { useMemo, useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { getCurrentUserRole, setToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import authApi from "@/apis/authAPI";
import type { Login } from "@/types/auth.type";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  UserRound,
  UserRoundCog,
} from "lucide-react";
import { WizardStepper } from "@/components/auth/wizard-stepper";
import { StorePicker } from "@/components/auth/store-picker";
import { saveSwitchCredentials } from "@/lib/storeSession";

type LoginFormValues = Login & {
  accountType: "customer" | "manager";
};

const validationSchema: Yup.ObjectSchema<LoginFormValues> = Yup.object({
  email: Yup.string()
    .trim()
    .email("Email không hợp lệ.")
    .required("Vui lòng nhập email."),
  password: Yup.string().required("Vui lòng nhập mật khẩu."),
  storeId: Yup.string().when("accountType", {
    is: "customer",
    then: (schema) => schema.required("Vui lòng chọn phòng khám."),
    otherwise: (schema) => schema.optional(),
  }),
  accountType: Yup.mixed<"customer" | "manager">()
    .oneOf(["customer", "manager"])
    .required(),
});

const normalizeRole = (role?: string | null) => role?.trim().toLowerCase() ?? "";

const defaultPathByRole = (role: string) => {
  switch (normalizeRole(role)) {
    case "admin":
      return "/admin/dashboard";
    case "manager":
      return "/manager/dashboard";
    case "customer":
    case "user":
      return "/user/service";
    default:
      return "/";
  }
};

const isPathAllowedForRole = (path: string, role: string) => {
  const normalizedRole = normalizeRole(role);

  if (path.startsWith("/admin")) {
    return normalizedRole === "admin";
  }

  if (path.startsWith("/manager") || path.startsWith("/staff")) {
    return normalizedRole === "manager";
  }

  if (path.startsWith("/user")) {
    return normalizedRole === "customer" || normalizedRole === "user";
  }

  return true;
};

const extractJwtToken = (value: unknown): string | null => {
  if (typeof value === "string") {
    return value.split(".").length === 3 ? value : null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const data = value as Record<string, unknown>;
  const candidates = [
    data.token,
    data.accessToken,
    data.jwtToken,
    data.jwt,
    data.data,
  ];

  for (const candidate of candidates) {
    const token = extractJwtToken(candidate);
    if (token) {
      return token;
    }
  }

  return null;
};

type StepKey = "type" | "store" | "credentials";

export function LoginForm({ className, ...props }: ComponentProps<"form">) {
  const [searchParams] = useSearchParams();
  const initialStoreId = searchParams.get("storeId")?.trim() ?? "";
  const prefillEmail = searchParams.get("email")?.trim() ?? "";
  // Chế độ "đổi phòng khám": vào từ tài khoản đang đăng nhập, đã biết email,
  // nhảy thẳng tới bước chọn phòng khám.
  const isSwitchMode = searchParams.get("switch") === "1";
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [stepIndex, setStepIndex] = useState(isSwitchMode ? 1 : 0);
  // Khi đăng nhập thất bại lúc đã chọn phòng khám, gợi ý dùng chính tài khoản
  // này để tham gia phòng khám đó (join-store) thay vì tạo tài khoản mới.
  const [showJoinHint, setShowJoinHint] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const joinStoreSuccess =
    typeof location.state === "object" &&
    location.state !== null &&
    "joinStoreSuccess" in location.state &&
    Boolean((location.state as { joinStoreSuccess?: unknown }).joinStoreSuccess);

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: prefillEmail,
      password: "",
      storeId: initialStoreId,
      accountType: "customer",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (loading) return;

      setSubmitError(null);
      setShowJoinHint(false);
      try {
        setLoading(true);
        const payload: Login = {
          email: values.email,
          password: values.password,
          ...(values.accountType === "customer"
            ? { storeId: values.storeId }
            : {}),
        };
        const response = await authApi.loginUser(payload);
        const token = extractJwtToken(response?.data);
        if (token) {
          setToken(token);
          // Lưu lại để có thể đổi cửa hàng ngầm sau này (xem storeSession).
          saveSwitchCredentials(values.email, values.password);
          const role = getCurrentUserRole() ?? "";

          window.dispatchEvent(new Event("authChanged"));

          const fromPath =
            typeof location.state === "object" &&
            location.state !== null &&
            "from" in location.state &&
            typeof location.state.from === "object" &&
            location.state.from !== null &&
            "pathname" in location.state.from &&
            typeof location.state.from.pathname === "string"
              ? location.state.from.pathname
              : "";
          const targetPath =
            fromPath && isPathAllowedForRole(fromPath, role)
              ? fromPath
              : defaultPathByRole(role);

          navigate(targetPath, { replace: true });
          return;
        }
        navigate("/", { replace: true });
      } catch (err) {
        console.error(err);
        setSubmitError(getBackendErrorMessage(err));
        // Khách hàng đăng nhập hụt vào một phòng khám đã chọn — có thể họ chưa
        // tham gia phòng khám này. Gợi ý dùng chính tài khoản này để tham gia.
        if (values.accountType === "customer" && values.storeId) {
          setShowJoinHint(true);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  // Wizard: khách hàng cần chọn phòng khám; quản lý thì bỏ qua bước đó.
  // Không bước nào gửi request — chỉ gửi 1 request đăng nhập ở bước cuối.
  const steps = useMemo<
    { key: StepKey; label: string; fields: (keyof LoginFormValues)[] }[]
  >(() => {
    if (formik.values.accountType === "customer") {
      return [
        { key: "type", label: "Loại tài khoản", fields: ["accountType"] },
        { key: "store", label: "Phòng khám", fields: ["storeId"] },
        { key: "credentials", label: "Đăng nhập", fields: ["email", "password"] },
      ];
    }
    return [
      { key: "type", label: "Loại tài khoản", fields: ["accountType"] },
      { key: "credentials", label: "Đăng nhập", fields: ["email", "password"] },
    ];
  }, [formik.values.accountType]);

  const safeStepIndex = Math.min(stepIndex, steps.length - 1);
  const currentStep = steps[safeStepIndex];
  const isLastStep = safeStepIndex === steps.length - 1;

  const goNext = async () => {
    const stepFields = currentStep.fields;
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
    setShowJoinHint(false);
    setStepIndex(Math.min(safeStepIndex + 1, steps.length - 1));
  };

  const goBack = () => {
    setSubmitError(null);
    setShowJoinHint(false);
    setStepIndex(Math.max(safeStepIndex - 1, 0));
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={formik.handleSubmit}
      noValidate
      {...props}
    >
      <WizardStepper
        steps={steps.map((step) => step.label)}
        current={safeStepIndex}
      />

      <FieldGroup>
        {joinStoreSuccess ? (
          <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            Đăng ký tham gia cửa hàng thành công! Vui lòng đăng nhập.
          </div>
        ) : null}
        {isSwitchMode ? (
          <div className="rounded-lg border border-[#f0d8d0] bg-[#fff8f3] px-4 py-3 text-sm text-slate-600">
            Đổi phòng khám cho tài khoản{" "}
            <span className="font-semibold text-[#B24C40]">
              {prefillEmail || "của bạn"}
            </span>
            . Chọn phòng khám và nhập lại mật khẩu để tiếp tục.
          </div>
        ) : null}

        {currentStep.key === "type" ? (
          <Field>
            <FieldLabel>Loại tài khoản</FieldLabel>
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => formik.setFieldValue("accountType", "customer")}
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition",
                  formik.values.accountType === "customer"
                    ? "bg-white text-[#B24C40] shadow-sm"
                    : "text-slate-500 hover:bg-white/60",
                )}
              >
                <UserRound className="h-4 w-4" />
                Customer
              </button>
              <button
                type="button"
                onClick={() => formik.setFieldValue("accountType", "manager")}
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition",
                  formik.values.accountType === "manager"
                    ? "bg-white text-[#B24C40] shadow-sm"
                    : "text-slate-500 hover:bg-white/60",
                )}
              >
                <UserRoundCog className="h-4 w-4" />
                Manager
              </button>
            </div>
            <FieldDescription>
              Chọn loại tài khoản bạn muốn đăng nhập.
            </FieldDescription>
          </Field>
        ) : null}

        {currentStep.key === "store" ? (
          <Field>
            <FieldLabel>Chọn phòng khám</FieldLabel>
            <FieldDescription>
              Đăng nhập vào đúng phòng khám bạn đã đăng ký tài khoản.
            </FieldDescription>
            <StorePicker
              value={formik.values.storeId ?? ""}
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

        {currentStep.key === "credentials" ? (
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
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                <Link
                  to="/auth/forgot-password"
                  className="ml-auto text-sm font-medium text-[#D56756] transition hover:text-[#b34c47]"
                >
                  Quên mật khẩu?
                </Link>
              </div>
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

        {showJoinHint && formik.values.storeId ? (
          <div className="rounded-xl border border-[#f0d8d0] bg-[#fff8f3] px-4 py-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">
              Chưa có tài khoản ở phòng khám này?
            </p>
            <p className="mt-1">
              Bạn có thể dùng chính tài khoản này để tham gia phòng khám đã chọn
              — không cần tạo tài khoản mới.
            </p>
            <Link
              to={`/auth/join-store?${new URLSearchParams({
                storeId: formik.values.storeId,
                ...(formik.values.email
                  ? { email: formik.values.email }
                  : {}),
              }).toString()}`}
              className="mt-2 inline-flex items-center gap-1 font-semibold text-[#D56756] hover:text-[#b34c47]"
            >
              Tham gia phòng khám bằng tài khoản này →
            </Link>
          </div>
        ) : null}

        <Field>
          <div className="flex items-center gap-3">
            {safeStepIndex > 0 ? (
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
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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

        <Field>
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
              to={
                initialStoreId
                  ? `/auth/signup?${new URLSearchParams({ storeId: initialStoreId }).toString()}`
                  : "/auth/signup"
              }
              className="font-medium text-[#D56756] hover:text-[#b34c47]"
            >
              Tạo tài khoản miễn phí
            </Link>
          </FieldDescription>
          {formik.values.accountType === "customer" ? (
            <FieldDescription className="px-0 text-center text-sm text-slate-500">
              Đã có tài khoản ở phòng khám khác?{" "}
              <Link
                to={
                  initialStoreId
                    ? `/auth/join-store?${new URLSearchParams({ storeId: initialStoreId }).toString()}`
                    : "/auth/join-store"
                }
                className="font-medium text-[#D56756] hover:text-[#b34c47]"
              >
                Thêm tài khoản vào cửa hàng mới
              </Link>
            </FieldDescription>
          ) : null}
        </Field>
      </FieldGroup>
    </form>
  );
}
