import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoaderCircle, UserPlus } from "lucide-react";
import authApi from "@/apis/authAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateUsername } from "@/lib/auth";
import type { RegisterManager } from "@/types/auth.type";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";

type CreateManagerFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
};

const initialFormValues: CreateManagerFormValues = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  storeName: "",
  storeAddress: "",
  storePhone: "",
};

const validationSchema: Yup.ObjectSchema<CreateManagerFormValues> = Yup.object({
  email: Yup.string()
    .trim()
    .email("Email không hợp lệ.")
    .test(
      "contains-at",
      "Email không hợp lệ.",
      (value) => !value || value.includes("@"),
    )
    .required("Vui lòng nhập email."),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
    .required("Vui lòng nhập mật khẩu."),
  confirmPassword: Yup.string()
    .required("Vui lòng xác nhận mật khẩu.")
    .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp."),
  firstName: Yup.string().trim().required("Vui lòng nhập tên."),
  lastName: Yup.string().trim().required("Vui lòng nhập họ."),
  storeName: Yup.string().trim().required("Vui lòng nhập tên cửa hàng."),
  storeAddress: Yup.string().trim().required("Vui lòng nhập địa chỉ cửa hàng."),
  storePhone: Yup.string()
    .trim()
    .required("Vui lòng nhập số điện thoại cửa hàng."),
});

const AdminCreateManager = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const formik = useFormik<CreateManagerFormValues>({
    initialValues: initialFormValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      if (loading) {
        return;
      }

      setError(null);
      setSuccess(null);

      const request: RegisterManager = {
        userName: generateUsername(values.email.trim()),
        email: values.email.trim(),
        password: values.password,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        storeName: values.storeName.trim(),
        storeAddress: values.storeAddress.trim(),
        storePhone: values.storePhone.trim(),
      };

      setLoading(true);

      try {
        await authApi.registerManager(request);
        setSuccess(
          "Tạo tài khoản cho manager thành công. Manager có thể sử dụng email và mật khẩu đã cung cấp để đăng nhập vào hệ thống.",
        );
        helpers.resetForm();
      } catch (createError) {
        setError(getBackendErrorMessage(createError));
      } finally {
        setLoading(false);
      }
    },
  });

  const getFieldError = (field: keyof CreateManagerFormValues) => {
    return formik.touched[field] && formik.errors[field]
      ? formik.errors[field]
      : null;
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#D56756]/10 text-[#B24C40]">
          <UserPlus className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
          Tạo tài khoản Manager
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Admin tạo tài khoản quản lý mới để vận hành cửa hàng trên hệ thống.
        </p>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        {error ? (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lastName">Họ</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nguyễn"
              disabled={loading}
            />
            {getFieldError("lastName") ? (
              <p className="text-sm font-medium text-red-600">
                {getFieldError("lastName")}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">Tên</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="An"
              disabled={loading}
            />
            {getFieldError("firstName") ? (
              <p className="text-sm font-medium text-red-600">
                {getFieldError("firstName")}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="manager@example.com"
              disabled={loading}
            />
            {getFieldError("email") ? (
              <p className="text-sm font-medium text-red-600">
                {getFieldError("email")}
              </p>
            ) : null}
            {formik.values.email.trim() ? (
              <p className="text-xs font-medium text-slate-500">
                Tên đăng nhập sẽ là{" "}
                <span className="text-slate-950">
                  {generateUsername(formik.values.email.trim())}
                </span>
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nhập mật khẩu"
              disabled={loading}
            />
            {getFieldError("password") ? (
              <p className="text-sm font-medium text-red-600">
                {getFieldError("password")}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nhập lại mật khẩu"
              disabled={loading}
            />
            {getFieldError("confirmPassword") ? (
              <p className="text-sm font-medium text-red-600">
                {getFieldError("confirmPassword")}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeName">Tên cửa hàng</Label>
            <Input
              id="storeName"
              name="storeName"
              value={formik.values.storeName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="PetHub Quận 1"
              disabled={loading}
            />
            {getFieldError("storeName") ? (
              <p className="text-sm font-medium text-red-600">
                {getFieldError("storeName")}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="storePhone">Số điện thoại cửa hàng</Label>
            <Input
              id="storePhone"
              name="storePhone"
              value={formik.values.storePhone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="0901234567"
              disabled={loading}
            />
            {getFieldError("storePhone") ? (
              <p className="text-sm font-medium text-red-600">
                {getFieldError("storePhone")}
              </p>
            ) : null}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="storeAddress">Địa chỉ cửa hàng</Label>
            <Input
              id="storeAddress"
              name="storeAddress"
              value={formik.values.storeAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nhập địa chỉ cửa hàng"
              disabled={loading}
            />
            {getFieldError("storeAddress") ? (
              <p className="text-sm font-medium text-red-600">
                {getFieldError("storeAddress")}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#D56756] px-5 text-white hover:bg-[#B24C40]"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Tạo Manager
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateManager;
