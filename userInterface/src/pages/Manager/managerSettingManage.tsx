import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import storeApi from "@/apis/storeAPI";
import { useManagerStore } from "@/hooks/useManagerStore";
import { getAuthenticatedStoreId, getCurrentUserId } from "@/lib/auth";
import { queryKeys } from "@/lib/queryKeys";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";
import type { UpdateStore } from "@/types/store.type";

interface StoreFormValues {
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
}

const validationSchema: Yup.ObjectSchema<StoreFormValues> = Yup.object({
  name: Yup.string().trim().required("Vui lòng nhập tên cửa hàng."),
  address: Yup.string().trim().required("Vui lòng nhập địa chỉ."),
  phone: Yup.string()
    .trim()
    .matches(/^[0-9+\-\s()]*$/, "Số điện thoại không hợp lệ.")
    .required("Vui lòng nhập số điện thoại."),
  email: Yup.string()
    .trim()
    .email("Email không hợp lệ.")
    .required("Vui lòng nhập email."),
  isActive: Yup.boolean().required(),
});

const ManagerSettingManage = () => {
  const queryClient = useQueryClient();
  const {
    data: store,
    isLoading,
    isError,
    isStoreIdMissing,
  } = useManagerStore();

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const managerId = getCurrentUserId() ?? "";
  const storeId = getAuthenticatedStoreId() ?? "";

  const formik = useFormik<StoreFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: store?.name ?? "",
      address: store?.address ?? "",
      phone: store?.phone ?? "",
      email: store?.email ?? "",
      isActive: store?.isActive ?? true,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (loading) return;

      setSubmitError(null);
      setSubmitSuccess(false);

      if (!storeId || !managerId) {
        setSubmitError(
          "Không xác định được cửa hàng của bạn. Vui lòng đăng nhập lại.",
        );
        return;
      }

      const payload: UpdateStore = {
        managerId,
        name: values.name.trim(),
        address: values.address.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        isActive: values.isActive,
      };

      try {
        setLoading(true);
        await storeApi.updateStore(storeId, payload);
        await queryClient.invalidateQueries({
          queryKey: queryKeys.managerStore(managerId),
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.authenticatedStore(storeId),
        });
        setSubmitSuccess(true);
      } catch (err) {
        console.error(err);
        setSubmitError(getBackendErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-[calc(100vh-3rem)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8DED9] text-[#B24C40]">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Thông tin cửa hàng
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Cập nhật thông tin cửa hàng của bạn.
            </p>
          </div>
        </div>

        {isStoreIdMissing ? (
          <div className="rounded-[20px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
            Không tìm thấy cửa hàng gắn với tài khoản của bạn. Vui lòng đăng nhập
            lại.
          </div>
        ) : isLoading ? (
          <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="rounded-[20px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            Không tải được thông tin cửa hàng. Vui lòng thử lại sau.
          </div>
        ) : (
          <form
            onSubmit={formik.handleSubmit}
            className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Tên cửa hàng *</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nhập tên cửa hàng"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FieldError
                  errors={
                    formik.touched.name && formik.errors.name
                      ? [{ message: formik.errors.name }]
                      : undefined
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="address">Địa chỉ *</FieldLabel>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Nhập địa chỉ cửa hàng"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FieldError
                  errors={
                    formik.touched.address && formik.errors.address
                      ? [{ message: formik.errors.address }]
                      : undefined
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">Số điện thoại *</FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="VD: 0901234567"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FieldError
                  errors={
                    formik.touched.phone && formik.errors.phone
                      ? [{ message: formik.errors.phone }]
                      : undefined
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email *</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="store@email.com"
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

              {/* <Field>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <FieldLabel htmlFor="isActive" className="mb-0">
                      Trạng thái hoạt động
                    </FieldLabel>
                    <FieldDescription className="text-sm text-slate-500">
                      Khi tắt, cửa hàng sẽ hiển thị là “Tạm ngưng”.
                    </FieldDescription>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formik.values.isActive}
                    onClick={() =>
                      formik.setFieldValue("isActive", !formik.values.isActive)
                    }
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
                      formik.values.isActive ? "bg-[#D56756]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                        formik.values.isActive
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </Field> */}

              {submitError ? (
                <FieldDescription className="text-center text-sm text-red-600 whitespace-pre-line">
                  {submitError}
                </FieldDescription>
              ) : null}

              {submitSuccess ? (
                <FieldDescription className="text-center text-sm text-emerald-600">
                  Cập nhật thông tin cửa hàng thành công!
                </FieldDescription>
              ) : null}

              <div className="flex gap-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => formik.resetForm()}
                  disabled={loading || !formik.dirty}
                  className="flex-1 rounded-full"
                >
                  Hoàn tác
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !formik.dirty}
                  className="flex-1 rounded-full bg-[#D56756] px-5 py-3 text-base font-semibold text-white hover:bg-[#b34c47] disabled:cursor-not-allowed disabled:bg-[#d89992]"
                >
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        )}
      </div>
    </div>
  );
};

export default ManagerSettingManage;
